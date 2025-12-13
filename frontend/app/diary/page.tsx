"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// 감성 음악 일기장 페이지 (최초 UI/구조 설계)

// 감성 음악 일기장 페이지 (DB 연동 CRUD)
export default function MusicDiaryPage() {
  const router = useRouter();
  // 전체보기 토글 제거
  // 별 클릭 시 상세 모달
  const [detailDiary, setDetailDiary] = useState<any>(null);
  // 사용자 및 일기 상태
  const [user, setUser] = useState<any>(null);
  const [diaries, setDiaries] = useState<any[]>([]);
  // 별+말풍선 랜덤 위치/크기 (diaries.length 변할 때만 재생성)
  const starBalloons = useMemo(() => diaries.map((d: any, i: number) => {
    // 화면 전체에 고르게 분산 (좌우/상하)
    const col = i % 3;
    const row = Math.floor(i / 3);
    const left = 12 + col * 32 + Math.random() * 8; // 12~84%
    const top = 28 + row * 22 + Math.random() * 8; // 28~80%
    const size = 60 + Math.random() * 24; // 60~84px
    return (
      <div key={d.id || i} style={{position:'absolute', left:`${left}%`, top:`${top}%`, zIndex:2, cursor:'pointer'}} onClick={()=>setDetailDiary(d)}>
        {/* 별 SVG */}
        <svg width={size} height={size} viewBox="0 0 24 24">
          <polygon points="12,2 14.09,8.26 20.97,8.27 15.18,12.14 17.27,18.4 12,14.77 6.73,18.4 8.82,12.14 3.03,8.27 9.91,8.26" fill="#ffe066" stroke="#e0d7b8" strokeWidth="1.5"/>
        </svg>
        {/* 말풍선 */}
        <div style={{
          position:'absolute', left:'110%', top:'50%', transform:'translateY(-50%)', minWidth:120, background:'#fff', borderRadius:16, boxShadow:'0 2px 12px #0002', padding:'10px 18px', fontSize:15, color:'#333', fontWeight:500, display:'flex', flexDirection:'column', alignItems:'flex-start',
        }}>
          <div style={{fontSize:13, color:'#888', marginBottom:2}}>{d.created_at?.slice(0,10) || d.date}</div>
          <div style={{fontWeight:600, maxWidth:120, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{d.track}</div>
          {/* 꼬리 */}
          <div style={{position:'absolute', left:-16, top:'50%', transform:'translateY(-50%)', width:0, height:0, borderTop:'8px solid transparent', borderBottom:'8px solid transparent', borderRight:'16px solid #fff'}} />
        </div>
      </div>
    );
  }), [diaries.length, diaries.map(d=>d.id).join(','), diaries.map(d=>d.track).join(','), diaries.map(d=>d.weather).join(','), diaries.map(d=>d.mood).join(','), diaries.map(d=>d.memo).join(',')]);
  // 모달 상태 및 입력값
  const [modalOpen, setModalOpen] = useState(false);
  const [track, setTrack] = useState("");
  const [weather, setWeather] = useState("");
  const [mood, setMood] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // 수정 모드
  const [editId, setEditId] = useState<number|null>(null);
  // 위시리스트(좋아요) 곡 목록
  const [favoriteTracks, setFavoriteTracks] = useState<any[]>([]);
  // 곡 목록 로딩
  const [favLoading, setFavLoading] = useState(false);

  // 사용자 정보 및 일기/좋아요 곡 목록 불러오기
  useEffect(() => {
    const fetchUserAndDiaries = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/auth/me", { withCredentials: true });
        if (res.data.user) {
          setUser(res.data.user);
          const diaryRes = await axios.get(`/api/diary?user_id=${res.data.user.user_id}`);
          setDiaries(diaryRes.data.diaries || []);
          // 위시리스트(좋아요) 곡 불러오기 (내 백엔드)
          setFavLoading(true);
          try {
            const favRes = await axios.get(`/api/bookmark/list?user_id=${res.data.user.user_id}`, { withCredentials: true });
            setFavoriteTracks(Array.isArray(favRes.data.bookmarks) ? favRes.data.bookmarks : []);
          } catch { setFavoriteTracks([]); }
          setFavLoading(false);
        } else {
          setUser(null);
          setDiaries([]);
          setFavoriteTracks([]);
        }
      } catch (e: any) {
        setError("일기 불러오기 실패");
        setUser(null);
        setDiaries([]);
        setFavoriteTracks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndDiaries();
  }, []);

  // 일기 작성/수정
  const handleAddOrEditDiary = async () => {
    if (!track.trim() || !weather.trim() || !mood.trim()) {
      setError("필수 항목을 모두 입력하세요");
      return;
    }
    setError("");
    try {
      if (editId) {
        // 수정
        const res = await axios.put(`/api/diary/${editId}`, { track, weather, mood, memo, user_id: user.user_id });
        console.log('수정 응답:', res.data);
        if (!res.data.success) {
          setError("수정 실패: " + (res.data.error || '')); return;
        }
      } else {
        // 작성
        const res = await axios.post("/api/diary", { user_id: user.user_id, track, weather, mood, memo });
        console.log('작성 응답:', res.data);
        if (!res.data.success) {
          setError("작성 실패: " + (res.data.error || '')); return;
        }
      }
      // 새로고침
      const diaryRes = await axios.get(`/api/diary?user_id=${user.user_id}`);
      setDiaries(diaryRes.data.diaries || []);
      setTrack(""); setWeather(""); setMood(""); setMemo("");
      setModalOpen(false);
      setEditId(null);
      setDetailDiary(null); // 상세 모달도 닫기
    } catch (e: any) {
      setError("저장 실패: " + (e?.response?.data?.error || e.message || '')); 
      console.error('저장 실패', e);
    }
  };

  // 일기 삭제
  const handleDeleteDiary = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/diary/${id}`);
      setDiaries(diaries.filter((d) => d.id !== id));
    } catch {
      alert("삭제 실패");
    }
  };

  // 수정 모드 진입
  const handleEditDiary = (d: any) => {
    setTrack(d.track); setWeather(d.weather); setMood(d.mood); setMemo(d.memo || "");
    setEditId(d.id);
    setModalOpen(true);
  };

  // 달 단계 계산 (글 3개부터 보름달)
  // 0: 초승달, 1~2: 상현달, 3+: 보름달
  let moonPhase = 0;
  if (diaries.length === 0) moonPhase = 0;
  else if (diaries.length <= 2) moonPhase = 1;
  else moonPhase = 5;
  // 꽃/별 개수 = 일기 개수
  const flowerCount = diaries.length;
  const starCount = diaries.length;

  // 별/꽃 위치 useMemo로 고정 (diaries.length 변할 때만 재생성)
  const flowers = useMemo(() => Array.from({ length: flowerCount }, (_, i) => {
    const left = 10 + Math.random() * 80;
    const top = 60 + Math.random() * 30;
    return (
      <svg key={i} width="24" height="24" style={{ position: 'absolute', left: `${left}%`, top: `${top}%`, zIndex: 1 }} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" fill="#ffe066" />
        <ellipse cx="12" cy="4" rx="3" ry="5" fill="#ffd6e0" />
        <ellipse cx="12" cy="20" rx="3" ry="5" fill="#ffd6e0" />
        <ellipse cx="4" cy="12" rx="5" ry="3" fill="#ffd6e0" />
        <ellipse cx="20" cy="12" rx="5" ry="3" fill="#ffd6e0" />
      </svg>
    );
  }), [flowerCount]);
  const stars = useMemo(() => Array.from({ length: starCount }, (_, i) => {
    const left = 5 + Math.random() * 90;
    const top = 5 + Math.random() * 40;
    return (
      <svg key={i} width="12" height="12" style={{ position: 'absolute', left: `${left}%`, top: `${top}%`, zIndex: 0 }} viewBox="0 0 12 12">
        <circle cx="6" cy="6" r="3" fill="#fff9c4" />
      </svg>
    );
  }), [starCount]);

  // 달 SVG 단계별
  const moonSvgs = [
    // 0: 초승달
    <svg key={0} width="80" height="80" viewBox="0 0 80 80"><path d="M60 40a30 30 0 1 1-30-30A24 24 0 0 0 60 40z" fill="#fffbe6" stroke="#e0d7b8" strokeWidth="2"/></svg>,
    // 1: 상현달
    <svg key={1} width="80" height="80" viewBox="0 0 80 80"><path d="M60 40a30 30 0 1 1-30-30A18 18 0 0 0 60 40z" fill="#fffbe6" stroke="#e0d7b8" strokeWidth="2"/></svg>,
    // 2: 반달 (자연스러운 그림자)
    <svg key={2} width="80" height="80" viewBox="0 0 80 80">
      <ellipse cx="40" cy="40" rx="30" ry="30" fill="#fffbe6" stroke="#e0d7b8" strokeWidth="2"/>
      <ellipse cx="54" cy="40" rx="14" ry="28" fill="#222" opacity="0.13"/>
    </svg>,
    // 3: 차오르는 달
    <svg key={3} width="80" height="80" viewBox="0 0 80 80">
      <ellipse cx="40" cy="40" rx="30" ry="30" fill="#fffbe6" stroke="#e0d7b8" strokeWidth="2"/>
      <ellipse cx="58" cy="40" rx="9" ry="28" fill="#222" opacity="0.10"/>
    </svg>,
    // 4: 거의 보름달
    <svg key={4} width="80" height="80" viewBox="0 0 80 80">
      <ellipse cx="40" cy="40" rx="30" ry="30" fill="#fffbe6" stroke="#e0d7b8" strokeWidth="2"/>
      <ellipse cx="64" cy="40" rx="4" ry="28" fill="#222" opacity="0.07"/>
    </svg>,
    // 5: 보름달 (그림자 없이 꽉 찬 밝은 달)
    <svg key={5} width="80" height="80" viewBox="0 0 80 80">
      <ellipse cx="40" cy="40" rx="30" ry="30" fill="#fffbe6" stroke="#e0d7b8" strokeWidth="2"/>
    </svg>,
  ];

  function setShowAll(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  // 랜덤 위치 꽃/별 생성 (간단 버전)
  // (중복 선언 제거됨)

  return (
    <div className="fixed inset-0 w-full h-full min-h-screen flex flex-col items-center justify-start overflow-y-auto" style={{zIndex:1}}>
      {/* 감성 배경: 밤하늘, 달, 별, 꽃 (화면 전체) */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-indigo-900 via-blue-200 to-yellow-50 overflow-hidden">
        {stars}
        <div style={{ position: 'absolute', left: '50%', top: '12%', transform: 'translate(-50%, 0)' }}>{moonSvgs[moonPhase]}
          {/* 별자리: 일기 3개 이상 작성 시 달 아래에 표시 (글 개수만큼 별/선 자동) */}
          {diaries.length >= 3 && (
            <svg width="360" height="80" viewBox="0 0 360 80" style={{position:'absolute', left:'50%', top:'90px', transform:'translate(-50%,0)'}}>
              {/* 별 위치 계산: 가로 등간격, 약간의 랜덤 세로 */}
              {(() => {
                const N = diaries.length;
                const margin = 32;
                const w = 360;
                const h = 80;
                const step = (w - margin * 2) / (N - 1);
                const points = Array.from({length: N}, (_, i) => {
                  const x = margin + i * step;
                  const y = 40 + (Math.sin(i * 1.2) * 18) + (Math.random() * 8 - 4); // 곡선+랜덤
                  return {x, y};
                });
                return <>
                  {/* 선: 모든 별을 polyline으로 연결 */}
                  <polyline points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#e0d7b8" strokeWidth="1.2" opacity="0.45" />
                  {/* 별: 각 위치에 작은 별 */}
                  {points.map((p, i) => (
                    <polygon key={i}
                      points={[
                        [p.x, p.y-8], [p.x+2.5, p.y-2], [p.x+8, p.y-2], [p.x+3.5, p.y+2.5], [p.x+5, p.y+8],
                        [p.x, p.y+4], [p.x-5, p.y+8], [p.x-3.5, p.y+2.5], [p.x-8, p.y-2], [p.x-2.5, p.y-2]
                      ].map(pair=>pair.join(",")).join(" ")}
                      fill="#fffbe6" stroke="#e0d7b8" strokeWidth="0.9" opacity="0.85"
                    />
                  ))}
                </>;
              })()}
            </svg>
          )}
        </div>
        {flowers}
      </div>
      <div className="w-full flex items-center justify-center relative">
        {/* 왼쪽 위 메인 이동 화살표 (배경/테두리 없이) */}
        <button
          onClick={()=>router.push("/main")}
          className="absolute left-4 top-4"
          style={{zIndex:3, background: 'none', border: 'none', padding: 0, boxShadow: 'none'}}
          aria-label="메인으로"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
        </button>
  <h1 className="text-2xl font-bold mt-10 mb-6 text-center text-white drop-shadow">🎼 감성 음악 일기장</h1>
</div>

      {/* 오른쪽 하단 큰 별 아이콘 (FAB) */}
      {user && (
        <button
          onClick={()=>{setModalOpen(true); setEditId(null); setTrack(""); setWeather(""); setMood(""); setMemo("");}}
          className="fixed bottom-8 right-8 hover:scale-110 transition-transform"
          style={{
            zIndex: 20,
            background: 'none',
            border: 'none',
            borderRadius: 0,
            padding: 0,
            width: '72px',
            height: '72px',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="글쓰기"
        >
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="12,2 14.09,8.26 20.97,8.27 15.18,12.14 17.27,18.4 12,14.77 6.73,18.4 8.82,12.14 3.03,8.27 9.91,8.26" fill="#ffe066" stroke="#e0d7b8" strokeWidth="1.5"/>
          </svg>
        </button>
      )}

      {/* 글쓰기 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button onClick={()=>{setModalOpen(false); setEditId(null); setError("");}} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">×</button>
            <h2 className="text-xl font-bold mb-4 text-center">{editId ? "음악 일기 수정" : "오늘의 음악 일기 작성"}</h2>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">오늘 들은 곡</label>
              <select
                value={track}
                onChange={e => setTrack(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white"
                disabled={favLoading || favoriteTracks.length === 0}
              >
                <option value="">곡을 선택하세요</option>
                {favoriteTracks.map((f, idx) => (
                  <option key={f.music_id || f.spotify_id || idx} value={f.music_name || f.title || f.name || f.url || ""}>
                    {(f.music_name || f.title || f.name || f.url || "").slice(0, 40)}
                    {f.artist ? ` - ${f.artist}` : ""}
                  </option>
                ))}
              </select>
              {favLoading && <div className="text-xs text-gray-400 mt-1">좋아요 곡 불러오는 중...</div>}
              {(!favLoading && favoriteTracks.length === 0) && <div className="text-xs text-gray-400 mt-1">좋아요한 곡이 없습니다</div>}
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">오늘의 날씨</label>
              <div className="flex gap-2 mt-1">
                {[
                  {label: "맑음", value: "맑음", icon: "☀️"},
                  {label: "비", value: "비", icon: "🌧️"},
                  {label: "눈", value: "눈", icon: "❄️"},
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={()=>setWeather(opt.value)}
                    className={`px-4 py-2 rounded-full border text-base font-semibold flex items-center gap-1 transition-all ${weather===opt.value ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50'}`}
                  >{opt.icon} {opt.label}</button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">오늘의 기분</label>
              <input value={mood} onChange={e => setMood(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="설렘, 우울, 힐링 등" />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">한 줄 메모</label>
              <input value={memo} onChange={e => setMemo(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="오늘의 감상, 느낌 등" />
            </div>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <button onClick={handleAddOrEditDiary} className="mt-2 w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition">{editId ? "수정 저장" : "저장"}</button>
          </div>
        </div>
      )}

      <div className="mt-24" />
      {/* 기본: 별+말풍선 UI, 전체보기: 카드 리스트 */}
      {loading ? (
        <div className="text-gray-500 py-10">일기 불러오는 중...</div>
      ) : !user ? (
        <div className="text-gray-500 py-10">로그인이 필요합니다</div>
      ) : (
        <>
          {/* 별+말풍선 UI */}
          <div style={{position:'relative', width:'100%', height:'340px', minHeight:'240px'}}>
            {starBalloons}
            {diaries.length === 0 && <div className="text-gray-400 py-10 mt-8 text-center">아직 작성한 음악 일기가 없습니다</div>}
          </div>
          
        </>
      )}
            {/* 별 클릭 시 일기 상세 모달 */}
            {detailDiary && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40" onClick={()=>setDetailDiary(null)}>
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative" onClick={e=>e.stopPropagation()}>
                  <button onClick={()=>setDetailDiary(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">×</button>
                  <h2 className="text-xl font-bold mb-4 text-center">{detailDiary.track}</h2>
                  <div className="mb-2 text-sm text-gray-500 text-center">{detailDiary.created_at?.slice(0,10) || detailDiary.date}</div>
                  <div className="mb-2"><b>날씨:</b> {detailDiary.weather}</div>
                  <div className="mb-2"><b>기분:</b> {detailDiary.mood}</div>
                  <div className="mb-2 italic text-gray-600">"{detailDiary.memo}"</div>
                  <div className="flex gap-4 justify-center mt-6">
                    <button
                      onClick={() => {
                        setDetailDiary(null);
                        setEditId(detailDiary.id);
                        setTrack(detailDiary.track ?? "");
                        setWeather(detailDiary.weather ?? "");
                        setMood(detailDiary.mood ?? "");
                        setMemo(detailDiary.memo ?? "");
                        setModalOpen(true);
                      }}
                      className="px-5 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold shadow hover:bg-yellow-100 hover:text-indigo-800 transition"
                    >수정</button>
                    <button
                      onClick={() => { setDetailDiary(null); handleDeleteDiary(detailDiary.id); }}
                      className="px-5 py-2 rounded-full bg-yellow-100 text-indigo-700 font-semibold shadow hover:bg-indigo-100 hover:text-indigo-800 transition"
                    >삭제</button>
                  </div>
                </div>
              </div>
            )}
      {/* 추후: 달력 뷰, DB 연동, 감성 배경 등 추가 */}
    </div>
  );
}

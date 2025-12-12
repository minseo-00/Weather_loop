"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WeatherHeader from "@/widgets/weather-header/ui/WeatherHeader";

export default function SettingsPage() {
  const router = useRouter();
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState("");
  const [tempName, setTempName] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tagline, setTagline] = useState("");
  const [tempTagline, setTempTagline] = useState("");
  const [isEditingTagline, setIsEditingTagline] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  useEffect(() => {
    const loadMe = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/auth/me', { credentials: 'include' });
        if (!res.ok) throw new Error('failed_me');
        const data = await res.json();
        if (data && data.user) {
          const userEmail = data.user.email as string;
          setEmail(userEmail);
          const initialName = userEmail?.split('@')[0] || '사용자';
          setName(initialName);
          setTempName(initialName);
          try {
            const savedName = typeof window !== 'undefined' ? localStorage.getItem('displayName') : null;
            const savedTag = typeof window !== 'undefined' ? localStorage.getItem('displayTagline') : null;
            const savedAvatar = typeof window !== 'undefined' ? localStorage.getItem('avatarDataUrl') : null;
            if (savedName) {
              setName(savedName);
              setTempName(savedName);
            }
            if (savedTag) {
              setTagline(savedTag);
              setTempTagline(savedTag);
            }
            if (savedAvatar) {
              setAvatar(savedAvatar);
            }
          } catch {}
        } else {
          setEmail(null);
        }
      } catch (e) {
        setEmail(null);
        setError('로그인 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadMe();
  }, []);

  const fileToDataUrlResized = (file: File, size = 256): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('파일을 읽는 중 오류'));
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('캔버스 생성 실패');
            const s = Math.min(img.width, img.height);
            const sx = (img.width - s) / 2;
            const sy = (img.height - s) / 2;
            canvas.width = size;
            canvas.height = size;
            ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
            const url = canvas.toDataURL('image/jpeg', 0.9);
            resolve(url);
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => reject(new Error('이미지 로드 실패'));
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const onAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const resized = await fileToDataUrlResized(file, 256);
      setTempAvatar(resized);
      setIsEditingAvatar(true);
    } catch {}
    // reset so same file can be reselected
    e.target.value = "";
  };

  const handleAvatarSave = () => {
    if (!tempAvatar) return;
    setAvatar(tempAvatar);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('avatarDataUrl', tempAvatar);
        window.dispatchEvent(new Event('profile-updated'));
      }
    } catch {}
    setTempAvatar(null);
    setIsEditingAvatar(false);
  };

  const handleAvatarCancel = () => {
    setTempAvatar(null);
    setIsEditingAvatar(false);
  };

  const handleAvatarRemove = () => {
    setAvatar(null);
    setTempAvatar(null);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('avatarDataUrl');
        window.dispatchEvent(new Event('profile-updated'));
      }
    } catch {}
    setIsEditingAvatar(false);
  };

  const handleNameSave = () => {
    setName(tempName);
    setIsEditingName(false);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('displayName', tempName);
        window.dispatchEvent(new Event('profile-updated'));
      }
    } catch {}
  };

  const handleTaglineSave = () => {
    setTagline(tempTagline);
    setIsEditingTagline(false);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('displayTagline', tempTagline);
        window.dispatchEvent(new Event('profile-updated'));
      }
    } catch {}
  };

  const handleTaglineCancel = () => {
    setTempTagline(tagline);
    setIsEditingTagline(false);
  };

  const handleNameCancel = () => {
    setTempName(name);
    setIsEditingName(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
      setEmail(null);
      setName('');
      setTempName('');
      router.push('/');
    } catch {}
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#FFF9E8] to-[#FAF3E8]"
    >
      <WeatherHeader />
      <div className="flex flex-1 w-full mt-0">
        {/* 좌측 메뉴 */}
        <aside className="w-80 min-h-full border-r border-gray-200 bg-white flex flex-col pt-6 pb-12 px-8 gap-2">
          <h2
            className="w-full text-left text-2xl font-bold text-gray-900 mb-8"
          >
            계정 관리
          </h2>
          <nav className="flex flex-col gap-2">
            <button className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition text-left">
              개인 정보
            </button>
          </nav>
        </aside>
        {/* 우측 정보 */}
        <main className="flex-1 min-h-full flex flex-col px-16 py-12">
          <h2
            className="w-full text-left text-2xl font-bold text-gray-900 mb-8"
          >
            개인 정보
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-2xl mx-auto">
            {loading ? (
              <div className="text-gray-500">로딩 중...</div>
            ) : !email ? (
              <div className="flex flex-col items-start gap-4">
                <div className="text-gray-800 font-semibold">로그인이 필요합니다.</div>
                <div className="text-sm text-gray-600">계정으로 로그인하면 이름/이메일 정보가 표시됩니다.</div>
                <div className="flex gap-2 mt-2">
                  <a href="/login" className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition">이메일로 로그인</a>
                  <a href="/api/auth/login" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition">Spotify로 로그인</a>
                </div>
                {error && <div className="text-sm text-red-500">{error}</div>}
              </div>
            ) : (
            <>
              <div className="flex items-center gap-8 mb-8">
                <div className="relative flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                    { (isEditingAvatar && tempAvatar) || avatar ? (
                      <img
                        src={(isEditingAvatar && tempAvatar) ? (tempAvatar as string) : (avatar as string)}
                        alt="프로필 사진"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl text-gray-400 font-bold">프사</span>
                    )}
                  </div>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onAvatarFileChange}
                  />
                  <label
                    htmlFor="avatar-input"
                    className="mt-2 px-2 py-1 text-xs rounded-md bg-gray-900 text-white cursor-pointer shadow hover:bg-gray-800"
                  >
                    변경
                  </label>
                  {isEditingAvatar && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleAvatarSave}
                        className="px-3 py-1 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleAvatarCancel}
                        className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition"
                      >
                        취소
                      </button>
                      {avatar && (
                        <button
                          onClick={handleAvatarRemove}
                          className="px-3 py-1 rounded-lg bg-white border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 transition"
                        >
                          제거
                        </button>
                      )}
                    </div>
                  )}
                </div>
              <div className="flex-1">
                {isEditingName ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="px-3 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-900 text-xl font-bold focus:outline-none focus:border-gray-900"
                      autoFocus
                    />
                    <button
                      onClick={handleNameSave}
                      className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleNameCancel}
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="text-xl font-bold text-gray-900">{name || '사용자'}</div>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition"
                    >
                      수정
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
                <div className="text-base text-gray-500 mt-1">프로필</div>
                {/* 한줄 소개 편집 */}
                <div className="mt-3">
                  {isEditingTagline ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={tempTagline}
                        onChange={(e) => setTempTagline(e.target.value)}
                        placeholder="한줄 소개를 입력하세요"
                        className="px-3 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:border-gray-900 w-full max-w-sm"
                      />
                      <button
                        onClick={handleTaglineSave}
                        className="px-3 py-1 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleTaglineCancel}
                        className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-600">{tagline || '한줄 소개를 입력해보세요'}</div>
                      <button
                        onClick={() => setIsEditingTagline(true)}
                        className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition"
                      >
                        소개 수정
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <span className="font-normal text-gray-600">이메일 주소</span>
                <span className="text-gray-700">{email}</span>
                <button className="border border-gray-300 px-3 py-1 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition">확인</button>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <span className="font-normal text-gray-600">전화번호</span>
                <span className="text-gray-700">+82 **-****-2841</span>
                <button className="text-gray-600 hover:text-gray-900 transition">수정</button>
              </div>
            </div>
            </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

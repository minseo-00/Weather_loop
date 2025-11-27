"use client";

import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="w-[1200px] h-[1467px] mx-auto relative bg-white overflow-hidden shadow-lg rounded-xl mt-10">
      {/* [필수 기능: UI/UX 디자인] 상단 제목 */}
      <div className="text-2xl font-semibold text-gray-800 px-6 pt-6">설정</div>

      {/* [필수 기능: UI/UX 디자인] 상단 구분선 */}
      <div className="w-[1125px] h-0 left-[23px] top-[129px] absolute outline outline-1 outline-offset-[-0.50px] outline-black"></div>

      {/* [필수 기능: UI/UX 디자인 / 컴포넌트 단위 UI] 프로필 원형 + 이름 */}
      <div className="w-64 h-64 left-[475px] top-[180px] absolute bg-zinc-300 rounded-full flex items-center justify-center text-3xl font-medium text-black font-['Noto_Sans_KR']">
        프사 변경
      </div>
      <div className="w-28 h-20 left-[543px] top-[430px] absolute text-center text-black text-4xl font-medium font-['Noto_Sans_KR']">
        NAME
      </div>

      {/* [필수 기능: 이벤트 핸들링 / 라우팅] ← 돌아가기 버튼 */}
      <button
        onClick={() => router.push("/favorites")}
        className="absolute top-6 right-6 text-gray-500 hover:text-black transition"
      >
        ← 돌아가기
      </button>

      {/* [필수 기능: 컴포넌트 단위 UI / CRUD / 데이터 표시] 개인 정보 영역 */}
      <div className="absolute left-[100px] top-[600px] w-[1000px]">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">개인 정보</h2>

        <div className="flex justify-between border-b py-4">
          <span className="font-semibold text-gray-700">실명</span>
          <span className="text-gray-600">상열 이</span>
          <button className="text-gray-400 hover:text-black">수정</button> {/* [CRUD: 수정] */}
        </div>

        <div className="flex justify-between border-b py-4">
          <span className="font-semibold text-gray-700">선호하는 이름</span>
          <span className="text-gray-600">미지출</span>
          <button className="text-gray-400 hover:text-black">추가</button> {/* [CRUD: 추가] */}
        </div>

        <div className="flex justify-between border-b py-4 items-center">
          <span className="font-semibold text-gray-700">이메일 주소</span>
          <span className="text-gray-600">a***@naver.com</span>
          <button className="border px-2 py-1 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition">
            확인
          </button>
        </div>

        <div className="flex justify-between border-b py-4">
          <span className="font-semibold text-gray-700">전화번호</span>
          <span className="text-gray-600">+82 **-****-2841</span>
          <button className="text-gray-400 hover:text-black">수정</button> {/* [CRUD: 수정] */}
        </div>

        <div className="flex justify-between border-b py-4">
          <span className="font-semibold text-gray-700">본인 인증</span>
          <span className="text-gray-600">시작 안 함</span>
          <button className="text-gray-400 hover:text-black">시작</button>
        </div>
      </div>
    </div>
  );
}

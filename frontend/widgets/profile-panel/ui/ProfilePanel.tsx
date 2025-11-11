"use client";

export default function ProfilePanel() {
  return (
    <div className="flex flex-col items-center text-center">
      <img
        src="/images/profile-placeholder.png"
        alt="profile"
        className="w-32 h-32 rounded-full object-cover shadow-md"
      />
      <p className="mt-3 text-lg font-semibold">따봉도치야</p>
      <p className="text-gray-500">고마워</p>
      <button className="mt-4 px-3 py-1 text-sm border rounded-lg text-gray-600 hover:bg-gray-50">
        설정
      </button>
    </div>
  );
}

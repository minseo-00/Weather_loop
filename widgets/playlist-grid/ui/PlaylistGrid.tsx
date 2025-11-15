// /widgets/playlist-grid/ui/PlaylistGrid.tsx
"use client";

export default function PlaylistGrid() {
  return (
    <div className="w-full flex flex-col items-center mt-6">
      {/* 1️⃣ 사진 */}
      <img
        src="/images/golden.png"
        alt="Golden Cover"
        className="w-72 h-72 object-cover rounded-xl border-[4px] border-blue-200"
      />


      <div className="mt-4 text-white text-6xl font-bold font-['Inter']">
        Golden
      </div>
    </div>
  );
}

// src/app/admin/promotions/CreatePromotionButton.tsx
"use client";

export default function CreatePromotionButton() {
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      onClick={() =>
        (
          document.getElementById("createPromotionModal") as HTMLDialogElement
        )?.showModal()
      }
    >
      새 프로모션
    </button>
  );
}

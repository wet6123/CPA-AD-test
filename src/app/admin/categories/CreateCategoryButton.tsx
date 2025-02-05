// src/app/admin/categories/CreateCategoryButton.tsx
"use client";

export default function CreateCategoryButton() {
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      onClick={() =>
        (
          document.getElementById("createModal") as HTMLDialogElement
        )?.showModal()
      }
    >
      새 카테고리
    </button>
  );
}

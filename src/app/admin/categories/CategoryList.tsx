// src/app/admin/categories/CategoryList.tsx
"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export default function CategoryList({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const supabase = createClientComponentClient();

  // 카테고리 생성
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase
      .from("categories")
      .insert([
        {
          name: newCategory.name,
          slug: newCategory.slug,
          description: newCategory.description,
        },
      ])
      .select();

    if (error) {
      alert("카테고리 생성 실패: " + error.message);
    } else if (data) {
      setCategories([...categories, ...data]);
      setNewCategory({ name: "", slug: "", description: "" });
      (document.getElementById("createModal") as HTMLDialogElement)?.close();
    }

    setIsLoading(false);
  };

  // 카테고리 수정
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setIsLoading(true);

    const { error } = await supabase
      .from("categories")
      .update({
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description,
      })
      .eq("id", editingCategory.id);

    if (error) {
      alert("카테고리 수정 실패: " + error.message);
    } else {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? editingCategory : cat
        )
      );
      setEditingCategory(null);
      (document.getElementById("editModal") as HTMLDialogElement)?.close();
    }

    setIsLoading(false);
  };

  // 카테고리 삭제
  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setIsLoading(true);

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      alert("카테고리 삭제 실패: " + error.message);
    } else {
      setCategories(categories.filter((cat) => cat.id !== id));
    }

    setIsLoading(false);
  };

  return (
    <div>
      {/* 카테고리 목록 */}
      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                설명
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{category.slug}</td>
                <td className="px-6 py-4">{category.description}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      (
                        document.getElementById(
                          "editModal"
                        ) as HTMLDialogElement
                      )?.showModal();
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                    disabled={isLoading}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={isLoading}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 생성 모달 */}
      <dialog id="createModal" className="rounded-lg shadow-lg p-6">
        <form onSubmit={handleCreate}>
          <h3 className="text-lg font-bold mb-4">새 카테고리 생성</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                이름
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slug
              </label>
              <input
                type="text"
                value={newCategory.slug}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, slug: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                설명
              </label>
              <textarea
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
          <div className="mt-4 space-x-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isLoading ? "처리중..." : "생성"}
            </button>
            <button
              type="button"
              onClick={() =>
                (
                  document.getElementById("createModal") as HTMLDialogElement
                )?.close()
              }
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              취소
            </button>
          </div>
        </form>
      </dialog>

      {/* 수정 모달 */}
      <dialog id="editModal" className="rounded-lg shadow-lg p-6">
        {editingCategory && (
          <form onSubmit={handleUpdate}>
            <h3 className="text-lg font-bold mb-4">카테고리 수정</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  이름
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      slug: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  설명
                </label>
                <textarea
                  value={editingCategory.description || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>
            <div className="mt-4 space-x-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {isLoading ? "처리중..." : "수정"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  (
                    document.getElementById("editModal") as HTMLDialogElement
                  )?.close();
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
}

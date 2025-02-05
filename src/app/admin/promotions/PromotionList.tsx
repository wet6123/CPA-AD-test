// src/app/admin/promotions/PromotionList.tsx
"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Category = {
  id: string;
  name: string;
};

type Promotion = {
  id: string;
  title: string;
  description: string | null;
  content: string;
  category_id: string;
  url: string | null;
  commission_rate: number | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  meta_title: string | null;
  meta_description: string | null;
  category: {
    name: string;
  };
};

export default function PromotionList({
  initialPromotions,
  categories,
}: {
  initialPromotions: Promotion[];
  categories: Category[];
}) {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null
  );
  const [newPromotion, setNewPromotion] = useState({
    title: "",
    description: "",
    content: "",
    category_id: "",
    url: "",
    commission_rate: "",
    status: "active",
    start_date: "",
    end_date: "",
    meta_title: "",
    meta_description: "",
  });

  const supabase = createClientComponentClient();

  // 프로모션 생성
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.from("promotions").insert([
      {
        ...newPromotion,
        commission_rate: newPromotion.commission_rate
          ? parseFloat(newPromotion.commission_rate)
          : null,
      },
    ]).select(`
        *,
        category:categories(name)
      `);

    if (error) {
      alert("프로모션 생성 실패: " + error.message);
    } else if (data) {
      setPromotions([...data, ...promotions]);
      setNewPromotion({
        title: "",
        description: "",
        content: "",
        category_id: "",
        url: "",
        commission_rate: "",
        status: "active",
        start_date: "",
        end_date: "",
        meta_title: "",
        meta_description: "",
      });
      (
        document.getElementById("createPromotionModal") as HTMLDialogElement
      )?.close();
    }

    setIsLoading(false);
  };

  // 프로모션 수정
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromotion) return;
    setIsLoading(true);

    const { error } = await supabase
      .from("promotions")
      .update({
        ...editingPromotion,
        commission_rate: editingPromotion.commission_rate,
      })
      .eq("id", editingPromotion.id);

    if (error) {
      alert("프로모션 수정 실패: " + error.message);
    } else {
      setPromotions(
        promotions.map((promo) =>
          promo.id === editingPromotion.id ? editingPromotion : promo
        )
      );
      setEditingPromotion(null);
      (
        document.getElementById("editPromotionModal") as HTMLDialogElement
      )?.close();
    }

    setIsLoading(false);
  };

  // 프로모션 삭제
  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setIsLoading(true);

    const { error } = await supabase.from("promotions").delete().eq("id", id);

    if (error) {
      alert("프로모션 삭제 실패: " + error.message);
    } else {
      setPromotions(promotions.filter((promo) => promo.id !== id));
    }

    setIsLoading(false);
  };

  return (
    <div>
      {/* 프로모션 목록 */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                수수료율
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {promotions.map((promotion) => (
              <tr key={promotion.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {promotion.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {promotion.category?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      promotion.status === "active"
                        ? "bg-green-100 text-green-800"
                        : promotion.status === "inactive"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {promotion.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {promotion.commission_rate
                    ? `${promotion.commission_rate}%`
                    : "-"}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditingPromotion(promotion);
                      (
                        document.getElementById(
                          "editPromotionModal"
                        ) as HTMLDialogElement
                      )?.showModal();
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                    disabled={isLoading}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(promotion.id)}
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
      <dialog
        id="createPromotionModal"
        className="rounded-lg shadow-lg p-6 w-full max-w-2xl"
      >
        <form onSubmit={handleCreate}>
          <h3 className="text-lg font-bold mb-4">새 프로모션 생성</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 col-span-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  제목
                </label>
                <input
                  type="text"
                  value={newPromotion.title}
                  onChange={(e) =>
                    setNewPromotion({ ...newPromotion, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  카테고리
                </label>
                <select
                  value={newPromotion.category_id}
                  onChange={(e) =>
                    setNewPromotion({
                      ...newPromotion,
                      category_id: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                >
                  <option value="">카테고리 선택</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                설명
              </label>
              <textarea
                value={newPromotion.description || ""}
                onChange={(e) =>
                  setNewPromotion({
                    ...newPromotion,
                    description: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                rows={3}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                내용
              </label>
              <textarea
                value={newPromotion.content}
                onChange={(e) =>
                  setNewPromotion({ ...newPromotion, content: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                rows={5}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                프로모션 URL
              </label>
              <input
                type="url"
                value={newPromotion.url || ""}
                onChange={(e) =>
                  setNewPromotion({ ...newPromotion, url: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                수수료율 (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={newPromotion.commission_rate}
                onChange={(e) =>
                  setNewPromotion({
                    ...newPromotion,
                    commission_rate: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                시작일
              </label>
              <input
                type="date"
                value={newPromotion.start_date}
                onChange={(e) =>
                  setNewPromotion({
                    ...newPromotion,
                    start_date: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                종료일
              </label>
              <input
                type="date"
                value={newPromotion.end_date}
                onChange={(e) =>
                  setNewPromotion({ ...newPromotion, end_date: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                상태
              </label>
              <select
                value={newPromotion.status}
                onChange={(e) =>
                  setNewPromotion({ ...newPromotion, status: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
                <option value="expired">만료</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                SEO 제목
              </label>
              <input
                type="text"
                value={newPromotion.meta_title || ""}
                onChange={(e) =>
                  setNewPromotion({
                    ...newPromotion,
                    meta_title: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                SEO 설명
              </label>
              <textarea
                value={newPromotion.meta_description || ""}
                onChange={(e) =>
                  setNewPromotion({
                    ...newPromotion,
                    meta_description: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                rows={2}
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
                  document.getElementById(
                    "createPromotionModal"
                  ) as HTMLDialogElement
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
      <dialog
        id="editPromotionModal"
        className="rounded-lg shadow-lg p-6 w-full max-w-2xl"
      >
        {editingPromotion && (
          <form onSubmit={handleUpdate}>
            <h3 className="text-lg font-bold mb-4">프로모션 수정</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 col-span-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    제목
                  </label>
                  <input
                    type="text"
                    value={editingPromotion.title}
                    onChange={(e) =>
                      setEditingPromotion({
                        ...editingPromotion,
                        title: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    카테고리
                  </label>
                  <select
                    value={editingPromotion.category_id}
                    onChange={(e) =>
                      setEditingPromotion({
                        ...editingPromotion,
                        category_id: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  >
                    <option value="">카테고리 선택</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  설명
                </label>
                <textarea
                  value={editingPromotion.description || ""}
                  onChange={(e) =>
                    setEditingPromotion({
                      ...editingPromotion,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  내용
                </label>
                <textarea
                  value={editingPromotion.content}
                  onChange={(e) =>
                    setEditingPromotion({
                      ...editingPromotion,
                      content: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  rows={5}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  프로모션 URL
                </label>
                <input
                  type="url"
                  value={editingPromotion.url || ""}
                  onChange={(e) =>
                    setEditingPromotion({
                      ...editingPromotion,
                      url: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  수수료율 (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingPromotion.commission_rate || ""}
                  onChange={(e) =>
                    setEditingPromotion({
                      ...editingPromotion,
                      commission_rate: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  시작일
                </label>
                <input
                  type="date"
                  value={editingPromotion.start_date || ""}
                  onChange={(e) =>
                    setEditingPromotion({
                      ...editingPromotion,
                      start_date: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  종료일
                </label>
                <input
                  type="date"
                  value={editingPromotion.end_date || ""}
                  onChange={(e) =>
                    setEditingPromotion({
                      ...editingPromotion,
                      end_date: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  상태
                </label>
                <select
                  value={editingPromotion.status}
                  onChange={(e) =>
                    setEditingPromotion({
                      ...editingPromotion,
                      status: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                >
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                  <option value="expired">만료</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  SEO 제목
                </label>
                <input
                  type="text"
                  value={editingPromotion.meta_title || ""}
                  onChange={(e) =>
                    setEditingPromotion({
                      ...editingPromotion,
                      meta_title: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  SEO 설명
                </label>
                <textarea
                  value={editingPromotion.meta_description || ""}
                  onChange={(e) =>
                    setEditingPromotion({
                      ...editingPromotion,
                      meta_description: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  rows={2}
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
                  setEditingPromotion(null);
                  (
                    document.getElementById(
                      "editPromotionModal"
                    ) as HTMLDialogElement
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

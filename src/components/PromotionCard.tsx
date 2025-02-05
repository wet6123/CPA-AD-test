// src/components/PromotionCard.tsx
type PromotionProps = {
  title: string;
  description: string | null;
  commissionRate: number | null;
  status: string;
  url: string;
  darkMode?: boolean;
};

export default function PromotionCard({
  title,
  description,
  commissionRate,
  status,
  url,
  darkMode = false,
}: PromotionProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-lg shadow-md overflow-hidden transition hover:shadow-lg ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
          {commissionRate && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {commissionRate}%
            </span>
          )}
        </div>
        {description && (
          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {description}
          </p>
        )}
        <div className="mt-4 flex justify-between items-center">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              status === "active"
                ? "bg-green-100 text-green-800"
                : status === "inactive"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status === "active"
              ? "진행중"
              : status === "inactive"
              ? "중지됨"
              : "만료됨"}
          </span>
        </div>
      </div>
    </a>
  );
}

import { calculateTrendPercentage, cn } from "lib/utils";

interface StatsCardProps {
  headerTitle: string;
  total: number;
  lastMonthCount: number;
  currentMonthCount: number;
}

function StatsCard({
  headerTitle,
  total,
  lastMonthCount,
  currentMonthCount,
}: StatsCardProps) {
  const { trend, percentage } = calculateTrendPercentage(
    currentMonthCount,
    lastMonthCount
  );

  const isDecrement = trend === "decrement";

  return (
    <article className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.01] transform">
      <h3 className="text-base font-semibold text-gray-700 mb-4">
        {headerTitle}
      </h3>
      <div className="flex justify-between items-end gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-extrabold text-gray-900 leading-none">
            {total.toLocaleString()}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <figure className="flex items-center gap-1">
              <img
                src={`/assets/icons/${
                  isDecrement ? "arrow-down.svg" : "arrow-up-green.svg"
                }`}
                alt={isDecrement ? "down arrow" : "up arrow"}
                className="size-5"
              />
              <figcaption
                className={cn(
                  "text-base font-semibold",
                  isDecrement ? "text-red-600" : "text-green-600"
                )}
              >
                {typeof percentage === "number"
                  ? `${Math.round(percentage)}%`
                  : "N/A"}
              </figcaption>
            </figure>
            <p className="text-sm font-medium text-gray-500 truncate">
              vs last month
            </p>
          </div>
        </div>

        <img
          src={`/assets/icons/${
            isDecrement ? "decrement.svg" : "increment.svg"
          }`}
          alt={
            isDecrement ? "overall decrement icon" : "overall increment icon"
          }
          className="w-24 h-24 object-contain md:w-28 md:h-28 lg:w-32 lg:h-32 flex-shrink-0"
        />
      </div>
    </article>
  );
}

export default StatsCard;

import { cn, getFirstWord } from "lib/utils";
import { Link, useLocation } from "react-router";
import { Badge } from "~/components/ui/badge";

function TripCard({
  id,
  name,
  location,
  imageUrl,
  tags,
  price,
}: TripCardProps) {
  const path = useLocation();

  return (
    <Link
      to={
        path.pathname === "/" || path.pathname.startsWith("/travel")
          ? `/travel/${id}`
          : `/trips/${id}`
      }
      className="block w-full max-w-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 bg-white" // নেক্সট লেভেল স্টাইলিং
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {price !== undefined && price !== null && (
          <div className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-md md:text-lg font-bold px-4 py-2 rounded-full shadow-md z-10">
            {price}
          </div>
        )}
      </div>

      <article className="p-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
          {name}
        </h2>
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <img
            src="/assets/icons/location-mark.svg"
            alt="location icon"
            className="w-4 h-4 mr-1"
          />
          <p>{location}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags &&
            tags.length > 0 &&
            tags.map((tag, index) => (
              <Badge
                key={index}
                variant={index === 1 ? "destructive" : "default"}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold",
                  index === 1
                    ? "!bg-pink-100 !text-pink-700"
                    : "!bg-emerald-100 !text-emerald-700"
                )}
              >
                {getFirstWord(tag)}
              </Badge>
            ))}
        </div>
      </article>
    </Link>
  );
}

export default TripCard;

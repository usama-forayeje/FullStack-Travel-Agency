import { cn, getFirstWord } from "lib/utils";
import {
  ChipDirective,
  ChipsDirective,
  ChipListComponent,
} from "@syncfusion/ej2-react-buttons";
import { Link, useLocation } from "react-router";

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
      className="trip-card"
    >
      <img src={imageUrl} alt={name} className="trip-card-image" />
      <article className="trip-card-details">
        <h2>{name}</h2>
        <figure className="location-info">
          <img
            src="/assets/icons/location-mark.svg"
            alt="location"
            className="size-4"
          />
          <figcaption>{location}</figcaption>
        </figure>
      </article>
      <div className="mt-5 pl-[18px] pr-3.5 pb-5">
        {tags && tags.length > 0 && (
          <ChipListComponent id={`travel-chip-${id}`}>
            <ChipsDirective>
              {tags.map((tag, index) => (
                <ChipDirective
                  key={index}
                  text={getFirstWord(tag)}
                  cssClass={cn(
                    index === 1
                      ? "!bg-pink-50 !text-pink-500"
                      : "!bg-success-50 !text-success-700"
                  )}
                />
              ))}
            </ChipsDirective>
          </ChipListComponent>
        )}
      </div>
      <article className="tripCard-pill">
        {price !== undefined && price !== null && (
          <h2 className="text-sm md:text-lg font-semibold text-dark-100">
            {price}
          </h2>
        )}
      </article>
    </Link>
  );
}

export default TripCard;

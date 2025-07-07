import { cn } from "lib/utils";
import { Link, NavLink } from "react-router";
import { sidebarItems } from "~/constants";

function NavItems({ handleClick }: { handleClick?: () => void }) {
  const user = {
    name: "Usama Forayaje",
    email: "usama@usama.com",
    imageUrl: "https://placehold.co/150",
  };
  return (
    <section className="nav-items">
      <Link to={"/"} className="link-logo">
        <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
        <h1>Traveler</h1>
      </Link>
      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, icon, label }) => (
            <NavLink key={id} to={href}>
              {({ isActive }) => (
                <div
                  className={cn("group nav-item", {
                    "bg-primary-100 !text-white": isActive,
                  })}
                  onClick={handleClick}
                >
                  <img
                    src={icon}
                    alt={label}
                    className={`group-hover:brightness-0 size-0 group-hover:invert ${
                      isActive ? "brightness-0 invert" : "text-dark-200"
                    } `}
                  />
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <footer className="nav-footer">
          <img
            src={user?.imageUrl || "/assets/images/david.webp"}
            alt={user?.name || "Usama"}
          />
          <article>
            <h2>{user?.name || "Usama"}</h2>
            <p>{user?.email || "usama@usama.com"}</p>
          </article>

          <button
            onClick={() => {
              console.log("logout");
            }}
            className="cursor-pointer"
          >
            <img
              src="/assets/icons/logout.svg"
              alt="logout"
              className="size-6"
            />
          </button>
        </footer>
      </div>
    </section>
  );
}

export default NavItems;

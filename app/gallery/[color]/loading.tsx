import navBarStyles from "@/app/components/NavBar/NavBar.module.scss";
import { Skeleton } from "@radix-ui/themes/components/index";

export default function Loading() {
  return (
    <>
      <aside>
        <nav
          className={`flex flex-col justify-between items-center ${navBarStyles.navBar}`}
        >
          <Skeleton
            style={{ width: "50px", height: "50px" }}
            className="mb-3.5"
          />
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} style={{ width: "50px", height: "50px" }} />
          ))}
        </nav>
      </aside>
      <Skeleton width='700px' height='700px' />
    </>
  );
}

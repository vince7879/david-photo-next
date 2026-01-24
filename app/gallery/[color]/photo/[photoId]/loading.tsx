import navBarStyles from "@/app/components/NavBar/NavBar.module.scss";
import { Skeleton } from "@radix-ui/themes/components/index";

export default function Loading() {
  return (
    <>
      <aside>
        <nav
          className={`flex flex-col justify-normal items-center ${navBarStyles.navBar}`}
        >
          <Skeleton
            style={{ width: "50px", height: "50px" }}
            className="mb-3.5"
          />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} style={{ width: "50px", height: "50px" }} className="mt-3.5" />
          ))}
        </nav>
      </aside>
      <div className="flex flex-col gap-1">
        <Skeleton width='600px' height='675px' />
        <Skeleton width='300px' height='20px' />
      </div>
    </>
  );
}

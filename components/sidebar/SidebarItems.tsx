import Link from "next/link";
import { Route } from "./routes";
import { usePathname } from "next/navigation";
import { useDashboardContext } from "../../context/Provider";
import { User } from "next-auth";

const style = {
  title: "mx-4 text-md whitespace-pre",
  active: "bg-nsgsco rounded-full",
  link: "flex items-center justify-start my-1 p-3 w-full hover:text-white",
  close:
    "lg:duration-700 lg:ease-out lg:invisible lg:opacity-0 lg:transition-all",
  open: "lg:duration-500 lg:ease-in lg:h-auto lg:opacity-100 lg:transition-all lg:w-auto",
};

interface userProps {
  user: User | null | undefined;
  routes: Route[] | null | undefined;
}

export function SidebarItems(props: userProps) {
  const pathname = usePathname();
  const { sidebarOpen } = useDashboardContext();
  const routes = props.routes;
  return (
    <ul className="md:pl-3 pr-4">
      {routes?.map((item) => (
        <li key={item.title}>
          <Link href={item.link}>
            <span className={style.link}>
              <div
                className={`p-2 ${item.link === pathname ? style.active : ""}`}
              >
                <span
                  className={`${
                    item.link === pathname
                      ? ""
                      : "hover:text-nsgsco transition ease-in-out"
                  }`}
                >
                  {item.icon}
                </span>
              </div>
              <span
                className={`${style.title} ${
                  sidebarOpen ? style.open : style.close
                }`}
              >
                {item.title}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

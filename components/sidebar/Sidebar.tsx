"use client";

import css from "../style.module.css";
import { SidebarItems } from "./SidebarItems";
import { SidebarHeader } from "./SidebarHeader";
import { useDashboardContext } from "../../context/Provider";
import { User } from "next-auth";
import { Route } from "./routes";

interface SidebarProps {
  mobileOrientation: "start" | "end";
  user: User | null | undefined;
  routes: Route[] | null | undefined;
}

const style = {
  mobileOrientation: {
    start: "left-0 ",
    end: "right-0 lg:right-0",
  },
  container: "pb-32 lg:pb-12",
  close: "duration-700 ease-out hidden transition-all lg:w-24",
  open: "absolute duration-500 ease-in transition-all w-8/12 z-40 sm:w-5/12 md:w-64 pr-9 ",
  default:
    "h-screen overflow-y-auto overflow-x-hidden text-white top-0 lg:absolute bg-gray-900 lg:block lg:z-40 right-dir",
};

export function Sidebar(props: SidebarProps) {
  const { sidebarOpen } = useDashboardContext();
  const user = props.user;
  return (
    <aside
      className={`${style.default} 
        ${style.mobileOrientation[props.mobileOrientation]} 
        ${sidebarOpen ? style.open : style.close} ${css.scrollbar}`}
    >
      <div className={style.container}>
        <SidebarHeader />
        <SidebarItems routes={props.routes} user={user} />
      </div>
    </aside>
  );
}

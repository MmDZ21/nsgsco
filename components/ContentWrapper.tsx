"use client";
import { User } from "next-auth";

import { usePathname, useRouter } from "next/navigation";
import { Routes } from "./sidebar/routes";
import Clock from "@/utils/Clock";
import PersianDate from "@/utils/PersianDate";
import Notif from "./Notif";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useSession } from "next-auth/react";

interface ContentProps {
  children: React.ReactNode;
  user: undefined | User | null;
  routes: Routes | null | undefined;
}
export function Content({ children, user, routes }: ContentProps) {
  const { data: session, status } = useSession();
  const { unreadSuggestions, unreadTickets } = useContext(UserContext);
  const router = useRouter();
  const pathname = usePathname();
  const route = routes?.dashboardRoutes.find(
    (route) => route.link !== "/" && pathname.includes(route.link)
  );
  const isDashboard =
    pathname === "/dashboard/admin" || pathname === "/dashboard/user";

  return (
    <div className="flex flex-wrap">
      <div className="mt-8 w-full lg:mt-0 lg:w-4/12 lg:pr-4">
        <div className="rounded-3xl min-h-[400px] bg-gray-800 px-6 pt-6 ">
          <div className="flex pb-6 right-dir text-2xl font-bold text-white">
            <p>اعلان ها</p>
          </div>
          {unreadTickets > 0 && (
            <Notif
              quantity={unreadTickets}
              type="ticket"
              admin={session?.user.role === "ADMIN"}
            />
          )}
          {session?.user.role === "ADMIN" && unreadSuggestions > 0 && (
            <Notif
              quantity={unreadSuggestions}
              type="suggestion"
              admin={session?.user.role === "ADMIN"}
            />
          )}
          {unreadSuggestions === 0 && unreadTickets === 0 && (
            <div className="text-gray-400 text-sm right-dir">
              اعلانی موجود نیست.
            </div>
          )}
        </div>
      </div>
      <div
        id="content"
        className="w-full rounded-3xl bg-gray-800 p-6 lg:w-8/12 lg:mt-0 mt-8 flex-col"
      >
        <div className="mb-8 flex items-center justify-between text-white">
          <PersianDate />
          <p className="text-2xl font-bold">سلام {user?.name}</p>
        </div>
        <div className="flex flex-wrap items-center justify-end md:justify-between pb-8">
          <div className="hidden md:flex">
            <Clock />
          </div>
          <div className="flex items-center">
            <p className="text-white font-IranSansBold bg-gray-900 p-4 rounded-3xl md:text-lg">
              {route?.title && pathname.includes(route?.link)
                ? route.title
                : isDashboard
                ? "پنل کاربری"
                : "خالی"}
            </p>
          </div>
        </div>
        <div className="mx-auto w-[80%] py-14">{children}</div>
      </div>
    </div>
  );
}
<div className="text-gray-400 text-sm right-dir">اعلانی موجود نیست.</div>;

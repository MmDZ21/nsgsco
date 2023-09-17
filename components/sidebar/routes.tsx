import { PayslipsIcon } from "./icons/PayslipsIcon";
import { HomeIcon } from "./icons/HomeIcon";
import { NotificationsIcon } from "./icons/NotificationsIcon";
import { SuggestionsIcon } from "./icons/SuggestionsIcon";
import { RequestsIcon } from "./icons/RequestsIcon";
import { SettingsIcon } from "./icons/SettingsIcon";

const sideBarSize: number = 6;
const dashboardSize: number = 10;

export interface Route {
  title: string;
  icon: JSX.Element;
  link: string;
}

export interface Routes {
  sidebarRoutes: Route[];
  dashboardRoutes: Route[];
}

export const userRoutes: Routes = {
  sidebarRoutes: [
    {
      title: "پنل کاربری",
      icon: <HomeIcon size={sideBarSize} />,
      link: "/dashboard/user",
    },
    {
      title: "فیش حقوقی",
      icon: <PayslipsIcon size={sideBarSize} />,
      link: "/dashboard/user/payslips",
    },
    {
      title: "اطلاعیه ها",
      icon: <NotificationsIcon size={sideBarSize} />,
      link: "/dashboard/user/notifications",
    },
    {
      title: "ارتباط",
      icon: <RequestsIcon size={sideBarSize} />,
      link: "/dashboard/user/requests",
    },
    {
      title: "پیشنهادات",
      icon: <SuggestionsIcon size={sideBarSize} />,
      link: "/dashboard/user/suggestions",
    },
    {
      title: "تنظیمات",
      icon: <SettingsIcon size={sideBarSize} />,
      link: "/dashboard/user/settings",
    },
  ],
  dashboardRoutes: [
    {
      title: "صفحه اصلی",
      icon: <HomeIcon size={dashboardSize} />,
      link: "/",
    },
    {
      title: "دریافت فیش حقوقی",
      icon: <PayslipsIcon size={dashboardSize} />,
      link: "/dashboard/user/payslips",
    },
    {
      title: "اطلاعیه ها",
      icon: <NotificationsIcon size={dashboardSize} />,
      link: "/dashboard/user/notifications",
    },
    {
      title: "ارتباط",
      icon: <RequestsIcon size={dashboardSize} />,
      link: "/dashboard/user/requests",
    },
    {
      title: "نظرات و پیشنهادات",
      icon: <SuggestionsIcon size={dashboardSize} />,
      link: "/dashboard/user/suggestions",
    },
    {
      title: "تنظیمات حساب",
      icon: <SettingsIcon size={dashboardSize} />,
      link: "/dashboard/user/settings",
    },
  ],
};

export const adminRoutes: Routes = {
  sidebarRoutes: [
    {
      title: "پنل کاربری",
      icon: <HomeIcon size={sideBarSize} />,
      link: "/dashboard/admin",
    },
    {
      title: "فیش حقوقی",
      icon: <PayslipsIcon size={sideBarSize} />,
      link: "/dashboard/admin/payslips",
    },
    {
      title: "اطلاعیه ها",
      icon: <NotificationsIcon size={sideBarSize} />,
      link: "/dashboard/admin/notifications",
    },
    {
      title: "ارتباط",
      icon: <RequestsIcon size={sideBarSize} />,
      link: "/dashboard/admin/requests",
    },
    {
      title: "پیشنهادات",
      icon: <SuggestionsIcon size={sideBarSize} />,
      link: "/dashboard/admin/suggestions",
    },
    {
      title: "تنظیمات",
      icon: <SettingsIcon size={sideBarSize} />,
      link: "/dashboard/admin/settings",
    },
  ],
  dashboardRoutes: [
    {
      title: "صفحه اصلی",
      icon: <HomeIcon size={dashboardSize} />,
      link: "/",
    },
    {
      title: "فیش حقوقی کاربران",
      icon: <PayslipsIcon size={dashboardSize} />,
      link: "/dashboard/admin/payslips",
    },
    {
      title: "اطلاعیه ها",
      icon: <NotificationsIcon size={dashboardSize} />,
      link: "/dashboard/admin/notifications",
    },
    {
      title: "ارتباط",
      icon: <RequestsIcon size={dashboardSize} />,
      link: "/dashboard/admin/requests",
    },
    {
      title: "نظرات و پیشنهادات",
      icon: <SuggestionsIcon size={dashboardSize} />,
      link: "/dashboard/admin/suggestions",
    },
    {
      title: "تنظیمات حساب",
      icon: <SettingsIcon size={dashboardSize} />,
      link: "/dashboard/admin/settings",
    },
  ],
};

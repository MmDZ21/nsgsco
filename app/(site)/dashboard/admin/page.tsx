import DashboardCards from "@/components/DashboardCards";
import { adminRoutes } from "@/components/sidebar/routes";

const page = () => {
  const routes = adminRoutes.dashboardRoutes;
  return (
    <div className="w-full rounded-3xl text-white">
      <div className="flex flex-wrap pb-8"></div>
      <div className="flex flex-wrap">
        {routes.map((item) => (
          <DashboardCards {...item} />
        ))}
      </div>
    </div>
  );
};

export default page;

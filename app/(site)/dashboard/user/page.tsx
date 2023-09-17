import DashboardCards from "@/components/DashboardCards";
import { userRoutes } from "@/components/sidebar/routes";

const page = () => {
  const routes = userRoutes.dashboardRoutes;
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

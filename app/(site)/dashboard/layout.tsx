import { TopBar } from "../../../components/TopBar";
import { Overlay } from "../../../components/Overlay";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { DashboardProvider } from "../../../context/Provider";
import { Content } from "@/components/ContentWrapper";
import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";
import { Routes, adminRoutes, userRoutes } from "@/components/sidebar/routes";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import UserProvider from "@/context/UserContext";

const style = {
  container:
    "bg-nsgscoBg bg-no-repeat bg-center bg-cover h-screen overflow-hidden relative ",
  mainContainer: "flex flex-col h-screen pl-0 w-full lg:pr-20 lg:space-y-4",
  main: "h-screen overflow-auto pb-36 pt-4 px-2 md:pb-8 md:pt-4 lg:pt-0 lg:px-12 ",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/");
  }
  let routes: Routes;
  const user = session.user;
  if (user?.role === "BASIC") {
    routes = userRoutes;
  } else if (user?.role === "ADMIN") {
    routes = adminRoutes;
  } else {
    return redirect("/");
  }

  return (
    <DashboardProvider>
      <UserProvider>
        <div className={style.container}>
          <div className="flex items-start">
            <Overlay />
            <Sidebar
              routes={routes?.sidebarRoutes}
              user={user}
              mobileOrientation="end"
            />
            <div className={style.mainContainer}>
              <TopBar />
              <main className={style.main}>
                <div>
                  <Content routes={routes} user={user}>
                    {children}
                  </Content>
                </div>
              </main>
            </div>
          </div>
        </div>
      </UserProvider>
    </DashboardProvider>
  );
}

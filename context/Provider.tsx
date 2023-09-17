"use client";

import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { createContext } from "react";

interface DashboardProviderProps {
  children: React.ReactNode;
}

interface ProviderValues {
  sidebarOpen?: boolean;
  openSidebar?: () => void;
  closeSidebar?: () => void;
}

// create new context
const Context = createContext<ProviderValues>({});

export function DashboardProvider({ children }: DashboardProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // set the html tag overflow to hidden
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
  }, []);

  // close Sidebar on route changes when viewport is less than 1024px
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
  }, []);

  // close side navigation when route changes
  // useEffect(() => {
  //   if (sidebarOpen) {
  //     router.events.on("routeChangeStart", () => setSidebarOpen(false));
  //   }

  //   return () => {
  //     if (sidebarOpen) {
  //       router.events.off("routeChangeStart", () => setSidebarOpen(false));
  //     }
  //   };
  // }, [sidebarOpen, router]);

  return (
    <Context.Provider value={{ sidebarOpen, openSidebar, closeSidebar }}>
      {children}
    </Context.Provider>
  );
}

// custom hook to consume all context values { sidebarOpen, openSidebar, closeSidebar }
export function useDashboardContext() {
  return useContext(Context);
}

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "BASIC") {
    redirect("/dashboard/user");
  } else if (session?.user?.role === "ADMIN") {
    redirect("/dashboard/admin");
  } else {
    redirect("/");
  }

  return <div>Loading...</div>;
};

export default Page;

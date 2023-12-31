import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "داشبورد",
  description: "نیرو صنعت گستر شرق",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  if (session?.user.role !== "ADMIN") {
    redirect("/dashboard/user");
  }

  return <div>{children}</div>;
}

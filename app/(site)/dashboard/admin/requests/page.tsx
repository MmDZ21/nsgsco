"use client";
import AdminTicketList from "@/components/AdminTicketList";
import { UserContext } from "@/context/UserContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function Tickets() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("sign-in");
    },
  });
  const tickets = useContext(UserContext).tickets;
  return (
    <div dir="rtl">
      <div className="pb-4">
        <button
          onClick={() => router.push("/dashboard/admin/requests/new")}
          className="text-white py-2 px-4 rounded bg-nsgsco  hover:bg-[#093e3b] text-sm tracking-wider transition"
        >
          پیام جدید
        </button>
      </div>
      <AdminTicketList tickets={tickets} />
    </div>
  );
}

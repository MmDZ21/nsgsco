"use client";
import TicketList from "@/components/TicketList";
import { UserContext } from "@/context/UserContext";
import { TicketModel } from "@/types/prisma";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Tickets() {
  const [myTickets, setMyTickets] = useState<TicketModel[]>([]);
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("sign-in");
    },
  });
  const tickets = useContext(UserContext).tickets;
  useEffect(() => {
    const myTickets = tickets.filter(
      (ticket) => ticket.userId === session?.user.id
    );
    setMyTickets(myTickets);
  }, [tickets]);
  return (
    <div dir="rtl">
      <div className="pb-4">
        <button
          onClick={() => router.push("/dashboard/user/requests/new")}
          className="text-white py-2 px-4 rounded bg-nsgsco  hover:bg-[#093e3b] text-sm tracking-wider transition"
        >
          پیام جدید
        </button>
      </div>
      <TicketList tickets={myTickets} />
    </div>
  );
}

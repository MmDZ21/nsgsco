"use client";

import TicketDetails from "@/components/TicketDetails";
import { UserContext } from "@/context/UserContext";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const page = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("sign-in");
    },
  });
  const tickets = useContext(UserContext).tickets;
  const params = useParams();
  const ticketId = params.ticket_id as string;
  const ticket = tickets.find((ticket) => ticket.id === ticketId);
  return <div>{ticket && <TicketDetails ticket={ticket} />}</div>;
};

export default page;

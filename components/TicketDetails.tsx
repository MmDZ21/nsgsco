"use client";
import { TicketModel } from "@/types/prisma";

import { ChatBox } from "./ChatBox";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import axios from "axios";

const TicketDetails = ({ ticket }: { ticket: TicketModel }) => {
  const { fetchTickets } = useContext(UserContext);
  const updateUnread = async () => {
    await axios.patch(`/api/tickets/updateUnread/${ticket.id}`);
    fetchTickets();
  };
  useEffect(() => {
    updateUnread();
  }, []);
  return (
    <div>
      <ChatBox ticket={ticket} />
    </div>
  );
};

export default TicketDetails;

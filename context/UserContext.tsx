"use client";

import { PayslipModel, SuggestionModel, TicketModel } from "@/types/prisma";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

interface ContextProps {
  tickets: TicketModel[];
  payslips: PayslipModel[];
  suggestions: SuggestionModel[];
  unreadTickets: number;
  unreadSuggestions: number;
  fetchPayslips: any;
  fetchTickets: any;
  fetchSuggestions: any;
}
export const UserContext = createContext<ContextProps>({
  payslips: [],
  tickets: [],
  suggestions: [],
  unreadTickets: 0,
  unreadSuggestions: 0,
  fetchPayslips: null,
  fetchTickets: null,
  fetchSuggestions: null,
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [payslips, setPayslips] = useState<PayslipModel[]>([]);
  const [tickets, setTickets] = useState<TicketModel[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionModel[]>([]);
  const [unreadTickets, setUnreadTickets] = useState<number>(0);
  const [unreadSuggestions, setUnreadSuggestions] = useState<number>(0);

  useEffect(() => {
    // Check if the session exists and is ready before fetching payslips
    if (status === "authenticated") {
      fetchPayslips();
      fetchTickets();
      fetchSuggestions();
    } else if (status === "loading") {
      console.log("loading...");
    } else {
      // Redirect to the login page if there's no session or the session is not ready
      router.push("/");
    }
  }, [status, session]);

  useEffect(() => {
    checkNewEvents();
  }, [tickets, suggestions]);
  const fetchPayslips = async () => {
    try {
      if (session?.user.role === "ADMIN") {
        const response = await axios.get<PayslipModel[]>(
          "/api/payslips/getAll"
        );
        setPayslips(response.data);
      } else {
        const response = await axios.get<PayslipModel[]>(
          "/api/payslips/getById"
        );
        setPayslips(response.data);
      }
    } catch (error) {
      console.error("Error fetching payslips:", error);
    }
  };

  const fetchTickets = async () => {
    try {
      if (session?.user.role === "ADMIN") {
        const response = await axios.get<TicketModel[]>("/api/tickets/getAll");
        setTickets(response.data);
      } else {
        const response = await axios.get<TicketModel[]>("/api/tickets/getById");
        setTickets(response.data);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };
  const fetchSuggestions = async () => {
    try {
      if (session?.user.role === "ADMIN") {
        const response = await axios.get<SuggestionModel[]>(
          "/api/suggestions/getAll"
        );
        setSuggestions(response.data);
      } else {
        const response = await axios.get<SuggestionModel[]>(
          "/api/suggestions/getById"
        );
        setSuggestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const checkNewEvents = async () => {
    const unreadTickets =
      session?.user.role === "ADMIN"
        ? tickets.filter((ticket) => ticket.unreadByAdmin === true)
        : tickets.filter((ticket) => ticket.unreadByUser === true);
    setUnreadTickets(unreadTickets.length);
    const unreadSuggestions = suggestions.filter(
      (suggestion) => suggestion.unread === true
    );
    setUnreadSuggestions(unreadSuggestions.length);
    console.log(unreadTickets, unreadSuggestions);
  };

  return (
    <UserContext.Provider
      value={{
        tickets,
        payslips,
        suggestions,
        unreadSuggestions,
        unreadTickets,
        fetchPayslips,
        fetchTickets,
        fetchSuggestions,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

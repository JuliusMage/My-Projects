import { Box, Heading, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import TicketCard from "../components/TicketCard";

const Dashboard = () => {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    // Fetch existing tickets from REST API
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tickets`)
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch(() => {
        /* noop */
      });

    // Connect to WebSocket for live updates
    const socket = io(import.meta.env.VITE_WS_URL, {
      transports: ["websocket"],
    });

    socket.on("ticket", (ticket) => {
      setTickets((prev) => [ticket, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Box>
      <Heading mb={4}>Live Tickets</Heading>
      <VStack spacing={4} align="stretch">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </VStack>
    </Box>
  );
};

export default Dashboard;

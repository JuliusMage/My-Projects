import { Box, Heading, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TicketCard from "../components/TicketCard";

const mockTickets = [
  { id: 1, message: "User cannot login", sentiment: "negative" },
  { id: 2, message: "Billing question", sentiment: "neutral" },
];

const Dashboard = () => {
  const [tickets, setTickets] = useState(mockTickets);

  useEffect(() => {
    // TODO: Connect to backend or WebSocket
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

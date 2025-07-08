import { Box, Text, Badge } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const TicketCard = ({
  ticket,
}: {
  ticket: { id: number; message: string; sentiment: string };
}) => {
  return (
    <Link to={`/ticket/${ticket.id}`}>
      <Box borderWidth="1px" borderRadius="lg" p={4} _hover={{ bg: "gray.50" }}>
        <Text fontWeight="bold">{ticket.message}</Text>
        <Badge
          colorScheme={
            ticket.sentiment === "positive"
              ? "green"
              : ticket.sentiment === "negative"
              ? "red"
              : "yellow"
          }
        >
          {ticket.sentiment}
        </Badge>
      </Box>
    </Link>
  );
};

export default TicketCard;

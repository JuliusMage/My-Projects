import { useParams } from "react-router-dom";
import { Box, Heading, Text } from "@chakra-ui/react";

const TicketDetail = () => {
  const { id } = useParams();

  return (
    <Box>
      <Heading>Ticket #{id}</Heading>
      <Text mt={4}>Details and chat history will appear here.</Text>
    </Box>
  );
};

export default TicketDetail;

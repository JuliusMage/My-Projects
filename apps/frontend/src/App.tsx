import { ChakraProvider, Box } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TicketDetail from "./pages/TicketDetail";
import AdminPanel from "./pages/Admin";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Box p={4}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ticket/:id" element={<TicketDetail />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;

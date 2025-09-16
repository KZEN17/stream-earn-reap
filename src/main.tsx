import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/PrivyAuthContext";
import { LoginModalProvider } from "@/contexts/LoginModalContext";
import { LoginModal } from "@/components/LoginModal";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();

console.log('Main.tsx is running');

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="clip-ui-theme">
        <AuthProvider>
          <LoginModalProvider>
            <App />
            <LoginModal />
          </LoginModalProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

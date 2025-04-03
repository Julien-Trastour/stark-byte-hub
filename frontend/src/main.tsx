import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { Provider as JotaiProvider } from "jotai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./routes";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { useAuthInit } from "./hooks/useAuthInit";
import Loader from "./components/common/Loader";
import "./styles.css";

// Création d'un client query partagé
const queryClient = new QueryClient();

function App() {
  const loading = useAuthInit();

  return (
    <div key={loading ? "loading" : "ready"}>
      {loading ? <Loader /> : <RouterProvider router={router} />}
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>
            <App />
          </JotaiProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

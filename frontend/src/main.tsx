import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { Provider as JotaiProvider } from "jotai";
import router from "./routes";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { useAuthInit } from "./hooks/useAuthInit";
import Loader from "./components/common/Loader";
import "./styles.css";

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
        <JotaiProvider>
          <App />
        </JotaiProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

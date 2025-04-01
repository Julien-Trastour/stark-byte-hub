import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { Provider as JotaiProvider } from "jotai";
import router from "./routes";
import ErrorBoundary from "./components/common/ErrorBoundary";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ErrorBoundary>
			<JotaiProvider>
				<RouterProvider router={router} />
			</JotaiProvider>
		</ErrorBoundary>
	</React.StrictMode>,
);

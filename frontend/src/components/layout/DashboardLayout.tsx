import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout() {
	return (
		<div className="flex h-screen bg-[#121212] text-white">
			<Sidebar />
			<div className="flex-1 flex flex-col">
				<Header />
				<main className="h-[calc(100vh-4rem)] p-6 overflow-hidden">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

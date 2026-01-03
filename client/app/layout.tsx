import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

export const metadata: Metadata = {
	title: "Insight Hub",
	description:
		"Insight Hub (Mystery Shopping & Feedback Management System developed and maintained by Rahul Agarwal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="min-h-screen bg-background text-foreground antialiased">
				{children}
				<ToastContainer
					position="bottom-right"
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					theme="dark"
				/>
			</body>
		</html>
	);
}

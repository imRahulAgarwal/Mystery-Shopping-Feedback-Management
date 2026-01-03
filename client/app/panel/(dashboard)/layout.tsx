"use client";

import Header from "@/components/panel/Header/Header";
import Sidebar from "@/components/panel/Sidebar/Sidebar";
import { useCallback, useEffect, useState } from "react";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
	const [isDesktopScreen, setIsDesktopScreen] = useState(true);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

	useEffect(() => {
		const handleResize = () => setIsDesktopScreen(window.innerWidth > 768);

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		setIsSidebarOpen(isDesktopScreen);
	}, [isDesktopScreen]);

	useEffect(() => {
		if (!isDesktopScreen && isSidebarOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isDesktopScreen, isSidebarOpen]);

	return (
		<div className="flex h-screen relative overflow-hidden">
			<Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
			<div className="flex-1 flex flex-col">
				<Header toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
				<main className="flex-1 p-4 overflow-y-auto">{children}</main>
			</div>
		</div>
	);
}

"use client";

import { Building, Home, ShieldUser, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useEffect, useRef } from "react";

const navLinks = [
	{ title: "Dashboard", icon: Home, href: "/panel" },
	{ title: "Industries", icon: Building, href: "/panel/industries" },
	{ title: "Roles", icon: ShieldUser, href: "/panel/roles" },
	{ title: "Panel Users", icon: Users, href: "/panel/users" },
];

type SidebarProps = { isOpen: boolean; closeSidebar: () => void };

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
	const pathname = usePathname();

	const backdropRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		function handleOutsideClick(e: MouseEvent) {
			if (backdropRef.current && !backdropRef.current.contains(e.target as Node)) {
				closeSidebar();
			}
		}

		document.addEventListener("mousedown", handleOutsideClick);

		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, [closeSidebar]);

	return (
		<>
			<nav
				className={clsx(
					"fixed inset-y-0 h-full left-0 z-40 w-64 bg-background border-r border-border",
					"transform transition-transform ease-in-out",
					isOpen ? "translate-x-0" : "-translate-x-full",
					"md:static md:translate-x-0"
				)}
				ref={backdropRef}>
				<div className="p-4 border-b border-slate-300 h-16 flex items-center w-full">
					<div className="flex items-center justify-between flex-1">
						<p>Insight Hub</p>
						<button className="md:hidden" onClick={closeSidebar}>
							<X />
						</button>
					</div>
				</div>
				<ul className="flex flex-col gap-2 p-2">
					{navLinks.map((navLink, index) => {
						const isActive = pathname === navLink.href;

						return (
							<Link
								onClick={closeSidebar}
								href={navLink.href}
								className={`px-4 py-2 border border-slate-300 rounded-xs ${
									isActive ? "bg-blue-500 text-slate-200" : ""
								}`}
								key={index}>
								{navLink.title}
							</Link>
						);
					})}
				</ul>
			</nav>
			{isOpen && <div className="bg-black/50 md:hidden absolute inset-0 z-20"></div>}
		</>
	);
}

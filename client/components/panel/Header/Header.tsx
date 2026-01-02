"use client";

import { LogOut, Menu, User, UserCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type HeaderProps = {
	toggleSidebar: () => void;
};

export default function Header({ toggleSidebar }: HeaderProps) {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		function handleOutsideClick(e: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}

		document.addEventListener("mousedown", handleOutsideClick);

		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, []);

	return (
		<header className="flex h-16 w-full items-center justify-between border-b border-slate-300 px-4">
			{/* Menu */}
			<button
				onClick={toggleSidebar}
				aria-label="Open menu"
				className="md:hidden rounded-xs p-2 outline-none transition-colors hover:bg-muted focus-visible:ring-1 focus-visible:ring-primary/30">
				<Menu size={22} />
			</button>

			{/* User dropdown */}
			<div className="relative ml-auto" ref={dropdownRef}>
				<button
					aria-haspopup="menu"
					aria-expanded={open}
					onClick={() => setOpen((p) => !p)}
					className="rounded-xs p-2 outline-none transition-colors hover:bg-muted focus-visible:ring-1 focus-visible:ring-primary/30">
					<UserCircle size={22} />
				</button>

				{open && (
					<div
						role="menu"
						className="
              absolute right-0 mt-2 w-56 rounded-xs
              border border-border bg-background shadow-sm
            ">
						<div className="px-4 py-3">
							<p className="text-sm font-medium">Rahul Agarwal</p>
							<p className="text-xs text-muted-foreground">imagarwal05@gmail.com</p>
						</div>

						<div className="h-px bg-border" />

						<Link
							href="/panel/profile"
							role="menuitem"
							onClick={() => setOpen(false)}
							className="
                flex w-full items-center gap-2 px-4 py-2 text-sm
                transition hover:bg-muted
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30
              ">
							<User size={16} />
							Profile
						</Link>

						<div className="h-px bg-border" />

						<button
							role="menuitem"
							onClick={() => setOpen(false)}
							className="
                flex w-full items-center gap-2 px-4 py-2 text-sm
                transition hover:bg-muted
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30
              ">
							<LogOut size={16} />
							Logout
						</button>
					</div>
				)}
			</div>
		</header>
	);
}

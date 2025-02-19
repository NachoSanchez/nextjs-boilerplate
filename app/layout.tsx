"use client"
import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import useSalesforceInteractions from "@/hooks/useSalesforceInteractions";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const { runSitemap, sendEvent } = useSalesforceInteractions();

	const handleSendEvent = () => {
		sendEvent({
			interaction: { name: "Custom Event" }
		});
	}

	useEffect(() => {
		console.log("***", pathname, window);

		const sitemapConfig = {
			global: {
				onActionEvent: (actionEvent: any) => {
					const email = "user@gmail.com";
					actionEvent.user = actionEvent.user || {};
					actionEvent.user.identities = actionEvent.user.identities || {};
					actionEvent.user.attributes = actionEvent.user.attributes || {};

					if (email) {
						actionEvent.user.identities.emailAddress = email;
					}

					return actionEvent;
				},
				contentZones: [
					{ name: 'Body-app', selector: 'body' },
					{ name: 'Header Banner', selector: '#header-banner' },
					{ name: 'Footer Banner', selector: '#footer-banner' },
				]
			},
			pageTypeDefault: {
				name: "default"
			},
			pageTypes: [
				{
					name: 'MockSite - Home',
					isMatch: () => pathname === "/",
					interaction: {
						name: "MockSite - Home"
					}
				},
				{
					name: 'MockSite - About',
					isMatch: () => pathname === "/about",
					interaction: {
						name: 'MockSite - About'
					}
				},
				{
					name: 'MockSite - Products',
					isMatch: () => pathname === "/products",
					interaction: {
						name: 'MockSite - Products'
					},
					contentZones: [
						{ name: "Lista Productos", selector: "#product-list" }
					]
				},
				{
					name: 'MockSite - Contact',
					isMatch: () => pathname === "/contact",
					interaction: {
						name: 'MockSite - Contact'
					}
				}
			]
		};

		runSitemap(
			{ cookieDomain: window.location.hostname },
			sitemapConfig,
			4
		);


	}, [pathname, runSitemap]);

	return (
		<html lang="en">
			<head>
				<script src="//cdn.evgnet.com/beacon/partnerdevsus/ecommerce/scripts/evergage.min.js" async/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<nav className="bg-gray-900 text-white p-4">
					<div className="container mx-auto flex justify-between items-center px-4">
						<Link href="/">
							<span className="text-xl font-bold cursor-pointer">MockSite</span>
						</Link>
						<div className="space-x-4">
							<Link href="/products"><span className="hover:text-gray-400 cursor-pointer">Products</span></Link>
							<Link href="/about"><span className="hover:text-gray-400 cursor-pointer">About</span></Link>
							<Link href="/contact"><span className="hover:text-gray-400 cursor-pointer">Contact</span></Link>
						</div>
					</div>
				</nav>

				{children}

				<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
					<button
						className="bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
						onClick={handleSendEvent}
					>
						Send Event to MCP
					</button>

					<a
						className="flex items-center gap-2 hover:underline hover:underline-offset-4"
						href="https://developer.salesforce.com/docs/marketing/personalization/guide/get-started.html"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							aria-hidden
							src="/globe.svg"
							alt="Globe icon"
							width={16}
							height={16}
						/>
						SFMC Personalization Docs →
					</a>
				</footer>
			</body>
		</html>
	);
}

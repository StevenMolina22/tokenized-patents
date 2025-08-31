"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hardhat } from "viem/chains";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Discover",
    href: "/discover",
  },
  {
    label: "Portfolio",
    href: "/portfolio",
  },
];

export const utilityLinks: HeaderMenuLink[] = [
  {
    label: "Messages",
    href: "/messages",
  },
  {
    label: "Profile",
    href: "/profile",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`px-4 py-2 text-sm font-medium duration-200 ${
              isActive ? "text-white" : "text-[#989898] hover:text-white"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
};

export const UtilityLinks = () => {
  return (
    <>
      {utilityLinks.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className="px-4 py-2 text-sm font-medium text-[#989898] hover:text-white duration-200"
        >
          {label}
        </Link>
      ))}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <header className="w-full bg-[#292526] border-t-2 py-2 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <img src="/navBarLogo.svg" alt="Logo" className="w-[186px] h-[65px]" />

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <HeaderMenuLinks />
          </nav>

          {/* Right side - Utility Links and Wallet Button */}
          <div className="flex items-center space-x-4 relative z-10">
            <div className="hidden md:flex items-center">
              <UtilityLinks />
            </div>
            <div className="relative z-20">
              <RainbowKitCustomConnectButton />
            </div>
            {isLocalNetwork && <FaucetButton />}
          </div>
        </div>
      </div>
    </header>
  );
};

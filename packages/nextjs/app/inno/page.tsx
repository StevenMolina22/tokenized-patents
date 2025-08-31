"use client";

import Button from "./components/Button";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export default function LandingPage() {
  const { openConnectModal } = useConnectModal();

  if (!openConnectModal) return null;

  return (
    <div className="min-h-screen bg-[#292526] flex flex-col items-center justify-center">
      {/* Button container */}
      <div className="flex flex-col -translate-y-4">
        <Button onClick={() => openConnectModal()}>I&apos;m an investor</Button>
        <Button onClick={() => openConnectModal()}>I&apos;m an innovator</Button>
      </div>
      <div className="absolute flex justify-left translate-x-2 bottom-10">
        <img src="/landingLogo.svg" alt="Landing Logo" className="w-[75%] h-[75%]" />
      </div>
    </div>
  );
}

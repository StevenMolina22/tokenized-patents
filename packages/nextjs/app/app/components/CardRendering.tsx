import { useState } from "react";
import { useRouter } from "next/navigation";
import data from "../../data.json";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export default function CardRendering() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showTokenPurchase, setShowTokenPurchase] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(1000);
  const [tokenPrice] = useState(0.001); // ETH per token
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const [currentPatentIndex, setCurrentPatentIndex] = useState(0);

  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const router = useRouter();

  // Transaction hooks
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: hash || undefined });

  const handleRequestAccess = () => {
    setShowPrivacyModal(true);
  };

  const handleContinue = () => {
    if (agreedToTerms) {
      setShowPrivacyModal(false);
      setShowUnlockModal(true);
    }
  };

  const handleUnlockContinue = () => {
    if (isConnected) {
      setShowUnlockModal(false);
      setShowTokenPurchase(true);
    } else {
      openConnectModal?.();
    }
  };

  const handleCancel = () => {
    setShowPrivacyModal(false);
    setShowUnlockModal(false);
    setShowTokenPurchase(false);
    setAgreedToTerms(false);
  };

  const handleDone = () => {
    // Navigate back to discover page
    router.push("/app/discover");
  };

  const handleTokenPurchase = async () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    try {
      // Calculate total ETH amount
      const totalAmount = tokenAmount * tokenPrice;

      // For demo purposes, we'll send ETH to a dummy address
      // In production, you'd interact with your actual smart contract
      writeContract({
        address: "0x0000000000000000000000000000000000000000" as `0x${string}`,
        abi: [
          {
            name: "transfer",
            type: "function",
            stateMutability: "payable",
            inputs: [],
            outputs: [],
          },
        ],
        // @ts-ignore
        value: parseEther(totalAmount.toString()),
      });
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  const handlePass = () => {
    setIsSlidingOut(true);
    setTimeout(() => {
      setCurrentPatentIndex(prev => (prev + 1) % data.patents.length);
      setIsSlidingOut(false);
      // Reset all modal states when switching patents
      setShowPrivacyModal(false);
      setShowUnlockModal(false);
      setShowTokenPurchase(false);
      setAgreedToTerms(false);
    }, 300); // Match the CSS transition duration
  };

  // Get current patent based on index
  const currentPatent = data.patents[currentPatentIndex];

  // Show transaction success state
  if (isSuccess) {
    return (
      <div className="bg-white rounded-4xl shadow-2xl p-8 h-[90vh] max-w-xl w-full mx-4 flex flex-col">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Success Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Transaction Successful!</h2>

        {/* Transaction Details */}
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Transaction Hash:</p>
          <p className="font-mono text-sm text-gray-800 break-all">{hash}</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Tokens Purchased:</span>
            <span className="font-medium text-gray-800">{tokenAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Total Paid:</span>
            <span className="font-medium text-gray-800">{(tokenAmount * tokenPrice).toFixed(4)} ETH</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-4 mt-auto">
          <button
            onClick={handleDone}
            className="flex-1 py-3 px-6 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Show token purchase interface
  if (showTokenPurchase) {
    return (
      <div className="bg-white rounded-4xl shadow-2xl p-8 h-[90vh] max-w-xl w-full mx-4 flex flex-col">
        {/* Top Section - Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Purchase Tokens</h2>

        {/* Wallet Info */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Connected Wallet:</p>
          <p className="font-mono text-sm text-gray-800 break-all">{address}</p>
        </div>

        {/* Token Amount Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tokens</label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={tokenAmount}
              onChange={e => setTokenAmount(Number(e.target.value))}
              min="1"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="1000"
            />
            <button
              onClick={() => setTokenAmount(1000)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              1K
            </button>
            <button
              onClick={() => setTokenAmount(5000)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              5K
            </button>
            <button
              onClick={() => setTokenAmount(10000)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              10K
            </button>
          </div>
        </div>

        {/* Price Information */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Token Price:</span>
            <span className="font-medium text-gray-800">{tokenPrice} ETH</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Total Amount:</span>
            <span className="font-medium text-gray-800">{(tokenAmount * tokenPrice).toFixed(4)} ETH</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">USD Value:</span>
            <span className="font-medium text-gray-800">${(tokenAmount * tokenPrice * 3000).toFixed(2)}</span>
          </div>
        </div>

        {/* Transaction Status */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">Transaction failed: {error.message}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-auto">
          <button
            onClick={handleCancel}
            disabled={isPending || isConfirming}
            className="flex-1 py-3 px-6 bg-gray-300 text-white rounded-lg font-medium hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleTokenPurchase}
            disabled={isPending || isConfirming}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              isPending || isConfirming
                ? "bg-yellow-500 text-white cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isPending ? "Confirming..." : isConfirming ? "Processing..." : "Purchase Tokens"}
          </button>
        </div>
      </div>
    );
  }

  // Show unlock modal (final step)
  if (showUnlockModal) {
    return (
      <div className="bg-white rounded-4xl shadow-2xl p-8 h-[90vh] max-w-xl w-full mx-4 flex flex-col">
        {/* Top Section - Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-purple-700 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Unlock access to innovation.</h2>

        {/* Main Content Text - Section 1 */}
        <p className="text-gray-700 mb-6 text-center">
          View <strong>{currentPatent.title}</strong>&apos;s confidential research data, financial projections, and IP
          strategy, information shared only with qualified investors.
        </p>

        {/* Main Content Text - Section 2 (Privacy Protection) */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-800 mb-3">Privacy Protection</h3>
          <p className="text-gray-700 text-sm">
            This information is shared confidentially with serious investors. By proceeding, you agree to keep all
            details private and use them solely for investment evaluation.
          </p>
        </div>

        {/* Checkbox */}
        <div className="flex items-center mb-8">
          <input
            type="checkbox"
            id="privacy-terms"
            checked={agreedToTerms}
            onChange={e => setAgreedToTerms(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="privacy-terms" className="ml-2 text-sm text-gray-500">
            I agree to these privacy terms.
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-auto">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 px-6 bg-gray-300 text-white rounded-lg font-medium hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUnlockContinue}
            disabled={!agreedToTerms}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              agreedToTerms
                ? "bg-green-400 text-white hover:bg-green-500"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Show privacy modal (first step)
  if (showPrivacyModal) {
    return (
      <div className="bg-white rounded-4xl shadow-2xl p-8 h-[90vh] max-w-xl w-full mx-4 flex flex-col">
        {/* Top Section - Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-purple-700 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Unlock access to innovation.</h2>

        {/* Main Content Text - Section 1 */}
        <p className="text-gray-700 mb-6 text-center">
          View <strong>{currentPatent.title}</strong>&apos;s confidential research data, financial projections, and IP
          strategy, information shared only with qualified investors.
        </p>

        {/* Main Content Text - Section 2 (Privacy Protection) */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-800 mb-3">Privacy Protection</h3>
          <p className="text-gray-700 text-sm">
            This information is shared confidentially with serious investors. By proceeding, you agree to keep all
            details private and use them solely for investment evaluation.
          </p>
        </div>

        {/* Checkbox */}
        <div className="flex items-center mb-8">
          <input
            type="checkbox"
            id="privacy-terms"
            checked={agreedToTerms}
            onChange={e => setAgreedToTerms(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="privacy-terms" className="ml-2 text-sm text-gray-500">
            I agree to these privacy terms.
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-auto">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 px-6 bg-gray-300 text-white rounded-lg font-medium hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!agreedToTerms}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              agreedToTerms
                ? "bg-green-400 text-white hover:bg-green-500"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Show original patent card with sliding animation
  return (
    <div
      className={`bg-white rounded-4xl shadow-2xl p-8 h-[90vh] max-w-xl w-full mx-4 flex flex-col transition-transform duration-300 ease-out ${
        isSlidingOut ? "transform translate-x-full opacity-0" : "transform translate-x-0 opacity-100"
      }`}
    >
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 tracking-tighter">{currentPatent.title}</h2>

        {/* Funding & Stage Details */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
          <span>
            <strong>Seeking:</strong> {currentPatent.seeking}
          </span>
          <span>
            <strong>Stage:</strong> {currentPatent.stage}
          </span>
          <span>
            <strong>Valuation:</strong> {currentPatent.valuation}
          </span>
          <span>
            <strong>Runway:</strong> {currentPatent.runway}
          </span>
        </div>
      </div>

      {/* Visual Placeholder */}
      <div className="w-full h-48 bg-gray-300 rounded-lg mb-6 flex items-center justify-center">
        <span className="text-gray-500">Video/Image Placeholder</span>
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-800 mb-2">Description</h3>
        <p className="text-gray-800 leading-relaxed">{currentPatent.description}</p>
      </div>

      {/* Founder Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Founder</h3>
        <div className="flex items-center gap-4">
          <img
            src={currentPatent.Inventor.imageUrl}
            alt={currentPatent.Inventor.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h4 className="font-bold text-gray-800 text-lg">{currentPatent.Inventor.name}</h4>
            <p className="text-gray-600 text-sm">{currentPatent.Inventor.bio}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons - Now properly contained */}
      <div className="flex gap-4 mt-auto pt-4">
        <button
          onClick={handlePass}
          className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Pass
        </button>
        <button
          onClick={handleRequestAccess}
          className="flex-1 py-3 px-6 bg-[#52D5BA] text-white rounded-lg font-medium hover:bg-[#45C4A8] transition-colors"
        >
          Request Access
        </button>
      </div>
    </div>
  );
}

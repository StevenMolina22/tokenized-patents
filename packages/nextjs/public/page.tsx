import { Poppins } from "next/font/google"

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#292526] flex flex-col items-center justify-center">
            {/* Logo at the top */}
            {/* <div className="mb-12">
                <img src="../assets/navBarLogo.svg" alt="Navbar Logo" className="w-48 h-auto" />
            </div> */}
            
            {/* Button container */}
            <div className="flex gap-8 mb-12">
                <button className="relative px-8 py-4 bg-white text-black font-semibold text-lg rounded-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                    boxShadow: "5px 5px 0px 2px rgba(20,71,230)",
                }}>
                    <span className="relative z-10">I'm an investor</span>
                </button>
                
                <button className="relative px-8 py-4 bg-white text-black font-semibold text-lg rounded-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                    boxShadow: "5px 5px 0px 2px rgba(20,71,230)",
                }}
                >
                    <span className="relative z-10">I'm an inventor</span>
                </button>
            </div>
            
            {/* Large landing logo at the bottom */}
            <div className="mt-8">
                <img src="/landingLogo.svg" alt="Landing Logo" className="w-96 h-auto" />
            </div>
        </div>
    )
}
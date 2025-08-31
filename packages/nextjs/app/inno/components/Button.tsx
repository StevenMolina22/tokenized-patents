export default function Button({ children, onClick, className }: { children: React.ReactNode, onClick: () => void, className?: string }) {
    return (
        <button className={`relative px-8 py-4 text-white font-medium text-lg rounded-lg transform transition-all duration-200 hover:text-[#52D5BA] cursor-pointer outline-none focus:outline-none ${className ?? ""}`}
        onClick={onClick}>
            {children}
        </button>
    )
}
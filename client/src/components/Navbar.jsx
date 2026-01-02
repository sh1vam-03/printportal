import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Button from "./ui/Button";

const Navbar = ({ isOpen, toggleMobileSidebar }) => {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className={`fixed top-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all duration-300 left-0 ${isOpen ? "md:left-64" : "md:left-20"}`}>
            <div className="flex h-16 items-center justify-between md:justify-end px-4 md:px-6">

                {/* Mobile Toggle Button */}
                <button
                    onClick={toggleMobileSidebar}
                    className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600 hidden sm:block">
                        {user?.role}
                    </span>
                    <Button size="sm" variant="secondary" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

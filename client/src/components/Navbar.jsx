import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Button from "./ui/Button";

const Navbar = ({ isOpen, toggleMobileSidebar }) => {
    const { user, logout } = useContext(AuthContext);

    // Help Center Link Logic
    const navigate = (path) => {
        window.location.href = path; // Simple navigation
    };

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
                    <div className="hidden sm:flex flex-col items-end mr-2">
                        <span className="text-sm font-semibold text-gray-900 leading-tight">
                            {user?.name || "User"}
                        </span>
                        <span className="text-xs text-brand-600 font-medium bg-brand-50 px-2 py-0.5 rounded-full">
                            {user?.role}
                        </span>
                    </div>

                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-violet-100 text-brand-700 font-bold border border-white shadow-sm ring-1 ring-gray-100">
                        {user?.name?.charAt(0) || "U"}
                    </div>

                    <button
                        onClick={() => navigate('/help')}
                        className="hidden sm:flex items-center justify-center p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-all"
                        title="Help Center"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>

                    <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                    <Button size="sm" variant="secondary" onClick={logout} className="ml-2 !px-3">
                        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

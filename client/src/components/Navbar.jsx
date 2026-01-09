import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Button from "./ui/Button";

const Navbar = ({ isOpen, toggleMobileSidebar }) => {
    const { user, logout } = useContext(AuthContext);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = (path) => {
        setIsProfileOpen(false);
        window.location.href = path;
    };

    // Close dropdown on outside click (simple version)
    useEffect(() => {
        const close = () => setIsProfileOpen(false);
        if (isProfileOpen) window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, [isProfileOpen]);

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

                    {/* Simplified Profile Dropdown Trigger */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all active:scale-95"
                        >
                            <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-violet-100 text-brand-700 font-bold border border-white shadow-sm ring-1 ring-gray-100 text-sm">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            <svg className={`hidden sm:block h-4 w-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2 overflow-hidden z-50">

                                <div className="p-2 space-y-1">
                                    <button onClick={() => navigate('/help')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all font-medium active:scale-[0.98]">
                                        <svg className="h-4.5 w-4.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        Help Center
                                    </button>
                                    <button onClick={() => navigate('/privacy')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all font-medium active:scale-[0.98]">
                                        <svg className="h-4.5 w-4.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Privacy Policy
                                    </button>
                                    <button onClick={() => navigate('/terms')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all font-medium active:scale-[0.98]">
                                        <svg className="h-4.5 w-4.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Terms of Service
                                    </button>
                                </div>

                                <div className="h-px bg-gray-100 mx-2"></div>

                                <div className="p-2">
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:text-rose-700 hover:bg-rose-50 active:bg-rose-50 rounded-xl transition-all font-medium active:scale-[0.98]"
                                    >
                                        <svg className="h-4.5 w-4.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

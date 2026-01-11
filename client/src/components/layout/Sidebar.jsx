import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = ({ isOpen, toggleSidebar, isMobileOpen, closeMobileSidebar }) => {
    const { user } = useContext(AuthContext);

    // Links config
    const links = [
        {
            name: "Dashboard",
            path: `/${user?.role === "EMPLOYEE" ? "employee" : user?.role === "ADMIN" ? "admin" : "printing"}`,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
        },
        {
            name: "Printing Management",
            path: `/${user?.role === "EMPLOYEE" ? "employee" : user?.role === "ADMIN" ? "admin" : "printing"}/printing-management`,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
            ),
        },
        ...(user?.role === "ADMIN" ? [{
            name: "User Management",
            path: "/admin/users",
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        }] : []),
    ];

    const handleToggle = () => {
        if (window.innerWidth < 768) {
            closeMobileSidebar();
        } else {
            toggleSidebar();
        }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/20 backdrop-blur-sm md:hidden transition-opacity"
                    onClick={closeMobileSidebar}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col h-screen bg-white/90 backdrop-blur-xl border-r border-gray-200/50 shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
                md:translate-x-0 md:shadow-none 
                w-72 ${isOpen ? "md:w-72" : "md:w-24"}`}
            >
                {/* Logo / Toggle Area */}
                <div
                    className="flex h-20 items-center px-6 border-b border-gray-100/50 cursor-pointer group"
                    onClick={handleToggle}
                    title="Toggle Sidebar"
                >
                    <div className="flex items-center gap-4 w-full">
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-500/30 transition-transform group-hover:scale-105 group-active:scale-95">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20"></div>
                        </div>
                        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
                            <span className="text-xl font-bold tracking-tight text-gray-900">Print<span className="text-brand-600 font-light">Portal</span></span>
                            <span className="text-xs font-medium text-brand-500 tracking-wide uppercase mt-0.5 block">MENU</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="p-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end
                            title={!isOpen ? link.name : ""}
                            className={({ isActive }) =>
                                `group flex items-center ${isOpen ? "gap-4 px-4" : "justify-center px-2"} py-3.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${isActive
                                    ? "bg-brand-50/80 text-brand-700 shadow-sm ring-1 ring-brand-200"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-brand-500 rounded-r-full ${!isOpen ? "left-0.5" : ""}`}></div>
                                    )}
                                    <div className={`shrink-0 transition-colors duration-300 ${isActive ? "text-brand-600" : "text-gray-400 group-hover:text-gray-600"}`}>
                                        {link.icon}
                                    </div>
                                    <span className={`transition-all duration-300 whitespace-nowrap ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0 absolute"}`}>
                                        {link.name}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* Optional Footer/User section could go here */}
            </aside>
        </>
    );
};

export default Sidebar;

import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = ({ isOpen, toggleSidebar, isMobileOpen, closeMobileSidebar }) => {
    const { user } = useContext(AuthContext);

    // Links config
    const links = [
        {
            name: "Dashboard",
            path: `/${user?.role === "TEACHER" ? "teacher" : user?.role === "ADMIN" ? "admin" : "printing"}`,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
        },
        {
            name: "Printing Management",
            path: `/${user?.role === "TEACHER" ? "teacher" : user?.role === "ADMIN" ? "admin" : "printing"}/printing-management`,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
            ),
        },
    ];

    const handleToggle = () => {
        if (window.innerWidth < 768) {
            closeMobileSidebar();
        } else {
            toggleSidebar();
        }
    };

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 
            ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} 
            md:translate-x-0 md:shadow-none 
            w-64 ${isOpen ? "md:w-64" : "md:w-20"}`}
        >
            {/* Logo / Toggle Area */}
            <div
                className="flex h-16 items-center px-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={handleToggle}
                title="Toggle Sidebar"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow-md shadow-brand-200">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 2 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <span className={`text-lg font-bold text-gray-900 whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
                        SchoolPrint
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-2 flex-1">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end
                        title={!isOpen ? link.name : ""}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 overflow-hidden whitespace-nowrap ${isActive
                                ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`
                        }
                    >
                        <div className="shrink-0">{link.icon}</div>
                        <span className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}>
                            {link.name}
                        </span>
                    </NavLink>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;

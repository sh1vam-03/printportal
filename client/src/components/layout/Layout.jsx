import { useState, useContext } from "react";
import Navbar from "../Navbar";
import Sidebar from "./Sidebar";
import { AuthContext } from "../../context/AuthContext";

const Layout = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar
                isOpen={isSidebarOpen}
                toggleMobileSidebar={toggleMobileSidebar}
            />

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                ></div>
            )}

            <div className="flex pt-16">
                <Sidebar
                    isOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                    isMobileOpen={isMobileOpen}
                    closeMobileSidebar={() => setIsMobileOpen(false)}
                />
                <main className={`flex-1 p-4 md:p-6 transition-all duration-300 min-w-0 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;

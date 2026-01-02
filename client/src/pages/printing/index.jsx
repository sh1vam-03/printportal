import { useContext, useEffect } from "react";
import { getSocket } from "../../services/socket";
import { ToastContext } from "../../context/ToastContext";
import ProtectedRoutes from "../../components/ProtectedRoutes";
import Layout from "../../components/layout/Layout";
import { Routes, Route } from "react-router-dom";
import PrintDashboard from "./PrintDashboard";
import DashboardAnalytics from "../common/DashboardAnalytics";
import NotFound from "../NotFound";

const PrintingRoutes = () => {
    const { showToast } = useContext(ToastContext);

    useEffect(() => {
        const socket = getSocket();

        const handleNotification = (data) => {
            // Printing department needs to know about: NEW_JOB (when admin approves)
            showToast(data.message, "info");
        };

        socket.on("notify_printing", handleNotification);

        return () => {
            socket.off("notify_printing", handleNotification);
        };
    }, [showToast]);

    return (
        <ProtectedRoutes allowedRoles={["PRINTING"]}>
            <Layout>
                <Routes>
                    <Route index element={<DashboardAnalytics />} />
                    <Route path="printing-management" element={<PrintDashboard />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </ProtectedRoutes>
    );
};

export default PrintingRoutes;

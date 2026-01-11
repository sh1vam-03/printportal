import { useContext, useEffect } from "react";
import { getSocket } from "../../services/socket";
import { ToastContext } from "../../context/ToastContext";
import ProtectedRoutes from "../../components/ProtectedRoutes";
import Layout from "../../components/layout/Layout";
import { Routes, Route, Navigate } from "react-router-dom";
import MyRequests from "./MyRequests";
import DashboardAnalytics from "../common/DashboardAnalytics";
import NotFound from "../NotFound";

const EmployeeRoutes = () => {
    const { showToast } = useContext(ToastContext);

    useEffect(() => {
        const socket = getSocket();

        const handleNotification = (data) => {
            // Employee needs to know about: APPROVED, REJECTED, FILE_DOWNLOADED, STATUS_UPDATE
            showToast(data.message, "info");
        };

        socket.on("notify_employee", handleNotification);

        return () => {
            socket.off("notify_employee", handleNotification);
        };
    }, [showToast]);

    return (
        <ProtectedRoutes allowedRoles={["EMPLOYEE"]}>
            <Layout>
                <Routes>
                    <Route index element={<DashboardAnalytics />} />
                    <Route path="printing-management" element={<MyRequests />} />
                    {/* <Route path="create" element={<CreatePrintRequest />} /> */}
                    <Route path="my-requests" element={<Navigate to="/employee/printing-management" replace />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </ProtectedRoutes>
    );
};

export default EmployeeRoutes;

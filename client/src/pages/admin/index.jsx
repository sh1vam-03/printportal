import ProtectedRoutes from "../../components/ProtectedRoutes";
import Layout from "../../components/layout/Layout";
import { Routes, Route } from "react-router-dom";
import ApproveRequests from "./ApproveRequests";
import DashboardAnalytics from "../common/DashboardAnalytics";
import NotFound from "../NotFound";

const AdminRoutes = () => {
    return (
        <ProtectedRoutes allowedRoles={["ADMIN"]}>
            <Layout>
                <Routes>
                    <Route index element={<DashboardAnalytics />} />
                    <Route path="printing-management" element={<ApproveRequests />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </ProtectedRoutes>
    );
};

export default AdminRoutes;

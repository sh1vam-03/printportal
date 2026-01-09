import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import Button from "./ui/Button";
import StatusBadge from "./StatusBadge";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";

import FilePreviewModal from "./common/FilePreviewModal";
import ConfirmationModal from "./ui/ConfirmationModal";

const RequestTable = ({ role, fetchQueryRole, filterFn, hideActions, hideStatus }) => {
    const { user } = useContext(AuthContext);
    const { showToast } = useContext(ToastContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewFile, setPreviewFile] = useState(null);

    const fetchRequests = async () => {
        try {
            // Determine which role to send to the backend
            // If fetchQueryRole is provided (even empty string), use it. Otherwise use the 'role' prop.
            const queryRole = fetchQueryRole !== undefined ? fetchQueryRole : role;

            // Controller expects userId in query for TEACHER filtering
            const userIdParam = user?.userId ? `&userId=${user.userId}` : "";
            const res = await api.get(`/print-requests?role=${queryRole}${userIdParam}`);

            let data = res.data.data || [];

            // Apply client-side filtering if provided
            if (filterFn) {
                data = data.filter(filterFn);
            }

            setRequests(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRequests();
        }
    }, [user]);

    const approve = async (id) => {
        try {
            await api.put(`/print-requests/${id}/approve`);
            showToast("Print request approved", "success");
            fetchRequests();
        } catch {
            showToast("Failed to approve request", "error");
        }
    };


    const reject = async (id) => {
        try {
            await api.put(`/print-requests/${id}/reject`);
            showToast("Print request rejected", "error");
            fetchRequests();
        } catch {
            showToast("Failed to reject request", "error");
        }
    };


    const updateStatus = async (id, status) => {
        try {
            await api.put(`/print-requests/${id}/status`, { status });

            if (status === "IN_PROGRESS") {
                showToast("Printing started", "warning");
            }

            if (status === "COMPLETED") {
                showToast("Printing completed", "success");
            }

            fetchRequests();
        } catch {
            showToast("Failed to update status", "error");
        }
    };


    const downloadFile = async (id, fileName) => {
        try {
            const response = await api.get(`/print-requests/${id}/download`, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName || "document.pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();

            showToast("File downloaded successfully", "info");
        } catch {
            showToast("File download failed", "error");
        }
    };


    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

    const openDeleteModal = (id) => {
        setConfirmModal({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        if (!confirmModal.id) return;
        try {
            await api.delete(`/print-requests/${confirmModal.id}`);
            showToast("Print request deleted successfully", "success");
            fetchRequests();
        } catch {
            showToast("Failed to delete request", "error");
        } finally {
            setConfirmModal({ isOpen: false, id: null });
        }
    };

    if (loading) return (
        <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        </div>
    );

    return (
        <div className="overflow-hidden">
            {/* Minimal Mobile View */}
            <div className="block md:hidden">
                {requests.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">No requests found</div>
                ) : (
                    <div className="space-y-3">
                        {requests.map((req) => (
                            <div
                                key={req._id}
                                onClick={() => setPreviewFile(req)}
                                className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm active:scale-98 transition-transform"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-semibold text-gray-900 truncate pr-4">{req.title || "Untitled"}</div>
                                    {!hideStatus && <StatusBadge status={req.status} />}
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                    <span>{req.teacher?.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Minimal Desktop Table */}
            <div className="hidden md:block overflow-x-hidden rounded-lg border border-gray-100">
                <table className="w-full border-collapse table-fixed">
                    <thead className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500">
                        <tr>
                            <th className="w-16 px-4 py-3 text-center">Status</th>
                            <th className="px-6 py-3 text-left font-semibold">Document</th>
                            <th className="w-48 px-6 py-3 text-left font-semibold">Teacher</th>
                            <th className="w-32 px-6 py-3 text-right font-semibold">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {requests.length === 0 ? (
                            <tr><td colSpan="4" className="py-8 text-center text-gray-500">No requests found</td></tr>
                        ) : (
                            requests.map((req) => (
                                <tr
                                    key={req._id}
                                    onClick={() => setPreviewFile(req)}
                                    className="group hover:bg-brand-50/30 cursor-pointer transition-colors"
                                >
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex justify-center scale-90"><StatusBadge status={req.status} /></div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors">{req.title || "Untitled Document"}</div>
                                        <div className="text-xs text-gray-400 truncate max-w-[300px]">{req.originalName}</div>
                                    </td>
                                    <td className="px-6 py-3 text-gray-600 font-medium">
                                        {req.teacher?.name}
                                    </td>
                                    <td className="px-6 py-3 text-right text-sm text-gray-500">
                                        {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Enhanced File Preview Modal with Actions */}
            <FilePreviewModal
                isOpen={!!previewFile}
                onClose={() => setPreviewFile(null)}
                fileUrl={previewFile ? `/print-requests/${previewFile._id}/preview` : ""}
                fileType={previewFile?.fileType || (() => {
                    if (!previewFile?.fileUrl) return "application/octet-stream";
                    const ext = previewFile.fileUrl.split('.').pop().toLowerCase();
                    if (ext === "pdf") return "application/pdf";
                    if (["jpg", "jpeg"].includes(ext)) return "image/jpeg";
                    if (ext === "png") return "image/png";
                    if (ext === "txt") return "text/plain";
                    return "application/octet-stream";
                })()}
                originalName={previewFile?.originalName || previewFile?.fileUrl.split('/').pop()}
                requestData={previewFile}
                userRole={role}

                // Action Handlers passed to Modal
                onAction={{
                    approve: approve,
                    reject: reject,
                    delete: (id) => openDeleteModal(id),
                    start: (id) => updateStatus(id, "IN_PROGRESS"),
                    complete: (id) => updateStatus(id, "COMPLETED")
                }}

                onNext={(() => {
                    const currentIndex = requests.findIndex(r => r._id === previewFile?._id);
                    return (currentIndex >= 0 && currentIndex < requests.length - 1) ? () => setPreviewFile(requests[currentIndex + 1]) : null;
                })()}
                onPrev={(() => {
                    const currentIndex = requests.findIndex(r => r._id === previewFile?._id);
                    return currentIndex > 0 ? () => setPreviewFile(requests[currentIndex - 1]) : null;
                })()}
            />

            {/* Delete Confirmation Modal (Invoked from Preview) */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmDelete}
                title="Delete Request?"
                message="Are you sure you want to permanently delete this print request?"
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
};


export default RequestTable;

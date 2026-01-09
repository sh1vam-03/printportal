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
            {/* Minimal Mobile View (Polished Cards) */}
            <div className="block md:hidden">
                {requests.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 italic">No print requests found</div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div
                                key={req._id}
                                onClick={() => setPreviewFile(req)}
                                className="relative rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all duration-200"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-brand-100 text-sm font-bold text-brand-600 shadow-inner">
                                            {req.teacher?.name?.charAt(0) || "?"}
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="font-bold text-gray-900 truncate">{req.title || "Untitled"}</div>
                                            <div className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    {!hideStatus && <StatusBadge status={req.status} />}
                                </div>

                                <div className="mt-2 flex items-center justify-between text-sm">
                                    <span className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2 py-1 rounded-md text-xs font-medium">
                                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        {req.originalName || req.fileUrl.split('/').pop()}
                                    </span>
                                    <svg className="h-5 w-5 text-gray-300 transform group-active:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Premium Desktop Table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <table className="w-full border-collapse table-fixed">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="w-36 px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Document Details</th>
                            <th className="w-56 px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Teacher</th>
                            <th className="w-40 px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Requested</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {requests.length === 0 ? (
                            <tr><td colSpan="4" className="py-12 text-center text-gray-400 italic">No pending requests found</td></tr>
                        ) : (
                            requests.map((req) => (
                                <tr
                                    key={req._id}
                                    onClick={() => setPreviewFile(req)}
                                    className="group hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 text-center align-middle">
                                        <div className="flex justify-center scale-95 origin-center transition-transform group-hover:scale-100">
                                            <StatusBadge status={req.status} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{req.title || "Untitled Job"}</span>
                                            <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                                <span className="truncate max-w-[200px]">{req.originalName || "file.pdf"}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 ring-2 ring-white shadow-sm">
                                                {req.teacher?.name?.charAt(0) || "T"}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{req.teacher?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right align-middle">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-sm font-medium text-gray-900">
                                                {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(req.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
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

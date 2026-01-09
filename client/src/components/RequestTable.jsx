import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import Button from "./ui/Button";
import StatusBadge from "./StatusBadge";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";

import FilePreviewModal from "./common/FilePreviewModal";

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


    if (loading) return (
        <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        </div>
    );

    return (
        <div className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            {/* Mobile View: Stacked Cards */}
            <div className="block md:hidden">
                {requests.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">No requests found</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {requests.map((req) => (
                            <div key={req._id} className="p-4 space-y-4">
                                {/* Header: Teacher & Status */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                                            {req.teacher?.name?.charAt(0) || "?"}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{req.teacher?.name || "Unknown"}</div>
                                            <div className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    {!hideStatus && <StatusBadge status={req.status} />}
                                </div>

                                {/* Body: Details Grid */}
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div className="col-span-2">
                                        <span className="block text-xs font-semibold text-gray-400 uppercase">File</span>
                                        <button
                                            onClick={() => setPreviewFile(req)}
                                            className="font-medium text-indigo-600 break-all hover:underline text-left flex items-center gap-1"
                                        >
                                            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            {req.originalName || req.fileUrl.split('/').pop()}
                                        </button>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {(req.fileSize / 1024).toFixed(1)} KB • {req.fileType?.split('/')[1] || 'unknown'}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-semibold text-gray-400 uppercase">Copies</span>
                                        <span className="font-medium">{req.copies} ({req.printType === "DOUBLE_SIDE" ? "Double" : "Single"})</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-semibold text-gray-400 uppercase">Due</span>
                                        <span className="font-medium">
                                            {new Date(req.dueDateTime).toLocaleString(undefined, {
                                                dateStyle: "short",
                                                timeStyle: "short",
                                            })}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="block text-xs font-semibold text-gray-400 uppercase">Delivery</span>
                                        <div className="font-medium">
                                            {req.deliveryType === "ROOM_DELIVERY" ? `Room ${req.deliveryRoom}` : "Pickup"}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {!hideActions && (
                                    <div className="pt-2 border-t border-gray-100 flex gap-2 justify-end">
                                        {role === "ADMIN" && req.status === "PENDING" && (
                                            <>
                                                <Button size="sm" onClick={() => approve(req._id)} className="w-full justify-center">Approve</Button>
                                                <Button size="sm" variant="danger" onClick={() => reject(req._id)} className="w-full justify-center">Reject</Button>
                                            </>
                                        )}
                                        {role === "PRINTING" && (
                                            <div className="flex flex-col gap-2 w-full">
                                                <Button size="sm" variant="secondary" onClick={() => downloadFile(req._id, req.fileUrl.split('/').pop())} className="w-full justify-center">
                                                    Download
                                                </Button>
                                                {req.status === "APPROVED" && (
                                                    <Button size="sm" onClick={() => updateStatus(req._id, "IN_PROGRESS")} className="w-full justify-center">Start Printing</Button>
                                                )}
                                                {req.status === "IN_PROGRESS" && (
                                                    <Button size="sm" variant="success" onClick={() => updateStatus(req._id, "COMPLETED")} className="w-full justify-center">Complete Job</Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                        <tr>
                            <th className="px-6 py-4 text-left font-semibold">Teacher</th>
                            <th className="px-6 py-4 text-left font-semibold">File Details</th>
                            <th className="px-6 py-4 text-left font-semibold">Delivery Info</th>
                            <th className="px-6 py-4 text-left font-semibold">Due Date</th>
                            {!hideStatus && <th className="px-6 py-4 text-left font-semibold">Status</th>}
                            {!hideActions && <th className="px-6 py-4 text-right font-semibold">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan={hideActions && hideStatus ? "4" : hideActions || hideStatus ? "5" : "6"} className="py-8 text-center text-gray-500">
                                    No requests found
                                </td>
                            </tr>
                        ) : (
                            requests.map((req) => (
                                <tr key={req._id} className="group transition-colors hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                                                {req.teacher?.name?.charAt(0) || "?"}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{req.teacher?.name || "Unknown"}</div>
                                                <div className="text-xs text-gray-500">{req.teacher?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            <button
                                                onClick={() => setPreviewFile(req)}
                                                className="inline-flex items-center gap-1.5 font-medium text-indigo-600 break-all hover:underline"
                                            >
                                                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                {req.originalName || req.fileUrl.split('/').pop()}
                                            </button>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span className="rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-600">
                                                    {req.copies} Copies
                                                </span>
                                                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-gray-500">
                                                    {req.fileType ? req.fileType.split('/')[1].toUpperCase() : 'FILE'}
                                                </span>
                                                <span>•</span>
                                                <span>{req.printType === "DOUBLE_SIDE" ? "Double Sided" : "Single Sided"}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900">
                                                {req.deliveryType === "ROOM_DELIVERY" ? "Room Delivery" : "Pickup"}
                                            </div>
                                            {req.deliveryType === "ROOM_DELIVERY" && (
                                                <div className="text-xs text-gray-500">Room: {req.deliveryRoom}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {new Date(req.dueDateTime).toLocaleString(undefined, {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </span>
                                    </td>
                                    {!hideStatus && (
                                        <td className="px-6 py-4">
                                            <StatusBadge status={req.status} />
                                        </td>
                                    )}
                                    {!hideActions && (
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {role === "ADMIN" && req.status === "PENDING" && (
                                                    <>
                                                        <Button size="sm" onClick={() => approve(req._id)} className="gap-2">
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Approve
                                                        </Button>
                                                        <Button size="sm" variant="danger" onClick={() => reject(req._id)} className="gap-2">
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}

                                                {role === "PRINTING" && (
                                                    <div className="flex flex-col gap-2 sm:flex-row">
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => downloadFile(req._id, req.fileUrl.split('/').pop())}
                                                            className="gap-2"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                            </svg>
                                                            Download
                                                        </Button>

                                                        {req.status === "APPROVED" && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => updateStatus(req._id, "IN_PROGRESS")}
                                                                className="gap-2"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                Start
                                                            </Button>
                                                        )}

                                                        {req.status === "IN_PROGRESS" && (
                                                            <Button
                                                                size="sm"
                                                                variant="success"
                                                                onClick={() => updateStatus(req._id, "COMPLETED")}
                                                                className="gap-2"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                Complete
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* File Preview Modal */}
            <FilePreviewModal
                isOpen={!!previewFile}
                onClose={() => setPreviewFile(null)}
                fileUrl={previewFile ? `/print-requests/${previewFile._id}/preview` : ""}
                fileType={previewFile?.fileType || "application/octet-stream"}
                originalName={previewFile?.originalName || previewFile?.fileUrl.split('/').pop()}
                canDownload={role === "ADMIN" || role === "PRINTING"}
                canPrint={role === "PRINTING"}
            />
        </div>
    );
};

export default RequestTable;

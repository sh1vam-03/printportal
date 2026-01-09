import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import api from "../../services/api";
import StatusBadge from "../StatusBadge";

const FilePreviewModal = ({
    isOpen,
    onClose,
    fileUrl,
    fileType,
    originalName,
    requestData, // Full request object for details
    onAction, // { approve, reject, delete, start, complete }
    userRole, // "ADMIN", "TEACHER", "PRINTING"
    onNext = null,
    onPrev = null,
}) => {
    const [blobUrl, setBlobUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [textContent, setTextContent] = useState(null);

    // Reset state when file changes
    useEffect(() => {
        let active = true;
        let createdUrl = null;

        if (isOpen && fileUrl) {
            setLoading(true);
            setError(null);
            setBlobUrl(null);
            setTextContent(null);

            api.get(fileUrl, { responseType: "blob" })
                .then((response) => {
                    if (!active) return;
                    const type = response.headers['content-type'] || fileType;
                    const blob = new Blob([response.data], { type });
                    createdUrl = URL.createObjectURL(blob);
                    setBlobUrl(createdUrl);

                    if (fileType === "text/plain") {
                        const reader = new FileReader();
                        reader.onload = () => { if (active) setTextContent(reader.result); };
                        reader.readAsText(blob);
                    }
                })
                .catch((err) => {
                    if (!active) return;
                    console.error("Error loading preview:", err);
                    setError("Failed to load file preview. You may not have permission.");
                })
                .finally(() => { if (active) setLoading(false); });
        }

        return () => {
            active = false;
            if (createdUrl) URL.revokeObjectURL(createdUrl);
        };
    }, [isOpen, fileUrl]);

    const handlePrint = () => {
        if (!blobUrl) return;
        const printWindow = window.open(blobUrl);
        if (printWindow) {
            printWindow.onload = () => { printWindow.print(); };
        }
    };

    const handleDownload = () => {
        if (!blobUrl) return;
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = originalName || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={null} // Custom header
            maxWidth="max-w-7xl" // Extra wide for better split
            padding="p-0" // Remove default padding for full control
            hideHeader={true}
        >
            <div
                className="flex flex-col lg:flex-row h-[100dvh] lg:h-[700px] w-full bg-white lg:rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* LEFT: File Preview Area */}
                <div className="flex-1 bg-gray-900/5 lg:bg-gray-100 relative flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200">
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 backdrop-blur-sm">
                            <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600"></div>
                            <span className="mt-4 text-sm font-semibold text-gray-600 tracking-wide animate-pulse">Loading preview...</span>
                        </div>
                    )}

                    {/* Mobile Header (Only visible on mobile) */}
                    <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm z-20">
                        <h3 className="font-bold text-gray-900 truncate pr-4">{originalName || "File Preview"}</h3>
                        <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-8 text-center text-red-500">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {!loading && !error && blobUrl && (
                        <div className="w-full h-full overflow-auto flex items-center justify-center bg-neutral-100/50 backdrop-blur-sm">
                            {fileType === "application/pdf" ? (
                                <iframe src={blobUrl} className="w-full h-full shadow-inner" title="PDF Preview" />
                            ) : fileType?.startsWith("image/") ? (
                                <img src={blobUrl} alt="Preview" className="max-w-full max-h-full object-contain p-2 shadow-xl" />
                            ) : fileType === "text/plain" ? (
                                <pre className="p-8 text-sm font-mono whitespace-pre-wrap text-left w-full h-full overflow-auto text-gray-800 bg-white">{textContent}</pre>
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <svg className="w-16 h-16 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    <span className="font-medium">No preview available</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons (Glassmorphism) */}
                    {onPrev && (
                        <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md shadow-lg rounded-full text-gray-800 transition-all hover:scale-110 z-20 group-hover:block border border-white/50">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                    )}
                    {onNext && (
                        <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md shadow-lg rounded-full text-gray-800 transition-all hover:scale-110 z-20 group-hover:block border border-white/50">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    )}
                </div>

                {/* RIGHT: Details & Actions Panel */}
                <div className="w-full lg:w-96 flex flex-col border-l border-gray-100 bg-white shrink-0 shadow-[-4px_0_15px_rgba(0,0,0,0.02)] z-10">

                    {/* Header */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 leading-tight mb-1">{requestData?.title || "Untitled Job"}</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="text-xs uppercase tracking-wide font-medium text-gray-400">Requested by</span>
                                        <span className="flex items-center gap-1 font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full text-xs border border-brand-100">
                                            {requestData?.teacher?.name || "Unknown Teacher"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {/* Status Section */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Status</h4>
                            <div className="flex items-center gap-3">
                                {/* StatusBadge component is assumed to be defined or imported elsewhere */}
                                <StatusBadge status={requestData?.status} />
                                <span className="text-xs text-gray-400">{new Date(requestData?.updatedAt).toLocaleTimeString()}</span>
                            </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 shadow-sm space-y-3">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Print Specifications</h4>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-xs text-gray-500 mb-0.5">Copies</span>
                                    <span className="font-bold text-gray-900 text-lg">{requestData?.copies}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500 mb-0.5">Format</span>
                                    <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                                        {requestData?.printType === "DOUBLE_SIDE" ? (
                                            <><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> Double Sided</>
                                        ) : (
                                            <><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Single Sided</>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Info */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Delivery & Deadline</h4>
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                                <div className="p-2.5 bg-white text-indigo-600 rounded-lg shadow-sm">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900 text-sm">
                                        Due {new Date(requestData?.dueDateTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </p>
                                    <p className="text-xs text-indigo-600/80 font-medium uppercase tracking-wide mt-1">
                                        by {new Date(requestData?.dueDateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <div className="mt-2 text-xs text-gray-600 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {requestData?.deliveryType === "ROOM_DELIVERY" ? `Deliver to Room ${requestData?.deliveryRoom}` : "Pickup from Print Room"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm gap-3 flex flex-col">

                        {/* Admin Approvals */}
                        {userRole === "ADMIN" && requestData?.status === "PENDING" && (
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => { onAction.approve(requestData._id); onClose(); }} className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-200 active:scale-95">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Approve
                                </button>
                                <button onClick={() => { onAction.reject(requestData._id); onClose(); }} className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    Reject
                                </button>
                            </div>
                        )}

                        {/* Printing Controls */}
                        {userRole === "PRINTING" && (
                            <div className="space-y-3">
                                {requestData?.status === "APPROVED" && (
                                    <button onClick={() => { onAction.start(requestData._id); onClose(); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                                        Start Printing Job
                                    </button>
                                )}
                                {requestData?.status === "IN_PROGRESS" && (
                                    <button onClick={() => { onAction.complete(requestData._id); onClose(); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Mark as Completed
                                    </button>
                                )}
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={handlePrint} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2-4h6a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 002 2zm-7 14h10a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2z" /></svg>
                                        Print
                                    </button>
                                    <button onClick={handleDownload} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        Download
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Dangerous Actions */}
                        {((userRole === "TEACHER" && ["PENDING", "REJECTED", "COMPLETED"].includes(requestData?.status)) || (userRole === "ADMIN" && requestData?.status !== "PENDING")) && (
                            <button
                                onClick={() => { onAction.delete(requestData._id); onClose(); }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors mt-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Delete Request
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default FilePreviewModal;

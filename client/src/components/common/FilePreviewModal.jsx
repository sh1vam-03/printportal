import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import api from "../../services/api";

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
            title={originalName || "File Preview"}
            maxWidth="max-w-6xl" // Wider modal for split view
        >
            <div className="flex flex-col lg:flex-row gap-6 h-[80vh] lg:h-[700px]">
                {/* LEFT: File Preview Area */}
                <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden relative flex flex-col border border-gray-200">
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600"></div>
                            <span className="mt-4 text-sm font-medium text-gray-500">Loading document...</span>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white p-8 text-center text-red-500">
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && blobUrl && (
                        <div className="w-full h-full overflow-auto bg-gray-50 flex items-center justify-center">
                            {fileType === "application/pdf" ? (
                                <iframe src={blobUrl} className="w-full h-full" title="PDF Preview" />
                            ) : fileType?.startsWith("image/") ? (
                                <img src={blobUrl} alt="Preview" className="max-w-full max-h-full object-contain p-4" />
                            ) : fileType === "text/plain" ? (
                                <pre className="p-6 text-sm font-mono whitespace-pre-wrap text-left w-full h-full overflow-auto text-gray-800">{textContent}</pre>
                            ) : (
                                <div className="text-gray-500">Preview not available for this file type</div>
                            )}
                        </div>
                    )}

                    {/* Navigation Overlays */}
                    {onPrev && (
                        <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 shadow-lg rounded-full text-gray-600 hover:text-brand-600 transition-all border hover:scale-110">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                    )}
                    {onNext && (
                        <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 shadow-lg rounded-full text-gray-600 hover:text-brand-600 transition-all border hover:scale-110">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    )}
                </div>

                {/* RIGHT: Details & Actions Panel */}
                <div className="w-full lg:w-80 flex flex-col border-l border-gray-100 pl-0 lg:pl-2 shrink-0 overflow-y-auto">
                    <div className="space-y-6 px-1">

                        {/* Meta Header */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-snug mb-1">{requestData?.title || "Untitled Job"}</h3>
                            <div className="text-sm text-gray-500">
                                by <span className="font-semibold text-brand-600">{requestData?.teacher?.name}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                {new Date(requestData?.createdAt).toLocaleString()}
                            </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Copies</span>
                                <span className="font-semibold text-gray-900">{requestData?.copies}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Sides</span>
                                <span className="font-semibold text-gray-900">{requestData?.printType === "DOUBLE_SIDE" ? "Double" : "Single"}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">File Type</span>
                                <span className="font-medium text-gray-700 uppercase">{fileType?.split('/')[1] || "File"}</span>
                            </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery Details</h4>
                            <div className="flex items-start gap-3 text-sm">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {requestData?.deliveryType === "ROOM_DELIVERY" ? `Room ${requestData?.deliveryRoom}` : "Pickup"}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-0.5">
                                        Due: {new Date(requestData?.dueDateTime).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="pt-4 mt-auto space-y-3 border-t border-gray-100">

                            {/* Admin Actions */}
                            {userRole === "ADMIN" && requestData?.status === "PENDING" && (
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => { onAction.approve(requestData._id); onClose(); }} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                                        Approve
                                    </button>
                                    <button onClick={() => { onAction.reject(requestData._id); onClose(); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                                        Reject
                                    </button>
                                </div>
                            )}

                            {/* Printing Dept Actions */}
                            {userRole === "PRINTING" && (
                                <div className="space-y-2">
                                    {requestData?.status === "APPROVED" && (
                                        <button onClick={() => { onAction.start(requestData._id); onClose(); }} className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm">
                                            Start Printing
                                        </button>
                                    )}
                                    {requestData?.status === "IN_PROGRESS" && (
                                        <button onClick={() => { onAction.complete(requestData._id); onClose(); }} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow-sm">
                                            Mark Completed
                                        </button>
                                    )}
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={handlePrint} className="px-3 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700">Print File</button>
                                        <button onClick={handleDownload} className="px-3 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700">Download</button>
                                    </div>
                                </div>
                            )}

                            {/* Delete Action (Shared) */}
                            {((userRole === "TEACHER" && ["PENDING", "REJECTED", "COMPLETED"].includes(requestData?.status)) || (userRole === "ADMIN" && requestData?.status !== "PENDING")) && (
                                <button
                                    onClick={() => { onAction.delete(requestData._id); onClose(); }}
                                    className="w-full px-4 py-2 border border-red-100 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Delete Request
                                </button>
                            )}

                            <button onClick={onClose} className="w-full px-4 py-2 text-gray-500 hover:text-gray-800 text-sm">
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default FilePreviewModal;

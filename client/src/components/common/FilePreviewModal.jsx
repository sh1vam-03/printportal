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
    userRole, // "ADMIN", "EMPLOYEE", "PRINTING"
    onNext = null,
    onPrev = null,
}) => {
    const [blobUrl, setBlobUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [textContent, setTextContent] = useState(null);

    // Helper to format file size
    const formatFileSize = (bytes) => {
        if (!bytes) return "Unknown Size";
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Helper to get readable file type
    const getReadableFileType = (mimeType, url) => {
        if (mimeType === "application/pdf") return "PDF Document";
        if (mimeType?.startsWith("image/")) return "Image File";
        if (mimeType === "text/plain") return "Text File";
        if (mimeType === "text/csv") return "CSV Spreadsheet";

        // Excel
        if (mimeType === "application/vnd.ms-excel") return "Excel Spreadsheet";
        if (mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return "Excel Spreadsheet";

        // PowerPoint
        if (mimeType === "application/vnd.ms-powerpoint") return "PowerPoint Presentation";
        if (mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation") return "PowerPoint Presentation";

        // Archives
        if (mimeType === "application/zip" || mimeType === "application/x-zip-compressed") return "ZIP Archive";

        // Fallback to extension
        if (url) {
            const parts = url.split('.');
            if (parts.length > 1) {
                const ext = parts.pop()?.toUpperCase();
                if (ext) {
                    if (["DOC", "DOCX"].includes(ext)) return "Word Document";
                    if (["MD", "MARKDOWN"].includes(ext)) return "Markdown File";
                    if (["XLS", "XLSX"].includes(ext)) return "Excel Spreadsheet";
                    if (["PPT", "PPTX"].includes(ext)) return "PowerPoint Presentation";
                    if (["CSV"].includes(ext)) return "CSV Spreadsheet";
                    if (["RTF"].includes(ext)) return "Rich Text Document";
                    if (["ODT"].includes(ext)) return "OpenDocument Text";
                    if (["SVG"].includes(ext)) return "SVG Image";
                    if (["BMP"].includes(ext)) return "BMP Image";
                    if (["ZIP"].includes(ext)) return "ZIP Archive";
                    if (ext.length < 6 && !ext.includes('/')) return `${ext} File`;
                }
            }
        }
        return "Document";
    };

    // Get the actual file URL - prioritize Cloudinary URL from requestData
    const actualFileUrl = requestData?.fileUrl || fileUrl;

    // Reset state when file changes
    useEffect(() => {
        let active = true;

        if (isOpen && actualFileUrl) {
            setLoading(true);
            setError(null);
            setTextContent(null);

            // Check if this is a text file that needs content reading
            const isTextFile = fileType === "text/plain" || fileType === "text/csv" || fileType === "text/markdown" ||
                actualFileUrl?.toLowerCase().endsWith(".md") || actualFileUrl?.toLowerCase().endsWith(".csv") ||
                actualFileUrl?.toLowerCase().endsWith(".txt");

            if (isTextFile) {
                // Only fetch as blob for text files to read content
                // Use the API endpoint for fetching (fileUrl) to ensure proper auth
                api.get(actualFileUrl, { responseType: "blob" })
                    .then((response) => {
                        if (!active) return;
                        const blob = new Blob([response.data], { type: fileType || 'text/plain' });
                        const reader = new FileReader();
                        reader.onload = () => { if (active) setTextContent(reader.result); };
                        reader.readAsText(blob);
                    })
                    .catch((err) => {
                        if (!active) return;
                        console.error("Error loading text file:", err);
                        setError("Failed to load file content.");
                    })
                    .finally(() => { if (active) setLoading(false); });
            } else {
                // For all other files (PDF, DOCX, images), use direct URLs - no blob fetch needed
                setLoading(false);
            }
        }

        return () => {
            active = false;
        };
    }, [isOpen, actualFileUrl, fileType]);

    const handlePrint = () => {
        if (!blobUrl) return;
        const printWindow = window.open(blobUrl);
        if (printWindow) {
            printWindow.onload = () => { printWindow.print(); };
        }
    };

    const handleDownload = () => {
        // Use the actual Cloudinary URL
        if (!actualFileUrl) return;

        const link = document.createElement("a");
        link.href = actualFileUrl;
        link.download = originalName || "download";
        link.target = "_blank";
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
                className="flex flex-col lg:flex-row h-[100dvh] lg:h-[700px] w-full bg-white lg:rounded-2xl overflow-y-auto lg:overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* LEFT: File Preview Area */}
                <div className="min-h-[40vh] lg:h-auto lg:flex-1 bg-gray-900/5 lg:bg-gray-100 relative flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 pt-14 lg:pt-0 shrink-0">
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 backdrop-blur-sm">
                            <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600"></div>
                            <span className="mt-4 text-sm font-semibold text-gray-600 tracking-wide animate-pulse">Loading preview...</span>
                        </div>
                    )}

                    {/* Mobile Header (Close Button Only) */}
                    <div className="lg:hidden flex items-center justify-end px-4 py-3 bg-transparent absolute top-0 right-0 z-30 w-full pointer-events-none">
                        <button onClick={onClose} className="pointer-events-auto p-2 text-white hover:text-gray-200 bg-black/20 backdrop-blur-md rounded-full shadow-sm transition-all active:scale-95">
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

                    {!loading && !error && (
                        <div className="w-full h-auto min-h-full flex items-center justify-center bg-neutral-100/50 backdrop-blur-sm p-4 lg:p-0">
                            {fileType === "application/pdf" ? (
                                <iframe src={actualFileUrl} className="w-full h-[50dvh] lg:h-full shadow-inner rounded-lg lg:rounded-none" title="PDF Preview" />
                            ) : (fileType?.startsWith("image/") || fileType === "image/svg+xml") ? (
                                <img src={actualFileUrl} alt="Preview" className="w-auto h-auto max-w-full max-h-[70vh] lg:max-h-full object-contain shadow-xl rounded-lg" />
                            ) : (fileType === "text/plain" || fileType === "text/csv" || fileType === "text/markdown" ||
                                actualFileUrl?.toLowerCase().endsWith(".md") || actualFileUrl?.toLowerCase().endsWith(".csv") ||
                                actualFileUrl?.toLowerCase().endsWith(".txt")) ? (
                                <pre className="p-8 text-sm font-mono whitespace-pre-wrap text-left w-full h-auto overflow-visible text-gray-800 bg-white rounded-lg shadow-sm">{textContent || "Loading text..."}</pre>
                            ) : (
                                // Google Docs Viewer for Office documents (DOCX, Excel, PowerPoint)
                                fileType === "application/msword" ||
                                fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                                fileType === "application/vnd.ms-excel" ||
                                fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                                fileType === "application/vnd.ms-powerpoint" ||
                                fileType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
                                actualFileUrl?.toLowerCase().endsWith(".doc") || actualFileUrl?.toLowerCase().endsWith(".docx") ||
                                actualFileUrl?.toLowerCase().endsWith(".xls") || actualFileUrl?.toLowerCase().endsWith(".xlsx") ||
                                actualFileUrl?.toLowerCase().endsWith(".ppt") || actualFileUrl?.toLowerCase().endsWith(".pptx")
                            ) ? (
                                <iframe
                                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(actualFileUrl)}&embedded=true`}
                                    className="w-full h-[50dvh] lg:h-full shadow-inner rounded-lg lg:rounded-none"
                                    title="Document Preview"
                                />
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center p-6 text-center">
                                    <svg className="w-16 h-16 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    <span className="font-medium text-lg text-gray-500 mb-1">
                                        No Preview Available
                                    </span>
                                    <span className="text-sm text-gray-400 mb-4">
                                        This file type cannot be previewed directly.
                                    </span>
                                    <button onClick={handleDownload} className="px-4 py-2 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-lg text-sm font-semibold transition-colors">
                                        Download to View
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons (Glassmorphism) */}
                    {onPrev && (
                        <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md shadow-lg rounded-full text-gray-800 transition-all hover:scale-110 z-20 group-hover:block border border-white/50 hidden lg:flex">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                    )}
                    {onNext && (
                        <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md shadow-lg rounded-full text-gray-800 transition-all hover:scale-110 z-20 group-hover:block border border-white/50 hidden lg:flex">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    )}
                </div>

                {/* RIGHT: Details & Actions Panel */}
                <div className="w-full lg:w-96 flex flex-col border-l border-gray-100 bg-white shrink-0 z-10 h-auto rounded-t-3xl lg:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:shadow-none translate-y-0 relative">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 relative">
                        {/* Desktop Close Button */}
                        <button
                            onClick={onClose}
                            className="hidden lg:flex absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-all"
                            title="Close Preview"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="flex flex-col gap-4">
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight break-words">{requestData?.title || "Untitled Job"}</h2>

                            <div className="flex flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-brand-100 to-indigo-100 flex items-center justify-center text-brand-700 font-bold text-sm ring-2 ring-white shadow-sm">
                                        {requestData?.employee?.name?.charAt(0) || "?"}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate max-w-[140px]">{requestData?.employee?.name || "Unknown"}</p>
                                        <p className="text-xs text-gray-500 font-medium truncate">Request Owner</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center shrink-0">
                                    <StatusBadge status={requestData?.status} />
                                    <span className="text-xs text-gray-400 mt-1 font-medium text-center">
                                        {new Date(requestData?.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="p-6 space-y-6 lg:overflow-y-auto lg:flex-1">



                        {/* File Details Grid */}
                        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">File Details</h4>
                            <div className="space-y-3">
                                <div>
                                    <span className="block text-xs text-gray-500 mb-0.5">Filename</span>
                                    <span className="font-semibold text-gray-900 text-sm break-all line-clamp-2" title={originalName}>
                                        {originalName || "Unknown Filename"}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="block text-xs text-gray-500 mb-0.5">Size</span>
                                        <span className="font-semibold text-gray-900 text-sm">{formatFileSize(requestData?.fileSize)}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-500 mb-0.5">Type</span>
                                        <span className="font-semibold text-gray-900 text-sm">{getReadableFileType(fileType, fileUrl)}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="block text-xs text-gray-500 mb-0.5">Uploaded On</span>
                                        <span className="font-semibold text-gray-900 text-sm">
                                            {new Date(requestData?.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-500 mb-0.5">Last Modified</span>
                                        <span className="font-semibold text-gray-900 text-sm">
                                            {new Date(requestData?.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Print Specs Grid */}
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
                                        by {new Date(requestData?.dueDateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}
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
                        {((userRole === "EMPLOYEE" && ["PENDING", "REJECTED", "COMPLETED"].includes(requestData?.status)) || (userRole === "ADMIN" && requestData?.status !== "PENDING")) && (
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

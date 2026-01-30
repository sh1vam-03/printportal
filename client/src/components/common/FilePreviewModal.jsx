import { useState, useEffect, useRef } from "react";
import Modal from "../ui/Modal";
import api from "../../services/api";
import StatusBadge from "../StatusBadge";
import * as mammoth from "mammoth";
import JSZip from "jszip";

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [textContent, setTextContent] = useState(null);
    const [htmlContent, setHtmlContent] = useState(null);

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

    // State for the secure file URL fetched from backend
    const [secureUrl, setSecureUrl] = useState(null);
    const [directDownloadUrl, setDirectDownloadUrl] = useState(null);

    // Reset state when file changes
    useEffect(() => {
        let active = true;

        const fetchSecureUrl = async () => {
            if (!requestData?._id) return;

            try {
                setLoading(true);
                setError(null);
                setTextContent(null);
                setHtmlContent(null);
                setSecureUrl(null);
                setDirectDownloadUrl(null);

                // 1. Fetch Blob for Preview (Text, Image, Desktop PDF)
                // Use relative path directly to ensure API instance handles it with Auth headers
                const fileEndpoint = `/print-requests/${requestData._id}/file`;

                // 2. Also Fetch Direct Download URL (For Mobile PDF / Download Button)
                // We do this in parallel or sequence. 
                api.get(`/print-requests/${requestData._id}/download?json=true`)
                    .then(res => {
                        if (active && res.data && res.data.downloadUrl) {
                            setDirectDownloadUrl(res.data.downloadUrl);
                        }
                    })
                    .catch(err => console.log("Direct download URL fetch failed (likely local file)", err));

                if (active) {
                    console.log("[Preview] Fetching blob from:", fileEndpoint);

                    const blobRes = await api.get(fileEndpoint, {
                        responseType: 'blob'
                    });

                    const blob = blobRes.data;
                    console.log("[Preview] Blob received, size:", blob.size, "type:", blob.type);

                    if (blob.size === 0) {
                        throw new Error("Received empty file");
                    }

                    const objectUrl = window.URL.createObjectURL(blob);
                    setSecureUrl(objectUrl);

                    // Content Type Logic
                    const lowerName = originalName?.toLowerCase() || "";

                    // TEXT FILES
                    const isTextFile = fileType === "text/plain" || fileType === "text/csv" || fileType === "text/markdown" ||
                        fileType?.startsWith("text/") ||
                        lowerName.endsWith(".md") ||
                        lowerName.endsWith(".txt") ||
                        lowerName.endsWith(".csv");

                    // WORD DOCUMENTS (DOCX)
                    const isDocx = fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                        lowerName.endsWith(".docx");

                    // POWERPOINT (PPTX)
                    const isPptx = fileType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
                        lowerName.endsWith(".pptx");

                    if (isTextFile) {
                        try {
                            const textText = await blob.text();
                            if (active) setTextContent(textText);
                        } catch (err) {
                            console.error("Text read failed", err);
                            if (active) setError("Failed to read text content");
                        }
                    } else if (isDocx) {
                        try {
                            const arrayBuffer = await blob.arrayBuffer();
                            const result = await mammoth.convertToHtml({ arrayBuffer });
                            if (active) setHtmlContent(result.value);
                        } catch (err) {
                            console.error("Docx conversion failed", err);
                            if (active) setError("Failed to render Word document.");
                        }
                    } else if (isPptx) {
                        try {
                            const zip = await JSZip.loadAsync(blob);
                            const slideFiles = Object.keys(zip.files).filter(name => name.startsWith("ppt/slides/slide") && name.endsWith(".xml"));

                            // Sort naturally: slide1, slide2, slide10
                            slideFiles.sort((a, b) => {
                                const numA = parseInt(a.match(/slide(\d+)\.xml/)[1]);
                                const numB = parseInt(b.match(/slide(\d+)\.xml/)[1]);
                                return numA - numB;
                            });

                            let finalHtml = "";
                            if (slideFiles.length === 0) {
                                finalHtml = "<p class='text-gray-500 italic'>No slides found or legacy PPT format.</p>";
                            }

                            for (let i = 0; i < slideFiles.length; i++) {
                                const slideName = slideFiles[i];
                                const slideXml = await zip.file(slideName).async("string");

                                // Simple regex to extract text within <a:t> tags
                                const matches = slideXml.match(/<a:t[^>]*>(.*?)<\/a:t>/g);
                                let slideText = "";
                                if (matches) {
                                    slideText = matches.map(tag => tag.replace(/<\/?a:t[^>]*>/g, "")).join(" ");
                                }

                                finalHtml += `
                                    <div class="mb-8 p-6 bg-gray-50 border border-gray-200 shadow-sm rounded-lg break-words">
                                        <h4 class="font-bold text-gray-400 uppercase text-xs mb-4 select-none">Slide ${i + 1}</h4>
                                        <p class="text-gray-800 whitespace-pre-wrap leading-relaxed">${slideText || "<span class='text-gray-400 italic'>No text content</span>"}</p>
                                    </div>
                                `;
                            }

                            if (active) setHtmlContent(finalHtml);

                        } catch (err) {
                            console.error("PPTX conversion failed", err);
                            if (active) setError("Failed to extract text from PowerPoint.");
                        }
                    }
                }
            } catch (err) {
                console.error("Preview setup failed:", err);
                if (err.response?.data instanceof Blob && err.response.data.type === "application/json") {
                    try {
                        const jsonText = await err.response.data.text();
                        const jsonError = JSON.parse(jsonText);
                        console.error("Backend Error JSON:", jsonError);
                    } catch (e) { /* ignore */ }
                }

                if (active) setError("Failed to load file preview. Ensure you are logged in.");
            } finally {
                if (active) setLoading(false);
            }
        };

        if (isOpen && requestData?._id) {
            fetchSecureUrl();
        }

        return () => {
            active = false;
        };
    }, [isOpen, requestData, fileType, originalName]);

    const handlePrint = () => {
        if (!secureUrl) return;
        // Open the secure URL in new window triggers native print or view
        const printWindow = window.open(secureUrl);
        // Printing programmatically is hard with direct stream unless we overload it.
        // For PDF, browser viewer has print button. For others, Ctrl+P.
        if (printWindow && fileType?.startsWith('image/')) {
            printWindow.onload = () => { printWindow.print(); };
        }
    };

    const handleDownload = () => {
        // Prefer direct URL if available (Cloudinary)
        if (directDownloadUrl) {
            const link = document.createElement("a");
            link.href = directDownloadUrl;
            link.setAttribute('download', originalName || "download");
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }

        // Fallback to blob download
        if (!secureUrl) return;
        const link = document.createElement("a");
        link.href = secureUrl;
        link.setAttribute('download', originalName || "download");
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

                    {/* Mobile Header (Title + Status + Close) */}
                    <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 absolute top-0 left-0 right-0 z-30 w-full shadow-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <h2 className="text-sm font-bold text-gray-900 truncate max-w-[180px]">
                                {requestData?.title || "Untitled Job"}
                            </h2>
                            <StatusBadge status={requestData?.status} size="sm" />
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full transition-all active:scale-95 shrink-0">
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

                    {!loading && !error && secureUrl && (
                        <div className="w-full h-full bg-neutral-100/50 backdrop-blur-sm">
                            {fileType === "application/pdf" ? (
                                <div className="w-full h-full bg-gray-100 flex flex-col justify-center items-center">
                                    {/* Desktop: Embedded Iframe */}
                                    <iframe
                                        src={secureUrl}
                                        className="hidden lg:block w-full h-full border-0"
                                        title="PDF Preview"
                                    >
                                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                            <p className="text-gray-500 mb-4">
                                                Preview not available.
                                            </p>
                                            <a
                                                href={secureUrl}
                                                download={originalName || "document.pdf"}
                                                className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
                                            >
                                                Download PDF
                                            </a>
                                        </div>
                                    </iframe>

                                    {/* Mobile/Tablet: Direct Open Button (Iframes are buggy on mobile) */}
                                    <div className="lg:hidden flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
                                        <div className="mb-6 p-4 bg-red-50 rounded-full ring-4 ring-red-50/50">
                                            <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">PDF Document</h3>
                                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                                            Mobile browsers often struggle to display embedded PDFs. Tap below to view the file.
                                        </p>
                                        <a
                                            href={directDownloadUrl || secureUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all active:scale-95"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            Open PDF
                                        </a>
                                    </div>
                                </div>
                            ) : (fileType?.startsWith("image/") || fileType === "image/svg+xml") ? (
                                <div className="w-full h-full overflow-y-auto flex items-center justify-center p-4">
                                    <img src={secureUrl} alt="Preview" className="w-auto h-auto max-w-full max-h-none shadow-xl rounded-lg" />
                                </div>
                            ) : (textContent) ? (
                                <div className="w-full h-full overflow-y-auto p-4 lg:p-8">
                                    <pre className="text-sm font-mono whitespace-pre-wrap text-left w-full h-auto text-gray-800 bg-white rounded-lg shadow-sm p-6 border border-gray-200">{textContent}</pre>
                                </div>
                            ) : (htmlContent) ? (
                                <div className="w-full h-full overflow-y-auto p-4 lg:p-12 bg-white flex justify-center">
                                    <div className="prose max-w-3xl w-full shadow-sm p-8 bg-white border border-gray-100 min-h-full" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                                </div>
                            ) : (
                                // OFFICE / OTHER FILES
                                // Local files cannot be previewed by external viewers.
                                // We show generic download prompt.
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-gray-400 flex flex-col items-center p-6 text-center">
                                        <svg className="w-16 h-16 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        <span className="font-medium text-lg text-gray-500 mb-1">
                                            Preview Not Available
                                        </span>
                                        <span className="text-sm text-gray-400 mb-4 max-w-xs">
                                            {fileType?.includes("powerpoint") || originalName?.toLowerCase().includes("ppt")
                                                ? "PowerPoint functionality is currently limited to download only."
                                                : "This file type cannot be previewed directly in browser."}
                                        </span>
                                        <a href={secureUrl} download={originalName} target="_blank" rel="noreferrer" className="px-4 py-2 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-lg text-sm font-semibold transition-colors">
                                            Download to View
                                        </a>
                                    </div>
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
                            <h2 className="hidden lg:block text-2xl font-bold text-gray-900 leading-tight break-words">{requestData?.title || "Untitled Job"}</h2>

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

                                <div className="hidden lg:flex flex-col items-center justify-center shrink-0">
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
        </Modal >
    );
};

export default FilePreviewModal;

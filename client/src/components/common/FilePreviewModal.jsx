import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import api from "../../services/api";

const FilePreviewModal = ({
    isOpen,
    onClose,
    fileUrl, // API endpoint or partial URL
    fileType,
    originalName,
    canDownload = false,
    canPrint = false,
}) => {
    const [blobUrl, setBlobUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [textContent, setTextContent] = useState(null);


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
                    const blob = new Blob([response.data], { type: fileType });
                    createdUrl = URL.createObjectURL(blob);
                    setBlobUrl(createdUrl);

                    if (fileType === "text/plain") {
                        const reader = new FileReader();
                        reader.onload = () => {
                            if (active) setTextContent(reader.result);
                        };
                        reader.readAsText(blob);
                    }
                })
                .catch((err) => {
                    if (!active) return;
                    console.error("Error loading preview:", err);
                    setError("Failed to load file preview. You may not have permission.");
                })
                .finally(() => {
                    if (active) setLoading(false);
                });
        }

        return () => {
            active = false;
            // If we created a URL, revoke it
            if (createdUrl) {
                URL.revokeObjectURL(createdUrl);
            }
        };
    }, [isOpen, fileUrl]);

    const handlePrint = () => {
        if (!blobUrl) return;
        const printWindow = window.open(blobUrl);
        if (printWindow) {
            // Wait for load then print
            printWindow.onload = () => {
                printWindow.print();
            };
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

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={originalName || "File Preview"}
        >
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600"></div>
                        <span className="mt-4 text-sm font-medium text-gray-500">Loading document preview...</span>
                    </div>
                )}

                {error && (
                    <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
                        <p className="font-medium">Preview Failed</p>
                        <p className="text-sm mt-1 opacity-80">{error}</p>
                    </div>
                )}

                {!loading && !error && blobUrl && (
                    <div className="w-full h-full flex-1 overflow-auto relative group rounded-lg bg-gray-50 border border-gray-100">
                        {/* Watermark */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none z-10 overflow-hidden">
                            <div className="transform -rotate-45 text-4xl font-black text-gray-900 whitespace-nowrap">
                                PREVIEW • PREVIEW • PREVIEW
                            </div>
                        </div>

                        {fileType === "application/pdf" ? (
                            <iframe
                                src={blobUrl}
                                className="w-full h-[600px] rounded-lg"
                                title="PDF Preview"
                            />
                        ) : fileType.startsWith("image/") ? (
                            <img
                                src={blobUrl}
                                alt="Preview"
                                className="max-w-full h-auto mx-auto rounded-lg shadow-sm"
                            />
                        ) : fileType === "text/plain" ? (
                            <pre className="bg-white p-6 overflow-auto h-[500px] w-full text-sm font-mono text-gray-800 leading-relaxed">
                                {textContent}
                            </pre>
                        ) : (
                            <div className="text-center p-12">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900">Preview not available</h3>
                                <p className="text-sm text-gray-500 mt-2">({fileType})</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3 w-full justify-end border-t border-gray-100 pt-5">
                    {canPrint && (
                        <button
                            onClick={handlePrint}
                            disabled={!blobUrl}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors shadow-sm hover:shadow"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2-4h6a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 002 2zm-7 14h10a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2z" />
                            </svg>
                            Print
                        </button>
                    )}

                    {canDownload && (
                        <button
                            onClick={handleDownload}
                            disabled={!blobUrl}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm hover:shadow"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default FilePreviewModal;

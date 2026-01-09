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
        if (isOpen && fileUrl) {
            setLoading(true);
            setError(null);
            setBlobUrl(null);
            setTextContent(null);

            // Construct full URL if needed, but api.get handles baseURL
            // If fileUrl is just the ID-based endpoint path: /print-requests/:id/preview
            api.get(fileUrl, { responseType: "blob" })
                .then((response) => {
                    const blob = new Blob([response.data], { type: fileType });
                    const url = URL.createObjectURL(blob);
                    setBlobUrl(url);

                    // If text, read it
                    if (fileType === "text/plain") {
                        const reader = new FileReader();
                        reader.onload = () => setTextContent(reader.result);
                        reader.readAsText(blob);
                    }
                })
                .catch((err) => {
                    console.error("Error loading preview:", err);
                    setError("Failed to load file preview. You may not have permission.");
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        // Cleanup
        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [isOpen, fileUrl]); // Removed fileType dependency to avoid re-fetch if type changes slightly, though it shouldn't.

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
                    <div className="flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                        <span className="ml-2">Loading preview...</span>
                    </div>
                )}

                {error && (
                    <div className="text-red-500">
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && blobUrl && (
                    <div className="w-full h-full flex-1 overflow-auto relative group">
                        {/* Watermark */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 select-none z-10 overflow-hidden">
                            <div className="transform -rotate-45 text-4xl font-bold text-gray-500 whitespace-nowrap">
                                PREVIEW ONLY • PREVIEW ONLY • PREVIEW ONLY
                            </div>
                        </div>

                        {fileType === "application/pdf" ? (
                            <iframe
                                src={blobUrl}
                                className="w-full h-[600px] border rounded"
                                title="PDF Preview"
                            />
                        ) : fileType.startsWith("image/") ? (
                            <img
                                src={blobUrl}
                                alt="Preview"
                                className="max-w-full h-auto rounded shadow-md"
                            />
                        ) : fileType === "text/plain" ? (
                            <pre className="bg-gray-100 p-4 rounded overflow-auto h-[500px] w-full text-sm">
                                {textContent}
                            </pre>
                        ) : (
                            <div className="text-center p-8 bg-gray-50 rounded">
                                <p>Preview not available for this file type.</p>
                                <p className="text-sm text-gray-500 mt-2">({fileType})</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex gap-4 w-full justify-end border-t pt-4">
                    {canPrint && (
                        <button
                            onClick={handlePrint}
                            disabled={!blobUrl}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2-4h6a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 002 2zm-7 14h10a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2z" />
                            </svg>
                            Print
                        </button>
                    )}

                    {canDownload && (
                        <button
                            onClick={handleDownload}
                            disabled={!blobUrl}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default FilePreviewModal;

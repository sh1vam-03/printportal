import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import api from "../../services/api";
import { useContext, useState } from "react";
import { ToastContext } from "../../context/ToastContext";
import { AuthContext } from "../../context/AuthContext";

const CreatePrintRequest = ({ onSuccess }) => {
    const { showToast } = useContext(ToastContext);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [deliveryType, setDeliveryType] = useState("PICKUP");
    const [fileName, setFileName] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                showToast("File size exceeds the 10MB limit. Please upload a smaller file", "error");
                e.target.value = ""; // Clear input
                setFileName(null);
                return;
            }
            setFileName(file.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.target);

            if (!user?.userId) {
                showToast("User ID missing. Re-login required.", "error");
                setLoading(false);
                return;
            }

            // Check file size again before submission just in case
            const file = formData.get("file");
            if (file && file.size > 10 * 1024 * 1024) {
                showToast("File size exceeds the 10MB limit.", "error");
                setLoading(false);
                return;
            }

            // formData.append("employeeId", user.userId); // Backend now takes from token

            await api.post("/print-requests", formData);
            showToast("Print request submitted successfully!", "success");
            e.target.reset();
            setDeliveryType("PICKUP");
            setFileName(null);

            if (onSuccess) onSuccess(); // Close modal
        } catch (err) {
            console.error("Submit error:", err);
            const msg = err.response?.data?.message || "Failed to submit request";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">


            {/* File Upload Section */}
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Upload Document</label>
                <div className="relative flex w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:border-brand-500 hover:bg-gray-100">
                    <input
                        type="file"
                        name="file"
                        required
                        accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.txt,.md"
                        onChange={handleFileChange}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
                            <svg className="h-10 w-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </div>

                        <p className="mt-4 text-xl font-bold text-gray-800">
                            {fileName ? (
                                <span className="text-brand-600">{fileName}</span>
                            ) : (
                                "Drag & Drop File Here"
                            )}
                        </p>

                        <p className="mt-2 text-sm text-gray-600">
                            Drag and drop your PNG, PDF, DOC, DOCX, JPG here or browse
                        </p>
                        <p className="mt-1 text-xs font-medium text-red-600">
                            Maximum allowed size 10MB
                        </p>

                        {!fileName && (
                            <p className="mt-4 text-md font-bold text-brand-600 hover:text-brand-500 underline">
                                Browse File
                            </p>
                        )}
                    </div>
                </div>
            </div>



            <div className="h-px bg-gray-100 w-full"></div>

            {/* Document Details */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="h-6 w-1 bg-brand-500 rounded-full"></span>
                    Details & Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Document Title</label>
                        <input
                            name="title"
                            type="text"
                            placeholder="e.g. Final Semester Exam"
                            required
                            maxLength={100}
                            className="w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Number of Copies</label>
                        <input
                            name="copies"
                            type="number"
                            min="1"
                            defaultValue="1"
                            required
                            className="w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Print Type</label>
                        <div className="relative">
                            <select
                                name="printType"
                                className="w-full appearance-none rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                            >
                                <option value="SINGLE_SIDE">Single Sided</option>
                                <option value="DOUBLE_SIDE">Double Sided</option>
                            </select>
                            <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Required By</label>
                        <input
                            name="dueDateTime"
                            type="datetime-local"
                            required
                            className="w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="h-px bg-gray-100 w-full"></div>

            {/* Delivery Section */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="h-6 w-1 bg-brand-500 rounded-full"></span>
                    Delivery Preferences
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Delivery Method</label>
                        <div className="relative">
                            <select
                                name="deliveryType"
                                value={deliveryType}
                                onChange={(e) => setDeliveryType(e.target.value)}
                                className="w-full appearance-none rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                            >
                                <option value="PICKUP">Pickup at Printing Dept</option>
                                <option value="ROOM_DELIVERY">Deliver to Room</option>
                            </select>
                            <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {deliveryType === "ROOM_DELIVERY" && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-sm font-semibold text-gray-700">Room Number</label>
                            <input
                                name="deliveryRoom"
                                placeholder="e.g. 104-B"
                                required
                                className="w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-6">
                <Button
                    className="w-full py-4 text-base font-bold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    disabled={loading}
                    size="lg"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending Request...
                        </span>
                    ) : (
                        "Submit Print Request"
                    )}
                </Button>
            </div>
        </form>

    );
};

export default CreatePrintRequest;

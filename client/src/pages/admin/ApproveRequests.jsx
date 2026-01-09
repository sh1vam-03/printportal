import { useState, useEffect } from "react";
import RequestTable from "../../components/RequestTable";
import Card from "../../components/ui/Card";
import api from "../../services/api";

const ApproveRequests = () => {
    const [view, setView] = useState("ALL");
    const [hasPending, setHasPending] = useState(false);

    const checkPendingRequests = async () => {
        try {
            const res = await api.get("/print-requests?role=ADMIN");
            const data = res.data.data || [];
            const pending = data.some(req => req.status === "PENDING");
            setHasPending(pending);
        } catch (err) {
            console.error("Failed to check pending requests", err);
        }
    };

    useEffect(() => {
        checkPendingRequests();
        // Optional: Polling or socket listener could go here
        const interval = setInterval(checkPendingRequests, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    // Also re-check when switching views or performing actions (passed effectively via key/remount in this simple implementaiton)
    // For better sync, RequestTable could accept a callback 'onDataChange' to trigger this check.

    return (
        <div className="space-y-6">
            <div className="flex flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">Printing Management</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">Review and approve print requests</p>
                </div>

                <div className="flex p-1 bg-gray-100 rounded-xl shrink-0 h-fit">
                    <button
                        onClick={() => setView("PENDING")}
                        className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${view === "PENDING" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <div className="relative">
                            Pending
                            {hasPending && (
                                <span className="absolute -top-1 -right-2 flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                </span>
                            )}
                        </div>
                    </button>
                    <button
                        onClick={() => setView("ALL")}
                        className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${view === "ALL" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        All History
                    </button>
                </div>
            </div>

            <RequestTable
                role="ADMIN"
                fetchQueryRole=""
                filterFn={view === "PENDING"
                    ? (req) => req.status === "PENDING"
                    : (req) => req.status !== "PENDING"
                }
                hideStatus={view === "PENDING"}
                key={view}
            />
        </div>
    );
};

export default ApproveRequests;

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
        <Card
            title={view === "ALL" ? "Overall Print Job Monitor" : "Pending Approvals"}
            action={
                <div className="flex h-10 w-10 items-center justify-center">
                    {view === "PENDING" ? (
                        <button
                            onClick={() => setView("ALL")}
                            className="group rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            title="Back to All Jobs"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            onClick={() => setView("PENDING")}
                            className={`group relative rounded-full p-2 transition-all hover:bg-gray-100 ${hasPending ? "text-indigo-600" : "text-gray-400"}`}
                            title="View Pending Approvals"
                        >
                            <svg className={`h-6 w-6 ${hasPending ? "animate-pulse" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {hasPending && (
                                <span className="absolute right-2 top-2 flex h-3 w-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span>
                                </span>
                            )}
                        </button>
                    )}
                </div>
            }
        >
            <RequestTable
                role="ADMIN"
                fetchQueryRole=""
                filterFn={view === "PENDING" ? (req) => req.status === "PENDING" : undefined}
                hideActions={view === "ALL"}
                hideStatus={view === "PENDING"}
                key={view}
            />
        </Card>
    );
};

export default ApproveRequests;

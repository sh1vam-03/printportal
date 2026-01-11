import { useState } from "react";
import RequestTable from "../../components/RequestTable";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import CreatePrintRequest from "./CreatePrintRequest";

const MyRequests = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <>
            <Card
                title={
                    <div className="flex w-full items-center justify-between gap-3">
                        <span>Monitor Job Status</span>
                        <button
                            onClick={handleRefresh}
                            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                            title="Refresh Status"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                }
                action={
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Print Request
                    </Button>
                }
            >
                <RequestTable role="EMPLOYEE" key={refreshKey} />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Start a New Print Job"
            >
                <CreatePrintRequest
                    onSuccess={() => {
                        setIsModalOpen(false);
                        handleRefresh();
                    }}
                />
            </Modal>
        </>
    );
};

export default MyRequests;

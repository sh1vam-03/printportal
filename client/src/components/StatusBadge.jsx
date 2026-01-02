const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-blue-100 text-blue-800",
    REJECTED: "bg-red-100 text-red-800",
    IN_PROGRESS: "bg-indigo-100 text-indigo-800",
    COMPLETED: "bg-green-100 text-green-800",
};

const StatusBadge = ({ status }) => {
    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status] || "bg-gray-100 text-gray-700"
                }`}
        >
            {status}
        </span>
    );
};

export default StatusBadge;

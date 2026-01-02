import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import { AuthContext } from "../../context/AuthContext";

const DashboardAnalytics = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            console.log("Fetching stats for user role:", user?.role);
            const res = await api.get("/dashboard/stats");
            console.log("Stats response:", res.data);
            setStats(res.data.data);
        } catch (err) {
            console.error("Failed to fetch dashboard stats", err);
            console.error("Error response:", err.response);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex h-64 items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
    );

    if (!stats) return <div className="p-8 text-center text-red-500">Failed to load data.</div>;

    // Data for charts
    const chartData = [
        {
            label: "Pending",
            value: stats.pending,
            statusColor: "text-yellow-600",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            label: "Approved",
            value: stats.approved,
            statusColor: "text-blue-600",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            label: "In Progress",
            value: stats.inProgress,
            statusColor: "text-indigo-600",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            )
        },
        {
            label: "Completed",
            value: stats.completed,
            statusColor: "text-green-600",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            )
        },
        {
            label: "Rejected",
            value: stats.rejected,
            statusColor: "text-red-600",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            )
        },
    ];

    // Remove irrelevant stats based on role for cleaner view if needed
    // Printing dept might not care about Rejected/Pending (but we show them for completeness if they exist)
    const filteredChartData = user?.role === "PRINTING"
        ? chartData.filter(d => ["Approved", "In Progress", "Completed"].includes(d.label))
        : chartData;

    const maxValue = Math.max(...filteredChartData.map(d => d.value), 5); // Minimum scale of 5 to avoid flat charts

    // Generate Y-axis hints (0, 25%, 50%, 75%, 100%)
    const yAxisTicks = [0, 0.25, 0.5, 0.75, 1].map(p => Math.round(maxValue * p));
    // Remove duplicates
    const uniqueTicks = [...new Set(yAxisTicks)];

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Hello, {user?.name || "User"}!
                    </h1>
                    <p className="mt-1 text-gray-500">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            {/* KPI Cards */}
            <Card title="Overview">
                {/* Mobile: Horizontal Scroll (Flex), Tablet+: Grid */}
                <div className={`flex overflow-x-auto pb-4 gap-8 md:grid md:gap-8 md:pb-4 ${filteredChartData.length <= 3 ? "lg:grid-cols-3" : "lg:grid-cols-5"}`}>
                    {filteredChartData.map((item) => (
                        <div key={item.label} className="flex-shrink-0 w-1/3 min-w-[120px] flex flex-col items-center justify-center border-r border-gray-100 last:border-0 md:w-auto md:border-r md:border-gray-200">
                            <span className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">{item.label}</span>
                            <span className={`text-3xl font-extrabold ${item.statusColor}`}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Chart Section */}
            <Card title="Requests Breakdown" className="overflow-hidden">
                {filteredChartData.every(item => item.value === 0) ? (
                    <div className="flex h-80 flex-col items-center justify-center text-gray-400">
                        <svg className="h-16 w-16 opacity-30 mb-4 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-500">No data available yet</p>
                        <p className="text-sm text-gray-400">Print requests will appear here once created.</p>
                    </div>
                ) : (
                    <div className="w-full">
                        {/* Removed min-w and scrollbox to force fit */}
                        <div className="relative mt-8 h-80 px-2 sm:px-4">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between px-2 sm:px-4 pb-8 pointer-events-none">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-full border-b border-dashed border-gray-100 h-px"></div>
                                ))}
                            </div>

                            {/* Bars Container */}
                            <div className="flex h-full items-end justify-around gap-1 sm:gap-6 pb-2 pl-6">
                                {filteredChartData.map((item) => {
                                    const height = (item.value / maxValue) * 100;
                                    return (
                                        <div key={item.label} className="group relative flex h-full w-full flex-col justify-end">
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white shadow-xl opacity-0 transition-opacity group-hover:block group-hover:opacity-100 z-10 whitespace-nowrap">
                                                {item.label}: <span className="text-indigo-300">{item.value}</span>
                                                {/* Arrow */}
                                                <div className="absolute top-full left-1/2 -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900"></div>
                                            </div>

                                            {/* Bar Wrapper */}
                                            <div className="relative flex h-full w-full flex-col justify-end items-center">
                                                {/* Bar */}
                                                <div
                                                    className="w-full max-w-[40px] md:max-w-[60px] rounded-t-lg bg-gradient-to-t from-indigo-500 to-indigo-400 opacity-90 transition-all duration-500 hover:opacity-100 hover:scale-y-105 origin-bottom shadow-sm group-hover:shadow-indigo-200"
                                                    style={{ height: `${height}%` }}
                                                ></div>
                                            </div>

                                            {/* X-Axis Label */}
                                            <p className="mt-4 text-center text-[10px] sm:text-xs font-medium text-gray-500 truncate w-full">{item.label}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Y-Axis Labels */}
                            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] sm:text-xs text-gray-400 font-medium px-1">
                                <span>{maxValue}</span>
                                <span>{Math.round(maxValue * 0.75)}</span>
                                <span>{Math.round(maxValue * 0.5)}</span>
                                <span>{Math.round(maxValue * 0.25)}</span>
                                <span>0</span>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default DashboardAnalytics;

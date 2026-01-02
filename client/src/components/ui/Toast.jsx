import { useEffect } from "react";

const styles = {
    success: {
        bg: "bg-white",
        border: "border-green-500",
        title: "text-gray-900",
        msg: "text-gray-600",
        iconTv: "text-green-600",
        iconBg: "bg-green-50",
        shadow: "shadow-green-100",
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    info: {
        bg: "bg-white",
        border: "border-blue-500",
        title: "text-gray-900",
        msg: "text-gray-600",
        iconTv: "text-blue-600",
        iconBg: "bg-blue-50",
        shadow: "shadow-blue-100",
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    warning: {
        bg: "bg-white",
        border: "border-orange-500",
        title: "text-gray-900",
        msg: "text-gray-600",
        iconTv: "text-orange-600",
        iconBg: "bg-orange-50",
        shadow: "shadow-orange-100",
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    },
    error: {
        bg: "bg-white",
        border: "border-red-500",
        title: "text-gray-900",
        msg: "text-gray-600",
        iconTv: "text-red-600",
        iconBg: "bg-red-50",
        shadow: "shadow-red-100",
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
};

const Toast = ({ message, type = "info", onClose }) => {
    const s = styles[type];

    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`pointer-events-auto w-96 max-w-[90vw] overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 shadow-lg ${s.shadow} animate-in slide-in-from-top-full duration-300`}>
            <div className={`p-4 border-b-4 ${s.border}`}>
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.iconBg} ${s.iconTv}`}>
                            {s.icon}
                        </div>
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className={`text-sm font-medium ${s.title}`}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </p>
                        <p className={`mt-1 text-sm ${s.msg}`}>
                            {message}
                        </p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                        <button
                            type="button"
                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={onClose}
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Toast;

const Input = ({ label, className = "", ...props }) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                {...props}
                className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${className}`}
            />
        </div>
    );
};

export default Input;

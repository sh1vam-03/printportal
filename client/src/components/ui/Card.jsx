const Card = ({ title, children, action, className = "" }) => {
    return (
        <div className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>
            {(title || action) && (
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
                    {title && (
                        <h2 className="text-lg font-bold text-gray-800">
                            {title}
                        </h2>
                    )}
                    {action && (
                        <div>
                            {action}
                        </div>
                    )}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;

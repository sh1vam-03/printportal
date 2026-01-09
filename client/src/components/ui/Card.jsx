const Card = ({ title, children, action, className = "" }) => {
    return (
        <div className={`overflow-hidden rounded-xl border border-gray-100 bg-white shadow-soft transition-all duration-300 hover:shadow-md ${className}`}>
            {(title || action) && (
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-50 bg-gray-50/50 px-6 py-4">
                    {title && (
                        <h2 className="text-lg font-bold text-gray-800 tracking-tight">
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
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default Card;

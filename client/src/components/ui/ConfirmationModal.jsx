import Modal from "./Modal";
import Button from "./Button";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", variant = "danger" }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            hideHeader={true}
            maxWidth="max-w-sm"
            padding="p-0"
        >
            <div className="p-6">
                <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-brand-100 text-brand-600'}`}>
                        {variant === 'danger' ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{message}</p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
                <Button variant="secondary" onClick={onClose}>
                    {cancelText}
                </Button>
                <Button variant={variant} onClick={() => { onConfirm(); onClose(); }}>
                    {confirmText}
                </Button>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;

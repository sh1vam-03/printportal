import Modal from './Modal';
import Button from './Button';

const AlertModal = ({ isOpen, onClose, title, message }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            hideHeader={true}
            maxWidth="max-w-md"
        >
            <div className="flex flex-col items-center text-center p-4">
                <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
                    <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h3 className="text-lg font-bold leading-6 text-gray-900 mb-2">
                    {title}
                </h3>

                <p className="text-sm text-gray-500 mb-6">
                    {message}
                </p>

                <Button
                    onClick={onClose}
                    className="min-w-[120px] shadow-lg shadow-brand-500/20"
                >
                    Got it
                </Button>
            </div>
        </Modal>
    );
};

export default AlertModal;

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Button from './Button';

const AlertModal = ({ isOpen, onClose, title, message }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100">
                                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-amber-100 rounded-full mb-4">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>

                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-bold leading-6 text-gray-900 text-center"
                                >
                                    {title}
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 text-center">
                                        {message}
                                    </p>
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <Button
                                        onClick={onClose}
                                        className="min-w-[120px] shadow-lg shadow-brand-500/20"
                                    >
                                        Got it
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AlertModal;

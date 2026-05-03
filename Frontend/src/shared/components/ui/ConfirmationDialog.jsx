import React from 'react'

const ConfirmationDialog = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-3 md:p-4">
            <div className="bg-[#0a0a0a] rounded-xl border border-white/5 max-w-sm w-full p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-linear-to-br from-[#1DB954] to-[#1ed760] flex items-center justify-center shrink-0">
                        <svg
                            className="w-5 h-5 md:w-6 md:h-6 text-black"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M12 9v2m0 4v2m0-10.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                            />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base md:text-lg font-bold text-white">
                            Cancel upload?
                        </h3>
                        <p className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2 leading-relaxed">
                            All unsaved changes will be discarded. You'll need
                            to start from the beginning.
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 md:gap-3 pt-2 md:pt-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-bold text-white border border-white/20 hover:border-white/40 hover:bg-white/5"
                    >
                        Continue
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-bold bg-linear-to-r from-[#ff6b6b] to-[#ff5252] text-white hover:from-[#ff8080] hover:to-[#ff6b6b] shadow-lg"
                    >
                        Discard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog
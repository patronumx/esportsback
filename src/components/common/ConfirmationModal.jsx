import React, { useEffect } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDanger = false,
    isLoading = false
}) => {
    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen && !isLoading) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose, isLoading]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200 p-4">
            <div
                className="bg-[#1E1E1E] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full transform transition-all scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${isDanger ? 'bg-red-500/20' : 'bg-purple-500/20'}`}>
                        {isDanger ? <Trash2 className="w-6 h-6 text-red-500" /> : <AlertTriangle className="w-6 h-6 text-purple-400" />}
                    </div>

                    <h3 className="text-xl font-bold text-white">{title}</h3>

                    <p className="text-gray-400 text-sm leading-relaxed">
                        {message}
                    </p>

                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
                    >
                        <Trash2 className="w-4 h-4 hidden" /> {/* Dummy to keep import valid if needed, or just import X */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>

                    <div className="flex gap-3 w-full mt-4">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-3 hover:bg-white/5 rounded-xl text-gray-400 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 py-3 rounded-xl text-white font-bold transition-all shadow-lg flex items-center justify-center 
                                ${isDanger
                                    ? 'bg-red-600 hover:bg-red-500 hover:shadow-red-500/20'
                                    : 'bg-purple-600 hover:bg-purple-500 hover:shadow-purple-500/20'}
                                disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/50 border-t-white mr-2"></div>
                            ) : null}
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;

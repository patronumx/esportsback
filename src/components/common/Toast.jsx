import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const isSuccess = type === 'success';

    return (
        <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right duration-300 fade-in">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl min-w-[300px] ${isSuccess
                    ? 'bg-[#09090b]/90 border-green-500/20 text-white shadow-green-500/10'
                    : 'bg-[#09090b]/90 border-red-500/20 text-white shadow-red-500/10'
                }`}>
                <div className={`p-2 rounded-full ${isSuccess ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {isSuccess ? <CheckCircle size={18} className="text-green-500" /> : <AlertCircle size={18} className="text-red-500" />}
                </div>

                <div className="flex-1">
                    <h4 className="text-sm font-semibold">{isSuccess ? 'Success' : 'Error'}</h4>
                    <p className="text-xs text-gray-400">{message}</p>
                </div>

                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Toast;

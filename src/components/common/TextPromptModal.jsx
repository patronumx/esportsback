import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';

const TextPromptModal = ({ isOpen, onClose, onSubmit, initialValue = '', title = 'Enter Text', placeholder = 'Type here...' }) => {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setValue(initialValue);
            // Focus after a tiny delay to ensure render
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    }, [isOpen, initialValue]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(value);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#18181b] border border-white/10 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4">
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all mb-4"
                        placeholder={placeholder}
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-2 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-900/20 flex items-center gap-2"
                        >
                            <Check size={14} />
                            CONFIRM
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TextPromptModal;

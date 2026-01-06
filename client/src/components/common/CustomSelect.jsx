import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ label, options, value, onChange, placeholder = "Select option", className = "", labelKey = "label", valueKey = "value", icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Create standardized options array
    const standardizedOptions = options.map(opt => {
        if (typeof opt === 'object') {
            return {
                value: opt[valueKey],
                label: opt[labelKey],
                original: opt
            };
        }
        return { value: opt, label: opt, original: opt };
    });

    const selectedOption = standardizedOptions.find(opt => opt.value === value);
    const displayLabel = selectedOption ? selectedOption.label : (value || placeholder); // Use value as fallback if no label found (rare but possible) but better to show placeholder if value is empty
    const showPlaceholder = !selectedOption && !value;

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{label}</label>}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-3 bg-black/20 rounded-xl border flex justify-between items-center text-left transition-all ${isOpen ? 'border-purple-500 ring-1 ring-purple-500/50' : 'border-white/10 hover:border-white/20'}`}
            >
                <div className="flex items-center min-w-0">
                    {Icon && <Icon className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />}
                    <span className={`text-sm ${!showPlaceholder ? 'text-white font-medium' : 'text-gray-500'} truncate`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {standardizedOptions.length === 0 ? (
                            <div className="p-3 text-center text-gray-500 text-sm">No options found</div>
                        ) : (
                            standardizedOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button" // important to prevent form submission
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full p-3 text-left text-sm rounded-lg transition-colors flex items-center justify-between ${value === option.value ? 'bg-purple-600/20 text-purple-400 font-bold' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {value === option.value && <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0 ml-2"></div>}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;

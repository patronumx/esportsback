import toast from 'react-hot-toast';

const toastStyle = {
    background: 'rgba(15, 23, 42, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    color: '#fff',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    fontSize: '14px',
    maxWidth: '400px',
};

export const showToast = {
    error: (message) => {
        toast.error(message, {
            style: {
                ...toastStyle,
                borderLeft: '4px solid #ef4444', // Red border for error
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.15)',
            },
            iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
            },
        });
    },

    success: (message) => {
        toast.success(message, {
            style: {
                ...toastStyle,
                borderLeft: '4px solid #22c55e', // Green border for success
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.15)',
            },
            iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
            },
        });
    },

    info: (message) => {
        toast(message, {
            icon: 'ℹ️',
            style: {
                ...toastStyle,
                borderLeft: '4px solid #3b82f6', // Blue border for info
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)',
            },
        });
    },

    // Custom "Game Style" warning for illegal access
    warning: (message) => {
        toast(message, {
            icon: '⚠️',
            style: {
                ...toastStyle,
                borderLeft: '4px solid #f59e0b', // Amber/Yellow
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)',
                background: 'linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(69, 26, 3, 0.9))', // Subtle gradient
            },
        });
    }
};

export default showToast;

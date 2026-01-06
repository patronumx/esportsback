import { useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import api from '../../api/client';

const FileUploader = ({ onUploadSuccess, label = "Upload File", accept = "image/*" }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data } = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (data.success) {
                setPreview(data.url);
                onUploadSuccess(data.url);
            } else {
                setError('Upload failed');
            }
        } catch (err) {
            console.error(err);
            setError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const clearPreview = () => {
        setPreview('');
        onUploadSuccess('');
    };

    return (
        <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2">{label}</label>

            {preview ? (
                <div className="relative w-full h-48 bg-gray-700 rounded-lg overflow-hidden border border-gray-600">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    <button
                        type="button"
                        onClick={clearPreview}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-blue-500 transition-colors bg-gray-700/30">
                    <input
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                    />
                    <div className="text-center">
                        {uploading ? (
                            <div className="flex flex-col items-center text-blue-400">
                                <Loader className="w-8 h-8 animate-spin mb-2" />
                                <span className="text-sm">Uploading...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <Upload className="w-8 h-8 mb-2" />
                                <span className="text-sm">Click to upload or drag and drop</span>
                                <span className="text-xs text-gray-500 mt-1">Supports: JPG, PNG, GIF, MP4</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default FileUploader;

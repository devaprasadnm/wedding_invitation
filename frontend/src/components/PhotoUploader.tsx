import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Upload } from 'lucide-react';

interface PhotoUploaderProps {
    clientId: string;
    clientSlug: string;
    onUploadComplete: () => void;
}

export default function PhotoUploader({ clientId, clientSlug, onUploadComplete }: PhotoUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadCount, setUploadCount] = useState(0);
    const [totalFiles, setTotalFiles] = useState(0);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const files = Array.from(e.target.files);
        setTotalFiles(files.length);
        setUploadCount(0);
        setUploading(true);

        try {
            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                const filePath = `${clientSlug}/${fileName}`;

                // 1. Upload to Storage
                const { error: uploadError } = await supabase.storage
                    .from('client-photos')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // 2. Save metadata to DB
                const { error: dbError } = await supabase.from('photos').insert({
                    client_id: clientId,
                    storage_path: filePath,
                    filename: file.name,
                    width: 0,
                    height: 0
                });

                if (dbError) throw dbError;

                setUploadCount(prev => prev + 1);
            }

            onUploadComplete();
        } catch (error: any) {
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
            setUploadCount(0);
            setTotalFiles(0);
        }
    };

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer relative">
            <input
                type="file"
                multiple={true}
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                disabled={uploading}
            />
            <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
                {uploading ? (
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                        <span>Uploading {uploadCount}/{totalFiles}...</span>
                    </div>
                ) : (
                    <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-medium">Click or Drag to Upload Photos</span>
                        <span className="text-xs text-gray-400">Multiple files supported</span>
                    </>
                )}
            </div>
        </div>
    );
}

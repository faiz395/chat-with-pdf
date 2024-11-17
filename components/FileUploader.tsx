"use client"
import React, { useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import useUpload from '@/hooks/useUpload';
import { useRouter } from 'next/navigation';

//  add css later 
//  add icons also

function FileUploader() {
    const { progress, status, fileId, handleUpload } = useUpload();
    const router = useRouter();

    useEffect(() => {
        if (fileId) {
            router.push(`/dashboard/files/${fileId}`)
        }
    }, [fileId, router])
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        // Do something with the files
        console.log("acceptedFiles: ", acceptedFiles);
        const file = acceptedFiles[0];

        if (file) {
            console.log("uploading file!");
            
            await handleUpload(file);
        } else {
            //  do nothing
            //  toast notification based of pro/free, etc. or to upload file again
        }

    }, [])

    const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            "application/pdf": [".pdf"],
        }
    })

    return (
        <div {...getRootProps()} className='min-h-screen flex justify-center items-center bg-indigo-50'>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    )
}

export default FileUploader
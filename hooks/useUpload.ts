"use client";

import { generateEmbeddings } from "@/actions/generateEmbeddings";
import { db, storage } from "@/firebase";
import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
import { useUser } from "@clerk/nextjs";
import { error } from "console";
import { Storage } from "firebase-admin/storage";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ID } from "appwrite";
import serviceClient from "@/appwriteClient";

export enum statusText {
  UPLOADING = "Uploading file....",
  UPLOADED = "File uploaded successfully",
  SAVING = "Saving file to database....",
  GENERATING = "Generating AI embeddings...",
}

function useUpload() {
  const [progress, setProgress] = useState<number | null>();
  const [fileId, setFileId] = useState<string | null>();
  const [status, setStatus] = useState<string | null>();

  const { user } = useUser();
  const router = useRouter();

  const handleUpload = async (file: File) => {
    console.log("upload staterd");

    if (!file || !user) return;

    //  FREE or PRO limitation

    setStatus(statusText.UPLOADING);

    const res = await serviceClient.addNewPdfToBucket(file);
    console.log("response from useUpload hook: ", res);
    console.log("file uploaded successfu;;y!");
    if (!res) throw new Error("No resopnse after uploading file");
    const fileIdToUploadTo = res.$id;
    setStatus(statusText.UPLOADED);
    let downloadUrl = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID}/files/${fileIdToUploadTo}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
    console.log("fileUrl: ", downloadUrl);

    console.log("user: ", user);
    console.log("userid: ", user.id);
    setStatus(statusText.SAVING);
    setFileId(fileIdToUploadTo);

    const addFileToDbRes = await serviceClient.addNewDocumentToDb({
      documentId: fileIdToUploadTo,
      documentUrl: downloadUrl,
      userId: user.id,
    });
    console.log("addFileToDbRes: ", addFileToDbRes);

    setStatus(statusText.GENERATING);
    // const storageRef = ref(
    //   storage,
    //   `users/${user.id}/files/${fileIdToUploadTo}`
    // );

    // const uploadTask = uploadBytesResumable(storageRef, file);
    // uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {
    //     const percent = Math.round(
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //     );
    //     setStatus(statusText.UPLOADING);
    //     setProgress(percent);
    //   },
    //   (error) => {
    //     console.error("Error uploading file: ", error);
    //   },
    //   async () => {
    //     setStatus(statusText.UPLOADED);
    //     let downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
    //     setStatus(statusText.SAVING);
    //     downloadUrl =  'https://about.gitlab.com/images/press/git-cheat-sheet.pdf'
    //     await setDoc(doc(db, "users", user.id, "files", fileIdToUploadTo), {
    //       name: file.name,
    //       size: file.size,
    //       type: file.type,
    //       downloadUrl: downloadUrl,
    //       // ref: uploadTask.snapshot.ref.fullPath,
    //       createdAt: new Date(),
    //     });
    //     setStatus(statusText.GENERATING);

    //     // Generate AI embeddings
    //     setFileId(fileIdToUploadTo);
    //   }
    // );

    //  integrate the storage with APPWRITE Later
    // async () => {
    // setStatus(statusText.UPLOADED);
    // let downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
    // setStatus(statusText.SAVING);
    // let downloadUrl =  'https://about.gitlab.com/images/press/git-cheat-sheet.pdf'
    // await setDoc(doc(db, "users", user.id, "files", fileIdToUploadTo), {
    //   name: file.name,
    //   size: file.size,
    //   type: file.type,
    //   downloadUrl: downloadUrl,
    //   // ref: uploadTask.snapshot.ref.fullPath,
    //   createdAt: new Date(),
    // });
    // setStatus(statusText.GENERATING);

    // Generate AI embeddings
    await generateEmbeddings(fileIdToUploadTo);

    setFileId(fileIdToUploadTo);
    setProgress(100);
    // }
  };
  return { progress, status, fileId, handleUpload };
}

export default useUpload;

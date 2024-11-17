import serviceServer from '@/appwriteServer';
import Chat from '@/components/Chat';
import PdfView from '@/components/PdfView';
import { adminDb } from '@/firebaseAdmin';
import { auth } from '@clerk/nextjs/server';
import React from 'react'

async function ChatToFilePage({params:{id}}:{
    params:{
        id:string
    };
}) {
  const { userId } = await auth();

  let ref = await serviceServer.getDocumentsById(id)
  console.log("ref: ",ref?.documents[0].documentUrl);
  
  const url = ref?.documents[0].documentUrl;
  
  return (
    <>
    {/* <div>ChatToFilePage URL: {url}</div> */}
    <Chat id={id}/>
    <PdfView url={url}/>
    </>
  )
}

export default ChatToFilePage
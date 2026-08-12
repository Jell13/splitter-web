"use client"

import { PhotoConfirmScreen } from "@/app/components/PhotoConfirm";
import { useEffect, useRef, useState } from "react";

export default function AddExpensePhotoPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<any>();

  useEffect(() => {
    inputRef.current?.click();
  }, [])

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    }
  }, [imageUrl])

  const handleFileChanger = (e : React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file)
    if (!file) return

    const url = URL.createObjectURL(file);
    console.log(url)
    setImageUrl(url);
  }
  return (
    <>
      <input type="file" ref={inputRef} hidden accept="image/*" onChange={handleFileChanger}/>
      <PhotoConfirmScreen imageUrl={imageUrl}/>
    </>
  );
}

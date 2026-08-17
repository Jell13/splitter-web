"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconPhoto, IconRefresh, IconReceipt } from "@tabler/icons-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePhotoStore } from "@/app/stores/photo-upload";

// TODO: replace local blob preview with a real upload to Convex
// storage, and store the resulting URL in usePhotoStore instead of
// local previewUrl state.

export default function PhotoConfirmPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const generateUploadUrl = useMutation(api.split.generateUploadUrl);
  const saveReceiptImage = useMutation(api.split.saveReceiptImage);
  const parseReceipt = useAction(api.receipts.parseReceipt);

  const setImageUrl = usePhotoStore((state) => state.setImageUrl);
  const setDescription = usePhotoStore((state) => state.setDescription);
  const setSubtotal = usePhotoStore((state) => state.setSubtotal);
  const setTip = usePhotoStore((state) => state.setTip);
  const setTax = usePhotoStore((state) => state.setTax);
  const setItems = usePhotoStore((state) => state.setItems);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return; // they cancelled the picker, stay on this screen
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  function handlePickPhoto() {
    inputRef.current?.click();
  }

  function handleRetry() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    inputRef.current?.click();
  }

  const handleUsePhoto = async () => {

    if (!file){
      return
    }
    setIsScanning(true);
    // TODO: replace with your real useAction(api.receipts.extractReceiptItems) call
    try{
      const postUrl = await generateUploadUrl()

      const result = await fetch(postUrl, {
        method: "POST",
        headers: {"Content-type": file.type},
        body: file
      })
      const { storageId } = await result.json();

      const { url } = await saveReceiptImage({storageId: storageId});
      setImageUrl(url)

      const parsed = await parseReceipt({imageUrl: url})

      setDescription(parsed.description)
      setSubtotal(parsed.subtotal);
      setTax(parsed.tax);
      setTip(parsed.tip);

      const parsedItems = parsed.items.map((item : { name: string, price: number}) => {
        const newItem = {
          id: crypto.randomUUID(),
          name: item.name,
          price: Number(item.price),
          assignedUserIds: []
        }

        return newItem
      })
      setItems(parsed.items)

    } catch(error){
      console.log("Error:", error)
    } finally {
      router.push("/add-expenses/photo/review")
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />

      <div className="px-5 pt-2">
        <h1 className="text-[18px]">Photo</h1>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-6">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Selected receipt"
            className="aspect-[3/4] w-full rounded-card object-cover"
          />
        ) : (
          <button
            onClick={handlePickPhoto}
            className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-card border border-dashed border-border bg-card text-muted-foreground"
          >
            <IconPhoto size={32} stroke={1.5} />
            <span className="text-xs">Tap to choose a photo</span>
          </button>
        )}

        {previewUrl && (
          <button
            onClick={handleRetry}
            disabled={isScanning}
            className="mt-4 flex items-center justify-center gap-2 self-center text-sm font-medium text-primary disabled:opacity-40"
          >
            <IconRefresh size={15} stroke={1.75} />
            Choose a different photo
          </button>
        )}
      </div>

      <div className="px-5 pb-8 pt-4">
        <button
          onClick={handleUsePhoto}
          disabled={!previewUrl || isScanning}
          className="w-full rounded-control bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          Use this photo
        </button>
      </div>

      {isScanning && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/90 px-5">
          <span className="flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-primary-soft text-primary-dark">
            <IconReceipt size={26} stroke={1.75} />
          </span>
          <p className="text-sm font-medium text-foreground">
            Scanning your receipt...
          </p>
          <p className="text-xs text-muted-foreground">
            This usually takes a few seconds
          </p>
        </div>
      )}
    </div>
  );
}
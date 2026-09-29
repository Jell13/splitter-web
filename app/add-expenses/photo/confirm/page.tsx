"use client";

import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IconPhoto,
  IconCamera,
  IconRefresh,
  IconReceipt,
} from "@tabler/icons-react";
import { useAction, useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { api } from "@/convex/_generated/api";
import { usePhotoStore } from "@/app/stores/photo-upload";
import { getBrowserId } from "@/app/lib/browser-id";
import { toast } from "sonner";

function PhotoConfirmPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCameraMode = searchParams.get("source") === "camera";

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

  async function convertHeicToJpeg(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));

        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (!blob) return reject(new Error("Conversion failed"));
            resolve(new File([blob], "receipt.jpg", { type: "image/jpeg" }));
          },
          "image/jpeg",
          0.9,
        );
      };

      img.onerror = () =>
        reject(new Error("Could not load image for conversion"));
      img.src = url;
    });
  }

  function isHeic(file: File): boolean {
    return (
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif")
    );
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    let selected = e.target.files?.[0];
    if (!selected) return;

    if (isHeic(selected)) {
      try {
        selected = await convertHeicToJpeg(selected);
      } catch {
        toast.error("Couldn't process that photo — try a different one");
        return;
      }
    }

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
    if (!file) {
      return;
    }
    setIsScanning(true);

    try {
      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      const { url } = await saveReceiptImage({ storageId });
      setImageUrl(url);

      const parsed = await parseReceipt({
        imageUrl: url,
        browserId: getBrowserId(),
      });

      setDescription(parsed.description);
      setSubtotal(parsed.subtotal);
      setTax(parsed.tax);
      setTip(parsed.tip);

      const parsedItems = parsed.items.map(
        (item: { name: string; price: number }) => ({
          id: crypto.randomUUID(),
          name: item.name,
          price: Number(item.price),
          assignedUserIds: [],
        }),
      );
      setItems(parsedItems);

      router.push("/add-expenses/photo/review");
    } catch (error) {
      console.error("Error:", error);
      const message =
        error instanceof ConvexError && typeof error.data === "string"
          ? error.data
          : "Couldn't scan that receipt — try again";
      toast.error(message);
      setIsScanning(false);
    }
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={isCameraMode ? "environment" : undefined}
        hidden
        onChange={handleFileChange}
      />

      <div className="px-5 pt-2">
        <h1 className="text-2xl">{isCameraMode ? "Scan" : "Photo"}</h1>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-6">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Selected receipt"
            className="aspect-3/4 w-full rounded-card object-cover"
          />
        ) : (
          <button
            onClick={handlePickPhoto}
            className="flex aspect-3/4 w-full flex-col items-center justify-center gap-2 rounded-card border border-dashed border-border bg-card text-muted-foreground"
          >
            {isCameraMode ? (
              <IconCamera size={32} stroke={1.5} />
            ) : (
              <IconPhoto size={32} stroke={1.5} />
            )}
            <span className="text-xl font-semibold">
              {isCameraMode ? "Tap to take a photo" : "Tap to choose a photo"}
            </span>
          </button>
        )}

        {previewUrl && (
          <button
            onClick={handleRetry}
            disabled={isScanning}
            className="mt-4 flex items-center justify-center gap-2 self-center text-base font-medium text-primary disabled:opacity-40"
          >
            <IconRefresh size={17} stroke={1.75} />
            {isCameraMode ? "Retake" : "Choose a different photo"}
          </button>
        )}
      </div>

      <div className="shrink-0 px-5 pb-8 pt-4">
        <button
          onClick={handleUsePhoto}
          disabled={!previewUrl || isScanning}
          className="w-full rounded-control bg-primary py-3.5 text-base font-semibold text-primary-foreground disabled:opacity-60"
        >
          Use this photo
        </button>
      </div>

      {isScanning && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/90 px-5">
          <span className="flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-primary-soft text-primary-dark">
            <IconReceipt size={26} stroke={1.75} />
          </span>
          <p className="text-base font-medium text-foreground">
            Scanning your receipt...
          </p>
          <p className="text-sm text-muted-foreground">
            This usually takes a few seconds
          </p>
        </div>
      )}
    </div>
  );
}

export default function PhotoConfirmPage() {
  return (
    <Suspense fallback={null}>
      <PhotoConfirmPageInner />
    </Suspense>
  );
}
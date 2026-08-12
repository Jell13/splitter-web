import { IconPhoto, IconRefresh } from "@tabler/icons-react";
import { PhotoConfirmationProps } from "../lib/types";

export function PhotoConfirmScreen({ imageUrl }: PhotoConfirmationProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex items-center justify-between px-5 pt-4">
        <h1 className="text-[16px]">Photo</h1>
        <span className="text-xs text-muted-foreground">1 of 1</span>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-6">
        <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-card border border-dashed border-border bg-card text-muted-foreground">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt="Selected receipt"
                className="aspect-[3/4] w-full rounded-card object-cover"
              />
            </>
          ) : (
            <>
              <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-card border border-dashed border-border bg-card text-muted-foreground">
                <IconPhoto size={32} stroke={1.5} />
                <span className="text-xs">Receipt photo preview</span>
              </div>
            </>
          )}
        </div>

        <button className="mt-4 flex items-center justify-center gap-2 self-center text-sm font-medium text-primary">
          <IconRefresh size={15} stroke={1.75} />
          Choose a different photo
        </button>
      </div>

      <div className="px-5 pb-8 pt-4">
        <button className="w-full rounded-control bg-primary py-3.5 text-sm font-semibold text-primary-foreground">
          Use this photo
        </button>
      </div>
    </div>
  );
}

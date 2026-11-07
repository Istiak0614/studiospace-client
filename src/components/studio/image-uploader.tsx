"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { ImagePlus, Link2, Loader2, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { errorMessage } from "@/lib/api";
import { MAX_IMAGE_MB, uploadToImgbb } from "@/lib/imgbb";
import { cn } from "@/lib/utils";

interface UploadItem {
  id: string;
  preview: string;  
  url?: string;     
  status: "uploading" | "done";
}

interface ImageUploaderProps {
  initial?: string[];                         
  onChange: (urls: string[]) => void;         
  onBusyChange?: (busy: boolean) => void;     
  max?: number;
  invalid?: boolean;
}

const newId = () => Math.random().toString(36).slice(2);

export function ImageUploader({ initial = [], onChange, onBusyChange, max = 5, invalid }: ImageUploaderProps) {
  const [items, setItems] = useState<UploadItem[]>(() =>
    initial.map((url) => ({ id: newId(), preview: url, url, status: "done" as const }))
  );
  const [dragging, setDragging] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChange(items.filter((i) => i.status === "done").map((i) => i.url!));
    onBusyChange?.(items.some((i) => i.status === "uploading"));
  }, [items]);

  const addFiles = (fileList: FileList | File[]) => {
    const room = max - items.length;
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (room <= 0) {
      toast.error(`You can add up to ${max} photos`);
      return;
    }
    if (files.length > room) toast.info(`Only the first ${room} photo(s) were added (max ${max})`);

    files.slice(0, room).forEach((file) => {
      const id = newId();
      const preview = URL.createObjectURL(file);
      setItems((prev) => [...prev, { id, preview, status: "uploading" }]);

      uploadToImgbb(file)
        .then((url) =>
          setItems((prev) => prev.map((i) => (i.id === id ? { ...i, url, preview: url, status: "done" } : i)))
        )
        .catch((err) => {
          toast.error(errorMessage(err));
          setItems((prev) => prev.filter((i) => i.id !== id));
        })
        .finally(() => URL.revokeObjectURL(preview));
    });
  };

  const addLink = () => {
    const url = linkValue.trim();
    if (!/^https:\/\/\S+$/.test(url)) {
      toast.error("Please paste a valid https:// image link");
      return;
    }
    if (items.length >= max) {
      toast.error(`You can add up to ${max} photos`);
      return;
    }
    setItems((prev) => [...prev, { id: newId(), preview: url, url, status: "done" }]);
    setLinkValue("");
  };

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const makeCover = (id: string) =>
    setItems((prev) => {
      const item = prev.find((i) => i.id === id)!;
      return [item, ...prev.filter((i) => i.id !== id)];
    });

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      {items.length < max && (
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-300",
            dragging ? "scale-[1.01] border-primary bg-primary/10" : "border-border bg-background/40 hover:border-primary/60",
            invalid && !dragging && "border-destructive/60"
          )}
        >
          <span className="grid size-14 place-items-center rounded-2xl bg-linear-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-accent/30">
            <ImagePlus className="size-7" />
          </span>
          <span className="font-medium">{dragging ? "Drop to upload" : "Drag photos here or click to browse"}</span>
          <span className="text-xs text-muted-foreground">
            JPG, PNG or WebP · up to {MAX_IMAGE_MB} MB each · {items.length}/{max} added
          </span>
        </button>
      )}
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = ""; 
        }}
      />

      {items.length < max && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLink();
                }
              }}
              placeholder="...or paste an image URL (https://)"
              className="h-11 rounded-xl bg-background/50 pl-10"
            />
          </div>
          <Button type="button" variant="outline" onClick={addLink} className="h-11 rounded-xl px-5">
            Add
          </Button>
        </div>
      )}

      {items.length > 0 && (
        <motion.ul layout className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative aspect-square overflow-hidden rounded-xl border border-border"
              >
                <img src={item.preview} alt={`Studio photo ${i + 1}`} className="size-full object-cover" />

                {item.status === "uploading" && (
                  <div className="absolute inset-0 grid place-items-center bg-black/55 text-white">
                    <Loader2 className="size-6 animate-spin" />
                  </div>
                )}

                {i === 0 && item.status === "done" && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground">
                    Cover
                  </span>
                )}

                {item.status === "done" && (
                  <div className="absolute inset-x-1.5 bottom-1.5 flex justify-end gap-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    {i !== 0 && (
                      <button type="button" onClick={() => makeCover(item.id)} aria-label="Make cover photo"
                        className="grid size-7 place-items-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-primary hover:text-primary-foreground">
                        <Star className="size-3.5" />
                      </button>
                    )}
                    <button type="button" onClick={() => remove(item.id)} aria-label="Remove photo"
                      className="grid size-7 place-items-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-destructive">
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
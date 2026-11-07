const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;
export const MAX_IMAGE_MB = 5;

export async function uploadToImgbb(file: File): Promise<string> {
  if (!IMGBB_KEY) throw new Error("Image upload isn't configured (missing NEXT_PUBLIC_IMGBB_KEY)");
  if (!file.type.startsWith("image/")) throw new Error(`"${file.name}" isn't an image`);
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) throw new Error(`"${file.name}" is larger than ${MAX_IMAGE_MB} MB`);

  const body = new FormData();
  body.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body });
  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    throw new Error(data?.error?.message ?? "Upload failed. Please try again.");
  }
  return data.data.display_url as string;
}
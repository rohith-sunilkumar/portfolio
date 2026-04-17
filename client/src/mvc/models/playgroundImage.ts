/** True when `image` is usable as an <img src> (Cloudinary, absolute, or site-relative). */
export function isPlaygroundDirectImageUrl(image: string | undefined | null): boolean {
  const s = (image || '').trim();
  if (!s) return false;
  return /^https?:\/\//i.test(s) || (s.startsWith('/') && s.length > 1);
}

export function playgroundCardImageUrl(image: string | undefined, fallbackUrl: string): string {
  return isPlaygroundDirectImageUrl(image) ? image!.trim() : fallbackUrl;
}

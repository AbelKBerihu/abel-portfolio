export function isVideoMedia(url?: string | null): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url) || url.startsWith('data:video/');
}

export function isGifMedia(url?: string | null): boolean {
  if (!url) return false;
  return /\.gif(\?.*)?$/i.test(url) || url.startsWith('data:image/gif');
}

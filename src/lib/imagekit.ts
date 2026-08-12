// Server-only ImageKit config. Never import this from a client component —
// it reads IMAGEKIT_PRIVATE_KEY, which must stay off the browser bundle.

export function getImageKitServerConfig() {
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!urlEndpoint || !publicKey || !privateKey) {
    throw new Error(
      "Missing ImageKit env vars. Set IMAGEKIT_URL_ENDPOINT, IMAGEKIT_PUBLIC_KEY, and IMAGEKIT_PRIVATE_KEY in .env.local."
    );
  }

  return { urlEndpoint, publicKey, privateKey };
}

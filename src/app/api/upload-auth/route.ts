import { getUploadAuthParams } from "@imagekit/next/server";
import { getImageKitServerConfig } from "@/lib/imagekit";

export async function GET() {
  const { publicKey, privateKey } = getImageKitServerConfig();

  const { token, expire, signature } = getUploadAuthParams({
    privateKey,
    publicKey,
  });

  return Response.json({ token, expire, signature, publicKey });
}

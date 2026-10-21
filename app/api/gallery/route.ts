
import { NextResponse } from "next/server";

const ALBUM_URL =
  "https://www.icloud.com/sharedalbum/#D1dv3drp_gpY0bcEL8I-WuHuGKACAEQARogjQNriCU7anGH_GX3a5vbYebMlxxSzGx67AQJz0zXkXI";

type ICloudPhoto = {
  photoGuid: string;
  mediaAssetType?: string;
  derivatives?: Record<string, { checksum?: string }>;
};

async function postICloud(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await response.text();

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `iCloud returned non-JSON response (HTTP ${response.status})`
    );
  }

  if (!response.ok && response.status !== 330) {
    throw new Error(
      `iCloud request failed: HTTP ${response.status} - ${text.slice(0, 200)}`
    );
  }

  return { response, data };
}

function getPartition(token: string): string {
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  const chars = token.startsWith("A")
    ? token.slice(1, 2)
    : token.slice(1, 3);

  let value = 0;
  for (const char of chars) {
    const digit = alphabet.indexOf(char);
    if (digit < 0) throw new Error("Invalid iCloud album token");
    value = value * 62 + digit;
  }

  return String(value).padStart(2, "0");
}

export async function GET() {
  try {
    const token = ALBUM_URL.split("#")[1]?.split(";")[0];

    if (!token) {
      return NextResponse.json(
        { error: "Invalid album URL" },
        { status: 400 }
      );
    }

    let host = `p${getPartition(token)}-sharedstreams.icloud.com`;
    const payload = { streamCtag: null };

    let result = await postICloud(
      `https://${host}/${token}/sharedstreams/webstream`,
      payload
    );

    // Apple may return HTTP 330 with a different server hostname.
    if (result.response.status === 330) {
      const newHost = result.data["X-Apple-MMe-Host"];

      if (!newHost || !/^[a-zA-Z0-9.-]+$/.test(newHost)) {
        throw new Error("iCloud returned an invalid redirect host");
      }

      host = newHost;

      result = await postICloud(
        `https://${host}/${token}/sharedstreams/webstream`,
        payload
      );
    }

    const photos: ICloudPhoto[] = result.data.photos ?? [];

    if (!Array.isArray(photos)) {
      throw new Error("Unexpected iCloud album response");
    }

    const images = photos.filter(
      (photo) =>
        photo.mediaAssetType !== "video" &&
        photo.photoGuid &&
        photo.derivatives
    );

    if (images.length === 0) {
      return NextResponse.json({ photos: [] });
    }

    const assets = await postICloud(
      `https://${host}/${token}/sharedstreams/webasseturls`,
      { photoGuids: images.map((photo) => photo.photoGuid) }
    );

    const items = assets.data.items ?? {};

    const photoUrls = images
      .map((photo) => {
        const checksums = Object.values(photo.derivatives ?? {})
          .map((derivative) => derivative.checksum)
          .filter((checksum): checksum is string => Boolean(checksum));

        for (const checksum of checksums) {
          const item = items[checksum];

          if (item?.url_location && item?.url_path) {
            return `https://${item.url_location}${item.url_path}`;
          }
        }

        return null;
      })
      .filter((url): url is string => url !== null);

    return NextResponse.json(
      { photos: photoUrls },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("iCloud Fetch Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown iCloud error",
        photos: [],
      },
      { status: 500 }
    );
  }
}

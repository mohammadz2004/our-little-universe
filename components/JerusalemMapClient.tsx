
"use client";

import { useEffect, useState } from "react";
import JerusalemMap from "./JerusalemMap";

interface PlaceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  googleMapsUrl: string;
}

export default function JerusalemMapClient({
  places,
}: {
  places: PlaceItem[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="h-[450px] w-full rounded-3xl bg-slate-800 sm:h-[500px]" />
    );
  }

  return <JerusalemMap key="interactive-jerusalem-map" places={places} />;
}

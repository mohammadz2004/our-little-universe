
"use client";

import dynamic from "next/dynamic";

const JerusalemMapClient = dynamic(
  () => import("./JerusalemMapClient"),
  { ssr: false }
);

export default JerusalemMapClient;

"use client";

import { useState } from "react";
import CardRendering from "./CardRendering";

export default function Card() {
  const [isNextOne] = useState(true);

  return <CardRendering isNextOne={isNextOne} />;
}

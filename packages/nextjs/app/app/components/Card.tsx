"use client";

import { useState } from "react";
import CardRendering from "./CardRendering";

export default function Card() {

    const [isNextOne, setIsNextOne] = useState(true);

    const handleNextOne = () => {
        setIsNextOne(true);
    }
    
    return (
        
   <CardRendering isNextOne={isNextOne} />
        
    )
}
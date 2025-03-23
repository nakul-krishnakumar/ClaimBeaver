"use client"
import Image from "next/image";
import { useState } from "react";
import bg from "../../../public/bg.svg";

const GlassBackground = () => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    return (
        <div className="absolute inset-0 w-full h-full">
            <Image
                src={bg}
                alt="background"
                fill
                priority
                className="object-cover"
                onLoad={() => setIsImageLoaded(true)}
            />
            {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                    <p>Loading...</p>
                </div>
            )}
            {isImageLoaded && (
                <div className="absolute inset-0 from-white/70 to-transparent backdrop-blur-3xl">
                    <div className="absolute inset-0 overflow-hidden">
                        <div
                            className="w-full h-full"
                            style={{
                                backgroundSize: "40px 40px",
                                backgroundImage:
                                    "linear-gradient(to right, rgba(209, 213, 219, 0.20) 1px, transparent 1px), linear-gradient(to bottom, rgba(209, 213, 219, 0.20) 1px, transparent 1px)",
                            }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlassBackground;
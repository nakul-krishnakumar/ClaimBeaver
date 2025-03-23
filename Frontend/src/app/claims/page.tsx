"use client"
import ClaimComponent from "@/components/claims/claims";
import GlassBackground from "@/components/background/glass-background"

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-screen relative">
            <div className="absolute inset-0 z-0">
                <GlassBackground />
            </div>
            <div className="z-10">
                <ClaimComponent />
            </div>
        </div>
    );
}
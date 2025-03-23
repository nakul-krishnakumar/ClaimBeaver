import Image from "next/image";

const GlassBackground = () => {
  return (
    <div className="-z-50 inset-0 w-full h-full">
      <Image src="/glass_bg.svg" alt="background" fill className="object-cover" />
      <div className="absolute inset-0 from-white/70 to-transparent backdrop-blur-3xl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-full h-full" 
               style={{ 
                 backgroundSize: '40px 40px',
                 backgroundImage: 'linear-gradient(to right, rgba(209, 213, 219, 0.20) 1px, transparent 1px), linear-gradient(to bottom, rgba(209, 213, 219, 0.20) 1px, transparent 1px)'
               }}>
            </div>
        </div>
    </div>
    </div>
  );
};

export default GlassBackground;
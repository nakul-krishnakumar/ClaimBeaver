import SignUp from "@/components/authentication/signup";
import GlassBackground from "@/components/background/glass-background";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Background (Fixed for full-page scroll support) */}
      <div className="fixed inset-0 -z-10">
        <GlassBackground />
      </div>

      {/* Main Content */}
      <main className="relative min-h-screen flex flex-col items-center justify-center py-16 px-4 sm:px-6">
       
        {/* Signup Card */}
        <div className="relative z-10 w-full max-w-3xl">
          <SignUp />
        </div>
      </main>
    </div>
  );
}

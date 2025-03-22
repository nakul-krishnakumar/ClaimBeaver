import GlassBackground from "../../components/ui/glass-bg";
import LogoText from "../../components/ui/logo";

export default function Layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="h-full" suppressHydrationWarning>
            <div className="">
                <LogoText />
            </div>
            {children}
            <GlassBackground />
        </main>
    );
}
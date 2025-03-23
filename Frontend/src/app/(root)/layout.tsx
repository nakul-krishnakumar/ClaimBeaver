import GlassBackground from "../../components/ui/glass-bg";
import Header from "../../components/ui/Header";

export default function Layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="h-full" suppressHydrationWarning>
            <Header />
            {children}
            <GlassBackground />
        </main>
    );
}
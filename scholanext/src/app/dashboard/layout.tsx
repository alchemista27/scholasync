import { Sidebar } from '@/components/ui/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0f0a 0%, #0a1210 100%)" }}>
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        {/* Subtle grid overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.015]"
          style={{ backgroundImage: "linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}

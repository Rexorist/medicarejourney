
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background bg-opacity-90 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50/40 via-background/60 to-background">
      <Sidebar />
      <main className={cn(
        "flex-1 p-5 md:p-8 md:ml-72 transition-all duration-300", 
        className
      )}>
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

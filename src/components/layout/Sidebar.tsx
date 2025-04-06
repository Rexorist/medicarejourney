
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Activity, Search, Calendar, Users, PlusCircle, 
  Home, Pill, MessageSquare, Menu, X, 
  ChevronRight, Settings, LogOut
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem = ({ icon, label, href, active }: NavItemProps) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 rounded-xl pl-3 mb-1 font-medium transition-all",
                active 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {icon}
              <span>{label}</span>
              {active && <ChevronRight className="ml-auto h-4 w-4" />}
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="hidden md:flex">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { icon: <Home size={20} />, label: "Dashboard", href: "/" },
    { icon: <Activity size={20} />, label: "Health Concerns", href: "/health-concerns" },
    { icon: <Calendar size={20} />, label: "Medical History", href: "/medical-history" },
    { icon: <Search size={20} />, label: "Find Doctors", href: "/find-doctors" },
    { icon: <MessageSquare size={20} />, label: "Consultations", href: "/consultations" },
    { icon: <Users size={20} />, label: "Family Health", href: "/family-health" },
    { icon: <Pill size={20} />, label: "Medications", href: "/medications" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-sidebar backdrop-blur-sm shadow-xl transition-transform duration-300 md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          <div className="p-5 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-sidebar-primary shadow-md">
                <AvatarFallback className="text-white font-bold">MJ</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-medical-blue to-medical-purple bg-clip-text text-transparent">
                  Medicare Journey
                </h1>
                <p className="text-xs text-sidebar-foreground/70">Health Tracker 2025</p>
              </div>
            </Link>
          </div>
          
          <ScrollArea className="flex-1 px-4 py-6">
            <div className="space-y-1">
              {navigation.map((item) => (
                <NavItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  active={isActive(item.href)}
                />
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-sidebar-border">
              <Button 
                className="w-full gap-2 rounded-xl bg-gradient-to-r from-medical-blue to-medical-purple hover:from-medical-blue/90 hover:to-medical-purple/90 font-medium" 
                onClick={() => console.log("New record")}
              >
                <PlusCircle size={18} />
                <span>New Health Record</span>
              </Button>
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="ring-2 ring-sidebar-primary/20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@example.com</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                  <LogOut size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-xs md:hidden" 
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

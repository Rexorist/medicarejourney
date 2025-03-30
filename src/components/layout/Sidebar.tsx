
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity, Search, Calendar, Users, PlusCircle, Home, Pill, MessageSquare, Menu, X } from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem = ({ icon, label, href, active }: NavItemProps) => {
  return (
    <Link to={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 pl-2",
          active && "bg-primary/10 text-primary"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
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
        "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          <div className="p-4">
            <Link to="/" className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-medical-blue">
                <AvatarFallback className="text-white">MJ</AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-bold text-medical-blue">Medicare Journey</h1>
            </Link>
          </div>
          
          <ScrollArea className="flex-1 px-3 py-2">
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
            
            <div className="mt-6 pt-6 border-t">
              <Button className="w-full gap-2" onClick={() => console.log("New record")}>
                <PlusCircle size={18} />
                <span>New Health Record</span>
              </Button>
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 md:hidden" 
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

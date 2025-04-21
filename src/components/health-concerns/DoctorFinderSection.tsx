
import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pill, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  distance: number;
  availability: string;
  timings: string;
  availableSlots: string[];
  image: string;
  rating: number;
  insuranceAccepted: string[];
  phone: string;
}

interface DoctorFinderSectionProps {
  doctorsDatabase: Doctor[];
  specialtyFilter: string | null;
  setSpecialtyFilter: (v: string | null) => void;
  availabilityFilter: string | null;
  setAvailabilityFilter: (v: string | null) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  doctors: Doctor[];
  setDoctors: (docs: Doctor[]) => void;
  showDoctors: boolean;
  setShowDoctors: (v: boolean) => void;
  filteredDoctors: Doctor[];
  handleFindDoctors: (specialty?: string | null) => void;
}

export function DoctorFinderSection({
  doctorsDatabase,
  specialtyFilter,
  setSpecialtyFilter,
  availabilityFilter,
  setAvailabilityFilter,
  searchTerm,
  setSearchTerm,
  doctors,
  setDoctors,
  showDoctors,
  setShowDoctors,
  filteredDoctors,
  handleFindDoctors
}: DoctorFinderSectionProps) {

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const specialties = Array.from(new Set(doctorsDatabase.map(doc => doc.specialty)));

  const handleScheduleAppointment = (doctor: Doctor, slot: string) => {
    toast({
      title: "Appointment Scheduled",
      description: `Your appointment with ${doctor.name} at ${slot} has been scheduled. We'll send you a confirmation email shortly.`,
    });
  };

  if (!showDoctors) return null;

  return (
    <Card className="backdrop-blur-sm bg-background/80 shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-medical-blue" />
          Doctors Near You
        </CardTitle>
        <CardDescription>
          {filteredDoctors.length} healthcare providers found based on your criteria
        </CardDescription>
        <ScrollArea className="max-h-[120px] overflow-y-auto py-1">
          <div className="flex gap-2 flex-wrap items-center">
            <div className="flex gap-1 flex-wrap">
              {specialties.map((spec) => (
                <Badge
                  key={spec}
                  variant={spec === specialtyFilter ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSpecialtyFilter(spec === specialtyFilter ? null : spec)}
                >
                  {spec}
                </Badge>
              ))}
            </div>
            <div className="flex gap-1 flex-wrap">
              <Badge
                variant={availabilityFilter === "today" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setAvailabilityFilter(availabilityFilter === "today" ? null : "today")}
              >
                Today
              </Badge>
              <Badge
                variant={availabilityFilter === "tomorrow" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setAvailabilityFilter(availabilityFilter === "tomorrow" ? null : "tomorrow")}
              >
                Tomorrow
              </Badge>
            </div>
            <Input
              placeholder="Search doctors..."
              className="ml-auto max-w-[180px] h-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </ScrollArea>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {filteredDoctors.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              No doctors match your search or filter criteria.
            </div>
          )}
          {filteredDoctors.map(doctor => (
            <div
              key={doctor.id}
              className="flex items-center rounded-lg border border-border p-4 gap-4 hover:border-primary hover:bg-muted/40 transition-all"
            >
              <img src={doctor.image} alt={doctor.name} className="w-14 h-14 rounded-full object-cover" />
              <div className="flex-1">
                <div className="font-medium">
                  {doctor.name} 
                  <span className="ml-2 text-xs text-muted-foreground">{doctor.specialty}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline">{doctor.location}</Badge>
                  <Badge variant="outline">{doctor.availability}</Badge>
                  <Badge variant="outline">{doctor.timings}</Badge>
                  <Badge variant="outline">{doctor.distance} mi</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {doctor.insuranceAccepted.join(", ")}
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[110px]">
                {doctor.availableSlots.slice(0, 2).map(slot => (
                  <Button
                    key={slot}
                    size="sm"
                    variant="outline"
                    onClick={() => handleScheduleAppointment(doctor, slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
              <div>
                <Button size="icon" variant="outline" className="rounded-full" title="Call">
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Calendar, Star, Clock, Heart, Filter } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  address: string;
  distance: string;
  phone: string;
  rating: number;
  availableDate: string;
  timings?: string;
  availableSlots?: string[];
  insuranceAccepted?: string[];
}

export default function FindDoctors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState<string>("all");
  const [availability, setAvailability] = useState<string>("all");
  const [maxDistance, setMaxDistance] = useState<string>("all");
  const { toast } = useToast();
  
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "1",
      name: "Dr. Priya Sharma",
      specialty: "Cardiologist",
      address: "123 Wellness Center, Jubilee Hills, Hyderabad",
      distance: "1.2",
      phone: "+91 98765 43210",
      rating: 4.8,
      availableDate: "Tomorrow",
      timings: "9:00 AM - 5:00 PM",
      availableSlots: ["10:30 AM", "2:15 PM", "4:00 PM"],
      insuranceAccepted: ["Star Health", "HDFC ERGO", "Apollo Munich"]
    },
    {
      id: "2",
      name: "Dr. Raj Patel",
      specialty: "Family Medicine",
      address: "456 Health Blvd, Banjara Hills, Hyderabad",
      distance: "0.8",
      phone: "+91 87654 32109",
      rating: 4.6,
      availableDate: "Today",
      timings: "8:00 AM - 4:00 PM",
      availableSlots: ["9:15 AM", "11:00 AM", "3:30 PM"],
      insuranceAccepted: ["Bajaj Allianz", "ICICI Lombard", "Max Bupa"]
    },
    {
      id: "3",
      name: "Dr. Meera Reddy",
      specialty: "Neurologist",
      address: "789 Wellness Ave, Madhapur, Hyderabad",
      distance: "2.3",
      phone: "+91 76543 21098",
      rating: 4.9,
      availableDate: "May 20, 2025",
      timings: "10:00 AM - 6:00 PM",
      availableSlots: ["10:30 AM", "1:45 PM", "5:15 PM"],
      insuranceAccepted: ["Aditya Birla Health", "ICICI Lombard", "HDFC ERGO"]
    },
    {
      id: "4",
      name: "Dr. Arjun Malhotra",
      specialty: "Dermatologist",
      address: "234 Healthcare Pkwy, Kondapur, Hyderabad",
      distance: "3.1",
      phone: "+91 65432 10987",
      rating: 4.7,
      availableDate: "May 18, 2025",
      timings: "9:00 AM - 5:00 PM",
      availableSlots: ["11:30 AM", "2:00 PM", "4:00 PM"],
      insuranceAccepted: ["Star Health", "Bajaj Allianz", "Max Bupa"]
    },
    {
      id: "5",
      name: "Dr. Ananya Desai",
      specialty: "Pediatrician",
      address: "567 Children's Health Center, Gachibowli, Hyderabad",
      distance: "1.5",
      phone: "+91 54321 09876",
      rating: 4.9,
      availableDate: "Today",
      timings: "8:30 AM - 4:30 PM",
      availableSlots: ["9:00 AM", "11:30 AM", "2:00 PM", "3:45 PM"],
      insuranceAccepted: ["Star Health", "Aditya Birla Health", "Bajaj Allianz"]
    },
    {
      id: "6",
      name: "Dr. Rahul Verma",
      specialty: "Orthopedic Surgeon",
      address: "890 Bone & Joint Center, Begumpet, Hyderabad",
      distance: "2.7",
      phone: "+91 43210 98765",
      rating: 4.8,
      availableDate: "May 19, 2025",
      timings: "9:00 AM - 5:00 PM",
      availableSlots: ["10:15 AM", "1:30 PM", "3:45 PM"],
      insuranceAccepted: ["Max Bupa", "Star Health", "ICICI Lombard"]
    },
    {
      id: "7",
      name: "Dr. Kavita Iyer",
      specialty: "OB/GYN",
      address: "123 Women's Health Center, Ameerpet, Hyderabad",
      distance: "1.9",
      phone: "+91 32109 87654",
      rating: 4.8,
      availableDate: "Tomorrow",
      timings: "8:00 AM - 4:00 PM",
      availableSlots: ["8:30 AM", "10:45 AM", "2:15 PM"],
      insuranceAccepted: ["Aditya Birla Health", "Bajaj Allianz", "HDFC ERGO"]
    },
    {
      id: "8",
      name: "Dr. Vivek Agarwal",
      specialty: "Family Medicine",
      address: "456 Primary Care Center, Himayatnagar, Hyderabad",
      distance: "0.5",
      phone: "+91 21098 76543",
      rating: 4.7,
      availableDate: "Today",
      timings: "9:00 AM - 6:00 PM",
      availableSlots: ["9:30 AM", "11:45 AM", "4:30 PM"],
      insuranceAccepted: ["Max Bupa", "HDFC ERGO", "Star Health"]
    }
  ]);

  // Get unique specialties
  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));
  
  // Filter doctors based on search query, specialty, and availability
  const filteredDoctors = doctors.filter(doctor => {
    // Filter by search query
    const matchesSearch = searchQuery.trim() === "" || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by specialty
    const matchesSpecialty = specialty === "all" || doctor.specialty === specialty;
    
    // Filter by availability
    const matchesAvailability = availability === "all" || 
      (availability === "today" && doctor.availableDate === "Today") ||
      (availability === "tomorrow" && doctor.availableDate === "Tomorrow") ||
      (availability === "this-week" && ["Today", "Tomorrow", "May 18, 2025", "May 19, 2025", "May 20, 2025"].includes(doctor.availableDate));
    
    // Filter by distance
    const matchesDistance = maxDistance === "all" || 
      (maxDistance === "1" && parseFloat(doctor.distance) <= 1) ||
      (maxDistance === "3" && parseFloat(doctor.distance) <= 3) ||
      (maxDistance === "5" && parseFloat(doctor.distance) <= 5);
    
    return matchesSearch && matchesSpecialty && matchesAvailability && matchesDistance;
  });

  // Sort doctors by distance (closest first)
  const sortedDoctors = [...filteredDoctors].sort((a, b) => 
    parseFloat(a.distance) - parseFloat(b.distance)
  );

  const handleScheduleAppointment = (doctor: Doctor, slot: string) => {
    toast({
      title: "Appointment Scheduled",
      description: `Your appointment with ${doctor.name} at ${slot} has been scheduled. We'll send you a confirmation email shortly.`,
    });
  };
  
  const handleSaveDoctor = (doctorId: string) => {
    toast({
      title: "Doctor Saved",
      description: "This doctor has been added to your favorites list.",
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Find Doctors Near You</h1>
          <p className="text-muted-foreground">
            Discover and connect with healthcare providers in your area
          </p>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Search and Filter</CardTitle>
            <CardDescription>Find the right doctor for your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
                <Input
                  type="text"
                  placeholder="Search by doctor name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map((spec) => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={availability} onValueChange={setAvailability}>
                <SelectTrigger>
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={maxDistance} onValueChange={setMaxDistance}>
                <SelectTrigger>
                  <SelectValue placeholder="Distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Distance</SelectItem>
                  <SelectItem value="1">Within 1 mile</SelectItem>
                  <SelectItem value="3">Within 3 miles</SelectItem>
                  <SelectItem value="5">Within 5 miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4">
          <h2 className="text-lg font-medium mb-2">
            {sortedDoctors.length} {sortedDoctors.length === 1 ? 'Doctor' : 'Doctors'} Found
          </h2>
          
          {sortedDoctors.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-lg text-gray-500">No doctors found matching your search criteria</p>
                <Button className="mt-4" onClick={() => {
                  setSearchQuery("");
                  setSpecialty("all");
                  setAvailability("all");
                  setMaxDistance("all");
                }}>Clear Filters</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedDoctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{doctor.name}</CardTitle>
                        <p className="text-medical-blue font-medium">{doctor.specialty}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSaveDoctor(doctor.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                        <div>
                          <div>{doctor.address}</div>
                          <div className="text-sm text-gray-500">{doctor.distance} miles away</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-gray-500" />
                        <span>{doctor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <span>{doctor.timings}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <span className="text-green-600 font-medium">Next available: {doctor.availableDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-400" />
                        <span>{doctor.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Available Time Slots:</h4>
                      <div className="flex flex-wrap gap-2">
                        {doctor.availableSlots?.map((slot, index) => (
                          <Badge 
                            key={index}
                            variant="outline" 
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => handleScheduleAppointment(doctor, slot)}
                          >
                            {slot}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleScheduleAppointment(doctor, doctor.availableSlots?.[0] || "")}>
                      Schedule Appointment
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

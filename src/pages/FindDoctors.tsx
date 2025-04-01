
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Calendar, Star } from "lucide-react";
import { useState } from "react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  address: string;
  distance: string;
  phone: string;
  rating: number;
  availableDate: string;
}

export default function FindDoctors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "1",
      name: "Dr. Emily Wilson",
      specialty: "Cardiologist",
      address: "123 Medical Center Dr, City Name",
      distance: "1.2 miles",
      phone: "(555) 123-4567",
      rating: 4.8,
      availableDate: "Next available: Tomorrow"
    },
    {
      id: "2",
      name: "Dr. James Thompson",
      specialty: "Family Medicine",
      address: "456 Health Blvd, City Name",
      distance: "0.8 miles",
      phone: "(555) 987-6543",
      rating: 4.6,
      availableDate: "Next available: Today"
    },
    {
      id: "3",
      name: "Dr. Maria Gonzalez",
      specialty: "Neurologist",
      address: "789 Wellness Ave, City Name",
      distance: "2.3 miles",
      phone: "(555) 456-7890",
      rating: 4.9,
      availableDate: "Next available: May 5"
    },
    {
      id: "4",
      name: "Dr. Robert Chang",
      specialty: "Dermatologist",
      address: "234 Healthcare Pkwy, City Name",
      distance: "3.1 miles",
      phone: "(555) 234-5678",
      rating: 4.7,
      availableDate: "Next available: May 3"
    }
  ]);

  // Filter doctors based on search query
  const filteredDoctors = searchQuery.trim() === "" 
    ? doctors 
    : doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleScheduleAppointment = (doctorId: string) => {
    console.log(`Schedule appointment with doctor ${doctorId}`);
  };

  return (
    <AppLayout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Find Doctors Near You</h1>
        
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search by doctor name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96"
          />
        </div>
        
        {filteredDoctors.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-lg text-gray-500">No doctors found matching your search</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{doctor.name}</CardTitle>
                  <p className="text-medical-blue font-medium">{doctor.specialty}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                      <div>
                        <div>{doctor.address}</div>
                        <div className="text-sm text-gray-500">{doctor.distance}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <span>{doctor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <span className="text-green-600 font-medium">{doctor.availableDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-400" />
                      <span>{doctor.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => handleScheduleAppointment(doctor.id)}
                  >
                    Schedule Appointment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

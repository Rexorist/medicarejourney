
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MessageCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface Consultation {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: "video" | "in-person" | "chat";
}

export default function Consultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([
    {
      id: "1",
      doctor: "Dr. Aishwarya Singh",
      specialty: "Cardiology",
      date: "May 15, 2025",
      time: "10:30 AM",
      type: "video"
    },
    {
      id: "2",
      doctor: "Dr. Ravi Kumar",
      specialty: "Family Medicine",
      date: "May 22, 2025",
      time: "2:45 PM",
      type: "in-person"
    },
    {
      id: "3",
      doctor: "Dr. Neha Gupta",
      specialty: "Dermatology",
      date: "June 3, 2025",
      time: "11:15 AM",
      type: "chat"
    }
  ]);

  const handleJoinConsultation = (id: string) => {
    toast({
      title: "Joining consultation",
      description: "Connecting you to your healthcare provider..."
    });
  };

  const handleCancelConsultation = (id: string) => {
    setConsultations(consultations.filter(c => c.id !== id));
    toast({
      title: "Consultation cancelled",
      description: "Your appointment has been cancelled successfully."
    });
  };

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-5 w-5 text-blue-500" />;
      case "chat": return <MessageCircle className="h-5 w-5 text-green-500" />;
      default: return <Calendar className="h-5 w-5 text-orange-500" />;
    }
  };

  const getConsultationLabel = (type: string) => {
    switch (type) {
      case "video": return "Video Call";
      case "chat": return "Chat Consultation";
      default: return "In-Person Visit";
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Consultations</h1>
        
        {consultations.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-lg text-gray-500">You don't have any upcoming consultations</p>
              <Button className="mt-4">Schedule a Consultation</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consultations.map((consultation) => (
              <Card key={consultation.id} className="overflow-hidden">
                <CardHeader className="bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{consultation.doctor}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getConsultationIcon(consultation.type)}
                      <span className="text-sm font-medium">{getConsultationLabel(consultation.type)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{consultation.specialty}</p>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{consultation.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{consultation.time}</span>
                    </div>
                  </div>
                  <div className="flex justify-between gap-2">
                    <Button 
                      variant="default" 
                      className="w-full" 
                      onClick={() => handleJoinConsultation(consultation.id)}
                    >
                      {consultation.type === "chat" ? "Start Chat" : "Join"}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => handleCancelConsultation(consultation.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}


import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, AlertCircle, Pill, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  refillDate?: string;
  instructions?: string;
}

export default function Medications() {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      purpose: "Blood Pressure",
      refillDate: "May 30, 2024",
      instructions: "Take in the morning with food"
    },
    {
      id: "2",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      purpose: "Diabetes Management",
      refillDate: "June 15, 2024",
      instructions: "Take with meals"
    },
    {
      id: "3",
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      purpose: "Cholesterol",
      refillDate: "June 5, 2024",
      instructions: "Take at bedtime"
    }
  ]);

  const handleRequestRefill = (id: string) => {
    toast({
      title: "Refill Requested",
      description: "Your prescription refill request has been submitted."
    });
  };

  const handleAddMedication = () => {
    toast({
      title: "Feature coming soon",
      description: "The medication management feature is under development."
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Medications</h1>
          <Button onClick={handleAddMedication} className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Add Medication</span>
          </Button>
        </div>
        
        {medications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-lg text-gray-500">No medications added yet</p>
              <Button className="mt-4" onClick={handleAddMedication}>Add Your First Medication</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medications.map((medication) => (
              <Card key={medication.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-medical-blue" />
                    <CardTitle className="text-lg">{medication.name}</CardTitle>
                  </div>
                  <p className="text-sm text-gray-600">{medication.purpose}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Dosage:</span>
                      <span>{medication.dosage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Frequency:</span>
                      <span>{medication.frequency}</span>
                    </div>
                    {medication.instructions && (
                      <div className="flex justify-between">
                        <span className="font-medium">Instructions:</span>
                        <span className="text-right max-w-[60%]">{medication.instructions}</span>
                      </div>
                    )}
                  </div>
                  
                  {medication.refillDate && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-md mb-3">
                      <AlertCircle className="h-4 w-4" />
                      <span>Refill by: {medication.refillDate}</span>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleRequestRefill(medication.id)}
                  >
                    Request Refill
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

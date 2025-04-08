
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History } from "lucide-react";
import { VitalsSection } from "@/components/medical-history/VitalsSection";
import { RecordsSection, MedicalRecord } from "@/components/medical-history/RecordsSection";
import { TimelineSection } from "@/components/medical-history/TimelineSection";

export default function MedicalHistory() {
  // Initial data for blood pressure
  const initialBloodPressureData = [
    { date: "Dec", systolic: 120, diastolic: 80 },
    { date: "Jan", systolic: 124, diastolic: 82 },
    { date: "Feb", systolic: 119, diastolic: 79 },
    { date: "Mar", systolic: 122, diastolic: 81 },
    { date: "Apr", systolic: 118, diastolic: 78 },
    { date: "May", systolic: 121, diastolic: 80 },
  ];
  
  // Initial data for blood sugar
  const initialBloodSugarData = [
    { date: "Dec", level: 95 },
    { date: "Jan", level: 100 },
    { date: "Feb", level: 98 },
    { date: "Mar", level: 105 },
    { date: "Apr", level: 99 },
    { date: "May", level: 97 },
  ];

  // Initial medical records
  const initialMedicalRecords: MedicalRecord[] = [
    {
      id: "1",
      title: "Annual Physical Checkup",
      date: "Mar 15, 2025",
      provider: "Dr. Sanjay Kapoor",
      notes: "All results within normal range. Vitamin D slightly low, supplement recommended."
    },
    {
      id: "2",
      title: "Dental Cleaning",
      date: "Jan 10, 2025",
      provider: "Dr. Preeti Sharma",
      notes: "No cavities. Recommended flossing more regularly."
    },
    {
      id: "3",
      title: "Eye Examination",
      date: "Nov 22, 2024",
      provider: "Dr. Vijay Mehta",
      notes: "Slight astigmatism. New prescription provided for glasses."
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <History className="h-8 w-8 text-medical-blue" />
            Medical History
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your health metrics and medical records
          </p>
        </div>
        
        <Tabs defaultValue="vitals" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vitals">Vital Trends</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="calendar">Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vitals" className="space-y-6 mt-6">
            <VitalsSection 
              initialBloodPressureData={initialBloodPressureData}
              initialBloodSugarData={initialBloodSugarData}
            />
          </TabsContent>
          
          <TabsContent value="records" className="mt-6">
            <RecordsSection initialRecords={initialMedicalRecords} />
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-6">
            <TimelineSection />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Heart, History, LineChart, FileText, Plus, Download } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart as RechartLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AddReadingDialog } from "@/components/medical-history/AddReadingDialog";
import { RecordUploader } from "@/components/medical-history/RecordUploader";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  provider: string;
  notes: string;
  file?: File;
  fileName?: string;
  fileSize?: string;
}

export default function MedicalHistory() {
  const { toast } = useToast();
  const [showUploader, setShowUploader] = useState(false);
  const [bloodPressureData, setBloodPressureData] = useState([
    { date: "Dec", systolic: 120, diastolic: 80 },
    { date: "Jan", systolic: 124, diastolic: 82 },
    { date: "Feb", systolic: 119, diastolic: 79 },
    { date: "Mar", systolic: 122, diastolic: 81 },
    { date: "Apr", systolic: 118, diastolic: 78 },
    { date: "May", systolic: 121, diastolic: 80 },
  ]);
  
  const [bloodSugarData, setBloodSugarData] = useState([
    { date: "Dec", level: 95 },
    { date: "Jan", level: 100 },
    { date: "Feb", level: 98 },
    { date: "Mar", level: 105 },
    { date: "Apr", level: 99 },
    { date: "May", level: 97 },
  ]);

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([
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
  ]);

  const handleAddReading = (data: any) => {
    const { type, date, values } = data;
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    
    if (type === "blood-pressure") {
      setBloodPressureData(prev => [
        ...prev, 
        { 
          date: monthName, 
          systolic: Number(values.systolic), 
          diastolic: Number(values.diastolic) 
        }
      ]);
      
      toast({
        title: "Blood Pressure Reading Added",
        description: `Added ${values.systolic}/${values.diastolic} mmHg for ${monthName}`,
      });
    } 
    else if (type === "blood-sugar") {
      setBloodSugarData(prev => [
        ...prev, 
        { 
          date: monthName, 
          level: Number(values.level) 
        }
      ]);
      
      toast({
        title: "Blood Sugar Reading Added",
        description: `Added ${values.level} mg/dL for ${monthName}`,
      });
    }
  };

  const handleAddRecord = (record: MedicalRecord) => {
    setMedicalRecords(prev => [record, ...prev]);
    setShowUploader(false);
  };

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
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Blood Pressure History</CardTitle>
                  <CardDescription>6-month trend analysis</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartLineChart data={bloodPressureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="systolic" 
                        name="Systolic" 
                        stroke="#0070C9" 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="diastolic" 
                        name="Diastolic" 
                        stroke="#FF5757" 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                      />
                    </RechartLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Blood Sugar Levels</CardTitle>
                  <CardDescription>6-month trend analysis</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartLineChart data={bloodSugarData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="level" 
                        name="Blood Sugar" 
                        stroke="#4CAF50" 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                      />
                    </RechartLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-center">
              <AddReadingDialog onAddReading={handleAddReading} />
            </div>
          </TabsContent>
          
          <TabsContent value="records" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Medical Records</h2>
              <Button onClick={() => setShowUploader(!showUploader)}>
                <FileText className="h-4 w-4 mr-2" />
                {showUploader ? "Cancel Upload" : "Upload Record"}
              </Button>
            </div>
            
            {showUploader && (
              <RecordUploader onAddRecord={handleAddRecord} />
            )}
            
            <div className="space-y-4">
              {medicalRecords.map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-4 flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-100 rounded-md mt-1">
                        <FileText className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{record.title}</h3>
                        <p className="text-sm text-muted-foreground">{record.provider}</p>
                        {record.fileName && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {record.fileName} {record.fileSize && `(${record.fileSize})`}
                          </p>
                        )}
                        <p className="text-sm mt-2">{record.notes}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="text-sm font-medium">{record.date}</p>
                      <div className="flex gap-2 mt-2">
                        {record.file && (
                          <Button variant="outline" size="sm" className="h-8">
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Download
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="link" size="sm" className="p-0 h-8">
                              View details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-lg font-semibold">{record.title}</h3>
                                <p className="text-sm text-muted-foreground">{record.date}</p>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <h4 className="text-sm font-medium">Healthcare Provider</h4>
                                  <p>{record.provider || "Not specified"}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Notes</h4>
                                  <p>{record.notes || "No notes available"}</p>
                                </div>
                                {record.fileName && (
                                  <div>
                                    <h4 className="text-sm font-medium">Attached File</h4>
                                    <p className="flex items-center gap-2">
                                      <FileText className="h-4 w-4" />
                                      {record.fileName} {record.fileSize && `(${record.fileSize})`}
                                    </p>
                                    <Button variant="outline" size="sm" className="mt-2">
                                      <Download className="h-3.5 w-3.5 mr-1" />
                                      Download
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Timeline</CardTitle>
                <CardDescription>View your medical events chronologically</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="w-[50px] flex-shrink-0 flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 w-px bg-border mt-2" />
                    </div>
                    <div className="flex-1 pb-8">
                      <h3 className="font-medium">Annual Physical Checkup</h3>
                      <p className="text-sm text-muted-foreground">March 15, 2025</p>
                      <p className="text-sm mt-2">All results within normal range. Vitamin D slightly low, supplement recommended.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-[50px] flex-shrink-0 flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-medical-red/10 flex items-center justify-center">
                        <Heart className="h-5 w-5 text-medical-red" />
                      </div>
                      <div className="flex-1 w-px bg-border mt-2" />
                    </div>
                    <div className="flex-1 pb-8">
                      <h3 className="font-medium">Blood Pressure Check</h3>
                      <p className="text-sm text-muted-foreground">February 20, 2025</p>
                      <p className="text-sm mt-2">Reading: 120/80 mmHg - Within healthy range</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-[50px] flex-shrink-0 flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <LineChart className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Blood Lab Work</h3>
                      <p className="text-sm text-muted-foreground">January 10, 2025</p>
                      <p className="text-sm mt-2">Complete blood count, lipid panel, and metabolic panel. All results normal.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

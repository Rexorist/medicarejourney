
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users, UserPlus, Activity, Heart, Pill, LineChart as LineChartIcon } from "lucide-react";
import { FamilyMember, FamilyMemberCard } from "@/components/family/FamilyMemberCard";
import { AddFamilyMemberDialog } from "@/components/family/AddFamilyMemberDialog";
import { useToast } from "@/hooks/use-toast";

// Sample data for the family members
const initialFamilyMembers: FamilyMember[] = [
  {
    id: "1",
    name: "John Doe",
    relationship: "Self",
    age: 35,
    bloodType: "O+",
    avatar: "/placeholder.svg",
    healthStatus: "Good",
    nextCheckup: "June 15, 2024",
    recentReadings: {
      bloodPressure: { value: "120/80", status: "normal", date: "May 1, 2024" },
      bloodSugar: { value: "95", status: "normal", date: "May 1, 2024" },
      heartRate: { value: "72", status: "normal", date: "May 1, 2024" }
    }
  },
  {
    id: "2",
    name: "Jane Doe",
    relationship: "Spouse",
    age: 33,
    bloodType: "A+",
    avatar: "/placeholder.svg",
    healthStatus: "Good",
    nextCheckup: "July 10, 2024",
    recentReadings: {
      bloodPressure: { value: "118/78", status: "normal", date: "Apr 25, 2024" },
      bloodSugar: { value: "92", status: "normal", date: "Apr 25, 2024" },
      heartRate: { value: "68", status: "normal", date: "Apr 25, 2024" }
    }
  },
  {
    id: "3",
    name: "Emma Doe",
    relationship: "Daughter",
    age: 8,
    bloodType: "O+",
    avatar: "/placeholder.svg",
    healthStatus: "Good",
    nextCheckup: "August 5, 2024",
    recentReadings: {
      bloodPressure: { value: "90/60", status: "normal", date: "Apr 15, 2024" },
      bloodSugar: { value: "80", status: "normal", date: "Apr 15, 2024" },
      heartRate: { value: "85", status: "normal", date: "Apr 15, 2024" }
    }
  }
];

// Sample health trends data for charts
const healthTrendsData = {
  bloodPressure: [
    { month: "Jan", John: 120, Jane: 118, Emma: 90 },
    { month: "Feb", John: 122, Jane: 117, Emma: 92 },
    { month: "Mar", John: 119, Jane: 119, Emma: 89 },
    { month: "Apr", John: 121, Jane: 116, Emma: 91 },
    { month: "May", John: 120, Jane: 118, Emma: 90 },
  ],
  bloodSugar: [
    { month: "Jan", John: 94, Jane: 90, Emma: 78 },
    { month: "Feb", John: 97, Jane: 91, Emma: 80 },
    { month: "Mar", John: 95, Jane: 93, Emma: 79 },
    { month: "Apr", John: 98, Jane: 92, Emma: 81 },
    { month: "May", John: 95, Jane: 92, Emma: 80 },
  ],
  heartRate: [
    { month: "Jan", John: 72, Jane: 68, Emma: 86 },
    { month: "Feb", John: 74, Jane: 67, Emma: 84 },
    { month: "Mar", John: 71, Jane: 69, Emma: 85 },
    { month: "Apr", John: 73, Jane: 66, Emma: 83 },
    { month: "May", John: 72, Jane: 68, Emma: 85 },
  ]
};

// Sample health alerts
const healthAlerts = [
  {
    memberId: "1",
    memberName: "John Doe",
    alertType: "Medication",
    message: "Blood pressure medication running low. Refill needed within 5 days.",
    date: "May 3, 2024",
    urgent: false
  },
  {
    memberId: "3",
    memberName: "Emma Doe",
    alertType: "Appointment",
    message: "Annual pediatric checkup scheduled for May 15, 2024 at 10:00 AM.",
    date: "May 5, 2024",
    urgent: false
  },
  {
    memberId: "2",
    memberName: "Jane Doe",
    alertType: "Health Reading",
    message: "Last blood pressure reading slightly elevated. Consider follow-up.",
    date: "Apr 28, 2024",
    urgent: true
  }
];

export default function FamilyHealth() {
  const { toast } = useToast();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [selectedChart, setSelectedChart] = useState("bloodPressure");
  
  const handleAddFamilyMember = (newMember: FamilyMember) => {
    setFamilyMembers([...familyMembers, newMember]);
    toast({
      title: "Family Member Added",
      description: `${newMember.name} has been added to your family dashboard.`,
    });
  };

  const handleUpdateReading = (memberId: string, readingType: string, value: string) => {
    const updatedMembers = familyMembers.map(member => {
      if (member.id === memberId) {
        return {
          ...member,
          recentReadings: {
            ...member.recentReadings,
            [readingType]: {
              ...member.recentReadings[readingType as keyof typeof member.recentReadings],
              value,
              date: new Date().toLocaleDateString()
            }
          }
        };
      }
      return member;
    });
    
    setFamilyMembers(updatedMembers);
    toast({
      title: "Reading Updated",
      description: `${readingType} reading has been updated.`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-medical-blue" />
            Family Health Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage health information for your entire family
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {familyMembers.map((member) => (
            <FamilyMemberCard 
              key={member.id}
              member={member}
              onUpdateReading={handleUpdateReading}
            />
          ))}
          
          <Card className="flex flex-col items-center justify-center p-6 border-dashed cursor-pointer hover:bg-muted/50 transition-colors">
            <AddFamilyMemberDialog onAddMember={handleAddFamilyMember}>
              <div className="flex flex-col items-center text-center">
                <UserPlus className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="font-medium">Add Family Member</h3>
                <p className="text-sm text-muted-foreground">Add a new family member to track their health</p>
              </div>
            </AddFamilyMemberDialog>
          </Card>
        </div>
        
        <Tabs defaultValue="trends" className="w-full mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends">Health Trends</TabsTrigger>
            <TabsTrigger value="alerts">Health Alerts</TabsTrigger>
            <TabsTrigger value="summary">Family Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="mt-6 space-y-6">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Button 
                variant={selectedChart === "bloodPressure" ? "default" : "outline"} 
                onClick={() => setSelectedChart("bloodPressure")}
                className="flex items-center gap-2"
              >
                <Heart className="h-4 w-4" /> Blood Pressure
              </Button>
              <Button 
                variant={selectedChart === "bloodSugar" ? "default" : "outline"} 
                onClick={() => setSelectedChart("bloodSugar")}
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" /> Blood Sugar
              </Button>
              <Button 
                variant={selectedChart === "heartRate" ? "default" : "outline"} 
                onClick={() => setSelectedChart("heartRate")}
                className="flex items-center gap-2"
              >
                <LineChartIcon className="h-4 w-4" /> Heart Rate
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  Family {selectedChart === "bloodPressure" 
                    ? "Blood Pressure" 
                    : selectedChart === "bloodSugar" 
                      ? "Blood Sugar" 
                      : "Heart Rate"} Trends
                </CardTitle>
                <CardDescription>5-month comparison across family members</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthTrendsData[selectedChart as keyof typeof healthTrendsData]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {familyMembers.map((member, index) => {
                      // Rotate through a set of colors
                      const colors = ["#0070C9", "#FF5757", "#4CAF50", "#FFC107", "#9C27B0"];
                      return (
                        <Line
                          key={member.id}
                          type="monotone"
                          dataKey={member.name.split(" ")[0]}
                          name={member.name}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Alerts & Reminders</CardTitle>
                <CardDescription>Important notifications for your family's health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthAlerts.map((alert, index) => (
                    <div key={index} className={`p-4 rounded-md border ${alert.urgent ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            {alert.alertType === 'Medication' && <Pill className="h-4 w-4" />}
                            {alert.alertType === 'Appointment' && <Calendar className="h-4 w-4" />}
                            {alert.alertType === 'Health Reading' && <Activity className="h-4 w-4" />}
                            {alert.alertType} Alert: {alert.memberName}
                          </h3>
                          <p className="text-sm">{alert.message}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">{alert.date}</div>
                      </div>
                      {alert.urgent && <span className="text-xs font-medium text-red-500">ATTENTION NEEDED</span>}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="ml-auto">View All Alerts</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="summary" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Family Health Summary</CardTitle>
                <CardDescription>Overview of your family's health status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Reading Date</TableHead>
                      <TableHead>BP</TableHead>
                      <TableHead>Blood Sugar</TableHead>
                      <TableHead>Heart Rate</TableHead>
                      <TableHead>Next Check-up</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {familyMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.healthStatus === "Good" 
                              ? "bg-green-100 text-green-800" 
                              : member.healthStatus === "Fair" 
                                ? "bg-yellow-100 text-yellow-800" 
                                : "bg-red-100 text-red-800"
                          }`}>
                            {member.healthStatus}
                          </span>
                        </TableCell>
                        <TableCell>{member.recentReadings.bloodPressure.date}</TableCell>
                        <TableCell>{member.recentReadings.bloodPressure.value}</TableCell>
                        <TableCell>{member.recentReadings.bloodSugar.value} mg/dL</TableCell>
                        <TableCell>{member.recentReadings.heartRate.value} bpm</TableCell>
                        <TableCell>{member.nextCheckup}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

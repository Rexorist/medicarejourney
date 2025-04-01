
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
import { Users, UserPlus, Activity, Heart, Pill, LineChart as LineChartIcon, Calendar, Bell, Check, Clock, Shield } from "lucide-react";
import { FamilyMember, FamilyMemberCard } from "@/components/family/FamilyMemberCard";
import { AddFamilyMemberDialog } from "@/components/family/AddFamilyMemberDialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Enhanced family member interface with medication tracking
interface EnhancedFamilyMember extends FamilyMember {
  medications?: {
    id: string;
    name: string;
    dosage: string;
    schedule: string;
    lastTaken?: string;
    nextDue?: string;
    status: 'taken' | 'missed' | 'upcoming';
  }[];
  isGuardian?: boolean;
}

// Sample data for the family members with medication tracking
const initialFamilyMembers: EnhancedFamilyMember[] = [
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
    },
    isGuardian: true,
    medications: [
      {
        id: "m1",
        name: "Lisinopril",
        dosage: "10mg",
        schedule: "Once daily (morning)",
        lastTaken: "Today, 8:15 AM",
        nextDue: "Tomorrow, 8:00 AM",
        status: "taken"
      },
      {
        id: "m2",
        name: "Atorvastatin",
        dosage: "20mg",
        schedule: "Once daily (bedtime)",
        lastTaken: "Yesterday, 9:30 PM",
        nextDue: "Today, 9:00 PM",
        status: "upcoming"
      }
    ]
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
    },
    medications: [
      {
        id: "m3",
        name: "Vitamin D",
        dosage: "2000 IU",
        schedule: "Once daily",
        lastTaken: "Today, 7:45 AM",
        nextDue: "Tomorrow, 8:00 AM",
        status: "taken"
      },
      {
        id: "m4",
        name: "Iron Supplement",
        dosage: "65mg",
        schedule: "Once daily with food",
        lastTaken: "Yesterday, 12:30 PM",
        nextDue: "Today, 12:00 PM",
        status: "missed"
      }
    ]
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
    },
    medications: [
      {
        id: "m5",
        name: "Children's Multivitamin",
        dosage: "1 tablet",
        schedule: "Once daily (morning)",
        lastTaken: "Today, 7:30 AM",
        nextDue: "Tomorrow, 7:30 AM",
        status: "taken"
      },
      {
        id: "m6",
        name: "Allergy Medicine",
        dosage: "5ml",
        schedule: "Twice daily",
        lastTaken: "Today, 8:00 AM",
        nextDue: "Today, 8:00 PM",
        status: "upcoming"
      }
    ]
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
    alertType: "Medication",
    message: "Iron supplement dose missed today. Please take as soon as possible.",
    date: "Today",
    urgent: true
  }
];

export default function FamilyHealth() {
  const { toast } = useToast();
  const [familyMembers, setFamilyMembers] = useState<EnhancedFamilyMember[]>(initialFamilyMembers);
  const [selectedChart, setSelectedChart] = useState("bloodPressure");
  const [guardianMode, setGuardianMode] = useState(true);
  const [showMedicationReminders, setShowMedicationReminders] = useState(true);
  
  const guardian = familyMembers.find(member => member.isGuardian);
  
  const handleAddFamilyMember = (newMember: FamilyMember) => {
    const enhancedMember: EnhancedFamilyMember = {
      ...newMember,
      medications: []
    };
    setFamilyMembers([...familyMembers, enhancedMember]);
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

  const handleMarkMedicationTaken = (memberId: string, medicationId: string) => {
    const updatedMembers = familyMembers.map(member => {
      if (member.id === memberId && member.medications) {
        const updatedMedications = member.medications.map(med => {
          if (med.id === medicationId) {
            return {
              ...med,
              status: "taken" as const,
              lastTaken: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
              nextDue: "Tomorrow, " + med.schedule.split(" ").pop()
            };
          }
          return med;
        });
        
        return {
          ...member,
          medications: updatedMedications
        };
      }
      return member;
    });
    
    setFamilyMembers(updatedMembers);
    
    toast({
      title: "Medication Taken",
      description: "Medication has been marked as taken.",
    });
  };
  
  const handleSendReminder = (memberId: string, medicationId: string) => {
    const member = familyMembers.find(m => m.id === memberId);
    const medication = member?.medications?.find(med => med.id === medicationId);
    
    if (member && medication) {
      toast({
        title: "Reminder Sent",
        description: `A reminder to take ${medication.name} has been sent to ${member.name}.`,
      });
    }
  };

  // Count up medication status for all family members
  const medicationSummary = {
    taken: 0,
    missed: 0,
    upcoming: 0,
    total: 0
  };
  
  familyMembers.forEach(member => {
    member.medications?.forEach(med => {
      medicationSummary.total++;
      medicationSummary[med.status]++;
    });
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8 text-medical-blue" />
              Family Health Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage health information for your entire family
            </p>
          </div>
          
          {guardian && (
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-slate-50">
              <div className="flex flex-col space-y-1">
                <h3 className="font-medium">Guardian Mode</h3>
                <p className="text-sm text-muted-foreground">Monitor your family's medication adherence</p>
              </div>
              <Switch 
                id="guardian-mode" 
                checked={guardianMode} 
                onCheckedChange={setGuardianMode}
              />
            </div>
          )}
        </div>
        
        {guardianMode && guardian && (
          <Card className="border-medical-blue/30 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-medical-blue" />
                Guardian Dashboard
              </CardTitle>
              <CardDescription>
                Monitor medication adherence for all family members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-4xl font-bold">{medicationSummary.total}</div>
                      <p className="text-sm text-muted-foreground mt-1">Total Medications</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="pt-6">
                      <div className="text-4xl font-bold text-green-600">{medicationSummary.taken}</div>
                      <p className="text-sm text-green-600/70 mt-1">Taken Today</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50">
                    <CardContent className="pt-6">
                      <div className="text-4xl font-bold text-amber-600">{medicationSummary.upcoming}</div>
                      <p className="text-sm text-amber-600/70 mt-1">Upcoming Today</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50">
                    <CardContent className="pt-6">
                      <div className="text-4xl font-bold text-red-600">{medicationSummary.missed}</div>
                      <p className="text-sm text-red-600/70 mt-1">Missed Doses</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Family Medication Tracker</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Family Member</TableHead>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Taken</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {familyMembers.filter(member => member.id !== guardian.id).map(member => 
                        member.medications?.map(medication => (
                          <TableRow key={`${member.id}-${medication.id}`}>
                            <TableCell>{member.name}</TableCell>
                            <TableCell>{medication.name}</TableCell>
                            <TableCell>{medication.dosage}</TableCell>
                            <TableCell>{medication.schedule}</TableCell>
                            <TableCell>
                              <Badge variant={
                                medication.status === "taken" ? "default" :
                                medication.status === "upcoming" ? "outline" : "destructive"
                              }>
                                {medication.status === "taken" && <Check className="h-3 w-3 mr-1" />}
                                {medication.status === "upcoming" && <Clock className="h-3 w-3 mr-1" />}
                                {medication.status === "missed" && <Bell className="h-3 w-3 mr-1" />}
                                {medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{medication.lastTaken || "Not taken yet"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleMarkMedicationTaken(member.id, medication.id)}
                                  disabled={medication.status === "taken"}
                                >
                                  Mark Taken
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleSendReminder(member.id, medication.id)}
                                  disabled={medication.status === "taken"}
                                >
                                  Send Reminder
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="medication-reminders" 
                    checked={showMedicationReminders} 
                    onCheckedChange={setShowMedicationReminders}
                  />
                  <Label htmlFor="medication-reminders">Receive notifications for missed medications</Label>
                </div>
                <Button>Configure Notifications</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
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
                        <TableCell className="font-medium">
                          {member.name}
                          {member.isGuardian && (
                            <Badge variant="outline" className="ml-2">Guardian</Badge>
                          )}
                        </TableCell>
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

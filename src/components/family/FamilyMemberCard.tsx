
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Heart, Activity, PulseIcon } from "lucide-react";

// Define the types for readings
type Reading = {
  value: string;
  status: "normal" | "warning" | "critical";
  date: string;
};

export type FamilyMember = {
  id: string;
  name: string;
  relationship: string;
  age: number;
  bloodType: string;
  avatar: string;
  healthStatus: "Good" | "Fair" | "Poor";
  nextCheckup: string;
  recentReadings: {
    bloodPressure: Reading;
    bloodSugar: Reading;
    heartRate: Reading;
    [key: string]: Reading;
  };
};

interface FamilyMemberCardProps {
  member: FamilyMember;
  onUpdateReading: (memberId: string, readingType: string, value: string) => void;
}

export const FamilyMemberCard = ({ member, onUpdateReading }: FamilyMemberCardProps) => {
  const [editingReading, setEditingReading] = useState<string | null>(null);
  const [newReadingValue, setNewReadingValue] = useState<string>("");
  
  const handleSubmitReading = () => {
    if (editingReading && newReadingValue) {
      onUpdateReading(member.id, editingReading, newReadingValue);
      setEditingReading(null);
      setNewReadingValue("");
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{member.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{member.relationship} • {member.age} years</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Blood Type</p>
            <p className="font-medium">{member.bloodType}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className={`font-medium ${
              member.healthStatus === "Good" ? "text-green-600" : 
              member.healthStatus === "Fair" ? "text-amber-600" : "text-red-600"
            }`}>
              {member.healthStatus}
            </p>
          </div>
        </div>
        
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-medium">Recent Readings</h4>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm">Blood Pressure:</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{member.recentReadings.bloodPressure.value}</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Edit className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Update Blood Pressure</h4>
                      <p className="text-sm text-muted-foreground">
                        Enter new blood pressure reading for {member.name}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bp-value">Systolic/Diastolic</Label>
                      <Input 
                        id="bp-value" 
                        placeholder="e.g., 120/80"
                        value={editingReading === "bloodPressure" ? newReadingValue : ""}
                        onChange={(e) => {
                          setEditingReading("bloodPressure");
                          setNewReadingValue(e.target.value);
                        }}
                      />
                    </div>
                    <Button onClick={handleSubmitReading}>Save Reading</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm">Blood Sugar:</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{member.recentReadings.bloodSugar.value} mg/dL</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Edit className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Update Blood Sugar</h4>
                      <p className="text-sm text-muted-foreground">
                        Enter new blood sugar reading for {member.name}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="sugar-value">Blood Sugar (mg/dL)</Label>
                      <Input 
                        id="sugar-value" 
                        placeholder="e.g., 95"
                        value={editingReading === "bloodSugar" ? newReadingValue : ""}
                        onChange={(e) => {
                          setEditingReading("bloodSugar");
                          setNewReadingValue(e.target.value);
                        }}
                      />
                    </div>
                    <Button onClick={handleSubmitReading}>Save Reading</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PulseIcon className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Heart Rate:</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{member.recentReadings.heartRate.value} bpm</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Edit className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Update Heart Rate</h4>
                      <p className="text-sm text-muted-foreground">
                        Enter new heart rate reading for {member.name}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hr-value">Heart Rate (bpm)</Label>
                      <Input 
                        id="hr-value" 
                        placeholder="e.g., 72"
                        value={editingReading === "heartRate" ? newReadingValue : ""}
                        onChange={(e) => {
                          setEditingReading("heartRate");
                          setNewReadingValue(e.target.value);
                        }}
                      />
                    </div>
                    <Button onClick={handleSubmitReading}>Save Reading</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 px-6 py-3">
        <div className="w-full text-sm flex justify-between">
          <span className="text-muted-foreground">Next Check-up:</span>
          <span className="font-medium">{member.nextCheckup}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

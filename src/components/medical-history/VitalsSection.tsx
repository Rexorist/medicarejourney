
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";

interface VitalsSectionProps {
  initialBloodPressureData: Array<{ date: string; systolic: number; diastolic: number }>;
  initialBloodSugarData: Array<{ date: string; level: number }>;
}

export function VitalsSection({ initialBloodPressureData, initialBloodSugarData }: VitalsSectionProps) {
  const { toast } = useToast();
  const [bloodPressureData, setBloodPressureData] = useState(initialBloodPressureData);
  const [bloodSugarData, setBloodSugarData] = useState(initialBloodSugarData);

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

  return (
    <div className="space-y-6">
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
    </div>
  );
}

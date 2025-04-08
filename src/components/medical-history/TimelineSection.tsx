
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Heart, LineChart } from "lucide-react";

export function TimelineSection() {
  return (
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
  );
}

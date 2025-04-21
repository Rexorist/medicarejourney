
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface RecentConcern {
  id: string;
  title: string;
  date: string;
  status: string;
  description: string;
}

interface RecentConcernsSectionProps {
  recentConcerns: RecentConcern[];
}

export function RecentConcernsSection({ recentConcerns }: RecentConcernsSectionProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-medical-blue" />
          Recent Health Concerns
        </CardTitle>
        <CardDescription>Review your recent health concerns and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {recentConcerns.map(concern => (
            <div key={concern.id} className="p-4 bg-muted rounded-lg border border-border">
              <div className="flex gap-4 items-center">
                <div className="text-medical-blue font-bold text-lg">
                  <Calendar className="w-4 h-4 mr-1 inline" />
                  {concern.date}
                </div>
                <div className="text-xs bg-medical-blue/10 text-medical-blue px-2 py-1 rounded-lg ml-auto">{concern.status}</div>
              </div>
              <div className="font-medium mt-2">{concern.title}</div>
              <div className="text-sm text-muted-foreground">{concern.description}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

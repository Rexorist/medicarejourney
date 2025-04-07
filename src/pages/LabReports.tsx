
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LabReportsUpload } from "@/components/lab-reports/LabReportsUpload";
import { FileText, Share2, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LabReports() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-medical-blue" />
            Lab Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload, manage, and analyze your medical lab reports
          </p>
        </div>
        
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertTitle>Your privacy is our priority</AlertTitle>
          <AlertDescription>
            All lab reports are encrypted and stored securely. Only you and your authorized healthcare providers can access them.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports">My Reports</TabsTrigger>
            <TabsTrigger value="shared">Shared With Me</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports" className="mt-6">
            <LabReportsUpload />
          </TabsContent>
          
          <TabsContent value="shared" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Shared Reports
                </CardTitle>
                <CardDescription>
                  Lab reports shared with you by your healthcare providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No shared reports</h3>
                  <p className="text-muted-foreground mt-1 max-w-md">
                    When healthcare providers share lab reports with you, they will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

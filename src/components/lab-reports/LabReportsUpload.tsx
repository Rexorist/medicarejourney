
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LabReport {
  id: string;
  name: string;
  date: string;
  size: string;
  type: string;
  file: File;
  status: 'uploaded' | 'analyzing' | 'analyzed';
  analysis?: string;
}

export function LabReportsUpload() {
  const { toast } = useToast();
  const [reports, setReports] = useState<LabReport[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }
    
    setSelectedFile(file);
    setError(null);
  };

  const formatDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const simulateUpload = () => {
    if (!selectedFile) return;
    
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      const newReport: LabReport = {
        id: Date.now().toString(),
        name: selectedFile.name,
        date: formatDate(),
        size: formatFileSize(selectedFile.size),
        type: selectedFile.type,
        file: selectedFile,
        status: 'uploaded'
      };
      
      setReports(prev => [...prev, newReport]);
      setSelectedFile(null);
      setUploadProgress(null);
      
      toast({
        title: "Report Uploaded",
        description: "Your lab report has been uploaded successfully."
      });
      
      // Reset the file input
      const fileInput = document.getElementById('report-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }, 2000);
  };

  const analyzeReport = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: 'analyzing' } 
        : report
    ));

    // Simulate AI analysis
    setTimeout(() => {
      setReports(prev => prev.map(report => {
        if (report.id === reportId) {
          let analysisText = '';
          
          // Generate a sample analysis based on the filename
          if (report.name.toLowerCase().includes('blood')) {
            analysisText = "Blood panel results show normal ranges for most values. Cholesterol is slightly elevated at 215 mg/dL (normal range: <200 mg/dL). Consider dietary adjustments with reduced saturated fat intake and regular exercise. Follow up with your doctor in 3 months to reassess.";
          } else if (report.name.toLowerCase().includes('thyroid')) {
            analysisText = "Thyroid function tests indicate normal TSH and T4 levels. No current intervention needed for thyroid function, but maintain regular monitoring every 6-12 months given family history.";
          } else if (report.name.toLowerCase().includes('liver')) {
            analysisText = "Liver function tests show mild elevation in ALT (55 U/L, normal range: 7-52 U/L). This could indicate minor liver stress. Recommend limiting alcohol consumption, increasing water intake, and follow-up testing in 1-2 months.";
          } else {
            analysisText = "Lab results are within normal ranges. Continue current health management practices and follow up with your healthcare provider as scheduled. Consider regular exercise and a balanced diet to maintain optimal health.";
          }
          
          return { ...report, status: 'analyzed', analysis: analysisText };
        }
        return report;
      }));
      
      toast({
        title: "Analysis Complete",
        description: "AI analysis of your lab report is now available."
      });
    }, 3000);
  };

  const handleViewAnalysis = (reportId: string) => {
    setSelectedReportId(reportId === selectedReportId ? null : reportId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Lab Reports
        </CardTitle>
        <CardDescription>
          Upload and analyze your lab reports for personalized health insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border border-dashed rounded-lg p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Upload Lab Report</h3>
              <p className="text-sm text-muted-foreground mt-1">PDF files only, max 10MB</p>
            </div>
            <Input
              id="report-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="max-w-sm"
            />
            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {uploadProgress !== null && (
              <div className="w-full max-w-sm">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-right mt-1">{uploadProgress}%</p>
              </div>
            )}
            <Button 
              onClick={simulateUpload} 
              disabled={!selectedFile || uploadProgress !== null}
            >
              Upload Report
            </Button>
          </div>
        </div>
        
        {reports.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-4">Your Lab Reports</h3>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-100 rounded-md">
                        <FileText className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                          <span>{report.date}</span>
                          <span>•</span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {report.status === 'uploaded' && (
                        <Button 
                          size="sm" 
                          onClick={() => analyzeReport(report.id)}
                        >
                          Analyze with AI
                        </Button>
                      )}
                      {report.status === 'analyzing' && (
                        <Button size="sm" disabled>
                          Analyzing...
                        </Button>
                      )}
                      {report.status === 'analyzed' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewAnalysis(report.id)}
                        >
                          {selectedReportId === report.id ? 'Hide Analysis' : 'View Analysis'}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {selectedReportId === report.id && report.analysis && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-md text-sm">
                      <h5 className="font-medium mb-2">AI Analysis:</h5>
                      <p>{report.analysis}</p>
                      <div className="mt-3 pt-3 border-t">
                        <h6 className="font-medium mb-1">Recommended Precautions:</h6>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Schedule a follow-up with your doctor to discuss these results</li>
                          <li>Maintain a balanced diet rich in fruits and vegetables</li>
                          <li>Stay hydrated with at least 8 glasses of water daily</li>
                          <li>Exercise regularly (aim for 150 minutes per week)</li>
                          <li>Monitor any symptoms related to the conditions tested</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <p className="text-sm text-muted-foreground">
          Securely share reports with your healthcare providers
        </p>
        <Button variant="outline" disabled={reports.length === 0}>
          Export All Reports
        </Button>
      </CardFooter>
    </Card>
  );
}


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, FileText, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

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

interface RecordUploaderProps {
  onAddRecord: (record: MedicalRecord) => void;
}

export function RecordUploader({ onAddRecord }: RecordUploaderProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [recordDetails, setRecordDetails] = useState({
    title: "",
    provider: "",
    notes: ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!acceptedTypes.includes(file.type)) {
      setError('Only PDF, JPEG, and PNG files are allowed');
      return;
    }
    
    setSelectedFile(file);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecordDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    if (!recordDetails.title) {
      setError("Please enter a title for the record");
      return;
    }
    
    // Simulate file upload
    setUploadProgress(0);
    
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(uploadInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    
    setTimeout(() => {
      clearInterval(uploadInterval);
      setUploadProgress(100);
      
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });

      const newRecord: MedicalRecord = {
        id: Date.now().toString(),
        title: recordDetails.title,
        date: formattedDate,
        provider: recordDetails.provider,
        notes: recordDetails.notes,
        file: selectedFile,
        fileName: selectedFile.name,
        fileSize: formatFileSize(selectedFile.size),
      };
      
      onAddRecord(newRecord);
      
      // Reset form
      setSelectedFile(null);
      setUploadProgress(null);
      setRecordDetails({
        title: "",
        provider: "",
        notes: ""
      });
      
      // Reset file input
      const fileInput = document.getElementById('record-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      toast({
        title: "Record Uploaded",
        description: "Your medical record has been uploaded successfully."
      });
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border border-dashed rounded-lg">
      <div className="flex flex-col items-center gap-4 mb-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Upload className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-center">Upload Medical Record</h3>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            PDF, JPEG, or PNG files, max 10MB
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Record Title*
          </label>
          <Input
            id="title"
            name="title"
            value={recordDetails.title}
            onChange={handleInputChange}
            placeholder="Annual Checkup, Specialist Visit, etc."
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="provider" className="text-sm font-medium">
            Healthcare Provider
          </label>
          <Input
            id="provider"
            name="provider"
            value={recordDetails.provider}
            onChange={handleInputChange}
            placeholder="Dr. Name or Hospital"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <Input
          id="notes"
          name="notes"
          value={recordDetails.notes}
          onChange={handleInputChange}
          placeholder="Brief description of the medical record"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="record-upload" className="text-sm font-medium">
          Select File*
        </label>
        <Input
          id="record-upload"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          required
        />
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {uploadProgress !== null && (
        <div>
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-right mt-1">{uploadProgress}%</p>
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={!selectedFile || uploadProgress !== null}
      >
        <FileText className="h-4 w-4 mr-2" />
        Upload Record
      </Button>
    </form>
  );
}

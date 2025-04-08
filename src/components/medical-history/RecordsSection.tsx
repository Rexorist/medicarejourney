
import { useState } from "react";
import { RecordUploader } from "@/components/medical-history/RecordUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Download, FileText } from "lucide-react";

export interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  provider: string;
  notes: string;
  file?: File;
  fileName?: string;
  fileSize?: string;
}

interface RecordsSectionProps {
  initialRecords: MedicalRecord[];
}

export function RecordsSection({ initialRecords }: RecordsSectionProps) {
  const [showUploader, setShowUploader] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(initialRecords);

  const handleAddRecord = (record: MedicalRecord) => {
    setMedicalRecords(prev => [record, ...prev]);
    setShowUploader(false);
  };

  return (
    <div className="space-y-6">
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
    </div>
  );
}

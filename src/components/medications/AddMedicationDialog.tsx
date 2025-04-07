
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AddMedicationProps {
  onAddMedication: (medication: {
    name: string;
    dosage: string;
    frequency: string;
    purpose: string;
    refillDate?: string;
    expiryDate?: string;
    instructions?: string;
  }) => void;
  children?: React.ReactNode;
}

export function AddMedicationDialog({ onAddMedication, children }: AddMedicationProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [medication, setMedication] = useState({
    name: "",
    dosage: "",
    frequency: "Once daily",
    purpose: "",
    refillDate: "",
    expiryDate: "",
    instructions: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMedication(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setMedication(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medication.name || !medication.dosage || !medication.frequency || !medication.purpose) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onAddMedication(medication);
    setMedication({
      name: "",
      dosage: "",
      frequency: "Once daily",
      purpose: "",
      refillDate: "",
      expiryDate: "",
      instructions: ""
    });
    setOpen(false);
    
    toast({
      title: "Medication Added",
      description: "Your medication has been added successfully."
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Add Medication</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
          <DialogDescription>
            Enter the details of your medication. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Medication Name *</Label>
              <Input
                id="name"
                name="name"
                value={medication.name}
                onChange={handleChange}
                placeholder="e.g. Lisinopril"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  name="dosage"
                  value={medication.dosage}
                  onChange={handleChange}
                  placeholder="e.g. 10mg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Select 
                  value={medication.frequency} 
                  onValueChange={(value) => handleSelectChange("frequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Once daily">Once daily</SelectItem>
                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                    <SelectItem value="Three times daily">Three times daily</SelectItem>
                    <SelectItem value="Four times daily">Four times daily</SelectItem>
                    <SelectItem value="As needed">As needed</SelectItem>
                    <SelectItem value="Once weekly">Once weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Input
                id="purpose"
                name="purpose"
                value={medication.purpose}
                onChange={handleChange}
                placeholder="e.g. Blood Pressure"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="refillDate">Refill Date</Label>
                <Input
                  id="refillDate"
                  name="refillDate"
                  value={medication.refillDate}
                  onChange={handleChange}
                  placeholder="e.g. May 30, 2025"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  value={medication.expiryDate}
                  onChange={handleChange}
                  placeholder="e.g. June 15, 2025"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                name="instructions"
                value={medication.instructions}
                onChange={handleChange}
                placeholder="e.g. Take in the morning with food"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Medication</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

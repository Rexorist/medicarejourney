
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const readingSchema = z.object({
  type: z.enum(["blood-pressure", "blood-sugar", "heart-rate", "weight", "temperature"]),
  date: z.date(),
  values: z.record(z.string(), z.coerce.number().or(z.string())),
});

type ReadingFormValues = z.infer<typeof readingSchema>;

// Define the fields needed for each reading type
const readingFields = {
  "blood-pressure": [
    { name: "systolic", label: "Systolic", unit: "mmHg" },
    { name: "diastolic", label: "Diastolic", unit: "mmHg" },
  ],
  "blood-sugar": [
    { name: "level", label: "Blood Sugar", unit: "mg/dL" },
  ],
  "heart-rate": [
    { name: "bpm", label: "Heart Rate", unit: "BPM" },
  ],
  "weight": [
    { name: "weight", label: "Weight", unit: "kg" },
  ],
  "temperature": [
    { name: "temperature", label: "Temperature", unit: "°C" },
  ],
};

interface AddReadingDialogProps {
  onAddReading?: (data: any) => void;
}

export function AddReadingDialog({ onAddReading }: AddReadingDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ReadingFormValues>({
    resolver: zodResolver(readingSchema),
    defaultValues: {
      type: "blood-pressure",
      date: new Date(),
      values: {},
    },
  });

  const selectedType = form.watch("type") as keyof typeof readingFields;

  const onSubmit = (data: ReadingFormValues) => {
    // Process the form data
    console.log("New reading:", data);
    
    // Call the onAddReading prop if provided
    if (onAddReading) {
      onAddReading(data);
    }
    
    // Reset the form
    form.reset();
    
    // Close the dialog
    setOpen(false);
    
    // Show a success toast
    toast({
      title: "Reading Added",
      description: `New ${data.type.replace('-', ' ')} reading added successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <span className="h-4 w-4 mr-2">+</span>
          Add New Reading
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Reading</DialogTitle>
          <DialogDescription>
            Enter the details for your new health reading.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reading Type</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset values when type changes
                      form.setValue("values", {});
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reading type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="blood-pressure">Blood Pressure</SelectItem>
                      <SelectItem value="blood-sugar">Blood Sugar</SelectItem>
                      <SelectItem value="heart-rate">Heart Rate</SelectItem>
                      <SelectItem value="weight">Weight</SelectItem>
                      <SelectItem value="temperature">Temperature</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {readingFields[selectedType].map((field) => (
              <FormItem key={field.name}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      onChange={(e) => {
                        const values = form.getValues("values") || {};
                        form.setValue("values", {
                          ...values,
                          [field.name]: e.target.value,
                        });
                      }}
                    />
                    <span className="ml-2 text-sm text-muted-foreground">{field.unit}</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            ))}

            <DialogFooter>
              <Button type="submit">Save Reading</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

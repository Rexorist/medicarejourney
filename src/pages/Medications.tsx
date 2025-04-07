import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Calendar, Clock, AlertCircle, Pill, PlusCircle, Tablet, Bell, Check, RotateCw, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { differenceInDays, parse, isBefore } from "date-fns";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  refillDate?: string;
  expiryDate?: string;
  instructions?: string;
  dispenserConnected?: boolean;
  lastDispensed?: string;
  nextDispense?: string;
  status?: 'taken' | 'missed' | 'upcoming';
  guardianAlert?: boolean;
}

interface Guardian {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export default function Medications() {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      purpose: "Blood Pressure",
      refillDate: "May 30, 2025",
      expiryDate: "June 15, 2025",
      instructions: "Take in the morning with food",
      dispenserConnected: true,
      lastDispensed: "Today, 8:15 AM",
      nextDispense: "Tomorrow, 8:00 AM",
      status: 'taken',
      guardianAlert: true
    },
    {
      id: "2",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      purpose: "Diabetes Management",
      refillDate: "June 15, 2025",
      expiryDate: "August 10, 2025",
      instructions: "Take with meals",
      dispenserConnected: true,
      lastDispensed: "Today, 7:30 AM",
      nextDispense: "Today, 7:30 PM",
      status: 'upcoming',
      guardianAlert: true
    },
    {
      id: "3",
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      purpose: "Cholesterol",
      refillDate: "June 5, 2025",
      expiryDate: "April 20, 2025",
      instructions: "Take at bedtime",
      dispenserConnected: false,
      guardianAlert: false
    }
  ]);

  const [guardians, setGuardians] = useState<Guardian[]>([
    {
      id: "g1",
      name: "Sarah Johnson",
      relationship: "Spouse",
      phone: "+1 (555) 123-4567"
    }
  ]);

  const [isDispenserConnected, setIsDispenserConnected] = useState(true);
  const [dispenserStatus, setDispenserStatus] = useState("Online");
  const [showExpiryWarnings, setShowExpiryWarnings] = useState(true);
  const { toast } = useToast();

  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;
    
    try {
      const expiry = parse(expiryDate, "MMMM d, yyyy", new Date());
      const today = new Date();
      
      if (isBefore(expiry, today)) {
        return { status: 'expired', daysLeft: 0 };
      }
      
      const daysLeft = differenceInDays(expiry, today);
      
      if (daysLeft <= 30) {
        return { status: 'expiring-soon', daysLeft };
      }
      
      return { status: 'valid', daysLeft };
    } catch (error) {
      console.error("Error parsing date:", error);
      return null;
    }
  };

  const expiringMedications = medications.filter(med => {
    const expiryStatus = getExpiryStatus(med.expiryDate);
    return expiryStatus && (expiryStatus.status === 'expired' || expiryStatus.status === 'expiring-soon');
  }).sort((a, b) => {
    const expiryA = getExpiryStatus(a.expiryDate);
    const expiryB = getExpiryStatus(b.expiryDate);
    
    if (!expiryA || !expiryB) return 0;
    return expiryA.daysLeft - expiryB.daysLeft;
  });

  const handleRequestRefill = (id: string) => {
    toast({
      title: "Refill Requested",
      description: "Your prescription refill request has been submitted."
    });
  };

  const handleAddMedication = () => {
    toast({
      title: "Feature coming soon",
      description: "The medication management feature is under development."
    });
  };

  const toggleDispenserConnection = () => {
    setIsDispenserConnected(!isDispenserConnected);
    toast({
      title: isDispenserConnected ? "Dispenser Disconnected" : "Dispenser Connected",
      description: isDispenserConnected 
        ? "Your smart dispenser has been disconnected." 
        : "Your smart dispenser is now connected and ready to use."
    });
    setDispenserStatus(isDispenserConnected ? "Offline" : "Online");
  };

  const handleManualDispense = (id: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMedications(medications.map(med => {
      if (med.id === id) {
        return {
          ...med,
          lastDispensed: `Today, ${timeString}`,
          status: 'taken'
        };
      }
      return med;
    }));

    toast({
      title: "Medication Dispensed",
      description: "The medication has been dispensed from your smart dispenser."
    });
  };
  
  const handleSyncDispenser = () => {
    toast({
      title: "Synchronizing Dispenser",
      description: "Your medication schedule is being synchronized with the smart dispenser."
    });
    
    setTimeout(() => {
      toast({
        title: "Synchronization Complete",
        description: "Your smart dispenser is updated with the latest medication schedule."
      });
    }, 1500);
  };

  const handleTestAlert = (id: string) => {
    toast({
      title: "Test Alert Sent",
      description: "A test notification has been sent to you and your guardian.",
      variant: "destructive"
    });
  };

  const handleToggleGuardianAlert = (id: string) => {
    setMedications(medications.map(med => {
      if (med.id === id) {
        const updatedMed = {
          ...med,
          guardianAlert: !med.guardianAlert
        };

        if (updatedMed.guardianAlert) {
          toast({
            title: "Guardian Alerts Enabled",
            description: "Your guardian will be notified if medication is not taken."
          });
        } else {
          toast({
            title: "Guardian Alerts Disabled",
            description: "Your guardian will not receive medication alerts."
          });
        }
        
        return updatedMed;
      }
      return med;
    }));
  };

  const handleExtendExpiry = (id: string) => {
    toast({
      title: "Expiry Date Extended",
      description: "The expiry date for this medication has been updated."
    });
  };

  const handleToggleExpiryWarnings = () => {
    setShowExpiryWarnings(!showExpiryWarnings);
    toast({
      title: showExpiryWarnings ? "Expiry Warnings Disabled" : "Expiry Warnings Enabled",
      description: showExpiryWarnings 
        ? "You will no longer receive expiry warnings for your medications." 
        : "You will now receive warnings when your medications are about to expire."
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Medications</h1>
            <p className="text-muted-foreground">Manage your medications and smart dispenser</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleAddMedication} className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span>Add Medication</span>
            </Button>
            <Button onClick={handleSyncDispenser} variant="outline" className="flex items-center gap-2">
              <RotateCw size={16} />
              <span>Sync Dispenser</span>
            </Button>
          </div>
        </div>
        
        {showExpiryWarnings && expiringMedications.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/40">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarClock className="h-5 w-5 text-amber-600" />
                Medication Expiry Alerts
              </CardTitle>
              <CardDescription>
                You have {expiringMedications.length} medication{expiringMedications.length !== 1 ? 's' : ''} that will expire soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expiringMedications.map(med => {
                  const expiryStatus = getExpiryStatus(med.expiryDate);
                  const isExpired = expiryStatus?.status === 'expired';
                  
                  return (
                    <div key={`expiry-${med.id}`} className={`flex justify-between items-center p-3 rounded-md ${isExpired ? 'bg-red-100' : 'bg-amber-100'}`}>
                      <div>
                        <p className="font-medium">{med.name} ({med.dosage})</p>
                        <p className="text-sm">
                          {isExpired 
                            ? <span className="text-red-600 font-semibold">Expired on {med.expiryDate}</span>
                            : <span className="text-amber-700">Expires in {expiryStatus?.daysLeft} days ({med.expiryDate})</span>
                          }
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant={isExpired ? "destructive" : "outline"}
                        onClick={() => handleExtendExpiry(med.id)}
                      >
                        {isExpired ? "Replace Medication" : "Extend Expiry"}
                      </Button>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="expiry-warnings" 
                    checked={showExpiryWarnings} 
                    onCheckedChange={handleToggleExpiryWarnings}
                  />
                  <Label htmlFor="expiry-warnings">Show expiry warnings</Label>
                </div>
                <Button variant="link" size="sm">Manage All Expiry Dates</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className={isDispenserConnected ? "border-green-200 bg-green-50/30" : "border-amber-200 bg-amber-50/30"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Tablet className="h-5 w-5" />
              Smart Medicine Dispenser
              <Badge variant={isDispenserConnected ? "default" : "outline"} className="ml-2">
                {dispenserStatus}
              </Badge>
            </CardTitle>
            <CardDescription>
              IoT-connected dispenser that provides medication according to schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="dispenser-connection"
                      checked={isDispenserConnected}
                      onCheckedChange={toggleDispenserConnection}
                    />
                    <Label htmlFor="dispenser-connection">
                      {isDispenserConnected ? "Connected" : "Disconnected"}
                    </Label>
                  </div>
                  {isDispenserConnected && (
                    <Badge variant="outline" className="text-green-700 bg-green-100">
                      Battery: 87%
                    </Badge>
                  )}
                </div>
                
                {isDispenserConnected && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Next medication:</p>
                      <p className="text-lg">Metformin, Today 7:30 PM</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Dispenser capacity:</p>
                      <p className="text-lg">14 slots (10 filled)</p>
                    </div>
                  </div>
                )}
                
                {!isDispenserConnected && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Dispenser Offline</AlertTitle>
                    <AlertDescription>
                      Your smart dispenser is currently disconnected. Medication alerts and automatic dispensing are unavailable.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <Separator orientation="vertical" className="hidden md:block h-auto" />
              
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-2">Guardian Notification Settings</h3>
                {guardians.map(guardian => (
                  <div key={guardian.id} className="flex flex-col gap-2 p-3 rounded-md bg-card">
                    <div className="flex justify-between">
                      <p className="font-medium">{guardian.name}</p>
                      <Badge variant="outline">{guardian.relationship}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{guardian.phone}</p>
                    <div className="mt-1">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="alert-guardian" 
                          checked={medications.some(m => m.guardianAlert)} 
                          onCheckedChange={() => {
                            const allEnabled = medications.every(m => m.dispenserConnected && m.guardianAlert);
                            setMedications(medications.map(med => ({
                              ...med, 
                              guardianAlert: !allEnabled && med.dispenserConnected
                            })));
                            
                            toast({
                              title: allEnabled ? "Guardian Alerts Disabled" : "Guardian Alerts Enabled",
                              description: allEnabled 
                                ? "Your guardian will not receive medication alerts." 
                                : "Your guardian will be notified if medication is not taken."
                            });
                          }}
                        />
                        <Label htmlFor="alert-guardian">Notify for missed medications</Label>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-2"
                        onClick={() => handleTestAlert(guardian.id)}
                      >
                        Send Test Alert
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <h2 className="text-xl font-medium mt-6">Medications</h2>
        
        {medications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-lg text-gray-500">No medications added yet</p>
              <Button className="mt-4" onClick={handleAddMedication}>Add Your First Medication</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medications.map((medication) => {
              const expiryStatus = getExpiryStatus(medication.expiryDate);
              const expiryClass = 
                expiryStatus?.status === 'expired' ? "border-red-200 shadow-sm" : 
                expiryStatus?.status === 'expiring-soon' ? "border-amber-200 shadow-sm" : "";
              
              const statusClass = 
                medication.status === 'missed' ? "border-red-200 shadow-sm" : 
                medication.status === 'upcoming' ? "border-amber-200 shadow-sm" : "";
              
              return (
                <Card key={medication.id} className={`${expiryClass} ${statusClass}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-medical-blue" />
                      <CardTitle className="text-lg">{medication.name}</CardTitle>
                      {medication.dispenserConnected && (
                        <Badge variant="outline" className="ml-auto">Dispenser Connected</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{medication.purpose}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Dosage:</span>
                        <span>{medication.dosage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Frequency:</span>
                        <span>{medication.frequency}</span>
                      </div>
                      {medication.instructions && (
                        <div className="flex justify-between">
                          <span className="font-medium">Instructions:</span>
                          <span className="text-right max-w-[60%]">{medication.instructions}</span>
                        </div>
                      )}
                      
                      {medication.expiryDate && (
                        <div className="flex justify-between">
                          <span className="font-medium">Expires:</span>
                          <span className={
                            expiryStatus?.status === 'expired' ? "text-red-600 font-medium" : 
                            expiryStatus?.status === 'expiring-soon' ? "text-amber-600" : ""
                          }>{medication.expiryDate}</span>
                        </div>
                      )}
                      
                      {medication.dispenserConnected && (
                        <>
                          <Separator className="my-1" />
                          <div className="flex justify-between">
                            <span className="font-medium">Last dispensed:</span>
                            <span>{medication.lastDispensed || "Not yet dispensed"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Next scheduled:</span>
                            <span>{medication.nextDispense || "Not scheduled"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Status:</span>
                            <Badge variant={
                              medication.status === 'taken' ? "default" : 
                              medication.status === 'upcoming' ? "outline" : "destructive"
                            }>
                              {medication.status === 'taken' && <Check className="h-3 w-3 mr-1" />}
                              {medication.status === 'upcoming' && <Clock className="h-3 w-3 mr-1" />}
                              {medication.status === 'missed' && <Bell className="h-3 w-3 mr-1" />}
                              {medication.status ? medication.status.charAt(0).toUpperCase() + medication.status.slice(1) : 'N/A'}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Guardian alerts:</span>
                            <Switch
                              checked={!!medication.guardianAlert}
                              onCheckedChange={() => handleToggleGuardianAlert(medication.id)}
                              disabled={!medication.dispenserConnected}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    
                    {medication.refillDate && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-md mb-3">
                        <AlertCircle className="h-4 w-4" />
                        <span>Refill by: {medication.refillDate}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleRequestRefill(medication.id)}
                      >
                        Request Refill
                      </Button>
                      
                      {medication.dispenserConnected && (
                        <Button 
                          className="w-full"
                          onClick={() => handleManualDispense(medication.id)}
                          disabled={medication.status === 'taken'}
                        >
                          Dispense Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Medication Precautions</CardTitle>
            <CardDescription>Important safety information about your medications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Lisinopril (Blood Pressure)</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Monitor your blood pressure regularly</li>
                <li>Avoid high-potassium foods (bananas, potatoes, oranges)</li>
                <li>Stay hydrated but consult your doctor about fluid intake limits</li>
                <li>Avoid salt substitutes containing potassium</li>
                <li>Take medication at the same time each day</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Metformin (Diabetes Management)</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Take with meals to reduce stomach upset</li>
                <li>Monitor blood sugar levels as directed</li>
                <li>Maintain consistent carbohydrate intake across meals</li>
                <li>Limit alcohol consumption</li>
                <li>Be alert for signs of low blood sugar (hypoglycemia)</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Atorvastatin (Cholesterol)</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Take in the evening or at bedtime for best effectiveness</li>
                <li>Avoid grapefruit juice while taking this medication</li>
                <li>Report any unexplained muscle pain to your doctor</li>
                <li>Follow a heart-healthy diet low in saturated fats</li>
                <li>Complete regular blood tests to monitor liver function</li>
              </ul>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important Note</AlertTitle>
              <AlertDescription>
                Never adjust dosages or stop taking medications without consulting your healthcare provider. Always report side effects promptly.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}


import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Activity, 
  Plus, 
  Loader2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Search,
  MapPin,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

// Enhanced symptoms database with more specific responses and precautions
const symptomsDatabase = {
  "headache": {
    analysis: "Based on your description of headaches, this could be related to tension, migraine, or cluster headaches. Contributing factors may include stress, dehydration, eye strain, or sinus pressure.",
    treatment: "Consider over-the-counter pain relief, adequate hydration, and rest in a quiet, dark room.",
    precautions: [
      "Maintain a regular sleep schedule",
      "Stay hydrated throughout the day",
      "Practice stress management techniques like meditation",
      "Limit screen time and take frequent breaks",
      "Avoid triggers like certain foods or strong scents"
    ],
    whenToSeeDoctor: "If symptoms persist beyond a week or include vision changes, fever, or neck stiffness, consult a healthcare provider."
  },
  
  "stomachache": {
    analysis: "Your stomach pain may indicate several possible conditions including indigestion, gastritis, food intolerance, or viral gastroenteritis.",
    treatment: "Rest your stomach by eating bland foods, stay hydrated, and consider over-the-counter antacids.",
    precautions: [
      "Eat smaller, more frequent meals",
      "Avoid spicy, fatty, or acidic foods",
      "Drink clear fluids to prevent dehydration",
      "Avoid alcohol and caffeine",
      "Don't take NSAIDs on an empty stomach"
    ],
    whenToSeeDoctor: "If pain is severe, lasts more than a few days, or is accompanied by persistent vomiting or fever, seek medical attention."
  },
  
  "back pain": {
    analysis: "Your back pain symptoms suggest potential muscle strain, poor posture, or disc issues.",
    treatment: "Try gentle stretching, over-the-counter pain relievers, and alternating ice and heat therapy.",
    precautions: [
      "Practice proper lifting techniques (bend at knees, not waist)",
      "Maintain good posture when sitting and standing",
      "Use ergonomic furniture and equipment",
      "Strengthen core muscles through gentle exercise",
      "Avoid prolonged inactivity"
    ],
    whenToSeeDoctor: "If pain radiates down your legs, causes numbness/tingling, or affects bladder/bowel function, consult a doctor immediately."
  },
  
  "cough": {
    analysis: "Your described cough may be caused by a viral infection, allergies, asthma, or environmental irritants.",
    treatment: "Stay hydrated, use honey for soothing (if over 1 year old), and consider over-the-counter suppressants for nighttime relief.",
    precautions: [
      "Cover mouth when coughing to prevent spreading infection",
      "Use a humidifier to keep air moist",
      "Avoid smoking or secondhand smoke",
      "Stay hydrated to thin mucus secretions",
      "Get adequate rest to support immune function"
    ],
    whenToSeeDoctor: "If the cough persists beyond 3 weeks, produces colored phlegm, or is accompanied by fever or breathing difficulty, seek medical evaluation."
  },
  
  "fever": {
    analysis: "Your fever may indicate your body is fighting an infection.",
    treatment: "Rest, stay hydrated, and take acetaminophen or ibuprofen to reduce discomfort.",
    precautions: [
      "Dress lightly and avoid excess blankets",
      "Stay hydrated with water and clear fluids",
      "Rest to conserve energy for recovery",
      "Monitor temperature regularly",
      "Use lukewarm (not cold) water for sponge baths if needed"
    ],
    whenToSeeDoctor: "See a doctor if your fever exceeds 103°F (39.4°C), lasts more than three days, or is accompanied by severe headache, rash, breathing difficulties, or confusion."
  },
  
  "fatigue": {
    analysis: "Your fatigue symptoms could stem from inadequate sleep, high stress, nutritional deficiencies, or underlying medical conditions like thyroid disorders or anemia.",
    treatment: "Focus on improving sleep hygiene, balanced nutrition, regular physical activity, and stress management techniques.",
    precautions: [
      "Maintain a consistent sleep schedule",
      "Balance activity with appropriate rest periods",
      "Eat a balanced diet rich in nutrients",
      "Stay hydrated and limit alcohol consumption",
      "Practice stress-reduction techniques like mindfulness"
    ],
    whenToSeeDoctor: "If fatigue is severe, sudden, or persists despite lifestyle changes, consult your healthcare provider."
  }
};

// Enhanced database of doctors with specialties and timings
const doctorsDatabase = [
  {
    id: "d1",
    name: "Dr. Sarah Johnson",
    specialty: "Family Medicine",
    location: "Downtown Medical Center",
    distance: 0.8,
    availability: "Today",
    timings: "9:00 AM - 5:00 PM",
    availableSlots: ["10:30 AM", "2:15 PM", "4:00 PM"],
    image: "/placeholder.svg",
    rating: 4.8,
    insuranceAccepted: ["BlueCross", "Aetna", "Medicare"]
  },
  {
    id: "d2",
    name: "Dr. Michael Chen",
    specialty: "Internal Medicine",
    location: "Westside Health Clinic",
    distance: 1.2,
    availability: "Tomorrow",
    timings: "8:00 AM - 4:00 PM",
    availableSlots: ["9:15 AM", "11:00 AM", "3:30 PM"],
    image: "/placeholder.svg",
    rating: 4.6,
    insuranceAccepted: ["UnitedHealth", "Cigna", "Medicare"]
  },
  {
    id: "d3",
    name: "Dr. Amelia Patel",
    specialty: "Pediatrics",
    location: "Children's Health Center",
    distance: 2.5,
    availability: "Today",
    timings: "10:00 AM - 6:00 PM",
    availableSlots: ["10:30 AM", "1:45 PM", "5:15 PM"],
    image: "/placeholder.svg",
    rating: 4.9,
    insuranceAccepted: ["Aetna", "Cigna", "Humana"]
  },
  {
    id: "d4",
    name: "Dr. David Nguyen",
    specialty: "Cardiology",
    location: "Heart & Vascular Institute",
    distance: 3.1,
    availability: "Next Week",
    timings: "9:00 AM - 5:00 PM",
    availableSlots: ["11:30 AM (Mon)", "2:00 PM (Tue)", "4:00 PM (Wed)"],
    image: "/placeholder.svg",
    rating: 4.7,
    insuranceAccepted: ["BlueCross", "UnitedHealth", "Medicare"]
  },
  {
    id: "d5",
    name: "Dr. Rebecca Wilson",
    specialty: "Dermatology",
    location: "Skin Care Clinic",
    distance: 1.5,
    availability: "Tomorrow",
    timings: "8:30 AM - 4:30 PM",
    availableSlots: ["9:00 AM", "1:30 PM", "3:45 PM"],
    image: "/placeholder.svg",
    rating: 4.5,
    insuranceAccepted: ["Aetna", "Medicare", "Humana"]
  },
  {
    id: "d6",
    name: "Dr. Robert Lee",
    specialty: "Neurology",
    location: "Neuroscience Center",
    distance: 4.2,
    availability: "Thursday",
    timings: "9:30 AM - 5:30 PM",
    availableSlots: ["10:00 AM", "12:30 PM", "4:45 PM"],
    image: "/placeholder.svg",
    rating: 4.9,
    insuranceAccepted: ["BlueCross", "UnitedHealth", "Cigna"]
  }
];

export default function HealthConcerns() {
  const [loading, setLoading] = useState(false);
  const [concern, setConcern] = useState("");
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDoctors, setShowDoctors] = useState(false);
  const [doctors, setDoctors] = useState<typeof doctorsDatabase>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmitConcern = () => {
    if (!concern) {
      toast({
        title: "Error",
        description: "Please enter your health concern.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Analyze the concern against our symptom database
    setTimeout(() => {
      // Check if any key words from the symptom database appear in the concern
      const lowerCaseConcern = concern.toLowerCase();
      let foundAnalysis = null;
      
      // Find matching symptoms in our database
      for (const symptom in symptomsDatabase) {
        if (lowerCaseConcern.includes(symptom)) {
          foundAnalysis = symptomsDatabase[symptom as keyof typeof symptomsDatabase];
          break;
        }
      }
      
      // Fallback to generic response if no match found
      if (!foundAnalysis) {
        foundAnalysis = {
          analysis: "Based on your description, we recommend consulting with a healthcare professional for a proper diagnosis. Your symptoms could be related to various conditions, and a doctor can provide appropriate guidance after examination.",
          precautions: [
            "Monitor your symptoms and document any changes",
            "Get adequate rest and stay hydrated",
            "Avoid self-medication without professional advice",
            "Consider consulting with a primary care physician"
          ],
          whenToSeeDoctor: "If symptoms are severe, persistent, or worsening, please seek medical attention promptly."
        };
      }
      
      setAnalysis(foundAnalysis);
      setLoading(false);
    }, 1500);
  };
  
  const handleFeedback = (positive: boolean) => {
    toast({
      title: positive ? "Thank you for your feedback" : "We'll improve our analysis",
      description: positive 
        ? "We're glad our analysis was helpful." 
        : "Thank you for helping us improve our AI system.",
    });
    setAnalysis(null);
    setConcern("");
  };

  const handleFindDoctors = () => {
    setLoading(true);
    // Simulate finding nearby doctors and sort by distance
    setTimeout(() => {
      const sortedDoctors = [...doctorsDatabase].sort((a, b) => a.distance - b.distance);
      setDoctors(sortedDoctors);
      setShowDoctors(true);
      setLoading(false);
    }, 1000);
  };

  // Filter doctors by specialty
  const filteredDoctors = selectedSpecialty
    ? doctors.filter(doc => doc.specialty === selectedSpecialty)
    : doctors;

  // Get unique specialties
  const specialties = Array.from(new Set(doctors.map(doc => doc.specialty)));

  const recentConcerns = [
    {
      id: "1",
      title: "Intermittent headaches",
      date: "3 days ago",
      status: "Active",
      description: "Headaches occurring every afternoon, mild to moderate pain"
    },
    {
      id: "2",
      title: "Lower back pain",
      date: "2 weeks ago",
      status: "Resolved",
      description: "Pain improved with daily stretching exercises and proper posture"
    },
    {
      id: "3",
      title: "Seasonal allergies",
      date: "1 month ago",
      status: "Managed",
      description: "Using antihistamine as needed, symptoms under control"
    }
  ];

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="h-8 w-8 text-medical-blue" />
              Health Concerns
            </h1>
            <p className="text-muted-foreground mt-1">
              Track health issues and get AI-powered analysis with precautions
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Describe Your Health Concern</CardTitle>
              <CardDescription>
                Provide detailed information about your symptoms for more accurate analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Describe your symptoms, when they started, their severity, and any factors that make them better or worse..." 
                className="min-h-[120px]"
                value={concern}
                onChange={(e) => setConcern(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button 
                onClick={handleSubmitConcern} 
                disabled={loading || !concern}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze with AI
                  </>
                )}
              </Button>
              <Button 
                onClick={handleFindDoctors}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Find Doctors Near Me
              </Button>
            </CardFooter>
          </Card>
          
          {analysis && (
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-primary animate-pulse-light" />
                  AI Health Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Analysis</h3>
                  <p className="text-sm">{analysis.analysis}</p>
                </div>
                
                {analysis.treatment && (
                  <div>
                    <h3 className="font-medium mb-2">Treatment Suggestions</h3>
                    <p className="text-sm">{analysis.treatment}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-medical-blue" /> Recommended Precautions
                  </h3>
                  <ul className="text-sm space-y-2">
                    {analysis.precautions.map((precaution: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <span>{precaution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-amber-50 p-3 rounded-md">
                  <h3 className="font-medium mb-1 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" /> When to See a Doctor
                  </h3>
                  <p className="text-sm text-amber-800">{analysis.whenToSeeDoctor}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">Was this analysis helpful?</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleFeedback(true)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" /> Yes
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleFeedback(false)}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" /> No
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}

          {showDoctors && (
            <Card>
              <CardHeader>
                <CardTitle>Doctors Near You</CardTitle>
                <CardDescription>
                  Closest healthcare providers sorted by distance
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    variant={selectedSpecialty === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSpecialty(null)}
                  >
                    All Specialties
                  </Button>
                  {specialties.map(specialty => (
                    <Button 
                      key={specialty}
                      variant={selectedSpecialty === specialty ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSpecialty(specialty)}
                    >
                      {specialty}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDoctors.length === 0 && (
                    <p className="text-center py-8 text-muted-foreground">
                      No doctors found with the selected criteria
                    </p>
                  )}
                  
                  {filteredDoctors.map((doctor) => (
                    <div key={doctor.id} className="flex flex-col md:flex-row md:items-start gap-4 p-4 rounded-lg border">
                      <div className="h-16 w-16 rounded-full overflow-hidden bg-muted flex-shrink-0 mx-auto md:mx-0">
                        <img src={doctor.image} alt={doctor.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <h3 className="font-medium text-center md:text-left">{doctor.name}</h3>
                            <p className="text-sm text-medical-blue text-center md:text-left">{doctor.specialty}</p>
                          </div>
                          <Badge variant="outline" className="self-center md:self-start">
                            {doctor.distance} mile{doctor.distance !== 1 ? 's' : ''} away
                          </Badge>
                        </div>
                        
                        <div className="grid gap-3 mt-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Location:</span>
                              <span className="ml-2">{doctor.location}</span>
                            </div>
                            <div>
                              <span className="font-medium">Hours:</span>
                              <span className="ml-2">{doctor.timings}</span>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                              <span className="font-medium">Available slots:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {doctor.availableSlots.map((slot, index) => (
                                  <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                                    {slot}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <Button className="mt-2">Book Appointment</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="w-full md:w-[350px] space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Health Concerns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentConcerns.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className={`h-4 w-4 ${item.status === 'Active' ? 'text-medical-red' : 'text-medical-green'}`} />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <Separator />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add New Concern
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Symptom Checker</CardTitle>
              <CardDescription>Search for common symptoms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Search symptoms..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="ghost" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {["Headache", "Fever", "Cough", "Fatigue", "Nausea", "Back pain", "Stomachache"].map((symptom) => (
                  <Button 
                    key={symptom} 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => setConcern(concern ? `${concern}, ${symptom.toLowerCase()}` : symptom)}
                  >
                    {symptom}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

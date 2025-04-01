
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
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

// Sample symptoms database for more specific responses
const symptomsDatabase = {
  "headache": "Based on your description of headaches, this could be related to tension, migraine, or cluster headaches. Contributing factors may include stress, dehydration, eye strain, or sinus pressure. Consider over-the-counter pain relief, adequate hydration, and rest in a quiet, dark room. If symptoms persist beyond a week or include vision changes, fever, or neck stiffness, consult a healthcare provider.",
  
  "stomachache": "Your stomach pain may indicate several possible conditions including indigestion, gastritis, food intolerance, or viral gastroenteritis. Rest your stomach by eating bland foods, stay hydrated, and consider over-the-counter antacids. If pain is severe, lasts more than a few days, or is accompanied by persistent vomiting or fever, seek medical attention.",
  
  "back pain": "Your back pain symptoms suggest potential muscle strain, poor posture, or disc issues. Try gentle stretching, over-the-counter pain relievers, and alternating ice and heat therapy. Maintain proper posture and consider ergonomic improvements to your workspace. If pain radiates down your legs, causes numbness/tingling, or affects bladder/bowel function, consult a doctor immediately.",
  
  "cough": "Your described cough may be caused by a viral infection, allergies, asthma, or environmental irritants. Stay hydrated, use honey for soothing (if over 1 year old), and consider over-the-counter suppressants for nighttime relief. If the cough persists beyond 3 weeks, produces colored phlegm, or is accompanied by fever or breathing difficulty, seek medical evaluation.",
  
  "fatigue": "Your fatigue symptoms could stem from inadequate sleep, high stress, nutritional deficiencies, or underlying medical conditions like thyroid disorders or anemia. Focus on improving sleep hygiene, balanced nutrition, regular physical activity, and stress management techniques. If fatigue is severe, sudden, or persists despite lifestyle changes, consult your healthcare provider.",
  
  "fever": "Your fever may indicate your body is fighting an infection. Rest, stay hydrated, and take acetaminophen or ibuprofen to reduce discomfort. See a doctor if your fever exceeds 103°F (39.4°C), lasts more than three days, or is accompanied by severe headache, rash, breathing difficulties, or confusion."
};

// Mock database of doctors
const doctorsDatabase = [
  {
    id: "d1",
    name: "Dr. Sarah Johnson",
    specialty: "Family Medicine",
    location: "Downtown Medical Center",
    distance: "0.8 miles",
    availability: "Today",
    image: "/placeholder.svg"
  },
  {
    id: "d2",
    name: "Dr. Michael Chen",
    specialty: "Internal Medicine",
    location: "Westside Health Clinic",
    distance: "1.2 miles",
    availability: "Tomorrow",
    image: "/placeholder.svg"
  },
  {
    id: "d3",
    name: "Dr. Amelia Patel",
    specialty: "Pediatrics",
    location: "Children's Health Center",
    distance: "2.5 miles",
    availability: "Wednesday",
    image: "/placeholder.svg"
  },
  {
    id: "d4",
    name: "Dr. David Nguyen",
    specialty: "Cardiology",
    location: "Heart & Vascular Institute",
    distance: "3.1 miles",
    availability: "Next Week",
    image: "/placeholder.svg"
  }
];

export default function HealthConcerns() {
  const [loading, setLoading] = useState(false);
  const [concern, setConcern] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDoctors, setShowDoctors] = useState(false);
  const [doctors, setDoctors] = useState<typeof doctorsDatabase>([]);
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
        foundAnalysis = "Based on your description, we recommend consulting with a healthcare professional for a proper diagnosis. Your symptoms could be related to various conditions, and a doctor can provide appropriate guidance after examination.";
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
    // Simulate finding nearby doctors
    setTimeout(() => {
      setDoctors(doctorsDatabase);
      setShowDoctors(true);
      setLoading(false);
    }, 1000);
  };

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
              Track health issues and get AI-powered analysis
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
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{analysis}</p>
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
                <CardTitle>Available Doctors Near You</CardTitle>
                <CardDescription>
                  Doctors who can help with your health concerns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className="flex items-start gap-4 p-3 rounded-lg border">
                      <div className="h-16 w-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        <img src={doctor.image} alt={doctor.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{doctor.name}</h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center text-xs">
                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                            {doctor.distance}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Available: {doctor.availability}
                          </div>
                        </div>
                      </div>
                      <Button size="sm">Book</Button>
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
                {["Headache", "Fever", "Cough", "Fatigue", "Nausea"].map((symptom) => (
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

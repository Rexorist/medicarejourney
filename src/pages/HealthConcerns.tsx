
import { useState, useEffect } from "react";
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
  Shield,
  Calendar,
  Clock,
  Phone,
  Star
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
  },
  
  "joint pain": {
    analysis: "Joint pain may be caused by arthritis, injury, overuse, or inflammatory conditions.",
    treatment: "Rest affected joints, apply ice/heat, and consider anti-inflammatory medications if approved by your doctor.",
    precautions: [
      "Maintain a healthy weight to reduce joint stress",
      "Use proper form during physical activities",
      "Incorporate low-impact exercises like swimming or cycling",
      "Consider supportive devices like braces when needed",
      "Avoid activities that worsen pain"
    ],
    whenToSeeDoctor: "If joint pain is accompanied by significant swelling, redness, warmth, or limited range of motion, seek medical attention."
  },
  
  "rash": {
    analysis: "Your skin rash could be due to allergies, irritants, infections, or underlying medical conditions.",
    treatment: "Keep the area clean, avoid irritants, and use over-the-counter hydrocortisone for itching if approved by your doctor.",
    precautions: [
      "Avoid scratching to prevent infection",
      "Use mild, fragrance-free soaps and detergents",
      "Wear loose, breathable clothing over affected areas",
      "Keep track of potential triggers",
      "Avoid very hot showers or baths"
    ],
    whenToSeeDoctor: "Seek medical attention if the rash spreads quickly, is accompanied by fever, forms blisters, or affects your face or genitals."
  },
  
  "dizziness": {
    analysis: "Dizziness can result from inner ear issues, low blood pressure, dehydration, medication side effects, or more serious conditions.",
    treatment: "Sit or lie down when feeling dizzy, stay hydrated, and move slowly when changing positions.",
    precautions: [
      "Avoid sudden head movements",
      "Rise slowly from sitting or lying positions",
      "Stay well-hydrated throughout the day",
      "Use assistive devices like handrails when needed",
      "Avoid driving or operating machinery when dizzy"
    ],
    whenToSeeDoctor: "Get immediate medical attention if dizziness is accompanied by chest pain, severe headache, vision changes, slurred speech, or loss of consciousness."
  },
  
  "shortness of breath": {
    analysis: "Difficulty breathing can be caused by asthma, allergies, anxiety, respiratory infections, heart problems, or lung conditions.",
    treatment: "Use prescribed inhalers if applicable, practice breathing techniques, and avoid triggers.",
    precautions: [
      "Avoid smoke and air pollution",
      "Use air purifiers in your home",
      "Practice breathing exercises regularly",
      "Monitor and record symptoms and triggers",
      "Maintain a healthy weight"
    ],
    whenToSeeDoctor: "Seek emergency care if shortness of breath is sudden and severe, occurs at rest, or is accompanied by chest pain, blue lips, or altered consciousness."
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
    insuranceAccepted: ["BlueCross", "Aetna", "Medicare"],
    phone: "(555) 123-4567"
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
    insuranceAccepted: ["UnitedHealth", "Cigna", "Medicare"],
    phone: "(555) 987-6543"
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
    insuranceAccepted: ["Aetna", "Cigna", "Humana"],
    phone: "(555) 456-7890"
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
    insuranceAccepted: ["BlueCross", "UnitedHealth", "Medicare"],
    phone: "(555) 234-5678"
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
    insuranceAccepted: ["Aetna", "Medicare", "Humana"],
    phone: "(555) 789-0123"
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
    insuranceAccepted: ["BlueCross", "UnitedHealth", "Cigna"],
    phone: "(555) 321-6547"
  },
  {
    id: "d7",
    name: "Dr. Emily Roberts",
    specialty: "Orthopedics",
    location: "Joint & Bone Medical Center",
    distance: 2.8,
    availability: "Today",
    timings: "8:00 AM - 4:00 PM",
    availableSlots: ["8:30 AM", "11:00 AM", "3:00 PM"],
    image: "/placeholder.svg",
    rating: 4.7,
    insuranceAccepted: ["Medicare", "BlueCross", "UnitedHealth"],
    phone: "(555) 432-1098"
  },
  {
    id: "d8",
    name: "Dr. James Taylor",
    specialty: "Gastroenterology",
    location: "Digestive Health Institute",
    distance: 3.4,
    availability: "Tomorrow",
    timings: "9:00 AM - 5:00 PM",
    availableSlots: ["10:15 AM", "1:30 PM", "4:00 PM"],
    image: "/placeholder.svg",
    rating: 4.8,
    insuranceAccepted: ["Aetna", "Cigna", "Medicare"],
    phone: "(555) 654-3210"
  },
  {
    id: "d9",
    name: "Dr. Sophia Kim",
    specialty: "Family Medicine",
    location: "Community Health Center",
    distance: 0.6,
    availability: "Today",
    timings: "8:30 AM - 5:30 PM",
    availableSlots: ["9:00 AM", "12:00 PM", "2:30 PM", "5:00 PM"],
    image: "/placeholder.svg",
    rating: 4.9,
    insuranceAccepted: ["Medicare", "Medicaid", "BlueCross"],
    phone: "(555) 876-5432"
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
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to analyze health concerns with improved matching
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
    
    // Smart analysis with improved keyword matching
    setTimeout(() => {
      const lowerCaseConcern = concern.toLowerCase();
      let foundAnalysis = null;
      let highestMatchScore = 0;
      let bestMatch = null;
      
      // Improved symptom matching algorithm
      for (const symptom in symptomsDatabase) {
        // Check if symptom appears in concern
        if (lowerCaseConcern.includes(symptom)) {
          const keywordScore = symptom.length / lowerCaseConcern.length; // Longer keyword matches are more significant
          const occurrenceScore = (lowerCaseConcern.match(new RegExp(symptom, 'g')) || []).length;
          const matchScore = keywordScore * occurrenceScore;
          
          if (matchScore > highestMatchScore) {
            highestMatchScore = matchScore;
            bestMatch = symptom;
          }
        }
      }
      
      // Use best matching symptom if found
      if (bestMatch) {
        foundAnalysis = symptomsDatabase[bestMatch as keyof typeof symptomsDatabase];
      }
      
      // Fallback to generic response if no match found
      if (!foundAnalysis) {
        const possibleSymptoms = Object.keys(symptomsDatabase).filter(symptom => 
          lowerCaseConcern.includes(symptom.substring(0, 4)) || 
          lowerCaseConcern.includes(symptom.substring(0, 3))
        );
        
        if (possibleSymptoms.length > 0) {
          // Use closest partial match
          foundAnalysis = symptomsDatabase[possibleSymptoms[0] as keyof typeof symptomsDatabase];
        } else {
          // Generic response as last resort
          foundAnalysis = {
            analysis: "Based on your description, we recommend consulting with a healthcare professional for a proper diagnosis. Your symptoms could be related to various conditions, and a doctor can provide appropriate guidance after examination.",
            treatment: "It's best to consult with a healthcare professional before attempting any self-treatment.",
            precautions: [
              "Monitor your symptoms and document any changes",
              "Get adequate rest and stay hydrated",
              "Avoid self-medication without professional advice",
              "Consider consulting with a primary care physician"
            ],
            whenToSeeDoctor: "If symptoms are severe, persistent, or worsening, please seek medical attention promptly."
          };
        }
      }
      
      // Recommend specialty based on symptoms
      const specialtyRecommendations = {
        "headache": "Neurology",
        "stomachache": "Gastroenterology",
        "back pain": "Orthopedics",
        "cough": "Internal Medicine",
        "fever": "Family Medicine",
        "fatigue": "Internal Medicine",
        "joint pain": "Orthopedics",
        "rash": "Dermatology",
        "dizziness": "Neurology",
        "shortness of breath": "Pulmonology"
      };
      
      const recommendedSpecialty = bestMatch 
        ? specialtyRecommendations[bestMatch as keyof typeof specialtyRecommendations] || "Family Medicine"
        : "Family Medicine";
      
      foundAnalysis.recommendedSpecialty = recommendedSpecialty;
      
      setAnalysis(foundAnalysis);
      setLoading(false);
      
      // Auto-load doctors based on recommended specialty
      handleFindDoctors(recommendedSpecialty);
    }, 1500);
  };
  
  const handleFeedback = (positive: boolean) => {
    toast({
      title: positive ? "Thank you for your feedback" : "We'll improve our analysis",
      description: positive 
        ? "We're glad our analysis was helpful." 
        : "Thank you for helping us improve our AI system.",
    });
    
    // Save feedback to improve future analysis
    console.log("Feedback recorded:", { 
      concern, 
      positive, 
      timestamp: new Date().toISOString() 
    });
    
    // Clear state if negative feedback
    if (!positive) {
      setAnalysis(null);
      setConcern("");
    }
  };

  const handleFindDoctors = (specialty: string | null = null) => {
    setLoading(true);
    
    // Simulate finding nearby doctors with improved sorting algorithm
    setTimeout(() => {
      // First sort by distance (primary sort)
      const sortedByDistance = [...doctorsDatabase].sort((a, b) => a.distance - b.distance);
      
      // Apply additional smart sorting criteria based on specialty and availability
      const smartSorted = sortedByDistance.sort((a, b) => {
        // Prioritize doctors of recommended specialty if provided
        if (specialty) {
          if (a.specialty === specialty && b.specialty !== specialty) return -1;
          if (a.specialty !== specialty && b.specialty === specialty) return 1;
        }
        
        // Prioritize doctors available today or tomorrow
        const availabilityScore = (doc: typeof a) => {
          if (doc.availability === "Today") return 3;
          if (doc.availability === "Tomorrow") return 2;
          return 1;
        };
        
        const aScore = availabilityScore(a);
        const bScore = availabilityScore(b);
        
        if (aScore !== bScore) return bScore - aScore;
        
        // If all else is equal, sort by distance
        return a.distance - b.distance;
      });
      
      setDoctors(smartSorted);
      setShowDoctors(true);
      
      // Set specialty filter if provided
      if (specialty) {
        setSelectedSpecialty(specialty);
      }
      
      setLoading(false);
    }, 1000);
  };

  // Apply multiple filters together
  const applyFilters = () => {
    // Filter doctors by specialty
    let filtered = selectedSpecialty
      ? doctors.filter(doc => doc.specialty === selectedSpecialty)
      : doctors;
    
    // Filter by availability
    if (availabilityFilter) {
      filtered = filtered.filter(doc => {
        if (availabilityFilter === "today") return doc.availability === "Today";
        if (availabilityFilter === "tomorrow") return doc.availability === "Tomorrow";
        if (availabilityFilter === "this-week") return ["Today", "Tomorrow", "Thursday", "Friday"].includes(doc.availability);
        return true;
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(lowercaseSearch) ||
        doc.specialty.toLowerCase().includes(lowercaseSearch) ||
        doc.location.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    return filtered;
  };

  // Apply all filters
  const filteredDoctors = applyFilters();

  // Get unique specialties for filter options
  const specialties = Array.from(new Set(doctors.map(doc => doc.specialty)));

  // Handle scheduling an appointment
  const handleScheduleAppointment = (doctor: typeof doctorsDatabase[0], slot: string) => {
    toast({
      title: "Appointment Scheduled",
      description: `Your appointment with ${doctor.name} at ${slot} has been scheduled. We'll send you a confirmation email shortly.`,
    });
  };

  // Sample recent concerns
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

  // Add quick symptom selection capability
  const commonSymptoms = [
    "Headache", "Fever", "Cough", "Fatigue", "Nausea", 
    "Back pain", "Stomachache", "Joint pain", "Rash", "Dizziness",
    "Shortness of breath"
  ];

  const handleQuickSymptomSelect = (symptom: string) => {
    setConcern(symptom.toLowerCase());
  };

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
          
          <Card className="backdrop-blur-sm bg-background/70 shadow-lg border border-opacity-40 hover:border-primary/40 transition-all duration-300">
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
              <div className="flex flex-wrap gap-2 mt-4">
                {commonSymptoms.map((symptom) => (
                  <Badge 
                    key={symptom} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleQuickSymptomSelect(symptom)}
                  >
                    {symptom}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button 
                onClick={handleSubmitConcern} 
                disabled={loading || !concern}
                className="w-full sm:w-auto"
                variant="gradient"
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
                onClick={() => handleFindDoctors()}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Find Doctors Near Me
              </Button>
            </CardFooter>
          </Card>
          
          {analysis && (
            <Card className="border-primary/30 backdrop-blur-sm bg-background/80 shadow-lg">
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
                
                {analysis.recommendedSpecialty && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <h3 className="font-medium mb-1 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" /> Recommended Specialist
                    </h3>
                    <p className="text-sm text-blue-800">
                      Based on your symptoms, we recommend consulting with a <strong>{analysis.recommendedSpecialty}</strong> specialist.
                    </p>
                  </div>
                )}
                
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
            <Card className="backdrop-blur-sm bg-background/80 shadow-lg">
              <CardHeader>
                <CardTitle>Doctors Near You</CardTitle>
                <CardDescription>
                  {filteredDoctors.length} healthcare providers found based on your criteria
                </CardDescription>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
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
                <div className="flex gap-2 mt-3">
                  <Button 
                    variant={availabilityFilter === null ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setAvailabilityFilter(null)}
                  >
                    Any Time
                  </Button>
                  <Button 
                    variant={availabilityFilter === "today" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setAvailabilityFilter("today")}
                  >
                    Today
                  </Button>
                  <Button 
                    variant={availabilityFilter === "tomorrow" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setAvailabilityFilter("tomorrow")}
                  >
                    Tomorrow
                  </Button>
                  <Button 
                    variant={availabilityFilter === "this-week" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setAvailabilityFilter("this-week")}
                  >
                    This Week
                  </Button>
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
                    <div key={doctor.id} className="flex flex-col md:flex-row md:items-start gap-4 p-4 rounded-lg border bg-card/40 backdrop-blur-xs hover:shadow-md transition-all">
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
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                              <span>{doctor.location}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                              <span>{doctor.phone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                              <span>{doctor.timings}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                              <span className="text-green-600 font-medium">Next available: {doctor.availability}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Star className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                              <span>{doctor.rating.toFixed(1)} out of 5</span>
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
                          
                          <Button 
                            className="mt-2" 
                            onClick={() => handleScheduleAppointment(doctor, doctor.availableSlots[0])}
                            variant="gradient"
                          >
                            Book Appointment
                          </Button>
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
          <Card className="backdrop-blur-sm bg-background/70 shadow-md border border-opacity-40">
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
          
          <Card className="backdrop-blur-sm bg-background/70 shadow-md border border-opacity-40">
            <CardHeader>
              <CardTitle className="text-lg">Quick Symptom Search</CardTitle>
              <CardDescription>Search for health information</CardDescription>
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
              
              <div>
                <h3 className="text-sm font-medium mb-2">Popular searches</h3>
                <div className="flex flex-wrap gap-2">
                  {["Headache", "Fever", "Cough", "Back pain", "Allergies", "Blood pressure"].map((term) => (
                    <Button 
                      key={term} 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => setSearchTerm(term)}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-background/70 shadow-md border border-opacity-40">
            <CardHeader>
              <CardTitle className="text-lg">Health Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Preventive Care</h3>
                <p className="text-xs text-muted-foreground">
                  Regular check-ups can help detect potential health issues before they become serious. Schedule your annual exam today.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Mental Wellness</h3>
                <p className="text-xs text-muted-foreground">
                  Taking time for self-care activities like meditation, reading, or walking can improve your mental well-being.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Nutrition</h3>
                <p className="text-xs text-muted-foreground">
                  Eating a balanced diet rich in fruits, vegetables, and whole grains provides essential nutrients for optimal health.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

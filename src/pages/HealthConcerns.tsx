import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Activity } from "lucide-react";
import { SymptomAnalyzerSection } from "@/components/health-concerns/SymptomAnalyzerSection";
import { DoctorFinderSection } from "@/components/health-concerns/DoctorFinderSection";
import { RecentConcernsSection } from "@/components/health-concerns/RecentConcernsSection";

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
  const [showDoctors, setShowDoctors] = useState(false);
  const [doctors, setDoctors] = useState<typeof doctorsDatabase>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAnalysis, setFilteredAnalysis] = useState<any>(null);

  // Filtering logic
  const applyFilters = () => {
    let filtered = selectedSpecialty
      ? doctors.filter(doc => doc.specialty === selectedSpecialty)
      : doctors;
    if (availabilityFilter) {
      filtered = filtered.filter(doc => {
        if (availabilityFilter === "today") return doc.availability === "Today";
        if (availabilityFilter === "tomorrow") return doc.availability === "Tomorrow";
        if (availabilityFilter === "this-week") return ["Today", "Tomorrow", "Thursday", "Friday"].includes(doc.availability);
        return true;
      });
    }
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

  // Doctor sorting logic
  const handleFindDoctors = (specialty: string | null = null) => {
    const sortedByDistance = [...doctorsDatabase].sort((a, b) => a.distance - b.distance);
    const smartSorted = sortedByDistance.sort((a, b) => {
      if (specialty) {
        if (a.specialty === specialty && b.specialty !== specialty) return -1;
        if (a.specialty !== specialty && b.specialty === specialty) return 1;
      }
      const availabilityScore = (doc: typeof a) => {
        if (doc.availability === "Today") return 3;
        if (doc.availability === "Tomorrow") return 2;
        return 1;
      };
      const aScore = availabilityScore(a);
      const bScore = availabilityScore(b);
      if (aScore !== bScore) return bScore - aScore;
      return a.distance - b.distance;
    });
    setDoctors(smartSorted);
    setShowDoctors(true);
    if (specialty) setSelectedSpecialty(specialty);
  };

  const filteredDoctors = applyFilters();

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
          <SymptomAnalyzerSection
            symptomsDatabase={symptomsDatabase}
            onAnalysis={setFilteredAnalysis}
            onRecommendDoctors={(specialty) => handleFindDoctors(specialty)}
          />
          <DoctorFinderSection
            doctorsDatabase={doctorsDatabase}
            specialtyFilter={selectedSpecialty}
            setSpecialtyFilter={setSelectedSpecialty}
            availabilityFilter={availabilityFilter}
            setAvailabilityFilter={setAvailabilityFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            doctors={doctors}
            setDoctors={setDoctors}
            showDoctors={showDoctors}
            setShowDoctors={setShowDoctors}
            filteredDoctors={filteredDoctors}
            handleFindDoctors={handleFindDoctors}
          />
          <RecentConcernsSection recentConcerns={recentConcerns} />
        </div>
      </div>
    </AppLayout>
  );
}

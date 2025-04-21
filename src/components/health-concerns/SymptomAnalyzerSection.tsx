
import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Stethoscope, Shield, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SymptomAnalyzerSectionProps {
  symptomsDatabase: any;
  onAnalysis: (analysis: any) => void;
  onRecommendDoctors: (specialty: string) => void;
}

const commonSymptoms = [
  "Headache", "Fever", "Cough", "Fatigue", "Nausea", 
  "Back pain", "Stomachache", "Joint pain", "Rash", "Dizziness",
  "Shortness of breath"
];

export function SymptomAnalyzerSection({ symptomsDatabase, onAnalysis, onRecommendDoctors }: SymptomAnalyzerSectionProps) {
  const [concern, setConcern] = useState("");
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  // For demo: specialty map
  const specialtyRecommendations: Record<string, string> = {
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

  const handleQuickSymptomSelect = (symptom: string) => {
    if (selectedSymptoms.includes(symptom.toLowerCase())) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom.toLowerCase()));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom.toLowerCase()]);
    }
  };

  const handleClearSelections = () => {
    setSelectedSymptoms([]);
    setConcern("");
  };

  // Core analysis logic (same as before)
  const handleSubmitConcern = () => {
    if (!concern && selectedSymptoms.length === 0) {
      toast({
        title: "Error",
        description: "Please enter your health concern or select symptoms.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const lowerCaseConcern = concern.toLowerCase();
      const matchedSymptoms: Record<string, { score: number, data: any }> = {};

      selectedSymptoms.forEach(symptom => {
        const key = symptom.toLowerCase();
        if (symptomsDatabase[key]) {
          matchedSymptoms[key] = { score: 1, data: symptomsDatabase[key] };
        }
      });

      for (const symptom in symptomsDatabase) {
        if (lowerCaseConcern.includes(symptom)) {
          const keywordScore = symptom.length / lowerCaseConcern.length;
          const occurrenceScore = (lowerCaseConcern.match(new RegExp(symptom, 'g')) || []).length;
          const matchScore = keywordScore * occurrenceScore;
          if (!matchedSymptoms[symptom]) {
            matchedSymptoms[symptom] = { score: matchScore, data: symptomsDatabase[symptom] };
          }
        }
      }

      if (Object.keys(matchedSymptoms).length === 0 && concern) {
        const possibleSymptoms = Object.keys(symptomsDatabase).filter(symptom =>
          lowerCaseConcern.includes(symptom.substring(0, 4)) || 
          lowerCaseConcern.includes(symptom.substring(0, 3))
        );
        possibleSymptoms.forEach(symptom => {
          matchedSymptoms[symptom] = { score: 0.5, data: symptomsDatabase[symptom] };
        });
      }

      let out;
      if (Object.keys(matchedSymptoms).length === 0) {
        out = {
          detectedSymptoms: [],
          analysis: "Based on your description, we recommend consulting with a healthcare professional for a proper diagnosis. Your symptoms could be related to various conditions, and a doctor can provide appropriate guidance after examination.",
          treatment: "It's best to consult with a healthcare professional before attempting any self-treatment.",
          precautions: [
            "Monitor your symptoms and document any changes",
            "Get adequate rest and stay hydrated",
            "Avoid self-medication without professional advice",
            "Consider consulting with a primary care physician"
          ],
          whenToSeeDoctor: "If symptoms are severe, persistent, or worsening, please seek medical attention promptly.",
          recommendedSpecialty: "Family Medicine"
        };
      } else {
        const sortedSymptoms = Object.entries(matchedSymptoms)
          .sort((a, b) => b[1].score - a[1].score);

        const primarySymptom = sortedSymptoms[0][0];
        const primaryData = sortedSymptoms[0][1].data;

        if (sortedSymptoms.length > 1) {
          const detectedSymptoms = sortedSymptoms.map(s => s[0]);
          const allPrecautions = new Set<string>();
          sortedSymptoms.forEach(([_, { data }]) => {
            data.precautions.forEach((p: string) => allPrecautions.add(p));
          });
          const recommendedSpecialty = specialtyRecommendations[primarySymptom] || "Family Medicine";
          out = {
            detectedSymptoms,
            analysis: `Based on your description, we've identified multiple symptoms including ${detectedSymptoms.join(', ')}. ${primaryData.analysis}`,
            treatment: `For your combination of symptoms: ${primaryData.treatment} However, for multiple symptoms, it's best to consult with a healthcare professional for personalized advice.`,
            precautions: Array.from(allPrecautions),
            whenToSeeDoctor: "With multiple symptoms, we recommend consulting a healthcare provider soon for proper evaluation.",
            recommendedSpecialty
          };
        } else {
          const recommendedSpecialty = specialtyRecommendations[primarySymptom] || "Family Medicine";
          out = {
            detectedSymptoms: [primarySymptom],
            analysis: primaryData.analysis,
            treatment: primaryData.treatment,
            precautions: primaryData.precautions,
            whenToSeeDoctor: primaryData.whenToSeeDoctor,
            recommendedSpecialty
          };
        }
      }
      setAnalysis(out);
      setLoading(false);
      onAnalysis?.(out);

      // Auto-load doctors based on recommended specialty
      onRecommendDoctors?.(out.recommendedSpecialty);
    }, 1500);
  };

  const handleFeedback = (positive: boolean) => {
    toast({
      title: positive ? "Thank you for your feedback" : "We'll improve our analysis",
      description: positive 
        ? "We're glad our analysis was helpful." 
        : "Thank you for helping us improve our AI system.",
    });
    if (!positive) {
      setAnalysis(null);
      setConcern("");
      setSelectedSymptoms([]);
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-background/70 shadow-lg border border-opacity-40 hover:border-primary/40 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-medical-blue" />
          Describe Your Health Concern
        </CardTitle>
        <CardDescription>
          Provide detailed information about your symptoms for more accurate analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe your symptoms, when they started, their severity, and any factors that make them better or worse..." 
          className="min-h-[120px]"
          value={concern}
          onChange={(e) => setConcern(e.target.value)}
        />
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Select Symptoms</h3>
            {selectedSymptoms.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleClearSelections}
              >
                Clear all
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map((symptom) => (
              <Badge 
                key={symptom} 
                variant={selectedSymptoms.includes(symptom.toLowerCase()) ? "default" : "outline"} 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleQuickSymptomSelect(symptom)}
              >
                {symptom}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <Button
          onClick={handleSubmitConcern}
          disabled={loading || (!concern && selectedSymptoms.length === 0)}
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
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze with AI
            </>
          )}
        </Button>
      </CardFooter>

      {analysis && (
        <Card className="border-primary/30 backdrop-blur-sm bg-background/80 shadow-lg mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-primary animate-pulse-light" />
              AI Health Analysis
            </CardTitle>
            {analysis.detectedSymptoms && analysis.detectedSymptoms.length > 0 && (
              <CardDescription>
                Detected symptoms: {analysis.detectedSymptoms.map((s: string) => 
                  s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
              </CardDescription>
            )}
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
                {analysis.precautions.map((precaution: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      {i + 1}
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
    </Card>
  );
}

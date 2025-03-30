
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
  ThumbsDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function HealthConcerns() {
  const [loading, setLoading] = useState(false);
  const [concern, setConcern] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
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
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis(
        "Based on your description of intermittent headaches, this could be related to several factors including stress, dehydration, or eye strain. The pattern suggests tension headaches rather than migraines. Recommendation: Monitor water intake, reduce screen time, and consider over-the-counter pain relief. If headaches persist beyond 7 days or increase in severity, consult with a healthcare provider."
      );
      setLoading(false);
    }, 2000);
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
            <CardFooter>
              <Button 
                onClick={handleSubmitConcern} 
                disabled={loading || !concern}
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
                <Input placeholder="Search symptoms..." />
                <Button variant="ghost" size="icon">
                  <Activity className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {["Headache", "Fever", "Cough", "Fatigue", "Nausea"].map((symptom) => (
                  <Button key={symptom} variant="outline" size="sm" className="text-xs">
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

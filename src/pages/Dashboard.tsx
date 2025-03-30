
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Activity, 
  Calendar, 
  Heart, 
  Pill, 
  ArrowUp, 
  ArrowDown,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Welcome, John</h1>
        <div className="health-stat health-stat-good">
          <CheckCircle2 size={16} />
          <span>Health status: Good</span>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Health concerns card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Health Concerns</CardTitle>
            <Activity className="h-5 w-5 text-medical-blue" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active concerns</span>
                <span className="font-bold">1</span>
              </div>
              
              <div className="flex items-center gap-2 rounded-md border p-3">
                <AlertCircle className="h-5 w-5 text-medical-red" />
                <div>
                  <p className="text-sm font-medium">Intermittent headaches</p>
                  <p className="text-xs text-muted-foreground">Started: 3 days ago</p>
                </div>
              </div>
              
              <Link to="/health-concerns">
                <Button variant="link" className="w-full p-0 mt-2">
                  View all concerns
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Medical history card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Recent Readings</CardTitle>
            <Heart className="h-5 w-5 text-medical-red" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Blood Pressure</p>
                  <div className="flex items-center gap-1 text-sm font-medium text-medical-green">
                    <ArrowDown className="h-4 w-4" />
                    <span>120/80</span>
                  </div>
                </div>
                <Progress value={60} className="h-2 mt-1" />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Blood Sugar</p>
                  <div className="flex items-center gap-1 text-sm font-medium text-yellow-500">
                    <ArrowUp className="h-4 w-4" />
                    <span>110 mg/dL</span>
                  </div>
                </div>
                <Progress value={75} className="h-2 mt-1" />
              </div>
              
              <Link to="/medical-history">
                <Button variant="link" className="w-full p-0 mt-2">
                  View medical history
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Medications card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Medications</CardTitle>
            <Pill className="h-5 w-5 text-medical-blue" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Today's medications</span>
                <span className="font-bold">2 of 3 taken</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-medical-green" />
                    <p className="text-sm">Vitamin D</p>
                  </div>
                  <span className="text-xs text-muted-foreground">8:00 AM</span>
                </div>
                
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-medical-green" />
                    <p className="text-sm">Multivitamin</p>
                  </div>
                  <span className="text-xs text-muted-foreground">8:00 AM</span>
                </div>
                
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <p className="text-sm">Omega-3</p>
                  </div>
                  <span className="text-xs text-muted-foreground">9:00 PM</span>
                </div>
              </div>
              
              <Link to="/medications">
                <Button variant="link" className="w-full p-0 mt-2">
                  View all medications
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-5 w-5 text-medical-blue" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-md border p-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Dr. Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">General Checkup • Tomorrow, 10:00 AM</p>
                </div>
              </div>
              
              <Link to="/consultations">
                <Button variant="link" className="w-full p-0 mt-2">
                  Schedule appointment
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Family health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Family Health</CardTitle>
            <Users className="h-5 w-5 text-medical-blue" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Family members</span>
                <span className="font-bold">3</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">JD</div>
                  <div className="h-8 w-8 rounded-full bg-medical-red text-white flex items-center justify-center text-xs font-bold">SD</div>
                  <div className="h-8 w-8 rounded-full bg-medical-green text-white flex items-center justify-center text-xs font-bold">LD</div>
                </div>
                <span className="text-sm text-muted-foreground">You, Sarah & Lisa</span>
              </div>
              
              <Link to="/family-health">
                <Button variant="link" className="w-full p-0 mt-2">
                  Manage family profiles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* AI Analysis */}
        <Card className="border-2 border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">AI Assistant</CardTitle>
            <div className="h-5 w-5 rounded-full bg-primary animate-pulse-light" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Use our AI to analyze your health concerns or check symptoms
            </p>
            
            <div className="space-y-3">
              <Link to="/health-concerns">
                <Button variant="default" className="w-full">
                  Analyze Health Concerns
                </Button>
              </Link>
              
              <Link to="/health-concerns">
                <Button variant="outline" className="w-full">
                  Check Symptoms
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

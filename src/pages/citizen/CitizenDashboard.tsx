import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Phone, Users, Shield, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Mock data
  const nearestShelters = [
    { id: 1, name: "Community Center Shelter", distance: "0.5 km", status: "available", capacity: "50/100" },
    { id: 2, name: "School Gymnasium", distance: "1.2 km", status: "limited", capacity: "80/90" },
    { id: 3, name: "Church Emergency Center", distance: "2.1 km", status: "full", capacity: "75/75" }
  ];

  const activeAlert = {
    title: "Flood Warning",
    message: "Heavy rainfall expected. Avoid low-lying areas.",
    time: "2 hours ago"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-safe text-safe-foreground';
      case 'limited': return 'bg-warning text-warning-foreground';
      case 'full': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6" />
            <div>
              <h1 className="font-semibold">SARVA</h1>
              <p className="text-xs opacity-90">Welcome, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/citizen/alerts')}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Emergency Alert Banner */}
        {activeAlert && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-warning">{activeAlert.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{activeAlert.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{activeAlert.time}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Help Request */}
        <Card className="border-emergency shadow-lg">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-emergency mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Need Emergency Help?</h2>
            <p className="text-muted-foreground mb-4">Get immediate assistance from rescue teams</p>
            <Button 
              onClick={() => navigate('/citizen/help-request')}
              className="w-full bg-emergency hover:bg-emergency/90 text-emergency-foreground"
              size="lg"
            >
              Send Help Request
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => navigate('/citizen/shelters')}
          >
            <MapPin className="h-6 w-6" />
            <span className="text-sm">Find Shelters</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => navigate('/citizen/alerts')}
          >
            <Bell className="h-6 w-6" />
            <span className="text-sm">View Alerts</span>
          </Button>
        </div>

        {/* Nearest Shelters */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Nearest Shelters</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/citizen/shelters')}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {nearestShelters.map((shelter) => (
              <Card key={shelter.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{shelter.name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {shelter.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {shelter.capacity}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(shelter.status)}>
                      {shelter.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Emergency Services
              </span>
              <Button variant="ghost" size="sm" className="text-emergency">
                911
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Local Emergency
              </span>
              <Button variant="ghost" size="sm" className="text-primary">
                (555) 123-4567
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CitizenDashboard;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MapPin, Phone, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const HelpRequestForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: '',
    emergencyType: '',
    details: '',
    urgency: 'medium'
  });

  const emergencyTypes = [
    { value: 'medical', label: 'Medical Emergency' },
    { value: 'fire', label: 'Fire' },
    { value: 'trapped', label: 'Trapped/Rescue Needed' },
    { value: 'food', label: 'Food/Water Needed' },
    { value: 'shelter', label: 'Shelter Needed' },
    { value: 'evacuation', label: 'Evacuation Assistance' },
    { value: 'other', label: 'Other Emergency' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'text-safe' },
    { value: 'medium', label: 'Medium', color: 'text-warning' },
    { value: 'high', label: 'High', color: 'text-emergency' },
    { value: 'critical', label: 'Critical', color: 'text-emergency font-bold' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.emergencyType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    toast({
      title: "Help Request Sent",
      description: "Emergency services have been notified. Help is on the way!",
      variant: "default"
    });

    // Navigate back to dashboard
    setTimeout(() => {
      navigate('/citizen/dashboard');
    }, 2000);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
          toast({
            title: "Location Detected",
            description: "Current location has been added to your request"
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter manually.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Please enter your location manually",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-emergency text-emergency-foreground p-4">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/citizen/dashboard')}
            className="text-emergency-foreground hover:bg-emergency-foreground/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <h1 className="font-semibold">Emergency Help Request</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-emergency">Send Help Request</CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Fill out this form to request emergency assistance
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Current Location
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter your location or coordinates"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      className="px-3"
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Emergency Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Emergency Type *</Label>
                  <Select
                    value={formData.emergencyType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, emergencyType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select emergency type" />
                    </SelectTrigger>
                    <SelectContent>
                      {emergencyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Urgency Level</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <span className={level.color}>{level.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Additional Details</Label>
                  <Textarea
                    id="details"
                    value={formData.details}
                    onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                    placeholder="Describe your situation in detail (injuries, number of people, accessibility, etc.)"
                    rows={4}
                  />
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  Your request will be immediately sent to emergency services and rescue teams in your area.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-emergency hover:bg-emergency/90 text-emergency-foreground"
                size="lg"
              >
                Send Emergency Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpRequestForm;
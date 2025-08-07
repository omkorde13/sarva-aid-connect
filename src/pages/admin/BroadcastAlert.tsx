import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Bell, AlertTriangle, MapPin, Upload, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BroadcastAlert = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [alertData, setAlertData] = useState({
    title: '',
    message: '',
    type: '',
    location: '',
    urgency: 'medium',
    targetAudience: 'all'
  });

  const alertTypes = [
    { value: 'warning', label: 'Warning' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'info', label: 'Information' },
    { value: 'evacuation', label: 'Evacuation Order' },
    { value: 'shelter', label: 'Shelter Update' },
    { value: 'weather', label: 'Weather Alert' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'critical', label: 'Critical' }
  ];

  const targetOptions = [
    { value: 'all', label: 'All Citizens' },
    { value: 'zone-a', label: 'Zone A (Downtown)' },
    { value: 'zone-b', label: 'Zone B (East Side)' },
    { value: 'zone-c', label: 'Zone C (West Side)' },
    { value: 'zone-d', label: 'Zone D (North Side)' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!alertData.title || !alertData.message || !alertData.type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    toast({
      title: "Alert Sent Successfully",
      description: `Alert broadcast to ${alertData.targetAudience === 'all' ? 'all citizens' : alertData.targetAudience}`,
    });

    // Reset form
    setAlertData({
      title: '',
      message: '',
      type: '',
      location: '',
      urgency: 'medium',
      targetAudience: 'all'
    });
  };

  const handlePreview = () => {
    toast({
      title: "Alert Preview",
      description: alertData.message || "No message entered yet",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/admin/dashboard')}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h1 className="font-semibold">Broadcast Emergency Alert</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alert Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Create New Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Alert Title *</Label>
                      <Input
                        id="title"
                        value={alertData.title}
                        onChange={(e) => setAlertData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter alert title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Alert Type *</Label>
                      <Select
                        value={alertData.type}
                        onValueChange={(value) => setAlertData(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select alert type" />
                        </SelectTrigger>
                        <SelectContent>
                          {alertTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Alert Message *</Label>
                    <Textarea
                      id="message"
                      value={alertData.message}
                      onChange={(e) => setAlertData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Enter the alert message that will be sent to citizens..."
                      rows={4}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Characters: {alertData.message.length}/500
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Urgency Level</Label>
                      <Select
                        value={alertData.urgency}
                        onValueChange={(value) => setAlertData(prev => ({ ...prev, urgency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {urgencyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Target Audience</Label>
                      <Select
                        value={alertData.targetAudience}
                        onValueChange={(value) => setAlertData(prev => ({ ...prev, targetAudience: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {targetOptions.map((target) => (
                            <SelectItem key={target.value} value={target.value}>
                              {target.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Specific Location (Optional)
                    </Label>
                    <Input
                      id="location"
                      value={alertData.location}
                      onChange={(e) => setAlertData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter specific location if applicable"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Attach Image (Optional)</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 5MB
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Choose File
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={handlePreview}>
                      Preview Alert
                    </Button>
                    <Button type="submit" className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Send Alert
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Alert Preview and Recent Alerts */}
          <div className="space-y-6">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Alert Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {alertData.title || alertData.message ? (
                  <div className="p-4 rounded-lg border bg-muted/20">
                    {alertData.title && (
                      <h3 className="font-semibold mb-2">{alertData.title}</h3>
                    )}
                    {alertData.message && (
                      <p className="text-sm mb-2">{alertData.message}</p>
                    )}
                    {alertData.location && (
                      <p className="text-xs text-muted-foreground">
                        📍 {alertData.location}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Enter alert details to see preview
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border">
                    <h4 className="font-medium text-sm">Flood Warning</h4>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <h4 className="font-medium text-sm">Shelter Opening</h4>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <h4 className="font-medium text-sm">Road Closure</h4>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-3">
                  View All Alerts
                </Button>
              </CardContent>
            </Card>

            {/* Alert Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Alert Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Alerts sent today</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active alerts</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Citizens reached</span>
                    <span className="font-medium">2,847</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastAlert;
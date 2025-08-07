import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bell, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';

const AlertsPage = () => {
  const navigate = useNavigate();
  
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Flood Warning',
      message: 'Heavy rainfall expected in the next 6 hours. Avoid low-lying areas and stay indoors.',
      location: 'Downtown Area',
      time: '2 hours ago',
      status: 'active',
      instructions: 'Move to higher ground if you are in a flood-prone area. Emergency shelters are open at Community Center and School Gymnasium.'
    },
    {
      id: 2,
      type: 'emergency',
      title: 'Evacuation Order',
      message: 'Immediate evacuation required for residents in Zone A due to gas leak.',
      location: 'Zone A - Industrial District',
      time: '4 hours ago',
      status: 'resolved',
      instructions: 'All residents have been safely evacuated. Area is now secure and residents may return.'
    },
    {
      id: 3,
      type: 'info',
      title: 'Shelter Update',
      message: 'Additional emergency shelter opened at Sports Complex. Food and medical supplies available.',
      location: 'Sports Complex - North Side',
      time: '6 hours ago',
      status: 'active',
      instructions: 'New shelter location: 321 Stadium Blvd. Free transportation available from Community Center.'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Power Outage',
      message: 'Widespread power outage affecting East Side. Restoration in progress.',
      location: 'East Side District',
      time: '8 hours ago',
      status: 'active',
      instructions: 'Use flashlights instead of candles. Charging stations available at emergency shelters.'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="h-5 w-5 text-emergency" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'info': return <Info className="h-5 w-5 text-primary" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getAlertColor = (type: string, status: string) => {
    if (status === 'resolved') return 'border-safe bg-safe/5';
    
    switch (type) {
      case 'emergency': return 'border-emergency bg-emergency/5';
      case 'warning': return 'border-warning bg-warning/5';
      case 'info': return 'border-primary bg-primary/5';
      default: return 'border-border';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-warning text-warning-foreground">Active</Badge>;
      case 'resolved':
        return <Badge className="bg-safe text-safe-foreground">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/citizen/dashboard')}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h1 className="font-semibold">Emergency Alerts</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Recent Alerts</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Auto-refresh every 30s</span>
          </div>
        </div>

        {alerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No emergency alerts at this time</p>
              <p className="text-sm text-muted-foreground mt-2">
                You'll be notified here when emergency services issue alerts
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className={getAlertColor(alert.type, alert.status)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <CardTitle className="text-base">{alert.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">{alert.location}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{alert.time}</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(alert.status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-foreground mb-4">{alert.message}</p>
                  
                  {alert.instructions && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm font-medium mb-1">Instructions:</p>
                      <p className="text-sm">{alert.instructions}</p>
                    </div>
                  )}

                  {alert.status === 'active' && (
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        Get Directions
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Share Alert
                      </Button>
                    </div>
                  )}

                  {alert.status === 'resolved' && (
                    <div className="flex items-center gap-2 mt-4 text-sm text-safe">
                      <CheckCircle className="h-4 w-4" />
                      <span>This alert has been resolved</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Emergency Contacts */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">Need Immediate Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12">
                <AlertTriangle className="h-4 w-4 mr-2 text-emergency" />
                Emergency: 911
              </Button>
              <Button 
                variant="outline" 
                className="h-12"
                onClick={() => navigate('/citizen/help-request')}
              >
                <Bell className="h-4 w-4 mr-2 text-primary" />
                Send Help Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlertsPage;
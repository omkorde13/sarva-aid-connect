import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, AlertTriangle, MapPin, Bell, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const stats = {
    activeRequests: 12,
    resolvedToday: 8,
    activeShelters: 4,
    totalCapacity: 415
  };

  const recentRequests = [
    { id: 1, type: 'Medical', location: 'Downtown', urgency: 'high', time: '2 min ago' },
    { id: 2, type: 'Trapped', location: 'East Side', urgency: 'critical', time: '5 min ago' },
    { id: 3, type: 'Food', location: 'West Side', urgency: 'medium', time: '15 min ago' }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-emergency text-emergency-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-safe text-safe-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6" />
            <div>
              <h1 className="font-semibold text-lg">SARVA Admin Portal</h1>
              <p className="text-xs opacity-90">Welcome, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Settings className="h-4 w-4" />
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

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeRequests}</div>
              <p className="text-xs text-muted-foreground">+2 from last hour</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              <Users className="h-4 w-4 text-safe" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolvedToday}</div>
              <p className="text-xs text-muted-foreground">+3 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Shelters</CardTitle>
              <MapPin className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeShelters}</div>
              <p className="text-xs text-muted-foreground">All operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCapacity}</div>
              <p className="text-xs text-muted-foreground">235 available</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            onClick={() => navigate('/admin/requests')}
            className="h-20 flex-col gap-2"
            variant="outline"
          >
            <AlertTriangle className="h-6 w-6" />
            <span>Manage Requests</span>
          </Button>

          <Button 
            onClick={() => navigate('/admin/broadcast')}
            className="h-20 flex-col gap-2"
            variant="outline"
          >
            <Bell className="h-6 w-6" />
            <span>Send Alert</span>
          </Button>

          <Button 
            onClick={() => navigate('/admin/shelters')}
            className="h-20 flex-col gap-2"
            variant="outline"
          >
            <MapPin className="h-6 w-6" />
            <span>Manage Shelters</span>
          </Button>

          <Button 
            className="h-20 flex-col gap-2"
            variant="outline"
          >
            <Users className="h-6 w-6" />
            <span>View Reports</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Help Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Help Requests
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/admin/requests')}
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{request.type}</span>
                        <Badge className={getUrgencyColor(request.urgency)}>
                          {request.urgency}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {request.location} • {request.time}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system health and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-safe rounded-full"></div>
                    Communication System
                  </span>
                  <Badge className="bg-safe text-safe-foreground">Online</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-safe rounded-full"></div>
                    GPS Tracking
                  </span>
                  <Badge className="bg-safe text-safe-foreground">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    Weather Service
                  </span>
                  <Badge className="bg-warning text-warning-foreground">Limited</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-safe rounded-full"></div>
                    Emergency Services
                  </span>
                  <Badge className="bg-safe text-safe-foreground">Connected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
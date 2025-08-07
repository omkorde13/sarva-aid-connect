import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, MapPin, Phone, Clock, User, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HelpRequest {
  id: number;
  name: string;
  phone: string;
  location: string;
  type: string;
  urgency: string;
  details: string;
  status: string;
  timeRequested: string;
  assignedTo?: string;
}

const HelpRequestManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');

  const [requests, setRequests] = useState<HelpRequest[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      location: "123 Main St, Downtown",
      type: "Medical",
      urgency: "critical",
      details: "Chest pain, difficulty breathing. Person conscious but needs immediate medical attention.",
      status: "pending",
      timeRequested: "2 min ago",
    },
    {
      id: 2,
      name: "Mike Chen",
      phone: "+1 (555) 234-5678",
      location: "456 Oak Ave, East Side",
      type: "Trapped",
      urgency: "high",
      details: "Trapped in basement due to debris. 2 people, both responsive.",
      status: "assigned",
      timeRequested: "15 min ago",
      assignedTo: "Rescue Team Alpha"
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      phone: "+1 (555) 345-6789",
      location: "789 Pine St, West Side",
      type: "Food",
      urgency: "medium",
      details: "Family of 4 needs food and clean water. Been without supplies for 2 days.",
      status: "in-progress",
      timeRequested: "1 hour ago",
      assignedTo: "Relief Team Beta"
    },
    {
      id: 4,
      name: "David Kim",
      phone: "+1 (555) 456-7890",
      location: "321 Elm St, North Side",
      type: "Evacuation",
      urgency: "high",
      details: "Elderly person needs evacuation assistance. Mobility issues.",
      status: "resolved",
      timeRequested: "3 hours ago",
      assignedTo: "Transport Team"
    }
  ]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-emergency text-emergency-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-safe text-safe-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'assigned': return 'bg-primary text-primary-foreground';
      case 'in-progress': return 'bg-accent text-accent-foreground';
      case 'resolved': return 'bg-safe text-safe-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleStatusChange = (requestId: number, newStatus: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    ));
    
    toast({
      title: "Status Updated",
      description: `Request #${requestId} marked as ${newStatus}`,
    });
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || request.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3 max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/admin/dashboard')}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <h1 className="font-semibold">Help Request Management</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, location, or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Filter by urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Request Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Interactive map showing all help requests</p>
                <p className="text-sm text-muted-foreground">Click on pins to view details</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Help Requests ({filteredRequests.length})
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                Refresh
              </Button>
            </div>
          </div>

          {filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">Request #{request.id}</h3>
                          <Badge className={getUrgencyColor(request.urgency)}>
                            {request.urgency}
                          </Badge>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <span className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {request.name}
                          </span>
                          <span className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {request.phone}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {request.location}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {request.timeRequested}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Emergency Type: {request.type}</p>
                      <p className="text-sm text-muted-foreground">{request.details}</p>
                      {request.assignedTo && (
                        <p className="text-sm mt-2">
                          <span className="font-medium">Assigned to:</span> {request.assignedTo}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:min-w-32">
                    {request.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleStatusChange(request.id, 'assigned')}
                        >
                          Assign Team
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                        >
                          View Details
                        </Button>
                      </>
                    )}
                    
                    {request.status === 'assigned' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleStatusChange(request.id, 'in-progress')}
                        >
                          Mark In Progress
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact Team
                        </Button>
                      </>
                    )}
                    
                    {request.status === 'in-progress' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleStatusChange(request.id, 'resolved')}
                          className="bg-safe hover:bg-safe/90"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Resolved
                        </Button>
                        <Button variant="outline" size="sm">
                          Update Status
                        </Button>
                      </>
                    )}
                    
                    {request.status === 'resolved' && (
                      <div className="text-center">
                        <CheckCircle className="h-6 w-6 text-safe mx-auto mb-1" />
                        <p className="text-sm text-safe font-medium">Completed</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredRequests.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No help requests found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpRequestManagement;
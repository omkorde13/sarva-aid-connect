import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, MapPin, Users, Plus, Edit, Phone, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Shelter {
  id: number;
  name: string;
  address: string;
  phone: string;
  capacity: number;
  currentOccupancy: number;
  status: 'open' | 'closed' | 'full' | 'limited';
  resources: string[];
  lastUpdated: string;
  manager: string;
}

const ShelterManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [shelters, setShelters] = useState<Shelter[]>([
    {
      id: 1,
      name: "Community Center Shelter",
      address: "123 Main St, Downtown",
      phone: "(555) 123-4567",
      capacity: 100,
      currentOccupancy: 50,
      status: 'open',
      resources: ['Food', 'Water', 'Medical', 'Blankets'],
      lastUpdated: '30 min ago',
      manager: 'John Smith'
    },
    {
      id: 2,
      name: "School Gymnasium",
      address: "456 Oak Ave, Westside",
      phone: "(555) 234-5678",
      capacity: 90,
      currentOccupancy: 80,
      status: 'limited',
      resources: ['Food', 'Water', 'Blankets'],
      lastUpdated: '1 hour ago',
      manager: 'Sarah Johnson'
    },
    {
      id: 3,
      name: "Church Emergency Center",
      address: "789 Pine St, Eastside",
      phone: "(555) 345-6789",
      capacity: 75,
      currentOccupancy: 75,
      status: 'full',
      resources: ['Food', 'Water', 'Medical', 'Clothing'],
      lastUpdated: '2 hours ago',
      manager: 'Mike Chen'
    },
    {
      id: 4,
      name: "Sports Complex Shelter",
      address: "321 Stadium Blvd, North",
      phone: "(555) 456-7890",
      capacity: 150,
      currentOccupancy: 25,
      status: 'open',
      resources: ['Food', 'Water', 'Medical', 'Pet Care'],
      lastUpdated: '45 min ago',
      manager: 'Maria Rodriguez'
    }
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingShelter, setEditingShelter] = useState<Shelter | null>(null);
  
  const [newShelter, setNewShelter] = useState({
    name: '',
    address: '',
    phone: '',
    capacity: 0,
    manager: '',
    resources: [] as string[]
  });

  const resourceOptions = [
    'Food', 'Water', 'Medical', 'Blankets', 'Clothing', 'Pet Care', 'Generator', 'Internet'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-safe text-safe-foreground';
      case 'limited': return 'bg-warning text-warning-foreground';
      case 'full': return 'bg-destructive text-destructive-foreground';
      case 'closed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 95) return 'text-destructive';
    if (percentage >= 80) return 'text-warning';
    return 'text-safe';
  };

  const handleStatusUpdate = (shelterId: number, newStatus: string) => {
    setShelters(prev => prev.map(shelter => 
      shelter.id === shelterId 
        ? { ...shelter, status: newStatus as Shelter['status'], lastUpdated: 'Just now' }
        : shelter
    ));
    
    toast({
      title: "Status Updated",
      description: `Shelter status changed to ${newStatus}`,
    });
  };

  const handleCapacityUpdate = (shelterId: number, newOccupancy: number) => {
    setShelters(prev => prev.map(shelter => 
      shelter.id === shelterId 
        ? { 
            ...shelter, 
            currentOccupancy: newOccupancy,
            lastUpdated: 'Just now',
            status: newOccupancy >= shelter.capacity ? 'full' : 
                    newOccupancy >= shelter.capacity * 0.8 ? 'limited' : 'open'
          }
        : shelter
    ));
    
    toast({
      title: "Capacity Updated",
      description: `Shelter occupancy updated to ${newOccupancy}`,
    });
  };

  const handleAddShelter = () => {
    if (!newShelter.name || !newShelter.address || !newShelter.capacity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const shelter: Shelter = {
      id: Date.now(),
      ...newShelter,
      currentOccupancy: 0,
      status: 'open',
      lastUpdated: 'Just now'
    };

    setShelters(prev => [...prev, shelter]);
    setNewShelter({
      name: '',
      address: '',
      phone: '',
      capacity: 0,
      manager: '',
      resources: []
    });
    setIsAddingNew(false);
    
    toast({
      title: "Shelter Added",
      description: `${shelter.name} has been added to the system`,
    });
  };

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
            <MapPin className="h-5 w-5" />
            <h1 className="font-semibold">Shelter Management</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{shelters.length}</div>
              <div className="text-sm text-muted-foreground">Total Shelters</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {shelters.filter(s => s.status === 'open').length}
              </div>
              <div className="text-sm text-muted-foreground">Open Shelters</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {shelters.reduce((sum, s) => sum + s.capacity, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Capacity</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {shelters.reduce((sum, s) => sum + s.currentOccupancy, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Current Occupancy</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Shelter Locations</h2>
          <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Shelter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Shelter</DialogTitle>
                <DialogDescription>
                  Enter the details for the new emergency shelter
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Shelter Name *</Label>
                  <Input
                    value={newShelter.name}
                    onChange={(e) => setNewShelter(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter shelter name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address *</Label>
                  <Input
                    value={newShelter.address}
                    onChange={(e) => setNewShelter(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter full address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={newShelter.phone}
                      onChange={(e) => setNewShelter(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Capacity *</Label>
                    <Input
                      type="number"
                      value={newShelter.capacity || ''}
                      onChange={(e) => setNewShelter(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                      placeholder="100"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Manager</Label>
                  <Input
                    value={newShelter.manager}
                    onChange={(e) => setNewShelter(prev => ({ ...prev, manager: e.target.value }))}
                    placeholder="Manager name"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddShelter}>
                    Add Shelter
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Shelter List */}
        <div className="space-y-4">
          {shelters.map((shelter) => (
            <Card key={shelter.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{shelter.name}</h3>
                          <Badge className={getStatusColor(shelter.status)}>
                            {shelter.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {shelter.address}
                          </span>
                          <span className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {shelter.phone}
                          </span>
                          <span className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Manager: {shelter.manager}
                          </span>
                          <span className="text-xs">
                            Last updated: {shelter.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Occupancy</span>
                        <span className={`text-sm font-bold ${getOccupancyColor(shelter.currentOccupancy, shelter.capacity)}`}>
                          {shelter.currentOccupancy} / {shelter.capacity}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((shelter.currentOccupancy / shelter.capacity) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Available Resources:</p>
                      <div className="flex flex-wrap gap-2">
                        {shelter.resources.map((resource) => (
                          <Badge key={resource} variant="outline" className="text-xs">
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:min-w-48">
                    <Select
                      value={shelter.status}
                      onValueChange={(value) => handleStatusUpdate(shelter.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="limited">Limited</SelectItem>
                        <SelectItem value="full">Full</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Update occupancy"
                        max={shelter.capacity}
                        min={0}
                        onBlur={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value !== shelter.currentOccupancy) {
                            handleCapacityUpdate(shelter.id, Math.min(value, shelter.capacity));
                          }
                          e.target.value = '';
                        }}
                        className="text-sm"
                      />
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {shelters.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No shelters configured</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add your first emergency shelter to get started
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShelterManagement;
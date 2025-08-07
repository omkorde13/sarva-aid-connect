import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MapPin, Users, Search, Navigation, Phone } from 'lucide-react';

const ShelterMap = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const shelters = [
    {
      id: 1,
      name: "Community Center Shelter",
      address: "123 Main St, Downtown",
      distance: "0.5 km",
      status: "available",
      capacity: "50/100",
      resources: ["Food", "Water", "Medical"],
      phone: "(555) 123-4567"
    },
    {
      id: 2,
      name: "School Gymnasium",
      address: "456 Oak Ave, Westside",
      distance: "1.2 km",
      status: "limited",
      capacity: "80/90",
      resources: ["Food", "Water"],
      phone: "(555) 234-5678"
    },
    {
      id: 3,
      name: "Church Emergency Center",
      address: "789 Pine St, Eastside",
      distance: "2.1 km",
      status: "full",
      capacity: "75/75",
      resources: ["Food", "Water", "Medical", "Clothing"],
      phone: "(555) 345-6789"
    },
    {
      id: 4,
      name: "Sports Complex Shelter",
      address: "321 Stadium Blvd, North",
      distance: "3.5 km",
      status: "available",
      capacity: "25/150",
      resources: ["Food", "Water", "Medical", "Pet Care"],
      phone: "(555) 456-7890"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-safe text-safe-foreground';
      case 'limited': return 'bg-warning text-warning-foreground';
      case 'full': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredShelters = shelters.filter(shelter =>
    shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shelter.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <MapPin className="h-5 w-5" />
            <h1 className="font-semibold">Emergency Shelters</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* Search and Map Placeholder */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shelters by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Map Placeholder */}
          <Card className="h-64 bg-muted/20">
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Interactive Map</p>
                <p className="text-sm text-muted-foreground">Showing shelters near you</p>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full">
            <Navigation className="h-4 w-4 mr-2" />
            Get Directions to Nearest Shelter
          </Button>
        </div>

        {/* Shelter List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Shelters ({filteredShelters.length})</h2>
          
          <div className="space-y-4">
            {filteredShelters.map((shelter) => (
              <Card key={shelter.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{shelter.name}</h3>
                      <p className="text-muted-foreground text-sm">{shelter.address}</p>
                    </div>
                    <Badge className={getStatusColor(shelter.status)}>
                      {shelter.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{shelter.distance} away</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{shelter.capacity} capacity</span>
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

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Navigation className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredShelters.length === 0 && (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No shelters found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShelterMap;
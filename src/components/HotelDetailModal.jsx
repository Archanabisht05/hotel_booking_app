import { useState } from "react";
import { X, Star, MapPin, Wifi, Car, Coffee, Utensils, Users, Phone, Mail, ChevronLeft, ChevronRight, Bed, CreditCard, Calendar, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Mock additional hotel data
const mockHotelDetails = {
  images: [
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
  ],
  fullDescription: "Experience the epitome of luxury at our grand hotel, where timeless elegance meets modern sophistication. Located in the heart of the city, our property offers unparalleled access to cultural attractions, fine dining, and shopping districts. Each room is meticulously designed with premium furnishings, marble bathrooms, and state-of-the-art amenities to ensure your comfort and convenience.",
  facilities: [
    "24-hour room service",
    "Concierge service",
    "Business center",
    "Fitness center",
    "Spa and wellness center",
    "Indoor swimming pool",
    "Restaurant and bar",
    "Free Wi-Fi",
    "Parking available",
    "Pet-friendly",
    "Airport shuttle",
    "Laundry service"
  ],
  roomTypes: [
    {
      name: "Deluxe Room",
      price: 199,
      originalPrice: 249,
      bedType: "King bed",
      maxGuests: 2,
      size: "35 m²",
      features: ["City view", "Free Wi-Fi", "Mini bar", "Air conditioning"],
      boardBasis: "Room only",
      cancellation: "Free cancellation until 24 hours before check-in",
      available: true
    },
    {
      name: "Executive Suite",
      price: 299,
      originalPrice: 399,
      bedType: "King bed + Sofa bed",
      maxGuests: 4,
      size: "55 m²",
      features: ["Ocean view", "Separate living area", "Executive lounge access", "Complimentary breakfast"],
      boardBasis: "Breakfast included",
      cancellation: "Free cancellation until 48 hours before check-in",
      available: true
    },
    {
      name: "Presidential Suite",
      price: 599,
      originalPrice: 799,
      bedType: "King bed + 2 Single beds",
      maxGuests: 6,
      size: "120 m²",
      features: ["Panoramic view", "Private terrace", "Butler service", "Premium amenities"],
      boardBasis: "All meals included",
      cancellation: "Non-refundable",
      available: false
    }
  ],
  pointsOfInterest: [
    { name: "Eiffel Tower", distance: "0.8 km", type: "Landmark" },
    { name: "Louvre Museum", distance: "1.2 km", type: "Museum" },
    { name: "Notre-Dame Cathedral", distance: "2.1 km", type: "Historical" },
    { name: "Champs-Élysées", distance: "1.5 km", type: "Shopping" },
    { name: "Seine River", distance: "0.3 km", type: "Nature" }
  ],
  contact: {
    email: "reservations@grandluxuryhotel.com",
    phone: "+33 1 23 45 67 89",
    website: "www.grandluxuryhotel.com"
  }
};

const amenityIcons = {
  "Free WiFi": Wifi,
  "Pool": Users,
  "Spa": Coffee,
  "Restaurant": Utensils,
  "Parking": Car,
  "Gym": Users,
  "Business Center": Coffee
};

const HotelDetailModal = ({ hotel, isOpen, onClose, checkIn, checkOut, rooms }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === mockHotelDetails.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? mockHotelDetails.images.length - 1 : prev - 1
    );
  };

  const totalGuests = rooms.reduce((sum, room) => sum + room.adults + room.children, 0);
  const nights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto p-0">
        <div className="relative">
          {/* Image Gallery */}
          <div className="relative h-80 overflow-hidden">
            <img
              src={mockHotelDetails.images[currentImageIndex]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {mockHotelDetails.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
                <div className="flex items-center gap-2 mb-2">
                  {Array.from({ length: hotel.category }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Badge variant="secondary" className="ml-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                    {hotel.reviewScore} Exceptional
                  </Badge>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {hotel.address}
                </div>
              </div>
              
              <Card className="lg:w-80">
                <CardContent className="p-4">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-primary">${hotel.price}</div>
                    <div className="text-sm text-muted-foreground">per night</div>
                  </div>
                  
                  {checkIn && checkOut && (
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span>{format(checkIn, 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span>{format(checkOut, 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Guests:</span>
                        <span>{totalGuests} guests</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total ({nights} nights):</span>
                        <span>${hotel.price * nights}</span>
                      </div>
                    </div>
                  )}
                  
                  <Button variant="cta" className="w-full">
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="facilities">Facilities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">About this hotel</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {mockHotelDetails.fullDescription}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Popular amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {hotel.amenities.map((amenity, index) => {
                      const Icon = amenityIcons[amenity] || Coffee;
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rooms" className="space-y-4">
                <h3 className="text-xl font-semibold">Available rooms</h3>
                <div className="space-y-4">
                  {mockHotelDetails.roomTypes.map((room, index) => (
                    <Card key={index} className={cn(
                      "transition-all duration-200",
                      !room.available && "opacity-50",
                      selectedRoom === index && "ring-2 ring-primary"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg">{room.name}</h4>
                              {!room.available && (
                                <Badge variant="destructive">Not Available</Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Bed className="h-4 w-4" />
                                {room.bedType}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                Max {room.maxGuests} guests
                              </div>
                              <div>Room size: {room.size}</div>
                              <div>Board: {room.boardBasis}</div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1">
                                {room.features.map((feature, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Shield className="h-3 w-3" />
                                {room.cancellation}
                              </div>
                            </div>
                          </div>

                          <div className="lg:w-48 text-right">
                            <div className="mb-2">
                              {room.originalPrice > room.price && (
                                <div className="text-sm text-muted-foreground line-through">
                                  ${room.originalPrice}
                                </div>
                              )}
                              <div className="text-2xl font-bold text-primary">
                                ${room.price}
                              </div>
                              <div className="text-sm text-muted-foreground">per night</div>
                            </div>
                            
                            <Button
                              variant={room.available ? "cta" : "ghost"}
                              disabled={!room.available}
                              onClick={() => setSelectedRoom(index)}
                              className="w-full"
                            >
                              {room.available ? "Select Room" : "Unavailable"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="facilities" className="space-y-6">
                <h3 className="text-xl font-semibold">Hotel facilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockHotelDetails.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Nearby attractions</h3>
                  <div className="space-y-3">
                    {mockHotelDetails.pointsOfInterest.map((poi, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{poi.name}</div>
                          <div className="text-sm text-muted-foreground">{poi.type}</div>
                        </div>
                        <Badge variant="outline">{poi.distance}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Contact information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{mockHotelDetails.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{mockHotelDetails.contact.phone}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotelDetailModal;
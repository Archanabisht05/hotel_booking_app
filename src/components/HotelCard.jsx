import { Star, MapPin, Wifi, Car, Coffee, Utensils, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const amenityIcons = {
  "Free WiFi": Wifi,
  "Pool": Users,
  "Spa": Coffee,
  "Restaurant": Utensils,
  "Parking": Car,
  "Gym": Users,
  "Business Center": Coffee
};

const HotelCard = ({ hotel, viewMode, onViewDetails }) => {
  const getReviewText = (score) => {
    if (score >= 9) return "Exceptional";
    if (score >= 8) return "Excellent";
    if (score >= 7) return "Very Good";
    if (score >= 6) return "Good";
    return "Fair";
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-hover hover:scale-[1.01] cursor-pointer group",
      viewMode === 'list' && "flex flex-row"
    )} onClick={onViewDetails}>
      <div className={cn(
        "relative",
        viewMode === 'grid' ? "h-48" : "w-80 h-full"
      )}>
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
            {hotel.reviewScore}
          </Badge>
        </div>
      </div>
      
      <CardContent className={cn(
        "p-4 flex-1",
        viewMode === 'list' && "flex flex-col justify-between"
      )}>
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {hotel.name}
              </h3>
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: hotel.category }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                ${hotel.price}
              </div>
              <div className="text-sm text-muted-foreground">per night</div>
            </div>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            {hotel.address}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {hotel.description}
          </p>

          <div className="flex flex-wrap gap-1">
            {hotel.amenities.slice(0, 4).map((amenity, index) => {
              const Icon = amenityIcons[amenity] || Coffee;
              return (
                <Badge key={index} variant="outline" className="text-xs">
                  <Icon className="h-3 w-3 mr-1" />
                  {amenity}
                </Badge>
              );
            })}
            {hotel.amenities.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{hotel.amenities.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        <div className={cn(
          "flex items-center justify-between",
          viewMode === 'grid' ? "mt-4" : "mt-auto pt-4"
        )}>
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">
              {hotel.reviewScore}
            </div>
            <div className="text-sm">
              <div className="font-medium">{getReviewText(hotel.reviewScore)}</div>
              <div className="text-muted-foreground">Guest rating</div>
            </div>
          </div>
          
          <Button variant="cta" onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelCard;
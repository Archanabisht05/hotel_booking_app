import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, MapPin, Users, Search, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import heroImage from "@/assets/hotel-hero.jpg";

// ---- tiny debounce hook (inline) ----
function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const HotelSearch = () => {
  const navigate = useNavigate();

  /* ---------- state ---------- */
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState();
  const [checkOut, setCheckOut] = useState();
  const [rooms, setRooms] = useState([
    { adults: 2, children: 0, childrenAges: [] },
  ]);

  const [showDestinations, setShowDestinations] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loadingDest, setLoadingDest] = useState(false);

  const debouncedDestination = useDebouncedValue(destination, 400);

  /* ---------- API caller ---------- */
  const fetchDestinations = async (query = null) => {
    setLoadingDest(true);
    try {
      const { data } = await axios.post(
        "https://staging.travelyatra.com/api/unsecure/dummy/hotels/places",
        {
          paginationFilterRequest: {
            paginationAction: "INITIAL_PAGE",
            maxLimit: 10,
            sortingOrder: "ASC",
          },
          search: query,
          fetchStaticDestination: !query,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-tenant-id": "pml",
          },
        }
      );
      setDestinations(data?.data?.destinations || []);
    } catch {
      setDestinations([]);
    } finally {
      setLoadingDest(false);
    }
  };

  /* ---------- effects ---------- */
  // initial fetch (static list)
  useEffect(() => {
    fetchDestinations();
  }, []);

  // debounced search
  useEffect(() => {
    fetchDestinations(debouncedDestination || null);
  }, [debouncedDestination]);

  /* ---------- helpers ---------- */
  const updateRoom = (index, field, value) => {
    const updatedRooms = [...rooms];
    if (field === "children" && value < updatedRooms[index].children) {
      updatedRooms[index].childrenAges = updatedRooms[index].childrenAges.slice(
        0,
        value
      );
    }
    updatedRooms[index] = { ...updatedRooms[index], [field]: value };
    setRooms(updatedRooms);
  };

  const addRoom = () =>
    setRooms([...rooms, { adults: 2, children: 0, childrenAges: [] }]);

  const removeRoom = (index) => {
    if (rooms.length > 1) setRooms(rooms.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    if (!destination || !checkIn || !checkOut) return;

    const searchParams = {
      destination,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      rooms: JSON.stringify(rooms),
    };
    const queryString = new URLSearchParams(searchParams).toString();
    navigate(`/results?${queryString}`);
  };

  const totalGuests = useMemo(
    () => rooms.reduce((sum, r) => sum + r.adults + r.children, 0),
    [rooms]
  );

  /* ---------- render ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 animate-fade-in">
            Discover amazing hotels and create unforgettable memories
          </p>

          {/* Search Form */}
          <Card className="max-w-5xl mx-auto bg-card/95 backdrop-blur-sm shadow-modal animate-scale-in">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Destination */}
                <div className="relative">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Where are you going?"
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        setShowDestinations(true);
                      }}
                      onFocus={() => setShowDestinations(true)}
                      className="pl-10"
                    />
                    {showDestinations &&
                      destination &&
                      destinations.length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-50 bg-popover border rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                          {destinations.map((dest, index) => (
                            <button
                              key={index}
                              className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                              onClick={() => {
                                setDestination(dest);
                                setShowDestinations(false);
                              }}
                            >
                              {dest}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                </div>

                {/* Check-in */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Check-in
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkIn && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {checkIn
                          ? format(checkIn, "MMM dd, yyyy")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Check-out */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Check-out
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOut && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {checkOut
                          ? format(checkOut, "MMM dd, yyyy")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(date) => date <= (checkIn || new Date())}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guests & Rooms */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Guests & Rooms
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        {totalGuests} guest{totalGuests !== 1 ? "s" : ""},{" "}
                        {rooms.length} room{rooms.length !== 1 ? "s" : ""}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="start">
                      <div className="space-y-4">
                        {rooms.map((room, roomIndex) => (
                          <div
                            key={roomIndex}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">
                                Room {roomIndex + 1}
                              </h4>
                              {rooms.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeRoom(roomIndex)}
                                  className="text-destructive"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>

                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span>Adults</span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      updateRoom(
                                        roomIndex,
                                        "adults",
                                        Math.max(1, room.adults - 1)
                                      )
                                    }
                                    disabled={room.adults <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center">
                                    {room.adults}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      updateRoom(
                                        roomIndex,
                                        "adults",
                                        room.adults + 1
                                      )
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              <div className="flex justify-between items-center">
                                <span>Children</span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      updateRoom(
                                        roomIndex,
                                        "children",
                                        Math.max(0, room.children - 1)
                                      )
                                    }
                                    disabled={room.children <= 0}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center">
                                    {room.children}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      updateRoom(
                                        roomIndex,
                                        "children",
                                        room.children + 1
                                      )
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              {room.children > 0 && (
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Children ages:
                                  </p>
                                  <div className="grid grid-cols-3 gap-2">
                                    {Array.from({ length: room.children }).map(
                                      (_, childIndex) => (
                                        <Input
                                          key={childIndex}
                                          type="number"
                                          min="0"
                                          max="17"
                                          placeholder="Age"
                                          value={
                                            room.childrenAges[childIndex] || ""
                                          }
                                          onChange={(e) => {
                                            const ages = [...room.childrenAges];
                                            ages[childIndex] =
                                              parseInt(e.target.value, 10) || 0;
                                            updateRoom(
                                              roomIndex,
                                              "childrenAges",
                                              ages
                                            );
                                          }}
                                          className="text-sm"
                                        />
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        <Button
                          variant="outline"
                          onClick={addRoom}
                          className="w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Room
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Button
                variant="cta"
                size="lg"
                onClick={handleSearch}
                disabled={!destination || !checkIn || !checkOut}
                className="w-full md:w-auto px-8"
              >
                <Search className="mr-2 h-5 w-5" />
                Search Hotels
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HotelSearch;

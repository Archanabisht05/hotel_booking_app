// import { useState, useEffect, useMemo } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import {
//   Calendar,
//   MapPin,
//   Users,
//   Search,
//   Star,
//   Filter,
//   Grid,
//   List,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";
// import { format } from "date-fns";
// import HotelDetailModal from "@/components/HotelDetailModal";
// import axios from "axios";

// const HotelResults = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const [hotels, setHotels] = useState([]);
//   const [filteredHotels, setFilteredHotels] = useState([]);
//   const [selectedHotel, setSelectedHotel] = useState(null);
//   const [viewMode, setViewMode] = useState("grid");
//   const [loading, setLoading] = useState(false);

//   // Search and filter states
//   const [searchQuery, setSearchQuery] = useState("");
//   const [priceRange, setPriceRange] = useState([0, 500]);
//   const [starFilter, setStarFilter] = useState([]);
//   const [sortBy, setSortBy] = useState("price-low");
//   const [showFilters, setShowFilters] = useState(false);

//   // Get search params
//   const destination = searchParams.get("destination") || "";
//   // const destination = searchParams.get("destination") || "";
//   const checkInStr = searchParams.get("checkIn"); // ISO string
//   const checkOutStr = searchParams.get("checkOut"); // ISO string

//   const checkIn = useMemo(
//     () => (checkInStr ? new Date(checkInStr) : null),
//     [checkInStr]
//   );
//   const checkOut = useMemo(
//     () => (checkOutStr ? new Date(checkOutStr) : null),
//     [checkOutStr]
//   );
//   const rooms = useMemo(
//     () =>
//       searchParams.get("rooms") ? JSON.parse(searchParams.get("rooms")) : [],
//     [searchParams.get("rooms")]
//   );

//   // Fetch hotels from API on mount
//   useEffect(() => {
//     if (!destination) {
//       setHotels([]);
//       setLoading(false);
//       return;
//     }

//     const source = axios.CancelToken.source(); // optional: abort on unmount
//     setLoading(true);

//     axios
//       .post(
//         "https://staging.travelyatra.com/api/unsecure/dummy/hotels/search",
//         {
//           destination,
//           checkIn: checkInStr,
//           checkOut: checkOutStr,
//           rooms,
//           paginationFilterRequest: {
//             paginationAction: "INITIAL_PAGE",
//             maxLimit: 20,
//             sortingOrder: "ASC",
//           },
//         },
//         {
//           headers: { "x-tenant-id": "pml" },
//           cancelToken: source.token,
//         }
//       )
//       .then(({ data }) => {
//         setHotels(data?.data?.hotels || []);
//       })
//       .catch(() => {
//         setHotels([]);
//       })
//       .finally(() => {
//         setLoading(false);
//       });

//     return () => source.cancel(); // clean-up
//   }, [destination, checkInStr, checkOutStr, rooms]);

//   // Filter and sort hotels
//   useEffect(() => {
//     let filtered = hotels.filter((hotel) => {
//       const matchesSearch = hotel.name
//         ?.toLowerCase()
//         .includes(searchQuery.toLowerCase());
//       const matchesPrice =
//         hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
//       const matchesStar =
//         starFilter.length === 0 ||
//         starFilter.includes(hotel.category || hotel.rating);

//       return matchesSearch && matchesPrice && matchesStar;
//     });

//     switch (sortBy) {
//       case "price-low":
//         filtered.sort((a, b) => a.price - b.price);
//         break;
//       case "price-high":
//         filtered.sort((a, b) => b.price - a.price);
//         break;
//       case "rating":
//         filtered.sort((a, b) => (b.reviewScore || 0) - (a.reviewScore || 0));
//         break;
//       case "stars":
//         filtered.sort(
//           (a, b) => (b.category || b.rating) - (a.category || a.rating)
//         );
//         break;
//     }

//     setFilteredHotels(filtered);
//   }, [hotels, searchQuery, priceRange, starFilter, sortBy]);

//   const handleStarFilterChange = (star, checked) => {
//     if (checked) {
//       setStarFilter([...starFilter, star]);
//     } else {
//       setStarFilter(starFilter.filter((s) => s !== star));
//     }
//   };

//   const totalGuests = rooms.reduce(
//     (sum, room) => sum + room.adults + room.children,
//     0
//   );

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header with search form */}
//       <div className="bg-primary text-primary-foreground py-4 shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col lg:flex-row gap-4 items-center">
//             <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="flex items-center gap-2">
//                 <MapPin className="h-4 w-4" />
//                 <span className="truncate">{destination}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-4 w-4" />
//                 <span className="text-sm">
//                   {checkIn && checkOut
//                     ? `${format(checkIn, "MMM dd")} - ${format(
//                         checkOut,
//                         "MMM dd"
//                       )}`
//                     : "Dates not set"}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Users className="h-4 w-4" />
//                 <span className="text-sm">
//                   {totalGuests} guests, {rooms.length} rooms
//                 </span>
//               </div>
//               <Button
//                 variant="secondary"
//                 size="sm"
//                 onClick={() => navigate("/")}
//               >
//                 <Search className="mr-1 h-4 w-4" />
//                 Modify Search
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Sidebar Filters */}
//           <div
//             className={cn(
//               "lg:w-80 space-y-6",
//               showFilters ? "block" : "hidden lg:block"
//             )}
//           >
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <h3 className="font-semibold">Filters</h3>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       setSearchQuery("");
//                       setPriceRange([0, 500]);
//                       setStarFilter([]);
//                     }}
//                   >
//                     Clear All
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {/* Search by name */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Search by property name
//                   </label>
//                   <Input
//                     placeholder="Hotel name..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>

//                 {/* Price Range */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Price per night: ${priceRange[0]} - ${priceRange[1]}
//                   </label>
//                   {/* Replace with your Slider component */}
//                   <input
//                     type="range"
//                     min={0}
//                     max={500}
//                     step={10}
//                     value={priceRange[0]}
//                     onChange={(e) =>
//                       setPriceRange([Number(e.target.value), priceRange[1]])
//                     }
//                   />
//                   <input
//                     type="range"
//                     min={0}
//                     max={500}
//                     step={10}
//                     value={priceRange[1]}
//                     onChange={(e) =>
//                       setPriceRange([priceRange[0], Number(e.target.value)])
//                     }
//                   />
//                 </div>

//                 {/* Star Rating */}
//                 <div>
//                   <label className="block text-sm font-medium mb-3">
//                     Star Rating
//                   </label>
//                   <div className="space-y-2">
//                     {[5, 4, 3, 2, 1].map((star) => (
//                       <div key={star} className="flex items-center space-x-2">
//                         <Checkbox
//                           id={`star-${star}`}
//                           checked={starFilter.includes(star)}
//                           onCheckedChange={(checked) =>
//                             handleStarFilterChange(star, checked)
//                           }
//                         />
//                         <label
//                           htmlFor={`star-${star}`}
//                           className="flex items-center gap-1 cursor-pointer"
//                         >
//                           <div className="flex">
//                             {Array.from({ length: star }).map((_, i) => (
//                               <Star
//                                 key={i}
//                                 className="h-4 w-4 fill-yellow-400 text-yellow-400"
//                               />
//                             ))}
//                           </div>
//                           <span className="text-sm">
//                             {star} star{star !== 1 ? "s" : ""}
//                           </span>
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1">
//             {/* Results Header */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//               <div>
//                 <h2 className="text-2xl font-bold">
//                   {filteredHotels.length} properties found
//                 </h2>
//                 <p className="text-muted-foreground">in {destination}</p>
//               </div>

//               <div className="flex items-center gap-4">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="lg:hidden"
//                 >
//                   <Filter className="mr-2 h-4 w-4" />
//                   Filters
//                 </Button>

//                 <Select value={sortBy} onValueChange={setSortBy}>
//                   <SelectTrigger className="w-40">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="price-low">
//                       Price: Low to High
//                     </SelectItem>
//                     <SelectItem value="price-high">
//                       Price: High to Low
//                     </SelectItem>
//                     <SelectItem value="rating">Guest Rating</SelectItem>
//                     <SelectItem value="stars">Star Rating</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 <div className="flex border rounded-md">
//                   <Button
//                     variant={viewMode === "grid" ? "default" : "ghost"}
//                     size="sm"
//                     onClick={() => setViewMode("grid")}
//                     className="rounded-r-none"
//                   >
//                     <Grid className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant={viewMode === "list" ? "default" : "ghost"}
//                     size="sm"
//                     onClick={() => setViewMode("list")}
//                     className="rounded-l-none"
//                   >
//                     <List className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             {/* Hotel Grid/List */}
//             <div
//               className={cn(
//                 "grid gap-6",
//                 viewMode === "grid"
//                   ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
//                   : "grid-cols-1"
//               )}
//             >
//               {filteredHotels.map((hotel) => (
//                 <Card key={hotel.id} className="overflow-hidden">
//                   <img
//                     src={
//                       hotel.image ||
//                       "https://via.placeholder.com/400x250?text=No+Image"
//                     }
//                     alt={hotel.name}
//                     className="w-full h-48 object-cover"
//                   />
//                   <CardHeader>
//                     <div className="flex items-center gap-2">
//                       <h3 className="font-bold text-lg">{hotel.name}</h3>
//                       <div className="flex">
//                         {Array.from({
//                           length: hotel.category || hotel.rating || 0,
//                         }).map((_, i) => (
//                           <Star
//                             key={i}
//                             className="h-4 w-4 fill-yellow-400 text-yellow-400"
//                           />
//                         ))}
//                       </div>
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                       {hotel.address}
//                     </p>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex flex-wrap gap-2 mb-2">
//                       {(hotel.amenities || []).slice(0, 5).map((amenity, i) => (
//                         <span
//                           key={i}
//                           className="bg-accent px-2 py-1 rounded text-xs"
//                         >
//                           {amenity}
//                         </span>
//                       ))}
//                     </div>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setSelectedHotel(hotel)}
//                       className="w-full"
//                     >
//                       View Details
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             {loading && (
//               <div className="text-center py-12">
//                 <h3 className="text-lg font-medium text-muted-foreground mb-2">
//                   Loading hotels...
//                 </h3>
//               </div>
//             )}

//             {filteredHotels.length === 0 && !loading && (
//               <div className="text-center py-12">
//                 <h3 className="text-lg font-medium text-muted-foreground mb-2">
//                   No hotels found
//                 </h3>
//                 {/* <p className="text-muted-foreground">
//                   Try adjusting your filters or search criteria
//                 </p> */}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Hotel Detail Modal */}
//       {selectedHotel && (
//         <HotelDetailModal
//           hotel={selectedHotel}
//           isOpen={!!selectedHotel}
//           onClose={() => setSelectedHotel(null)}
//           checkIn={checkIn}
//           checkOut={checkOut}
//           rooms={rooms}
//         />
//       )}
//     </div>
//   );
// };

// export default HotelResults;
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Star,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import HotelDetailModal from "@/components/HotelDetailModal";

const BOARD_TYPES = [
  { code: "AI", name: "ALL INCLUSIVE" },
  { code: "BB", name: "BED AND BREAKFAST" },
  { code: "FB", name: "FULL BOARD" },
  { code: "HB", name: "HALF BOARD" },
  { code: "RO", name: "ROOM ONLY" },
];

const HotelResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  /* -------------------- URL PARAMS -------------------- */
  const destination = searchParams.get("destination") || "";
  const checkInStr = searchParams.get("checkIn");
  const checkOutStr = searchParams.get("checkOut");

  const checkIn = useMemo(
    () => (checkInStr ? new Date(checkInStr) : null),
    [checkInStr]
  );
  const checkOut = useMemo(
    () => (checkOutStr ? new Date(checkOutStr) : null),
    [checkOutStr]
  );
  const rooms = useMemo(
    () =>
      searchParams.get("rooms") ? JSON.parse(searchParams.get("rooms")) : [],
    [searchParams.get("rooms")]
  );

  /* -------------------- STATE -------------------- */
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);

  /* ---- Extra filters ---- */
  const [priceRange, setPriceRange] = useState([1000, 100000]);
  const [starRange, setStarRange] = useState([1, 5]);
  const [reviewRange, setReviewRange] = useState([1, 5]);
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [sortBy, setSortBy] = useState("price-low");
  const [showFilters, setShowFilters] = useState(false);

  /* -------------------- API CALL -------------------- */
  useEffect(() => {
    if (!destination) {
      setHotels([]);
      setLoading(false);
      return;
    }

    const source = axios.CancelToken.source();
    setLoading(true);

    const payload = {
      destination,
      checkIn: checkInStr,
      checkOut: checkOutStr,
      rooms,
      paginationFilterRequest: {
        paginationAction: "INITIAL_PAGE",
        maxLimit: 20,
        sortingOrder: "ASC",
      },
      /* ---- Extra filters ---- */
      extrafilter: {
        minRate: priceRange[0],
        maxRate: priceRange[1],
        minCategory: starRange[0],
        maxCategory: starRange[1],
      },
      reviews: [
        {
          minRate: reviewRange[0],
          maxRate: reviewRange[1],
          minReviewCount: 1,
          type: "TRIPADVISOR",
        },
      ],
      boards: {
        board: selectedBoards,
        included: true,
      },
    };

    axios
      .post(
        "https://staging.travelyatra.com/api/unsecure/dummy/hotels/search",
        payload,
        { headers: { "x-tenant-id": "pml" }, cancelToken: source.token }
      )
      .then(({ data }) => setHotels(data?.data?.hotels || []))
      .catch(() => setHotels([]))
      .finally(() => setLoading(false));

    return () => source.cancel();
  }, [
    destination,
    checkInStr,
    checkOutStr,
    rooms,
    priceRange,
    starRange,
    reviewRange,
    selectedBoards,
  ]);

  /* -------------------- LOCAL FILTER & SORT -------------------- */
  useEffect(() => {
    let filtered = [...hotels];

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.reviewScore || 0) - (a.reviewScore || 0));
        break;
      case "stars":
        filtered.sort(
          (a, b) => (b.category || b.rating) - (a.category || a.rating)
        );
        break;
    }

    setFilteredHotels(filtered);
  }, [hotels, sortBy]);

  const totalGuests = rooms.reduce(
    (sum, room) => sum + room.adults + room.children,
    0
  );

  /* -------------------- RENDER -------------------- */
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {checkIn && checkOut
                    ? `${format(checkIn, "MMM dd")} - ${format(
                        checkOut,
                        "MMM dd"
                      )}`
                    : "Dates not set"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">
                  {totalGuests} guests, {rooms.length} rooms
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/")}
              >
                <Search className="mr-1 h-4 w-4" />
                Modify Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ---------- SIDEBAR FILTERS ---------- */}
          <div
            className={cn(
              "lg:w-80 space-y-6",
              showFilters ? "block" : "hidden lg:block"
            )}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPriceRange([1000, 100000]);
                      setStarRange([1, 5]);
                      setReviewRange([1, 5]);
                      setSelectedBoards([]);
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* PRICE */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price per night: ${priceRange[0]} – ${priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min={1000}
                    max={100000}
                    step={1000}
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="w-full"
                  />
                  <input
                    type="range"
                    min={1000}
                    max={100000}
                    step={1000}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full"
                  />
                </div>

                {/* STARS */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Star Category: {starRange[0]} – {starRange[1]}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={starRange[0]}
                    onChange={(e) =>
                      setStarRange([Number(e.target.value), starRange[1]])
                    }
                    className="w-full"
                  />
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={starRange[1]}
                    onChange={(e) =>
                      setStarRange([starRange[0], Number(e.target.value)])
                    }
                    className="w-full"
                  />
                </div>

                {/* REVIEW */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    TripAdvisor Rating: {reviewRange[0]} – {reviewRange[1]}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={0.1}
                    value={reviewRange[0]}
                    onChange={(e) =>
                      setReviewRange([Number(e.target.value), reviewRange[1]])
                    }
                    className="w-full"
                  />
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={0.1}
                    value={reviewRange[1]}
                    onChange={(e) =>
                      setReviewRange([reviewRange[0], Number(e.target.value)])
                    }
                    className="w-full"
                  />
                </div>

                {/* BOARD */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Board
                  </label>
                  <div className="space-y-2">
                    {BOARD_TYPES.map(({ code, name }) => (
                      <div key={code} className="flex items-center space-x-2">
                        <Checkbox
                          id={`board-${code}`}
                          checked={selectedBoards.includes(code)}
                          onCheckedChange={(checked) =>
                            setSelectedBoards((prev) =>
                              checked
                                ? [...prev, code]
                                : prev.filter((b) => b !== code)
                            )
                          }
                        />
                        <label htmlFor={`board-${code}`} className="text-sm">
                          {name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ---------- MAIN CONTENT ---------- */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {filteredHotels.length} properties found
                </h2>
                <p className="text-muted-foreground">in {destination}</p>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Guest Rating</SelectItem>
                    <SelectItem value="stars">Star Rating</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* ---------- HOTEL GRID / LIST ---------- */}
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {filteredHotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden">
                  <img
                    src={
                      hotel.image ||
                      "https://via.placeholder.com/400x250?text=No+Image"
                    }
                    alt={hotel.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{hotel.name}</h3>
                      <div className="flex">
                        {Array.from({
                          length: hotel.category || hotel.rating || 0,
                        }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {hotel.address}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(hotel.amenities || []).slice(0, 5).map((amenity, i) => (
                        <span
                          key={i}
                          className="bg-accent px-2 py-1 rounded text-xs"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedHotel(hotel)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {loading && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-muted-foreground">
                  Loading hotels...
                </h3>
              </div>
            )}

            {filteredHotels.length === 0 && !loading && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-muted-foreground">
                  No hotels found
                </h3>
                {/* <p className="text-muted-foreground">
                  Try adjusting your filters or search criteria
                </p> */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------- MODAL ---------- */}
      {selectedHotel && (
        <HotelDetailModal
          hotel={selectedHotel}
          isOpen={!!selectedHotel}
          onClose={() => setSelectedHotel(null)}
          checkIn={checkIn}
          checkOut={checkOut}
          rooms={rooms}
        />
      )}
    </div>
  );
};

export default HotelResults;

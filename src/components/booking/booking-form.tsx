"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchResults } from "@/components/booking/search-results"
import { useToast } from "@/hooks/use-toast"

interface Station {
  id: number;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
}

interface City {
  id: string;
  name: string;
}

interface SearchResult {
  id: number;
  train_id: number;
  train_name: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  status: 'On Time' | 'Delayed' | 'Cancelled';
  price: {
    economy: number;
    business: number;
    vip: number;
  };
  available_seats: {
    economy: number;
    business: number;
    vip: number;
  };
}

const formSchema = z.object({
  fromCity: z.string().min(1, "Please select a departure city"),
  fromStation: z.string().min(1, "Please select a departure station"),
  toCity: z.string().min(1, "Please select an arrival city"),
  toStation: z.string().min(1, "Please select an arrival station"),
  date: z.date({
    required_error: "Please select a date",
  }),
  ticketClass: z.enum(["economy", "business", "vip"], {
    required_error: "Please select a ticket class",
  }),
})

export function BookingForm() {
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null)
  const [dataFetched, setDataFetched] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [trains, setTrains] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stations
        const stationsRes = await fetch("/api/stations");
        if (!stationsRes.ok) {
          throw new Error("Failed to fetch stations data");
        }
        const stationsData = await stationsRes.json();
        setStations(stationsData.results);

        // Extract unique cities from stations
        const uniqueCities = Array.from(
          new Set<string>(stationsData.results.map((station: Station) => station.city))
        ).map((city, index) => ({
          id: String(index + 1),
          name: city
        }));
        setCities(uniqueCities);

        // Fetch all schedules
        const schedulesRes = await fetch("/api/schedules");
        if (!schedulesRes.ok) {
          throw new Error("Failed to fetch schedules data");
        }
        const schedulesData = await schedulesRes.json();
        setSchedules(schedulesData.results);

        // Fetch all trains
        const trainsRes = await fetch("/api/trains");
        if (!trainsRes.ok) {
          throw new Error("Failed to fetch trains data");
        }
        const trainsData = await trainsRes.json();
        setTrains(trainsData.results);

        setDataFetched(true);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load necessary data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticketClass: "economy",
    },
  })

  const fromCity = form.watch("fromCity")
  const toCity = form.watch("toCity")

  const fromStations = stations.filter((station) => station.city === cities.find(c => c.id === fromCity)?.name)
  const toStations = stations.filter((station) => station.city === cities.find(c => c.id === toCity)?.name)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSearching(true)
    setError(null)

    try {
      // Filter schedules based on user selection
      const filteredSchedules = schedules.filter(schedule => {
        const matchesFromStation = schedule.dep_station_id.toString() === values.fromStation;
        const matchesToStation = schedule.arrival_station_id.toString() === values.toStation;
        const matchesDate = format(new Date(schedule.departure_time), "yyyy-MM-dd") === format(values.date, "yyyy-MM-dd");
        
        return matchesFromStation && matchesToStation && matchesDate;
      });
      
      // Transform the filtered schedules
      const transformedResults: SearchResult[] = filteredSchedules.map((schedule: any) => {
        const train = trains.find(t => t.id === schedule.train_id);
        return {
          id: schedule.id,
          train_id: schedule.train_id,
          train_name: train?.name || 'Unknown Train',
          departure_time: schedule.departure_time,
          arrival_time: schedule.arrival_time,
          duration: calculateDuration(schedule.departure_time, schedule.arrival_time),
          status: schedule.status,
          price: {
            economy: schedule.eco_price,
            business: schedule.bus_price,
            vip: schedule.vip_price
          },
          available_seats: {
            economy: schedule.eco_left,
            business: schedule.bus_left,
            vip: schedule.vip_left
          }
        };
      });

      setSearchResults(transformedResults);
    } catch (error) {
      console.error("Search failed:", error);
      setError("Failed to search schedules. Please try again later.");
    } finally {
      setIsSearching(false)
    }
  }

  async function handleBookTicket(scheduleId: number, ticketClass: 'economy' | 'business' | 'vip', price: number) {
    try {
      // Get user ID
      const userId = prompt("Please enter your user ID:");
      if (!userId) {
        toast({
          title: "Error",
          description: "User ID is required to book a ticket.",
          variant: "destructive",
        });
        return;
      }

      // Validate user ID is a number
      if (isNaN(Number(userId))) {
        toast({
          title: "Error",
          description: "Please enter a valid user ID.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: Number(userId),
          schedule_id: scheduleId,
          class: ticketClass,
          status: 'booked'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to book ticket');
      }

      toast({
        title: "Success",
        description: "Ticket booked successfully!",
      });

      // Refresh the search results to update available seats
      const currentValues = form.getValues();
      await onSubmit(currentValues);
    } catch (error) {
      console.error('Failed to book ticket:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book ticket. Please try again.",
        variant: "destructive",
      });
    }
  }

  function calculateDuration(departureTime: string, arrivalTime: string): string {
    // Parse the datetime strings
    const dep = new Date(departureTime);
    const arr = new Date(arrivalTime);
    
    // Calculate the difference in milliseconds
    const diff = arr.getTime() - dep.getTime();
    
    // Convert to hours and minutes
    const totalMinutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!dataFetched) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="fromCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From City</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.setValue("fromStation", "")
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select departure city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fromStation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Station</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!fromCity}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select departure station" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fromStations.map((station) => (
                          <SelectItem key={station.id} value={station.id.toString()}>
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="toCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To City</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.setValue("toStation", "")
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select arrival city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toStation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Station</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!toCity}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select arrival station" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {toStations.map((station) => (
                          <SelectItem key={station.id} value={station.id.toString()}>
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Travel Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ticketClass"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Ticket Class</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="economy" />
                        </FormControl>
                        <FormLabel className="font-normal">Economy</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="business" />
                        </FormControl>
                        <FormLabel className="font-normal">Business</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="vip" />
                        </FormControl>
                        <FormLabel className="font-normal">VIP</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSearching}>
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search Trains"
            )}
          </Button>
        </form>
      </Form>

      {searchResults && (
        <SearchResults
          results={searchResults}
          selectedClass={form.getValues("ticketClass")}
          date={form.getValues("date")}
          fromCity={cities.find((c) => c.id === form.getValues("fromCity"))?.name || ""}
          toCity={cities.find((c) => c.id === form.getValues("toCity"))?.name || ""}
          fromStation={stations.find((s) => s.id.toString() === form.getValues("fromStation"))?.name || ""}
          toStation={stations.find((s) => s.id.toString() === form.getValues("toStation"))?.name || ""}
          onBookTicket={handleBookTicket}
        />
      )}
    </div>
  )
}


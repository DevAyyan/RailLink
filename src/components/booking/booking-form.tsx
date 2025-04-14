"use client"

import { useState } from "react"
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

// Sample data - in a real app, this would come from your API
const cities = [
  { id: 1, name: "Karachi" },
  { id: 2, name: "Lahore" },
  { id: 3, name: "Islamabad" },
  { id: 4, name: "Peshawar" },
  { id: 5, name: "Quetta" },
  { id: 6, name: "Faisalabad" },
]

const stations = [
  { id: 1, name: "Central Station", cityId: 1 },
  { id: 2, name: "North Terminal", cityId: 1 },
  { id: 3, name: "East Junction", cityId: 1 },
  { id: 4, name: "South Station", cityId: 1 },
  { id: 5, name: "Main Station", cityId: 2 },
  { id: 6, name: "West Terminal", cityId: 2 },
  { id: 7, name: "University Station", cityId: 3 },
  { id: 8, name: "City Center", cityId: 3 },
]

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
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[] | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticketClass: "economy",
    },
  })

  const fromCity = form.watch("fromCity")
  const toCity = form.watch("toCity")

  const fromStations = stations.filter((station) => station.cityId === Number.parseInt(fromCity || "0"))

  const toStations = stations.filter((station) => station.cityId === Number.parseInt(toCity || "0"))

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSearching(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Sample search results
    setSearchResults([
      {
        id: 1,
        trainNumber: "IC-101",
        trainName: "Express Line",
        departureTime: "08:30",
        arrivalTime: "12:45",
        duration: "4h 15m",
        price: {
          economy: 1200,
          business: 2500,
          vip: 4000,
        },
        availableSeats: {
          economy: 42,
          business: 18,
          vip: 6,
        },
      },
      {
        id: 2,
        trainNumber: "IC-205",
        trainName: "Rapid Connect",
        departureTime: "10:15",
        arrivalTime: "14:30",
        duration: "4h 15m",
        price: {
          economy: 1300,
          business: 2700,
          vip: 4200,
        },
        availableSeats: {
          economy: 28,
          business: 12,
          vip: 4,
        },
      },
      {
        id: 3,
        trainNumber: "IC-310",
        trainName: "City Liner",
        departureTime: "14:00",
        arrivalTime: "18:20",
        duration: "4h 20m",
        price: {
          economy: 1250,
          business: 2600,
          vip: 4100,
        },
        availableSeats: {
          economy: 56,
          business: 22,
          vip: 8,
        },
      },
    ])

    setIsSearching(false)
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
                          <SelectItem key={city.id} value={city.id.toString()}>
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
                          <SelectItem key={city.id} value={city.id.toString()}>
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
          fromCity={cities.find((c) => c.id.toString() === form.getValues("fromCity"))?.name || ""}
          toCity={cities.find((c) => c.id.toString() === form.getValues("toCity"))?.name || ""}
          fromStation={stations.find((s) => s.id.toString() === form.getValues("fromStation"))?.name || ""}
          toStation={stations.find((s) => s.id.toString() === form.getValues("toStation"))?.name || ""}
        />
      )}
    </div>
  )
}


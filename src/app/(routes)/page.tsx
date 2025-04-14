import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
      <div className="relative z-10 text-center">
        <div>
          <h1 className="text-5xl font-bold tracking-wide">Welcome to RailLink</h1>
          <p className="mt-4 text-lg opacity-80">Experience the future of metro and intercity travel.</p>
        </div>
        <div className="my-8">
          <div className="flex flex-col items-center justify-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Connecting Cities, Simplifying Travel</h2>
              <p className="text-lg mb-6">
                RailLink is a comprehensive train management system that connects cities through intercity train lines and
                manages local metro networks within each city.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/stations">Explore Stations</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/booking">Book Tickets</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
  );
}

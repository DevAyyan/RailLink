import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NetworkGraph } from "@/components/network-graph"

export default function Home() {
    return(
      <div className="h-screen pt-10 flex flex-col items-center justify-center relative text-white">
        <div className="h-50 mb-6">
        <h1 className="text-4xl font-bold">Map of the railway system.</h1>
        </div>

        <Card className="w-full h-96">
        <NetworkGraph />
        </Card>
      </div>
    )
}
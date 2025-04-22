import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrainsAdmin } from "@/components/admin/trains-admin"
import { StationsAdmin } from "@/components/admin/stations-admin"
import { SchedulesAdmin } from "@/components/admin/schedules-admin"
import { UsersAdmin } from "@/components/admin/users-admin"
import { RailwaysAdmin } from "@/components/admin/railways-admin"
import { TrainRoutesAdmin } from "@/components/admin/train-routes-admin"
import { TicketsAdmin } from "@/components/admin/tickets-admin"
import { PaymentsAdmin } from "@/components/admin/payments-admin"
import { MembershipsAdmin } from "@/components/admin/memberships-admin"
import { Shield } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Manage all aspects of the RailLink system according to the database schema.
      </p>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="memberships">Memberships</TabsTrigger>
          <TabsTrigger value="stations">Stations</TabsTrigger>
          <TabsTrigger value="railways">Railways</TabsTrigger>
          <TabsTrigger value="trains">Trains</TabsTrigger>
          <TabsTrigger value="train-routes">Train Routes</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>Add, edit, or remove users from the system</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersAdmin />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memberships" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Memberships Management</CardTitle>
              <CardDescription>Manage user membership tiers and expiry dates</CardDescription>
            </CardHeader>
            <CardContent>
              <MembershipsAdmin />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Stations Management</CardTitle>
              <CardDescription>Add, edit, or remove stations from the system</CardDescription>
            </CardHeader>
            <CardContent>
              <StationsAdmin />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="railways" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Railways Management</CardTitle>
              <CardDescription>Manage railway connections between stations</CardDescription>
            </CardHeader>
            <CardContent>
              <RailwaysAdmin />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trains" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Trains Management</CardTitle>
              <CardDescription>Add, edit, or remove trains from the system</CardDescription>
            </CardHeader>
            <CardContent>
              <TrainsAdmin />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="train-routes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Train Routes Management</CardTitle>
              <CardDescription>Manage train routes and sequences</CardDescription>
            </CardHeader>
            <CardContent>
              <TrainRoutesAdmin />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedules Management</CardTitle>
              <CardDescription>Add, edit, or remove train schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <SchedulesAdmin />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tickets Management</CardTitle>
              <CardDescription>Manage ticket bookings and status</CardDescription>
            </CardHeader>
            <CardContent>
              <TicketsAdmin />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payments Management</CardTitle>
              <CardDescription>Track and manage payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentsAdmin />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

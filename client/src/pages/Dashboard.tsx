import { useAuth } from "@/hooks/use-auth";
import { useMyRestaurant, useCreateRestaurant, useUpdateRestaurant } from "@/hooks/use-restaurants";
import { useCreateOffer } from "@/hooks/use-offers";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRestaurantSchema, insertOfferSchema, type InsertRestaurant, type InsertOffer } from "@shared/schema";
import { Loader2, Plus, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

// --- Subcomponents for Forms ---

function RestaurantForm({ 
  defaultValues, 
  mode 
}: { 
  defaultValues?: Partial<InsertRestaurant>, 
  mode: "create" | "update" 
}) {
  const createMutation = useCreateRestaurant();
  const updateMutation = useUpdateRestaurant();
  const [open, setOpen] = useState(false);
  
  // Need to handle ID for update separately
  const restaurantId = defaultValues?.id;

  const form = useForm<InsertRestaurant>({
    resolver: zodResolver(insertRestaurantSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      city: "Stuart",
      address: "",
      cuisine: "",
      phone: "",
      website: "",
      subscriptionTier: "free"
    }
  });

  const onSubmit = (data: InsertRestaurant) => {
    if (mode === "create") {
      createMutation.mutate(data, { onSuccess: () => setOpen(false) });
    } else if (mode === "update" && restaurantId) {
      // @ts-ignore - ID handling is a bit tricky with reuse
      updateMutation.mutate({ id: restaurantId, ...data }, { onSuccess: () => setOpen(false) });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={mode === "create" ? "default" : "outline"} className={mode === "create" ? "btn-primary" : ""}>
          {mode === "create" ? <><Plus className="mr-2 h-4 w-4"/> Create Restaurant Profile</> : <><Edit className="mr-2 h-4 w-4"/> Edit Profile</>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Your Restaurant" : "Edit Details"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cuisine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisine (comma separated)</FormLabel>
                    <FormControl><Input {...field} placeholder="Italian, Pizza..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="heroImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Image URL</FormLabel>
                    <FormControl><Input {...field} placeholder="https://..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl><Input {...field} placeholder="https://..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full btn-primary" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : "Save Details"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function CreateOfferForm({ restaurantId }: { restaurantId: number }) {
  const mutation = useCreateOffer();
  const [open, setOpen] = useState(false);

  const form = useForm<InsertOffer>({
    resolver: zodResolver(insertOfferSchema),
    defaultValues: {
      title: "",
      description: "",
      active: true
    }
  });

  const onSubmit = (data: InsertOffer) => {
    mutation.mutate({ restaurantId, ...data }, { onSuccess: () => {
      setOpen(false);
      form.reset();
    }});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-primary"><Plus className="mr-2 h-4 w-4"/> New Offer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Offer</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Title</FormLabel>
                  <FormControl><Input placeholder="e.g. 50% Off Appetizers" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Details about the offer..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Publish Offer"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: restaurant, isLoading: dataLoading } = useMyRestaurant();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/api/login");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || dataLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary"/></div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <div className="container-custom py-28 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary">Owner Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.firstName || "Chef"}.</p>
          </div>
          
          {restaurant && (
             <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <a href={`/restaurant/${restaurant.id}`} target="_blank">View Public Page</a>
                </Button>
             </div>
          )}
        </div>

        {!restaurant ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-4">Get Started</h2>
            <p className="text-muted-foreground mb-8">You haven't set up your restaurant profile yet.</p>
            <RestaurantForm mode="create" />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white border border-border p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Profile Details</TabsTrigger>
              <TabsTrigger value="offers">Offers</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Subscription</h3>
                  <div className="text-2xl font-bold text-primary capitalize">{restaurant.subscriptionTier} Tier</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Active Offers</h3>
                  <div className="text-2xl font-bold text-primary">{/* We would fetch this if relational data was deep-fetched in useMyRestaurant, assume simple prop for now */} - </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Views</h3>
                  <div className="text-2xl font-bold text-primary">0</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Restaurant Profile</h3>
                  <RestaurantForm mode="update" defaultValues={restaurant} />
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{restaurant.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{restaurant.address}, {restaurant.city}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">{restaurant.description}</dd>
                  </div>
                </dl>
              </div>
            </TabsContent>

            <TabsContent value="offers">
               <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Manage Offers</h3>
                  <CreateOfferForm restaurantId={restaurant.id} />
                </div>
                
                {/* List offers - normally we'd fetch relations or use a separate query */}
                <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                  Offers you create will appear here.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

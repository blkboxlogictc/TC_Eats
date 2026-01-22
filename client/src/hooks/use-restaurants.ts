import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertRestaurant, type Restaurant } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// GET /api/restaurants
export function useRestaurants(filters?: { search?: string; cuisine?: string; city?: string }) {
  const queryString = filters 
    ? "?" + new URLSearchParams(Object.entries(filters).filter(([_, v]) => v != null) as [string, string][]).toString()
    : "";

  return useQuery({
    queryKey: [api.restaurants.list.path, filters],
    queryFn: async () => {
      const res = await fetch(api.restaurants.list.path + queryString, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch restaurants");
      return api.restaurants.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/restaurants/:id
export function useRestaurant(id: number) {
  return useQuery({
    queryKey: [api.restaurants.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.restaurants.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch restaurant details");
      return api.restaurants.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// GET /api/my-restaurant
export function useMyRestaurant() {
  return useQuery({
    queryKey: [api.restaurants.getMyRestaurant.path],
    queryFn: async () => {
      const res = await fetch(api.restaurants.getMyRestaurant.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch my restaurant");
      // Could be null if owner hasn't created one yet, handle gracefully
      const data = await res.json();
      return data ? api.restaurants.getMyRestaurant.responses[200].parse(data) : null;
    },
    retry: false,
  });
}

// POST /api/restaurants
export function useCreateRestaurant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertRestaurant) => {
      const res = await fetch(api.restaurants.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create restaurant");
      }
      return api.restaurants.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.restaurants.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.restaurants.getMyRestaurant.path] });
      toast({ title: "Success", description: "Restaurant profile created successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

// PATCH /api/restaurants/:id
export function useUpdateRestaurant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertRestaurant>) => {
      const url = buildUrl(api.restaurants.update.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update restaurant");
      }
      return api.restaurants.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.restaurants.get.path, data.id] });
      queryClient.invalidateQueries({ queryKey: [api.restaurants.getMyRestaurant.path] });
      toast({ title: "Success", description: "Restaurant profile updated!" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

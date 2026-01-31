import { useState, useEffect, useMemo } from "react";
import { type InsertRestaurant, type Restaurant } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { getRestaurants, getRestaurantById, getMyRestaurant } from "../data/demo-data";

// Mock hook for restaurants list with filtering
export function useRestaurants(filters?: { search?: string; cuisine?: string; city?: string }) {
  const [isLoading, setIsLoading] = useState(true);
  
  const data = useMemo(() => getRestaurants(filters), [filters]);

  useEffect(() => {
    // Simulate loading delay for UX
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [filters]);

  return {
    data,
    isLoading,
    error: null,
    isError: false,
  };
}

// Mock hook for single restaurant
export function useRestaurant(id: number) {
  const [isLoading, setIsLoading] = useState(true);
  
  const data = useMemo(() => getRestaurantById(id), [id]);

  useEffect(() => {
    if (!id) return;
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [id]);

  return {
    data,
    isLoading: !!id && isLoading,
    error: null,
    isError: false,
  };
}

// Mock hook for authenticated user's restaurant
export function useMyRestaurant() {
  const [isLoading, setIsLoading] = useState(true);
  
  const data = useMemo(() => getMyRestaurant(), []);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  return {
    data,
    isLoading,
    error: null,
    isError: false,
  };
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

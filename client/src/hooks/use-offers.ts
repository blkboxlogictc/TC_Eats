import { useState, useEffect, useMemo } from "react";
import { type InsertOffer } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { getOffers, DEMO_OFFERS } from "../data/demo-data";

// Mock hook for public offers
export function usePublicOffers() {
  const [isLoading, setIsLoading] = useState(true);
  
  const data = useMemo(() => getOffers(), []);

  useEffect(() => {
    // Simulate loading delay for UX
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  return {
    data,
    isLoading,
    error: null,
    isError: false,
  };
}

// Mock mutation for creating an offer
export function useCreateOffer() {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const mutate = async (variables: { restaurantId: number } & InsertOffer) => {
    setIsPending(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsPending(false);
      
      // Create new offer object
      const newOffer = {
        id: Math.max(...DEMO_OFFERS.map(o => o.id)) + 1,
        restaurantId: variables.restaurantId,
        title: variables.title || "",
        description: variables.description || "",
        active: variables.active !== undefined ? variables.active : true,
        expiresAt: variables.expiresAt || null,
        createdAt: new Date().toISOString(),
      };

      // In a real app, this would update the data store
      // For demo purposes, we just show success
      toast({
        title: "Offer Created",
        description: "Your offer is now live! (Demo mode - changes not persisted)"
      });
    }, 1000);
  };

  const mutateAsync = (variables: { restaurantId: number } & InsertOffer) => {
    mutate(variables);
    return Promise.resolve();
  };

  return {
    mutate,
    mutateAsync,
    isPending,
    isError: false,
    error: null,
  };
}

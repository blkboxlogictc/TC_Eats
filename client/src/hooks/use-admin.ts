import { useState, useEffect, useMemo } from "react";
import { type InsertSmsCampaign } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { getStats, DEMO_PATRONS } from "../data/demo-data";

export function useAdminStats() {
  const [isLoading, setIsLoading] = useState(true);
  
  const data = useMemo(() => getStats(), []);

  useEffect(() => {
    // Simulate loading delay for UX
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return {
    data,
    isLoading,
    error: null,
    isError: false,
  };
}

export function useSendSmsCampaign() {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const mutate = async (data: InsertSmsCampaign) => {
    setIsPending(true);
    
    // Simulate SMS sending delay
    setTimeout(() => {
      setIsPending(false);
      
      // Calculate recipient count based on target criteria (demo logic)
      let recipientCount = DEMO_PATRONS.length;
      if (data.targetCriteria) {
        try {
          const criteria = JSON.parse(data.targetCriteria);
          recipientCount = DEMO_PATRONS.filter(p => {
            if (criteria.city && p.city !== criteria.city) return false;
            if (criteria.cuisine && p.cuisinePreferences) {
              const preferences = JSON.parse(p.cuisinePreferences);
              if (!preferences.includes(criteria.cuisine)) return false;
            }
            return true;
          }).length;
        } catch {
          // Keep full count if criteria parsing fails
        }
      }
      
      toast({
        title: "Campaign Sent",
        description: `Message sent to ${recipientCount} patrons. (Demo mode - no actual SMS sent)`
      });
    }, 1500);
  };

  const mutateAsync = (data: InsertSmsCampaign) => {
    mutate(data);
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

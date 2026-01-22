import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertOffer } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// GET /api/offers
export function usePublicOffers() {
  return useQuery({
    queryKey: [api.offers.listPublic.path],
    queryFn: async () => {
      const res = await fetch(api.offers.listPublic.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch offers");
      return api.offers.listPublic.responses[200].parse(await res.json());
    },
  });
}

// POST /api/restaurants/:restaurantId/offers
export function useCreateOffer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ restaurantId, ...data }: { restaurantId: number } & InsertOffer) => {
      const url = buildUrl(api.offers.create.path, { restaurantId });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create offer");
      }
      return api.offers.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      // Invalidate both public offers list and specific restaurant details which might contain offers
      queryClient.invalidateQueries({ queryKey: [api.offers.listPublic.path] });
      queryClient.invalidateQueries({ queryKey: [api.restaurants.get.path] }); 
      toast({ title: "Offer Created", description: "Your offer is now live!" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

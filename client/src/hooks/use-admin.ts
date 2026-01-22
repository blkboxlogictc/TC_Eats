import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertSmsCampaign } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useAdminStats() {
  return useQuery({
    queryKey: [api.admin.stats.path],
    queryFn: async () => {
      const res = await fetch(api.admin.stats.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.admin.stats.responses[200].parse(await res.json());
    },
  });
}

export function useSendSmsCampaign() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertSmsCampaign) => {
      const res = await fetch(api.admin.sendSms.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send SMS");
      }
      return api.admin.sendSms.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      toast({ 
        title: "Campaign Sent", 
        description: `Message sent to ${data.recipientCount} patrons.` 
      });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

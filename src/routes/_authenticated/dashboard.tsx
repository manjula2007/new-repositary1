import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingCard } from "@/components/ListingCard";
import type { Listing } from "@/lib/listings";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return;

      const [{ data: mine }, { data: favs }] = await Promise.all([
        supabase
          .from("listings")
          .select("*")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false }),
        supabase.from("favorites").select("listing_id").eq("user_id", user.id),
      ]);
      setMyListings(mine ?? []);

      const favIds = (favs ?? []).map((f) => f.listing_id);
      if (favIds.length > 0) {
        const { data: favListings } = await supabase
          .from("listings")
          .select("*")
          .in("id", favIds);
        setFavorites(favListings ?? []);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function removeListing(id: string) {
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) {
      toast.error("Could not delete listing");
      return;
    }
    setMyListings((prev) => prev.filter((l) => l.id !== id));
    await queryClient.invalidateQueries({ queryKey: ["listings"] });
    toast.success("Listing removed");
  }

  if (loading) {
    return <main className="mx-auto max-w-6xl px-4 py-16 text-center text-muted-foreground">Loading…</main>;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My listings</h1>
        <Button asChild>
          <Link to="/new">
            <PlusCircle className="mr-1 h-4 w-4" /> New listing
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="mine" className="mt-8">
        <TabsList>
          <TabsTrigger value="mine">Posted by me ({myListings.length})</TabsTrigger>
          <TabsTrigger value="saved">Saved ({favorites.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="mine">
          {myListings.length === 0 ? (
            <p className="mt-12 text-center text-muted-foreground">
              You haven't posted anything yet.{" "}
              <Link to="/new" className="font-semibold text-primary hover:underline">
                Post your first listing
              </Link>
            </p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {myListings.map((listing) => (
                <div key={listing.id} className="relative">
                  <ListingCard listing={listing} />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => removeListing(listing.id)}
                    aria-label="Delete listing"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="saved">
          {favorites.length === 0 ? (
            <p className="mt-12 text-center text-muted-foreground">
              Nothing saved yet — tap the heart on any listing to keep it here.
            </p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}

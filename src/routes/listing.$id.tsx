import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen, Laptop, Armchair, Shirt, Dumbbell, Package, MapPin, User, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categoryLabel, formatPrice, listingQuery } from "@/lib/listings";

const CATEGORY_ICONS = {
  books: BookOpen,
  electronics: Laptop,
  furniture: Armchair,
  clothing: Shirt,
  sports: Dumbbell,
  other: Package,
} as const;

export const Route = createFileRoute("/listing/$id")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(listingQuery(params.id)),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — CampusKart` : "Listing — CampusKart" },
      {
        name: "description",
        content: loaderData?.description ?? "A listing on CampusKart, the campus marketplace.",
      },
      { property: "og:title", content: loaderData ? `${loaderData.title} — CampusKart` : "CampusKart" },
      {
        property: "og:description",
        content: loaderData?.description ?? "A listing on CampusKart, the campus marketplace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ListingPage,
});

function ListingPage() {
  const { id } = Route.useParams();
  const { data: listing } = useSuspenseQuery(listingQuery(id));
  const [isFav, setIsFav] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const Icon = CATEGORY_ICONS[listing.category as keyof typeof CATEGORY_ICONS] ?? BookOpen;

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      setUserId(user?.id ?? null);
      if (!user) return;
      const { data: fav } = await supabase
        .from("favorites")
        .select("listing_id")
        .eq("user_id", user.id)
        .eq("listing_id", listing.id)
        .maybeSingle();
      setIsFav(!!fav);
    });
  }, [listing.id]);

  async function toggleFavorite() {
    if (!userId) {
      toast.info("Sign in to save listings");
      return;
    }
    if (isFav) {
      await supabase.from("favorites").delete().eq("user_id", userId).eq("listing_id", listing.id);
      setIsFav(false);
    } else {
      await supabase.from("favorites").insert({ user_id: userId, listing_id: listing.id });
      setIsFav(true);
      toast.success("Saved to your favorites");
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div
        className={`category-gradient-${listing.category} flex h-72 items-center justify-center rounded-3xl`}
      >
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            className="h-full w-full rounded-3xl object-cover"
          />
        ) : (
          <Icon className="h-20 w-20 text-foreground/30" />
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="secondary">{categoryLabel(listing.category)}</Badge>
          <h1 className="mt-2 text-3xl font-bold">{listing.title}</h1>
          <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" /> {listing.location}
          </p>
        </div>
        <div className="text-right">
          <p className="font-heading text-3xl font-extrabold text-primary">
            {formatPrice(listing.price)}
          </p>
          <Button className="mt-3" variant={isFav ? "secondary" : "outline"} onClick={toggleFavorite}>
            <Heart className={`mr-1 h-4 w-4 ${isFav ? "fill-current" : ""}`} />
            {isFav ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      <p className="mt-6 leading-relaxed text-foreground/90">{listing.description}</p>

      <div className="mt-10 flex items-center justify-between rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent">
            <User className="h-5 w-5 text-accent-foreground" />
          </span>
          <div>
            <p className="font-semibold">{listing.seller_name}</p>
            <p className="text-xs text-muted-foreground">Student seller</p>
          </div>
        </div>
        {userId ? (
          <Button asChild>
            <a href={`mailto:?subject=${encodeURIComponent(`Interested in: ${listing.title}`)}`}>
              Contact seller
            </a>
          </Button>
        ) : (
          <Button asChild>
            <Link to="/auth">Sign in to contact</Link>
          </Button>
        )}
      </div>
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/ListingCard";
import { CATEGORIES, listingsQuery } from "@/lib/listings";

const browseSearch = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/browse")({
  validateSearch: browseSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(listingsQuery(deps.category, deps.q)),
  head: () => ({
    meta: [
      { title: "Browse Listings — CampusKart" },
      {
        name: "description",
        content: "Browse second-hand textbooks, electronics, furniture, and more posted by students.",
      },
      { property: "og:title", content: "Browse Listings — CampusKart" },
      {
        property: "og:description",
        content: "Browse second-hand textbooks, electronics, furniture, and more posted by students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BrowsePage,
});

function BrowsePage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/browse" });
  const { data: listings } = useSuspenseQuery(listingsQuery(search.category, search.q));

  function setFilter(next: { category?: string | undefined; q?: string | undefined }) {
    const search: Record<string, string> = {};
    if (next.category) search["category"] = next.category;
    if (next.q) search["q"] = next.q;
    navigate({ search, replace: true });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Browse listings</h1>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search books, laptops, cycles…"
            defaultValue={search.q ?? ""}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                setFilter({ category: search.category, q: e.currentTarget.value });
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!search.category ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter({ q: search.q })}
          >
            All
          </Button>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              variant={search.category === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter({ category: cat.value, q: search.q })}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {listings.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          Nothing here yet — be the first to post in this category!
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}

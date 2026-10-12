import { Link } from "@tanstack/react-router";
import { BookOpen, Laptop, Armchair, Shirt, Dumbbell, Package, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { categoryLabel, formatPrice, type Listing } from "@/lib/listings";

const CATEGORY_ICONS = {
  books: BookOpen,
  electronics: Laptop,
  furniture: Armchair,
  clothing: Shirt,
  sports: Dumbbell,
  other: Package,
} as const;

export function ListingCard({ listing }: { listing: Listing }) {
  const Icon = CATEGORY_ICONS[listing.category as keyof typeof CATEGORY_ICONS] ?? BookOpen;

  return (
    <Link to="/listing/$id" params={{ id: listing.id }} className="group block">
      <Card className="overflow-hidden border transition-shadow group-hover:shadow-lg">
        <div
          className={`category-gradient-${listing.category} flex h-40 items-center justify-center`}
        >
          {listing.image_url ? (
            <img
              src={listing.image_url}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <Icon className="h-12 w-12 text-foreground/30" />
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-semibold">{listing.title}</h3>
            <span className="shrink-0 font-heading text-sm font-bold text-primary">
              {formatPrice(listing.price)}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{listing.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <Badge variant="secondary">{categoryLabel(listing.category)}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {listing.location}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

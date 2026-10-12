import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Listing = Tables<"listings">;

export const CATEGORIES = [
  { value: "books", label: "Books & Notes", blurb: "Textbooks, guides, calculators" },
  { value: "electronics", label: "Electronics", blurb: "Laptops, phones, gadgets" },
  { value: "furniture", label: "Furniture", blurb: "Desks, chairs, mini fridges" },
  { value: "clothing", label: "Clothing", blurb: "Jackets, shoes, essentials" },
  { value: "sports", label: "Sports & Fitness", blurb: "Cycles, gear, equipment" },
  { value: "other", label: "Everything Else", blurb: "Guitars, decor, misc finds" },
] as const;

export type Category = (typeof CATEGORIES)[number]["value"];

export function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function formatPrice(price: number) {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

async function fetchListings(category?: string, search?: string) {
  let query = supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export const listingsQuery = (category?: string, search?: string) =>
  queryOptions({
    queryKey: ["listings", category ?? "all", search ?? ""],
    queryFn: () => fetchListings(category, search),
  });

async function fetchListing(id: string) {
  const { data, error } = await supabase.from("listings").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export const listingQuery = (id: string) =>
  queryOptions({
    queryKey: ["listing", id],
    queryFn: () => fetchListing(id),
  });

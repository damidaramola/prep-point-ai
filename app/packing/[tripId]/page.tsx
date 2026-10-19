"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTrip } from "@/app/hooks/useTrip"
import { PackingItem } from "@/app/types";
import { getPackingItems, savePackingItems, setPackingComplete, getTips } from "@/lib/storage";
import Button from "@/app/components/Button";
import ChecklistItem from "@/app/components/ChecklistItem";
import ProgressBar from "@/app/components/ProgressBar";
import Spinner from "@/app/components/Spinner";
import Card from "@/app/components/Cards";
import PageShell, { PageHeader, BackLink } from "@/app/components/PageShell";
import TripNotFound from "@/app/components/TripNotFound";
import { LuggageIcon } from "@/app/components/Icons";

const defaultItems: PackingItem[] = [
  { id: 1, name: "T-shirts", category: "Clothing", packed: false },
  { id: 2, name: "Pants", category: "Clothing", packed: false },
  { id: 3, name: "Underwear", category: "Clothing", packed: false },
  { id: 4, name: "Toothbrush", category: "Toiletries", packed: false },
  { id: 5, name: "Shampoo", category: "Toiletries", packed: false },
  { id: 6, name: "Passport", category: "Documents", packed: false },
  { id: 7, name: "Tickets", category: "Documents", packed: false },
  { id: 8, name: "Phone Charger", category: "Electronics", packed: false },
  { id: 9, name: "Adapter", category: "Electronics", packed: false },
];

export default function PackingPage() {
  const router = useRouter();
  const { status, tripId } = useTrip();

  const [items, setItems] = useState<PackingItem[]>([]);
  const [itemsLoaded, setItemsLoaded] = useState(false);

  useEffect(() => {
    if (!tripId || status !== "found" || typeof tripId !== "string") return;
    const storedItems = getPackingItems(tripId);
    const suggested = getTips(tripId)?.packingItems ?? [];

    const loaded: PackingItem[] =
      storedItems.length > 0 ? storedItems
        : suggested.length > 0 ? suggested.map((item, i) => ({ id: i + 1, ...item, packed: false }))
          : defaultItems;
    setItems(loaded);
    setItemsLoaded(true);
  }, [tripId, status]);

  useEffect(() => {
    if (!itemsLoaded || status !== "found" || !tripId || typeof tripId !== "string") return;
    savePackingItems(tripId, items)
  }, [items, tripId, itemsLoaded, status]);

  // Track completion
  const total = items.length;
  const packed = items.filter((i) => i.packed).length;
  const overallProgress = total ? Math.round((packed / total) * 100) : 0;
  const isComplete = overallProgress === 100;

  useEffect(() => {
    if (!itemsLoaded || status !== "found" || !tripId || typeof tripId !== "string") return;
    setPackingComplete(tripId, isComplete);
  }, [isComplete, tripId, status,itemsLoaded]);

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const categories = [...new Set(items.map((i) => i.category))];
  if (status === "loading") {
    return (<PageShell><Spinner className="justify-center py-20" /></PageShell>)
  }
  if (status === "not-found") {
    return <TripNotFound />;
  }
  return (
    <PageShell>
      <BackLink href={`/timeline/${tripId}`}>Back to timeline</BackLink>
      <PageHeader
        title="Packing Checklist"
        subtitle={isComplete ? "All packed. You're ready to go!" : `${packed} of ${total} items packed`}
        icon={<LuggageIcon className="h-6 w-6" />}
      />

      <Card className="grid gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Overall</h2>
          <span className="text-sm font-medium text-sky-600">{overallProgress}% packed</span>
        </div>
        <ProgressBar progress={overallProgress} />
      </Card>

      {categories.map((category) => {
        const categoryItems = items.filter((i) => i.category === category);
        const done = categoryItems.filter((i) => i.packed).length;
        const percent = Math.round((done / categoryItems.length) * 100);

        return (
          <section key={category} className="grid gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">{category}</h2>
              <span className="text-xs text-slate-500">{done}/{categoryItems.length}</span>
            </div>
            <ProgressBar progress={percent} />
            <ul className="grid gap-2">
              {categoryItems.map((item) => (
                <ChecklistItem
                  key={item.id}
                  label={item.name}
                  checked={item.packed}
                  onToggle={() => toggleItem(item.id)}
                />
              ))}
            </ul>
          </section>
        );
      })}

      <Button variant="primary" size="lg" onClick={() => router.push("/dashboard")}>
        Go to my trips
      </Button>
    </PageShell>
  );
}
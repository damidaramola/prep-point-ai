"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTrip } from "@/app/hooks/useTrip"
import { PackingItem } from "@/app/types";
import { getPackingItems, savePackingItems, setPackingComplete } from "@/lib/storage";
import Button from "@/app/components/Button";
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

  // Load from localStorage using backtick template literal
  useEffect(() => {
    if (!tripId ||status !== "found"|| typeof tripId !== "string") return;
    const storedItems = getPackingItems(tripId);
    if (storedItems.length > 0) {
      setItems(storedItems)
    }
    else {
      setItems(defaultItems);
    }
    setItemsLoaded(true);
  }, [tripId, status]);

  useEffect(() => {
    if (!itemsLoaded || status !== "found"|| !tripId || typeof tripId !== "string") return;
    savePackingItems(tripId, items)
  }, [items, tripId, itemsLoaded, status]);

  // Track completion
  const total = items.length;
  const packed = items.filter((i) => i.packed).length;
  const overallProgress = total ? Math.round((packed / total) * 100) : 0;
  const isComplete = overallProgress === 100;

  useEffect(() => {
    if (!itemsLoaded ||status !== "found"|| !tripId || typeof tripId !== "string") return;
    setPackingComplete(tripId, isComplete);
  }, [isComplete, tripId,status]);

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const categories = [...new Set(items.map((i) => i.category))];
  if (status === "loading") {
    return (<div>Loading..</div>)

  }
  else if (
    status === "not-found"
  ) {

    return (<div>Trip not found<Button variant="secondary" size="md" onClick={() => router.push("/landing")}
    >go to landing page</Button></div>);

  }
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Packing Checklist 🎒</h1>

      <button
        type="button"
        onClick={() => router.push(`/timeline/${tripId}`)}
        className="mb-4 border p-2 rounded text-sm"
      >
        ← Back to Timeline
      </button>

      <div className="mb-6">
        <div className="bg-gray-200 h-3 rounded overflow-hidden">
          <div className="bg-green-500 h-full" style={{ width: `${overallProgress}%` }} />
        </div>
        <p className="text-sm mt-1">{overallProgress}% packed</p>
      </div>

      {categories.map((category) => {
        const categoryItems = items.filter((i) => i.category === category);
        const done = categoryItems.filter((i) => i.packed).length;
        const percent = Math.round((done / categoryItems.length) * 100);

        return (
          <div key={category} className="mb-6">
            <h2 className="font-semibold mb-2">{category}</h2>
            <div className="bg-gray-100 h-2 rounded mb-3 overflow-hidden">
              <div className="bg-blue-400 h-full" style={{ width: `${percent}%` }} />
            </div>
            <ul className="space-y-2">
              {categoryItems.map((item) => (
                <li key={item.id} className="flex items-center gap-2 border p-2 rounded">
                  <input
                    type="checkbox"
                    checked={item.packed}
                    onChange={() => toggleItem(item.id)}
                  />
                  <span className={item.packed ? "line-through text-gray-400" : ""}>
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
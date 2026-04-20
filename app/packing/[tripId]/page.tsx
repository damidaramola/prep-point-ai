"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Item = {
  id: number;
  name: string;
  category: string;
  packed: boolean;
};

const defaultItems: Item[] = [
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
  const params = useParams();
  const tripId = params.tripId as string;

  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage using backtick template literal
  useEffect(() => {
    if (!tripId) return;
    const stored = localStorage.getItem(`packing-${tripId}`);
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      setItems(defaultItems);
    }
    setLoaded(true);
  }, [tripId]);

  useEffect(() => {
    if (!loaded || !tripId) return;
    localStorage.setItem(`packing-${tripId}`, JSON.stringify(items));
  }, [items, tripId, loaded]);

  // Track completion
  const total = items.length;
  const packed = items.filter((i) => i.packed).length;
  const overallProgress = total ? Math.round((packed / total) * 100) : 0;
  const isComplete = overallProgress === 100;

  useEffect(() => {
    if (!tripId) return;
    localStorage.setItem(`packingComplete-${tripId}`, JSON.stringify(isComplete));
  }, [isComplete, tripId]);

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const categories = [...new Set(items.map((i) => i.category))];

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
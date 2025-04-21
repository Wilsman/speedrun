import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { ProgressBar } from "./ProgressBar";

interface CollectorItem {
  found: boolean;
  _id: Id<"collectorItems">;
  _creationTime: number;
  name: string;
  order: number;
  img: string;
}

export function CollectorItems() {
  const [searchTerm, setSearchTerm] = useState("");
  const items = useQuery(api.collector.list) as CollectorItem[] | undefined;
  const toggleItem = useMutation(api.collector.toggleItem);

  const handleToggle = (itemId: Id<"collectorItems">) => {
    void toggleItem({ itemId });
  };

  const filteredItems =
    items?.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? [];

  const foundCount = items?.filter((item) => item.found).length ?? 0;
  const totalCount = items?.length ?? 0;

  if (items === undefined) {
    return (
      <div className="text-center text-gray-400 py-4">
        Loading collector items...
      </div>
    );
  }

  return (
    <div className="w-full mx-auto mt-8 space-y-4">
      <div>
        <div className="flex justify-between items-center text-gray-300 mb-1">
          <span>Collector Progress</span>
          <span>
            {foundCount} / {totalCount} items found
          </span>
        </div>
        <ProgressBar value={foundCount} max={totalCount} />
      </div>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        className="w-full bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-500 rounded px-2 py-1 focus:outline-none"
      />
      <div className="space-y-2">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <label
              key={item._id}
              className="flex items-center gap-2 text-gray-200 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={item.found}
                onChange={() => handleToggle(item._id)}
                className="accent-amber-500 w-5 h-5 rounded border-gray-600 focus:ring-amber-500 focus:ring-offset-gray-800"
              />
              {item.img && (
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-7 h-7 rounded object-cover bg-gray-800 border border-gray-700"
                  width={28}
                  height={28}
                  loading="lazy"
                />
              )}
              <span className={item.found ? "line-through text-gray-500" : "text-gray-100"}>
                {item.name}
              </span>
            </label>
          ))
        ) : (
          <p className="text-gray-400 text-center py-4">
            {searchTerm
              ? `No items found matching "${searchTerm}".`
              : "No collector items loaded."}
          </p>
        )}
      </div>
    </div>
  );
}

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

const TRADER_LEVELS = {
  "Prapor": 4,
  "Therapist": 4,
  "Skier": 4,
  "Peacekeeper": 4,
  "Mechanic": 4,
  "Ragman": 4,
  "Jaeger": 4,
};

const SKILL_LEVELS = {
  "Strength": 51,
  "Endurance": 51,
  "Vitality": 51,
  "Health": 51,
  "Stress Resistance": 51,
};

const HIDEOUT_ITEMS = {
  "FireKlean Gun Lube": 1,
  "Alkaline Cleaner": 2,
  "Aseptic Bandage": 2,
  "Awl": 1,
  "Bolts": 13,
  // Add more items as needed
};

export function HideoutProgress() {
  const progress = useQuery(api.hideout.getHideoutProgress);
  const updateProgress = useMutation(api.hideout.updateHideoutProgress);
  const [activeTab, setActiveTab] = useState<"traders" | "skills" | "items">("traders");

  if (!progress) return null;

  const { skills, traders, items } = progress.hideoutProgress;

  const renderProgressSection = (
    title: string,
    type: "traders" | "skills" | "items",
    requirements: Record<string, number>
  ) => {
    const currentProgress = type === "traders" ? traders : type === "skills" ? skills : items;

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-amber-500">{title}</h3>
        <div className="grid gap-4">
          {Object.entries(requirements).map(([name, required]) => {
            const current = currentProgress[name] ?? 0;
            const itemProgressPercentage = Math.min((current / required) * 100, 100);

            return (
              <div key={name} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-200">{name}</span>
                  <div className="text-sm text-gray-400">
                    {current} / {required}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-gray-700 rounded">
                    <div
                      className="h-full bg-amber-500 rounded transition-all duration-300"
                      style={{ width: `${itemProgressPercentage}%` }}
                    />
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={required}
                    value={current}
                    onChange={(e) => {
                      const value = Math.max(0, Math.min(required, parseInt(e.target.value) || 0));
                      void updateProgress({
                        ...progress.hideoutProgress,
                        [type]: {
                          ...progress.hideoutProgress[type],
                          [name]: value,
                        },
                      });
                    }}
                    className="w-20 bg-gray-700 text-gray-100 rounded px-2 py-1"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8">
      <div className="flex gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "traders"
              ? "bg-amber-500 text-gray-900"
              : "bg-gray-800 text-gray-100 hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("traders")}
        >
          Traders
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "skills"
              ? "bg-amber-500 text-gray-900"
              : "bg-gray-800 text-gray-100 hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("skills")}
        >
          Skills
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "items"
              ? "bg-amber-500 text-gray-900"
              : "bg-gray-800 text-gray-100 hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("items")}
        >
          Items
        </button>
      </div>

      <div className="space-y-8">
        {activeTab === "traders" &&
          renderProgressSection("Trader Levels", "traders", TRADER_LEVELS)}
        {activeTab === "skills" &&
          renderProgressSection("Skill Levels", "skills", SKILL_LEVELS)}
        {activeTab === "items" &&
          renderProgressSection("Required Items", "items", HIDEOUT_ITEMS)}
      </div>
    </div>
  );
}

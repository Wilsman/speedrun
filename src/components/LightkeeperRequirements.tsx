import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { lightkeeperQuestUrls } from "@/data/lightkeeperQuestUrls"; // Corrected import path

export function LightkeeperRequirements() {
  const quests = useQuery(api.lightkeeper.getAllLightkeeperQuests, {});
  const progress = useQuery(api.lightkeeper.getUserLightkeeperProgress, {});
  const toggleQuest = useMutation(api.lightkeeper.toggleLightkeeperQuest);

  // Simplified loading/empty states (consistent with CollectorItems)
  if (quests === undefined || progress === undefined) {
    return <div className="mt-8 text-center text-gray-400">Loading Lightkeeper Quests...</div>;
  }
  if (quests === null || quests.length === 0) {
    return <div className="mt-8 text-center text-gray-400">No Lightkeeper Quests found. Try seeding.</div>;
  }

  const progressMap = new Map(progress?.map((p) => [p.questId, p.completed]) ?? []);
  const handleToggle = (questId: Id<"lightkeeperQuests">) => {
    console.log("Toggling quest:", questId);
    void toggleQuest({ questId });
  };

  const completedCount = quests.filter((q) => progressMap.get(q._id)).length;
  const totalQuests = quests.length;
  const overallProgress = totalQuests > 0 ? (completedCount / totalQuests) * 100 : 0;

  return (
    // Outer container like CollectorItems (width, margin, spacing)
    <div className="w-full mx-auto mt-8 space-y-4">
      {/* Main Title */} 
      <h3 className="text-xl font-semibold text-amber-500">Lightkeeper Requirements</h3>

      {/* Progress Bar Section (no surrounding box) */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-1 text-gray-300"> {/* Adjusted margin and text color */} 
          <span>Overall Progress</span>
          <span> {/* Adjusted span */} 
            {completedCount} / {totalQuests} tasks completed
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded"> {/* Simple progress bar container */} 
          <div
            className="h-full bg-amber-500 rounded transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Quest List Section (no surrounding box, no fixed height scroll) */}
      <div className="bg-gray-800 p-4 rounded-lg"> {/* Just the list with item spacing */} 
        {quests.map((quest) => (
          <label
            key={quest._id}
            className="flex items-center space-x-2 py-1 cursor-pointer select-none hover:bg-gray-700 rounded"
          >
            {/* Wiki icon link */}
            <a
              href={lightkeeperQuestUrls[quest.name] || "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open wiki page for ${quest.name}`}
              className="mr-1 text-gray-400 hover:text-blue-500"
              tabIndex={-1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 lucide lucide-link-icon lucide-link">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </a>
            <input
              type="checkbox"
              checked={!!progressMap.get(quest._id)}
              onChange={() => handleToggle(quest._id)}
              aria-label={`Mark ${quest.name} as completed`}
              className="accent-amber-500 w-5 h-5 rounded border-gray-600 focus:ring-amber-500 focus:ring-offset-gray-800 cursor-pointer"
            />
            <span className={progressMap.get(quest._id) ? "text-gray-400 line-through" : "text-gray-100"}>
              {quest.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

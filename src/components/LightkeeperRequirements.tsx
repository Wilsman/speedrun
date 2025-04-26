import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { lightkeeperQuestUrls } from "@/data/lightkeeperQuestUrls"; // Corrected import path

export function LightkeeperRequirements() {
  const quests = useQuery(api.lightkeeper.getAllLightkeeperQuests, {});
  const progress = useQuery(api.lightkeeper.getUserLightkeeperProgress, {});
  const toggleQuest = useMutation(api.lightkeeper.toggleLightkeeperQuest);
  // Import the new mutation
  const toggleSubTask = useMutation(api.lightkeeper.toggleLightkeeperSubTask);

  // Simplified loading/empty states (consistent with CollectorItems)
  if (quests === undefined || progress === undefined) {
    return <div className="mt-8 text-center text-gray-400">Loading Lightkeeper Quests...</div>;
  }
  if (quests === null || quests.length === 0) {
    return <div className="mt-8 text-center text-gray-400">No Lightkeeper Quests found. Try seeding.</div>;
  }

  // Create a map for faster progress lookup, including sub-task completion
  const progressMap = new Map(
    progress?.map((p) => [p.questId, { completed: p.completed, subTasksCompleted: p.subTasksCompleted ?? [] }]) ?? []
  );

  const handleToggle = (questId: Id<"lightkeeperQuests">) => {
    console.log("Toggling quest:", questId);
    void toggleQuest({ questId });
  };

  // Handler for sub-task toggling
  const handleSubTaskToggle = async (
    questId: Id<"lightkeeperQuests">,
    subTaskIndex: number
  ) => {
    console.log("Toggling sub-task:", questId, subTaskIndex);
    // Ensure the main quest progress exists before trying to toggle subtask
    if (progressMap.has(questId)) {
        void toggleSubTask({ questId, subTaskIndex });
    } else {
        console.log("Main quest progress not found locally, creating...");
        try {
          // 1. Create the main progress record, ensuring it's marked as incomplete initially.
          await toggleQuest({ questId: questId, initialState: false });
          console.log("Main quest progress created.");
          // 2. Now toggle the sub-task.
          await toggleSubTask({ questId, subTaskIndex });
          console.log("Sub-task toggled successfully after creating main progress.");
        } catch (error) {
          console.error("Error handling sub-task toggle after creation:", error);
        }
    }
  };


  const completedCount = quests.filter((q) => progressMap.get(q._id)?.completed).length;
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
        {quests.map((quest) => {
          const questInfo = lightkeeperQuestUrls[quest.name];
          const currentProgress = progressMap.get(quest._id);
          const isQuestComplete = !!currentProgress?.completed;
          const completedSubTasks = currentProgress?.subTasksCompleted ?? [];
          const hasSubTasks = questInfo?.subTasks && questInfo.subTasks.length > 0;

          return (
            <div key={quest._id} className="py-1">
              <label
                className="flex items-center space-x-2 cursor-pointer select-none hover:bg-gray-700 rounded px-1"
              >
                {/* Wiki icon link */}
                <a
                  href={questInfo?.url || "#"} // Use URL from questInfo
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
                  checked={isQuestComplete}
                  onChange={() => handleToggle(quest._id)}
                  aria-label={`Mark ${quest.name} as completed`}
                  className="accent-amber-500 w-5 h-5 rounded border-gray-600 focus:ring-amber-500 focus:ring-offset-gray-800 cursor-pointer"
                />
                <span className={isQuestComplete ? "text-gray-400 line-through" : "text-gray-100"}>
                  {quest.name}
                </span>
              </label>
              {/* Render sub-tasks if they exist */}
              {hasSubTasks && (
                <ul className="mt-1 ml-10 pl-2 border-l border-gray-700 space-y-0.5">
                  {questInfo.subTasks?.map((subTask, index) => {
                    const isSubTaskComplete = completedSubTasks.includes(index);
                    return (
                      <li key={index} className="text-sm text-gray-400 flex items-center space-x-1.5">
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                           <input
                            type="checkbox"
                            checked={isSubTaskComplete}
                            onChange={() => { void handleSubTaskToggle(quest._id, index); }} // Wrap async call
                            aria-label={`Mark sub-task ${subTask.item} as completed`}
                            className="accent-green-500 w-4 h-4 rounded border-gray-600 focus:ring-green-500 focus:ring-offset-gray-800 cursor-pointer"
                           />
                          <span className={isSubTaskComplete ? "line-through" : ""}>
                            <span className="ml-1">{subTask.item}</span>
                             {subTask.foundInRaid && (
                              <span className="ml-1 text-xs text-green-400">(FiR)</span>
                            )}
                          </span>
                         </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

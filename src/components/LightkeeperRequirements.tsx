import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { lightkeeperQuests, type SubTask, type QuestInfo } from "@/data/lightkeeperTasks"; // Import QuestInfo type
import { useState, useMemo } from 'react'; // Import useMemo

// Define a type for the combined quest data
interface FullQuestData {
  _id: Id<"lightkeeperQuests">;
  name: string;
  info: QuestInfo | undefined;
}

export function LightkeeperRequirements() {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedLocation, setSelectedLocation] = useState(""); // Add location filter state

  // Extract unique locations for the dropdown (Moved UP - Depends only on static import)
  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>();
    lightkeeperQuests.forEach(q => {
      if (q.location) locations.add(q.location);
    });
    // Sort locations alphabetically, handling 'Anywhere'/'N/A' if needed
    return ["", ...Array.from(locations).sort((a, b) => {
      if (a === 'Anywhere' || a === 'N/A') return -1;
      if (b === 'Anywhere' || b === 'N/A') return 1;
      return a.localeCompare(b);
    })];
  }, []); // Empty dependency array means this runs once

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
  const progressMap = new Map<
    Id<"lightkeeperQuests">,
    { completed: boolean; subTasksCompleted: number[] }
  >(
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

  // Filter quests based on search term AND selected location
  // Use the already checked 'quests' variable which cannot be undefined/null here
  const filteredQuests = quests.filter((quest) => {
    const nameMatch = quest.name.toLowerCase().includes(searchTerm.toLowerCase());
    const questInfo = lightkeeperQuests.find(q => q.name === quest.name);
    const locationMatch = selectedLocation === "" || questInfo?.location === selectedLocation;
    return nameMatch && locationMatch;
  });

  // Combine filtered Convex data with static info (needed for display)
  const fullFilteredQuests: FullQuestData[] = filteredQuests.map(quest => ({
    ...quest,
    info: lightkeeperQuests.find(q => q.name === quest.name),
  }));

  // Calculate progress based on the *final* filtered list
  const completedCount = filteredQuests.filter((q) => progressMap.get(q._id)?.completed).length; 
  const totalFilteredQuests = filteredQuests.length; 
  const overallProgress = totalFilteredQuests > 0 ? (completedCount / totalFilteredQuests) * 100 : 0;

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
            {completedCount} / {totalFilteredQuests} tasks completed {/* Use totalFilteredQuests */}
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded"> {/* Simple progress bar container */} 
          <div
            className="h-full bg-amber-500 rounded transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Search and Location Filter Row */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search Tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-500 rounded px-2 py-1 focus:outline-none" 
        />
        {/* Location Filter Dropdown */}
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-gray-200 rounded px-2 py-1 focus:outline-none"
          aria-label="Filter by Location"
        >
          {uniqueLocations.map(location => (
            <option key={location} value={location}>
              {location === "" ? "All Locations" : location}
            </option>
          ))}
        </select>
      </div>

      {/* Quest List Section - Flat List */}
      <div className="bg-gray-800 p-4 rounded-lg">
        {filteredQuests.length > 0 ? (
          <div className="space-y-1"> {/* Add spacing for flat list items */}
            {fullFilteredQuests.map((quest) => {
              const questInfo = quest.info;
              const currentProgress = progressMap.get(quest._id);
              const isQuestComplete = !!currentProgress?.completed;
              const completedSubTasks = currentProgress?.subTasksCompleted ?? [];
              const hasSubTasks = questInfo?.subTasks && questInfo.subTasks.length > 0;

              return (
                <div key={quest._id}>
                  <label className="flex items-center space-x-2 cursor-pointer select-none hover:bg-gray-700 rounded px-1">
                    <a href={questInfo?.url || "#"} target="_blank" rel="noopener noreferrer" aria-label={`Open wiki page for ${quest.name}`} className="mr-1 text-gray-400 hover:text-blue-500" tabIndex={-1}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 lucide lucide-link-icon lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    </a>
                    <input type="checkbox" checked={isQuestComplete} onChange={() => handleToggle(quest._id)} aria-label={`Mark ${quest.name} as completed`} className="accent-amber-500 w-5 h-5 rounded border-gray-600 focus:ring-amber-500 focus:ring-offset-gray-800 cursor-pointer"/>
                    <span className={isQuestComplete ? "text-gray-400 line-through" : "text-gray-100"}>
                      {quest.name}
                      {/* Show location/trader in flat view */}
                      {questInfo && (
                        <span className="text-xs text-gray-500 ml-1">({questInfo.trader} - {questInfo.location})</span>
                      )}
                    </span>
                  </label>
                  {hasSubTasks && questInfo && (
                    <ul className="mt-1 ml-10 pl-2 border-l border-gray-700 space-y-0.5">
                      {questInfo.subTasks?.map((subTask: SubTask, index: number) => {
                        const isSubTaskComplete = completedSubTasks.includes(index);
                        return (
                          <li key={index} className="text-sm text-gray-400 flex items-center space-x-1.5">
                            <label className="flex items-center space-x-1.5 cursor-pointer">
                              <input type="checkbox" checked={isSubTaskComplete} onChange={() => { void handleSubTaskToggle(quest._id, index); }} aria-label={`Mark sub-task ${subTask.item} as completed`} className="accent-green-500 w-4 h-4 rounded border-gray-600 focus:ring-green-500 focus:ring-offset-gray-800 cursor-pointer"/>
                              <span className={isSubTaskComplete ? "line-through" : ""}>
                                <span className="ml-1">{subTask.item}</span>
                                {subTask.foundInRaid && (<span className="ml-1 text-xs text-green-400">(FiR)</span>)}
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
        ) : (
          <p className="text-gray-400 text-center py-4">
            {searchTerm || selectedLocation
              ? `No tasks found matching your filters.`
              : "No Lightkeeper tasks loaded."}
          </p>
        )}
      </div>
    </div>
  );
}

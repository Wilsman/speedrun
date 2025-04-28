import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import kappaTasksData from "../../src/data/kappaTasks";

// Define the traders required for Kappa
const KAPPA_TRADERS = [
  "Prapor",
  "Therapist",
  "Skier",
  "Peacekeeper",
  "Mechanic",
  "Ragman",
  "Jaeger",
];

// Define the Task type based on LOCAL data structure
interface LocalTask {
  name: string;
  order: number;
  completed: boolean;
}

interface TraderTaskListProps {
  trader: string;
  tasks: LocalTask[];
}

function TraderTaskList({ trader, tasks }: TraderTaskListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const toggleTask = useMutation(api.tasks.toggleTask);

  const handleToggle = (taskName: string) => {
    const taskIdentifier = `${trader}:${taskName}`;
    void toggleTask({ taskIdentifier });
  };

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="">
      <input
        type="text"
        placeholder={`Search ${trader} tasks...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-3 mb-2 w-full bg-[#2a2a2a] border border-gray-600 text-gray-200 placeholder-gray-500 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
      />
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filteredTasks.length > 0 ? (
          filteredTasks
            .sort((a, b) => a.order - b.order)
            .map((task) => (
              <div key={`${trader}-${task.name}`} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`${trader}-${task.name}`}
                  checked={task.completed}
                  onChange={() => handleToggle(task.name)}
                  className="accent-amber-500 w-5 h-5 rounded border-gray-600 focus:ring-amber-500 focus:ring-offset-gray-800"
                />
                <label
                  htmlFor={`${trader}-${task.name}`}
                  className={`text-sm font-medium cursor-pointer ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}
                >
                  {task.name}
                </label>
              </div>
            ))
        ) : (
          <p className="text-gray-400 text-sm">
            No matching tasks found for "{searchTerm}".
          </p>
        )}
      </div>
    </div>
  );
}

export function KappaTaskList() {
  const [openTrader, setOpenTrader] = useState<string | null>(null);

  // Fetch user progress using the new query
  const userProgress = useQuery(api.tasks.getProgress);

  const toggleTrader = (trader: string) => {
    setOpenTrader(openTrader === trader ? null : trader);
  };

  const processedTasksByTrader = Object.entries(kappaTasksData)
    .filter(([trader]) => KAPPA_TRADERS.includes(trader))
    .reduce((acc, [trader, tasks]) => {
      acc[trader] = tasks.map(task => ({
        ...task,
        // Determine completed status from fetched userProgress
        completed: userProgress?.[`${trader}:${task.name}`] ?? false,
      }));
      return acc;
    }, {} as Record<string, LocalTask[]>);

  // Calculate overall progress based on processed tasks
  const allProcessedTasks = Object.values(processedTasksByTrader).flat();
  const overallCompleted = allProcessedTasks.filter(task => task.completed).length;
  const overallTotal = allProcessedTasks.length;

  // Add loading state while userProgress is fetching
  if (userProgress === undefined) {
    return <div className="text-center text-gray-400 py-4">Loading task progress...</div>;
  }

  return (
    <div className="w-full space-y-4">
      
      <div className="bg-gray-800 border border-gray-700 rounded-md p-4 mt-6 mb-6">
        <div className="flex justify-between items-center mb-2 text-sm text-gray-300">
          <span>Overall Progress</span>
          <span>{overallCompleted} / {overallTotal} tasks completed</span>
        </div>
        <ProgressBar value={overallCompleted} max={overallTotal} />
      </div>

      {KAPPA_TRADERS.map((trader) => {
        const traderTasks = processedTasksByTrader[trader] || [];
        const traderCompleted = traderTasks.filter(t => t.completed).length;
        const traderTotal = traderTasks.length;
        return (
          <div key={trader} className="border border-gray-700 rounded-md overflow-hidden">
            <button
              onClick={() => toggleTrader(trader)}
              className="w-full flex flex-col items-start bg-gray-800 hover:bg-gray-700 px-4 py-3 text-left text-lg font-medium text-amber-400 focus:outline-none"
            >
              <div className="flex w-full justify-between items-center">
                <span>{trader}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">
                    {traderCompleted} / {traderTotal}
                  </span>
                  <span className={`transform transition-transform duration-200 ${openTrader === trader ? 'rotate-180' : ''}`}>▼</span>
                </div>
              </div>
              <div className="w-full mt-1">
                <ProgressBar value={traderCompleted} max={traderTotal} />
              </div>
            </button>
            {openTrader === trader && (
              <div className="px-4 pb-4">
                <TraderTaskList trader={trader} tasks={traderTasks} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

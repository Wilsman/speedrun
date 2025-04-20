import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { ProgressBar } from "./ProgressBar";

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

// Define the Task type based on query structure
interface Task {
  _id: Id<"tasks">;
  name: string;
  trader: string;
  order: number;
  completed: boolean;
}

function TraderTaskList({ trader, tasks }: { trader: string, tasks: Task[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const toggleTask = useMutation(api.tasks.toggleTask);

  const handleToggle = (taskId: Id<"tasks">) => {
    void toggleTask({ taskId });
  };

  // Filter tasks based on search term using the passed tasks prop
  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // No need for loading/empty state here as parent handles it

  return (
    <div className="">
      <input
        type="text"
        placeholder={`Search ${trader} tasks...`}
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        className="mt-3 mb-2 w-full bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-500 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
      />
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filteredTasks.length > 0 ? (
          filteredTasks
            .sort((a, b) => a.order - b.order)
            .map((task) => (
              <div key={task._id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={task._id}
                  checked={task.completed}
                  onChange={() => handleToggle(task._id)} // Use onChange for standard checkbox
                  className="accent-amber-500 w-5 h-5 rounded border-gray-600 focus:ring-amber-500 focus:ring-offset-gray-800"
                />
                <label
                  htmlFor={task._id}
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
  // Fetch ALL tasks once in the parent component, using the 'all' filter
  const allTasks = useQuery(api.tasks.list, { filter: "all" }); 

  const toggleTrader = (trader: string) => {
    setOpenTrader(openTrader === trader ? null : trader);
  };

  const kappaTasks = allTasks?.filter(task => KAPPA_TRADERS.includes(task.trader)) ?? [];
  const overallCompleted = kappaTasks.filter(task => task.completed).length;
  const overallTotal = kappaTasks.length;

  const tasksByTrader = kappaTasks.reduce((acc, task) => {
    if (!acc[task.trader]) {
      acc[task.trader] = [];
    }
    acc[task.trader].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  if (allTasks === undefined) {
    return <div className="text-center text-gray-400 py-4">Loading tasks...</div>;
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
        const traderTasks = tasksByTrader[trader] || []; 
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
                    {traderTasks.filter(t => t.completed).length} / {traderTasks.length}
                  </span>
                  <span className={`transform transition-transform duration-200 ${openTrader === trader ? 'rotate-180' : ''}`}>▼</span>
                </div>
              </div>
              {/* ProgressBar directly under trader name in header */}
              <div className="w-full mt-1">
                <ProgressBar value={traderTasks.filter(t => t.completed).length} max={traderTasks.length} />
              </div>
            </button>
            {openTrader === trader && (
              <div className="px-4 pb-4">
                {/* Show search and tasks directly, no nested card */}
                <TraderTaskList trader={trader} tasks={traderTasks} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

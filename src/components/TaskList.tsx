import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

const TRADERS = [
  "Prapor",
  "Therapist",
  "Skier",
  "Peacekeeper",
  "Mechanic",
  "Ragman",
  "Jaeger",
];

export function TaskList() {
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete" | { trader: string }>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const tasks = useQuery(api.tasks.list, { filter, search: searchTerm || undefined }) ?? [];
  const toggleTask = useMutation(api.tasks.toggleTask);

  const tasksByTrader = tasks.reduce((acc, task) => {
    if (!acc[task.trader]) {
      acc[task.trader] = [];
    }
    acc[task.trader].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const overallProgress = (completedTasks / totalTasks) * 100;

  return (
    <div className="mt-8 space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-amber-500 mb-4">Kappa Tasks</h3>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-200">Overall Progress</span>
            <div className="text-sm text-gray-400">
              {completedTasks} / {totalTasks} tasks completed
            </div>
          </div>
          <div className="h-2 bg-gray-700 rounded">
            <div
              className="h-full bg-amber-500 rounded transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <select
          className="bg-gray-800 text-gray-100 rounded px-4 py-2"
          value={typeof filter === "object" ? `trader:${filter.trader}` : filter}
          onChange={(e) => {
            const value = e.target.value;
            if (value.startsWith("trader:")) {
              setFilter({ trader: value.slice(7) });
            } else {
              setFilter(value as "all" | "completed" | "incomplete");
            }
          }}
        >
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
          <optgroup label="By Trader">
            {TRADERS.map(trader => (
              <option key={trader} value={`trader:${trader}`}>{trader}</option>
            ))}
          </optgroup>
        </select>

        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-gray-800 text-gray-100 rounded px-4 py-2"
        />
      </div>

      <div className="space-y-8">
        {TRADERS.map(trader => {
          if (typeof filter === "object" && filter.trader !== trader) return null;
          
          const traderTasks = tasksByTrader[trader] ?? [];
          if (traderTasks.length === 0) return null;

          const completedTraderTasks = traderTasks.filter(task => task.completed).length;
          const traderProgress = (completedTraderTasks / traderTasks.length) * 100;

          return (
            <div key={trader} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-amber-500">{trader}</h3>
                <div className="text-sm text-gray-400">
                  {completedTraderTasks} / {traderTasks.length} tasks
                </div>
              </div>
              <div className="h-2 bg-gray-700 rounded mb-4">
                <div
                  className="h-full bg-amber-500 rounded transition-all duration-300"
                  style={{ width: `${traderProgress}%` }}
                />
              </div>
              <div className="space-y-2">
                {traderTasks
                  .sort((a, b) => a.order - b.order)
                  .map(task => (
                    <label
                      key={task._id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="w-5 h-5 rounded border-gray-600 text-amber-500 focus:ring-amber-500 focus:ring-offset-gray-800"
                        onChange={() => void toggleTask({ taskId: task._id })}
                      />
                      <span className={task.completed ? "text-gray-400 line-through" : "text-gray-100"}>
                        {task.name}
                      </span>
                    </label>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

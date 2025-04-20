import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function BossList() {
  const bossData = useQuery(api.bosses.getBossData) ?? [];
  const toggleTask = useMutation(api.bosses.toggleBossTask);
  // Fetch the list of completed boss tasks once at the top level
  const completedBossTasks = useQuery(api.bosses.list, {}) ?? [];

  const totalTasks = bossData.reduce(
    (sum, boss) => sum + boss.leftToComplete,
    0
  );
  const completedTaskCount = bossData.reduce(
    (sum, boss) => sum + boss.completed,
    0
  );
  const overallProgress = (completedTaskCount / totalTasks) * 100;

  return (
    <div className="mt-8 space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-amber-500 mb-4">
          Boss Tasks
        </h3>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-200">Overall Progress</span>
            <div className="text-sm text-gray-400">
              {completedTaskCount} / {totalTasks} tasks completed
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

      <div className="space-y-8">
        {bossData.map(
          ({
            boss,
            tasks,
            leftToComplete,
            completed,
            finalTask,
            finalTaskUnlocked,
          }) => {
            const bossProgress = (completed / leftToComplete) * 100;

            return (
              <div key={boss} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-amber-500">
                    {boss}
                  </h3>
                  <div className="text-sm text-gray-400">
                    {completed} / {leftToComplete} tasks
                  </div>
                </div>
                <div className="h-2 bg-gray-700 rounded mb-4">
                  <div
                    className="h-full bg-amber-500 rounded transition-all duration-300"
                    style={{ width: `${bossProgress}%` }}
                  />
                </div>
                <div className="space-y-2">
                  {/* Final task displayed at the top with special styling */}
                  <div className="mb-4 border-b border-gray-700 pb-3">
                    <label
                      key={finalTask}
                      className={`flex items-center gap-3 p-2 rounded ${finalTaskUnlocked ? "hover:bg-gray-700 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                    >
                      <input
                        type="checkbox"
                        checked={completedBossTasks.includes(finalTask)}
                        disabled={!finalTaskUnlocked}
                        className="accent-amber-500 w-5 h-5 rounded border-gray-600 focus:ring-amber-500 focus:ring-offset-gray-800"
                        onChange={() =>
                          finalTaskUnlocked &&
                          void toggleTask({ taskName: finalTask })
                        }
                      />
                      <div className="flex flex-col text-left">
                        <span
                          className={
                            completedBossTasks.includes(finalTask)
                              ? "text-gray-400 line-through"
                              : "text-amber-400 font-semibold"
                          }
                        >
                          {finalTask}
                        </span>
                        {!finalTaskUnlocked && (
                          <span className="text-xs text-gray-500 mt-1">
                            Complete all tasks below to unlock
                          </span>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Regular tasks */}
                  {tasks.map((task) => (
                    <label
                      key={task}
                      className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={completedBossTasks.includes(task)}
                        className="accent-amber-500 w-5 h-5 rounded border-gray-600 focus:ring-amber-500 focus:ring-offset-gray-800"
                        onChange={() => void toggleTask({ taskName: task })}
                      />
                      <span
                        className={
                          completedBossTasks.includes(task)
                            ? "text-gray-400 line-through"
                            : "text-gray-100"
                        }
                      >
                        {task}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PrestigeProgress {
  currentPrestige: number;
  level: number;
  strength: number;
  endurance: number;
  charisma: number;
  intelligenceCenter: number;
  security: number;
  restSpace: number;
  roubles: number;
  collectorComplete: boolean;
  figurines: string[];
  scavsKilled: number;
  pmcsKilled: number;
  labsExtracted: boolean;
}



export function PrestigeProgress() {
  const progress = useQuery(api.prestige.getPrestigeProgress);
  const updateProgress = useMutation(api.prestige.updatePrestigeProgress);
  const [selectedPrestige, setSelectedPrestige] = useState(1);

  // Get prestige requirements and completion for the selected prestige level
  const requirements = useQuery(api.prestige.getPrestigeRequirements, { prestigeLevel: selectedPrestige });
  const completion = useQuery(api.prestige.calculatePrestigeCompletion, { prestigeLevel: selectedPrestige });

  if (!progress || !requirements || !completion) return null;

  // Access nested prestigeProgress object
  const prestigeProgress = progress.prestigeProgress;
  
  // Calculate overall progress
  const { completedRequirements, totalRequirements, percentage: overallProgress } = completion;

  return (
    <div className="mt-8 space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-amber-500">Prestige Progress</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setSelectedPrestige(prev => Math.max(1, prev - 1))}
              disabled={selectedPrestige <= 1}
              className="p-1 rounded bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-amber-500 font-medium">{requirements.name}</span>
            <button 
              onClick={() => setSelectedPrestige(prev => prev + 1)}
              disabled={selectedPrestige >= 2} /* Update this when more prestige levels are added */
              className="p-1 rounded bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-200">Overall Progress</span>
            <div className="text-sm text-gray-400">
              {completedRequirements} / {totalRequirements} requirements met
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

      <div className="space-y-4">
        {/* Level */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-200">Level</span>
            <div className="text-sm text-gray-400">
              {prestigeProgress.level} / {requirements.level}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-gray-700 rounded">
              <div
                className="h-full bg-amber-500 rounded transition-all duration-300"
                style={{ width: `${Math.min((prestigeProgress.level / requirements.level) * 100, 100)}%` }}
              />
            </div>
            <input
              type="number"
              min="1"
              max={requirements.level}
              value={prestigeProgress.level}
              onChange={(e) => {
                const value = Math.max(1, Math.min(requirements.level, parseInt(e.target.value) || 1));
                void updateProgress({ ...prestigeProgress, level: value });
              }}
              className="w-20 bg-gray-700 text-gray-100 rounded px-2 py-1"
            />
          </div>
        </div>

        {/* Strength */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-200">Strength</span>
            <div className="text-sm text-gray-400">
              {prestigeProgress.strength} / {requirements.strength}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-gray-700 rounded">
              <div
                className="h-full bg-amber-500 rounded transition-all duration-300"
                style={{ width: `${Math.min((prestigeProgress.strength / requirements.strength) * 100, 100)}%` }}
              />
            </div>
            <input
              type="number"
              min="0"
              max={requirements.strength}
              value={prestigeProgress.strength}
              onChange={(e) => {
                const value = Math.max(0, Math.min(requirements.strength, parseInt(e.target.value) || 0));
                void updateProgress({ ...prestigeProgress, strength: value });
              }}
              className="w-20 bg-gray-700 text-gray-100 rounded px-2 py-1"
            />
          </div>
        </div>

        {/* Endurance */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-200">Endurance</span>
            <div className="text-sm text-gray-400">
              {prestigeProgress.endurance} / {requirements.endurance}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-gray-700 rounded">
              <div
                className="h-full bg-amber-500 rounded transition-all duration-300"
                style={{ width: `${Math.min((prestigeProgress.endurance / requirements.endurance) * 100, 100)}%` }}
              />
            </div>
            <input
              type="number"
              min="0"
              max={requirements.endurance}
              value={prestigeProgress.endurance}
              onChange={(e) => {
                const value = Math.max(0, Math.min(requirements.endurance, parseInt(e.target.value) || 0));
                void updateProgress({ ...prestigeProgress, endurance: value });
              }}
              className="w-20 bg-gray-700 text-gray-100 rounded px-2 py-1"
            />
          </div>
        </div>

        {/* Charisma */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-200">Charisma</span>
            <div className="text-sm text-gray-400">
              {prestigeProgress.charisma} / {requirements.charisma}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-gray-700 rounded">
              <div
                className="h-full bg-amber-500 rounded transition-all duration-300"
                style={{ width: `${Math.min((prestigeProgress.charisma / requirements.charisma) * 100, 100)}%` }}
              />
            </div>
            <input
              type="number"
              min="0"
              max={requirements.charisma}
              value={prestigeProgress.charisma}
              onChange={(e) => {
                const value = Math.max(0, Math.min(requirements.charisma, parseInt(e.target.value) || 0));
                void updateProgress({ ...prestigeProgress, charisma: value });
              }}
              className="w-20 bg-gray-700 text-gray-100 rounded px-2 py-1"
            />
          </div>
        </div>

        {/* Hideout Requirements */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="text-gray-200 font-medium mb-3">Hideout Requirements</h4>
          <div className="space-y-3">
            {/* Intelligence Center */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 text-sm">Intelligence Center</span>
                <div className="text-xs text-gray-400">
                  {prestigeProgress.intelligenceCenter} / {requirements.intelligenceCenter}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-gray-700 rounded">
                  <div
                    className="h-full bg-amber-500 rounded transition-all duration-300"
                    style={{ width: `${Math.min((prestigeProgress.intelligenceCenter / requirements.intelligenceCenter) * 100, 100)}%` }}
                  />
                </div>
                <input
                  type="number"
                  min="0"
                  max={requirements.intelligenceCenter}
                  value={prestigeProgress.intelligenceCenter}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(requirements.intelligenceCenter, parseInt(e.target.value) || 0));
                    void updateProgress({ ...prestigeProgress, intelligenceCenter: value });
                  }}
                  className="w-20 bg-gray-700 text-gray-100 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>

            {/* Security */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 text-sm">Security</span>
                <div className="text-xs text-gray-400">
                  {prestigeProgress.security} / {requirements.security}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-gray-700 rounded">
                  <div
                    className="h-full bg-amber-500 rounded transition-all duration-300"
                    style={{ width: `${Math.min((prestigeProgress.security / requirements.security) * 100, 100)}%` }}
                  />
                </div>
                <input
                  type="number"
                  min="0"
                  max={requirements.security}
                  value={prestigeProgress.security}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(requirements.security, parseInt(e.target.value) || 0));
                    void updateProgress({ ...prestigeProgress, security: value });
                  }}
                  className="w-20 bg-gray-700 text-gray-100 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>

            {/* Rest Space */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 text-sm">Rest Space</span>
                <div className="text-xs text-gray-400">
                  {prestigeProgress.restSpace} / {requirements.restSpace}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-gray-700 rounded">
                  <div
                    className="h-full bg-amber-500 rounded transition-all duration-300"
                    style={{ width: `${Math.min((prestigeProgress.restSpace / requirements.restSpace) * 100, 100)}%` }}
                  />
                </div>
                <input
                  type="number"
                  min="0"
                  max={requirements.restSpace}
                  value={prestigeProgress.restSpace}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(requirements.restSpace, parseInt(e.target.value) || 0));
                    void updateProgress({ ...prestigeProgress, restSpace: value });
                  }}
                  className="w-20 bg-gray-700 text-gray-100 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Roubles */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-200">Roubles</span>
            <div className="text-sm text-gray-400">
              {prestigeProgress.roubles.toLocaleString()} / {requirements.roubles.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-gray-700 rounded">
              <div
                className="h-full bg-amber-500 rounded transition-all duration-300"
                style={{ width: `${Math.min((prestigeProgress.roubles / requirements.roubles) * 100, 100)}%` }}
              />
            </div>
            <input
              type="number"
              min="0"
              max={requirements.roubles}
              value={prestigeProgress.roubles}
              onChange={(e) => {
                const value = Math.max(0, Math.min(requirements.roubles, parseInt(e.target.value) || 0));
                void updateProgress({ ...prestigeProgress, roubles: value });
              }}
              className="w-20 bg-gray-700 text-gray-100 rounded px-2 py-1"
            />
          </div>
        </div>

        {/* Collector Task */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={prestigeProgress.collectorComplete}
              onChange={(e) => void updateProgress({ ...prestigeProgress, collectorComplete: e.target.checked })}
              className="w-5 h-5 rounded border-gray-600 text-amber-500 focus:ring-amber-500 focus:ring-offset-gray-800"
            />
            <span className="text-gray-200">Complete Collector Task</span>
          </label>
        </div>

        {/* Figurines */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="text-gray-200 font-medium mb-3">Required Figurines ({prestigeProgress.figurines.length}/{requirements.figurines.length})</h4>
          <div className="space-y-2">
            {requirements.figurines.map((figurine, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`figurine-${index}`}
                  checked={prestigeProgress.figurines.includes(figurine)}
                  onChange={(e) => {
                    const newFigurines = e.target.checked
                      ? [...prestigeProgress.figurines, figurine]
                      : prestigeProgress.figurines.filter(f => f !== figurine);
                    void updateProgress({ ...prestigeProgress, figurines: newFigurines });
                  }}
                  className="w-4 h-4 rounded border-gray-600 text-amber-500 focus:ring-amber-500 focus:ring-offset-gray-800 mr-3"
                />
                <label htmlFor={`figurine-${index}`} className="text-gray-300 text-sm cursor-pointer">
                  {figurine}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Kill Requirements */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="text-gray-200 font-medium mb-3">Kill Requirements</h4>
          <div className="space-y-3">
            {requirements.scavsKilled > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 text-sm">Scavs Killed</span>
                  <div className="text-xs text-gray-400">
                    {prestigeProgress.scavsKilled} / {requirements.scavsKilled}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-gray-700 rounded">
                    <div
                      className="h-full bg-amber-500 rounded transition-all duration-300"
                      style={{ width: `${Math.min((prestigeProgress.scavsKilled / requirements.scavsKilled) * 100, 100)}%` }}
                    />
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={requirements.scavsKilled * 2} // Allow some buffer
                    value={prestigeProgress.scavsKilled}
                    onChange={(e) => {
                      const value = Math.max(0, parseInt(e.target.value) || 0);
                      void updateProgress({ ...prestigeProgress, scavsKilled: value });
                    }}
                    className="w-20 bg-gray-700 text-gray-100 rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            )}

            {requirements.pmcsKilled > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 text-sm">PMCs Killed</span>
                  <div className="text-xs text-gray-400">
                    {prestigeProgress.pmcsKilled} / {requirements.pmcsKilled}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-gray-700 rounded">
                    <div
                      className="h-full bg-amber-500 rounded transition-all duration-300"
                      style={{ width: `${Math.min((prestigeProgress.pmcsKilled / requirements.pmcsKilled) * 100, 100)}%` }}
                    />
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={requirements.pmcsKilled * 2} // Allow some buffer
                    value={prestigeProgress.pmcsKilled}
                    onChange={(e) => {
                      const value = Math.max(0, parseInt(e.target.value) || 0);
                      void updateProgress({ ...prestigeProgress, pmcsKilled: value });
                    }}
                    className="w-20 bg-gray-700 text-gray-100 rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Labs Extraction */}
        {requirements.labsExtracted && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={prestigeProgress.labsExtracted}
                onChange={(e) => void updateProgress({ ...prestigeProgress, labsExtracted: e.target.checked })}
                className="w-5 h-5 rounded border-gray-600 text-amber-500 focus:ring-amber-500 focus:ring-offset-gray-800"
              />
              <span className="text-gray-200">Survive and Extract from Labs</span>
            </label>
          </div>
        )}

        {/* Prestige Level Selector */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-200">Current Prestige Level</span>
            <div className="text-sm text-gray-400">
              {prestigeProgress.currentPrestige}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-gray-700 rounded">
              <div
                className="h-full bg-amber-500 rounded transition-all duration-300"
                style={{ width: `${(prestigeProgress.currentPrestige / 2) * 100}%` }}
              />
            </div>
            <select
              value={prestigeProgress.currentPrestige}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                void updateProgress({ ...prestigeProgress, currentPrestige: value });
              }}
              className="bg-gray-700 text-gray-100 rounded px-2 py-1"
            >
              <option value={1}>Prestige 1</option>
              <option value={2}>Prestige 2</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

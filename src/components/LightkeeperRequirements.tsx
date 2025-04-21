// src/components/LightkeeperRequirements.tsx

export function LightkeeperRequirements() {
  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-gray-800 rounded shadow space-y-4">
      <h1 className="text-4xl font-semibold text-amber-300 mb-2 text-center">Work-in-progress</h1>
      <h2 className="text-2xl font-bold text-amber-400 mb-2 text-center">Lightkeeper Questline Requirements</h2>
      <ul className="list-disc list-inside text-gray-200 space-y-1">
        <li>
          <span className="font-semibold text-amber-300">Scav Karma</span> of at least <span className="font-semibold">+1</span>
        </li>
      </ul>
      <div className="mt-4">
        <span className="font-semibold text-amber-300">Must complete the following quests:</span>
        <ul className="list-disc list-inside mt-2 text-gray-200 space-y-1">
          <li>A Fuel Matter</li>
          <li>Broadcast – Part 2</li>
          <li>Cargo X – Part 4</li>
          <li>Chemical – Part 4 <span className="text-gray-400">or</span> Out of Curiosity <span className="text-gray-400">or</span> Big Customer</li>
          <li>Courtesy Visit</li>
          <li>Database – Part 2</li>
          <li>Gunsmith – Part 10</li>
          <li>House Arrest – Part 1</li>
          <li>Lost Contact</li>
          <li>Seaside Vacation</li>
          <li>The Cult – Part 2</li>
          <li>The Huntsman Path – Forest Cleaning</li>
          <li>The Punisher – Part 4</li>
        </ul>
      </div>
    </div>
  );
}

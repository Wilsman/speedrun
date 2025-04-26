import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { BossList } from "./components/BossList";
// import { HideoutProgress } from "./components/HideoutProgress";
import { CollectorItems } from "./components/CollectorItems";
import { PrestigeProgress } from "./components/PrestigeProgress";
import { LightkeeperRequirements } from "./components/LightkeeperRequirements";
import { Toaster } from "sonner";
import { KappaTaskList } from "./components/KappaTaskList";
import { VersionLabel } from "@/components/VersionLabel";
import { Notepad } from "./components/Notepad"; // Import the new Notepad component
import { useQuery } from "convex/react"; // <-- Add useQuery import

export default function App() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [isNotepadVisible, setIsNotepadVisible] = useState(false); // State for notepad visibility

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 relative"> {/* Added relative positioning */}
      <header className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-semibold text-amber-500">Tarkov Kappa Tracker</h2>
        <div className="flex items-center space-x-4">
          {/* Notepad Toggle Button */}
          <button
            onClick={() => setIsNotepadVisible(!isNotepadVisible)}
            className="p-2 rounded hover:bg-gray-700 transition-colors"
            title={isNotepadVisible ? "Hide Notepad" : "Show Notepad"}
          >
            {/* Placeholder for icon - Using text for now */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 p-8 pb-16"> {/* Added padding at bottom to prevent content from being hidden behind the footer */}
        <div className="max-w-6xl mx-auto space-y-8"> {/* Added space-y-8 for spacing */}
          <Content activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </main>
      <VersionLabel />
      <Toaster theme="dark" />

      {/* Conditionally render floating Notepad */}
      <Notepad 
        isVisible={isNotepadVisible} 
        onClose={() => setIsNotepadVisible(false)} 
      />
    </div>
  );
}

/**
 * Component that calls the ensureUser internal mutation once when mounted.
 * Should be rendered inside the <Authenticated> block.
 */
function EnsureUser() {
  const ensureUserMutation = useMutation(api.users.ensureUser);

  useEffect(() => {
    // Call the mutation only once when the component mounts
    // Add void to explicitly ignore the promise
    void ensureUserMutation({}); 
  }, [ensureUserMutation]); // Depend on the mutation function

  return null; // This component doesn't render anything visible
}

function Content({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-amber-500 mb-4">
          Tarkov Kappa Prestige Tracker
        </h1>
        <Authenticated>
          <EnsureUser /> { /* Call ensureUser when authenticated */ }
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabContent activeTab={activeTab} />
        </Authenticated>
        <Unauthenticated>
          <p className="text-xl text-gray-400 mb-8">
            Sign in to track your progress
          </p>
          <SignInForm />
        </Unauthenticated>
      </div>
    </div>
  );
}

function Tabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const tabs = [
    { id: "tasks", label: "Kappa Tasks", type: "internal" as const },
    { id: "collector", label: "Collector Items", type: "internal" as const },
    { id: "lightkeeper", label: "Lightkeeper Req.", type: "internal" as const },
    { id: "bosses", label: "Boss Progression", type: "internal" as const },
    // { id: "hideout", label: "Hideout", type: "internal" as const },
    { id: "prestige", label: "Prestige Goals", type: "internal" as const },
    { id: "storyline", label: "1.0 Storyline quests", type: "external" as const, href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }, // New external link tab
  ];

  return (
    <div className="border-b border-gray-700 relative">
      <nav
        className="-mb-px flex space-x-8 overflow-x-auto whitespace-nowrap scrollbar-hide sm:overflow-visible sm:whitespace-normal"
        aria-label="Tabs"
      >
        {tabs.map((tab) => {
          const commonClasses = `
            border-b-2 py-4 px-1 text-sm font-medium whitespace-nowrap
          `;
          const activeClasses = "border-amber-500 text-amber-500";
          const inactiveClasses = "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300";

          if (tab.type === "internal") {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${commonClasses} ${
                  activeTab === tab.id ? activeClasses : inactiveClasses
                }`}
              >
                {tab.label}
              </button>
            );
          } else { // External link
            return (
              <a
                key={tab.id}
                href={tab.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${commonClasses} ${inactiveClasses} animate-flash-blue`}
              >
                {tab.label}
              </a>
            );
          }
        })}
      </nav>
      {/* Right fade scroll indicator, mobile only */}
      <div
        className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent sm:hidden"
        aria-hidden="true"
      />
    </div>
  );
}

function TabContent({ activeTab }: { activeTab: string }) {
  // Fetch tasks data here if the tasks tab is potentially active
  // This query will only run if the component mounts and stays mounted
  const allTasks = useQuery(api.tasks.list, { filter: "all" });

  switch (activeTab) {
    case "tasks":
      // Pass the fetched data to KappaTaskList
      return <KappaTaskList allTasks={allTasks} />;
    case "collector":
      return <CollectorItems />;
    case "bosses":
      return <BossList />;
    // case "hideout":
    //   return <HideoutProgress />;
    case "prestige":
      return <PrestigeProgress />;
    case "lightkeeper":
      return <LightkeeperRequirements />;
    default:
      return <div className="text-gray-400 mt-8">Coming soon...</div>;
  }
}

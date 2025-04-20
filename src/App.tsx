import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { useState } from "react";
import { BossList } from "./components/BossList";
import { HideoutProgress } from "./components/HideoutProgress";
import { CollectorItems } from "./components/CollectorItems";
import { PrestigeProgress } from "./components/PrestigeProgress";
import { Toaster } from "sonner";
import { KappaTaskList } from "./components/KappaTaskList";
import { VersionLabel } from "@/components/VersionLabel"; 

export default function App() {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <header className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-semibold text-amber-500">Tarkov Kappa Tracker</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 p-8 pb-16"> {/* Added padding at bottom to prevent content from being hidden behind the footer */}
        <div className="max-w-6xl mx-auto">
          <Content activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </main>
      <VersionLabel />
      <Toaster theme="dark" />
    </div>
  );
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
    { id: "tasks", label: "Kappa Tasks" },
    { id: "collector", label: "Collector Items" },
    { id: "bosses", label: "Boss Progression" },
    { id: "hideout", label: "Hideout" },
    { id: "prestige", label: "Prestige Goals" },
  ];

  return (
    <div className="border-b border-gray-700">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              border-b-2 py-4 px-1 text-sm font-medium
              ${
                activeTab === tab.id
                  ? "border-amber-500 text-amber-500"
                  : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function TabContent({ activeTab }: { activeTab: string }) {
  switch (activeTab) {
    case "tasks":
      return <KappaTaskList />;
    case "collector":
      return <CollectorItems />;
    case "bosses":
      return <BossList />;
    case "hideout":
      return <HideoutProgress />;
    case "prestige":
      return <PrestigeProgress />;
    default:
      return <div className="text-gray-400 mt-8">Coming soon...</div>;
  }
}

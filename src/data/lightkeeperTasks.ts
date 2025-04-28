import lightkeeperTasksData from './lightkeeperTasks.json';

// Mapping from Lightkeeper quest names to their wiki URLs

export interface SubTask {
  item: string;
  foundInRaid: boolean;
}

export interface QuestInfo {
  name: string;
  url: string;
  trader: string;
  location: string;
  subTasks?: SubTask[];
}

export const lightkeeperQuests: QuestInfo[] = lightkeeperTasksData;

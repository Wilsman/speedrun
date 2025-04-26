// Mapping from Lightkeeper quest names to their wiki URLs

interface SubTask {
  item: string;
  foundInRaid: boolean;
}

interface QuestInfo {
  url: string;
  subTasks?: SubTask[];
}

export const lightkeeperQuestUrls: Record<string, QuestInfo> = {
  "Burning Rubber": {
    url: "https://escapefromtarkov.fandom.com/wiki/Burning_Rubber",
  },
  "Debut": { url: "https://escapefromtarkov.fandom.com/wiki/Debut" },
  "First in Line": {
    url: "https://escapefromtarkov.fandom.com/wiki/First_in_Line",
    subTasks: [
      {
        item: "Any different medical item from the list on the wiki (1/3)",
        foundInRaid: true,
      },
      {
        item: "Any different medical item from the list on the wiki (2/3)",
        foundInRaid: true,
      },
      {
        item: "Any different medical item from the list on the wiki (3/3)",
        foundInRaid: true,
      },
    ],
  },
  "Luxurious Life": {
    url: "https://escapefromtarkov.fandom.com/wiki/Luxurious_Life",
  },
  "Saving the Mole": {
    url: "https://escapefromtarkov.fandom.com/wiki/Saving_the_Mole",
  },
  "Shooting Cans": { url: "https://escapefromtarkov.fandom.com/wiki/Shooting_Cans" },
  "Shortage": {
    url: "https://escapefromtarkov.fandom.com/wiki/Shortage",
    subTasks: [
      { item: "Salewa first aid kit", foundInRaid: true },
      { item: "Salewa first aid kit", foundInRaid: true },
      { item: "Salewa first aid kit", foundInRaid: true },
    ],
  },
  "Acquaintance": {
    url: "https://escapefromtarkov.fandom.com/wiki/Acquaintance",
    subTasks: [
      { item: "Iskra ration pack", foundInRaid: true },
      { item: "Iskra ration pack", foundInRaid: true },
      { item: "Iskra ration pack", foundInRaid: true },
      { item: "Pack of instant noodles", foundInRaid: true },
      { item: "Pack of instant noodles", foundInRaid: true },
      { item: "Can of beef stew (Large)", foundInRaid: true },
      { item: "Can of beef stew (Large)", foundInRaid: true },
    ],
  },
  "Background Check": {
    url: "https://escapefromtarkov.fandom.com/wiki/Background_Check",
  },
  "Gunsmith - Part 1": {
    url: "https://escapefromtarkov.fandom.com/wiki/Gunsmith_-_Part_1",
  },
  "Introduction": {
    url: "https://escapefromtarkov.fandom.com/wiki/Introduction",
  },
  "The Huntsman Path - Forest Cleaning": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Huntsman_Path_-_Forest_Cleaning",
  },
  "The Huntsman Path - Secured Perimeter": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Huntsman_Path_-_Secured_Perimeter",
  },
  "The Survivalist Path - Thrifty": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Survivalist_Path_-_Thrifty",
  },
  "The Survivalist Path - Tough Guy": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Survivalist_Path_-_Tough_Guy",
  },
  "The Survivalist Path - Unprotected but Dangerous": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Survivalist_Path_-_Unprotected_but_Dangerous",
  },
  "The Survivalist Path - Wounded Beast": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Survivalist_Path_-_Wounded_Beast",
  },
  "The Survivalist Path - Zhivchik": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Survivalist_Path_-_Zhivchik",
  },
  "The Tarkov Shooter - Part 1": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Tarkov_Shooter_-_Part_1",
  },
  "The Tarkov Shooter - Part 2": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Tarkov_Shooter_-_Part_2",
  },
  "The Tarkov Shooter - Part 3": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Tarkov_Shooter_-_Part_3",
  },
  "The Tarkov Shooter - Part 4": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Tarkov_Shooter_-_Part_4",
  },
  "The Tarkov Shooter - Part 5": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Tarkov_Shooter_-_Part_5",
  },
  "Sanitary Standards - Part 1": {
    url: "https://escapefromtarkov.fandom.com/wiki/Sanitary_Standards_-_Part_1",
    subTasks: [
      { item: "Gas analyzer", foundInRaid: true },
    ],
  },
  "BP Depot": { url: "https://escapefromtarkov.fandom.com/wiki/BP_Depot" },
  "Delivery from the Past": {
    url: "https://escapefromtarkov.fandom.com/wiki/Delivery_From_the_Past",
  },
  "Gunsmith - Part 2": {
    url: "https://escapefromtarkov.fandom.com/wiki/Gunsmith_-_Part_2",
  },
  "Supplier": {
    url: "https://escapefromtarkov.fandom.com/wiki/Supplier",
    subTasks: [
      { item: "BNTI Module-3M body armor", foundInRaid: true },
      { item: "TOZ-106 20ga bolt-action shotgun", foundInRaid: true },
    ],
  },
  "Bad Rep Evidence": {
    url: "https://escapefromtarkov.fandom.com/wiki/Bad_Rep_Evidence",
  },
  "Gunsmith - Part 3": {
    url: "https://escapefromtarkov.fandom.com/wiki/Gunsmith_-_Part_3",
  },
  "The Extortionist": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Extortionist",
  },
  "Golden Swag": { url: "https://escapefromtarkov.fandom.com/wiki/Golden_Swag" },
  "Painkiller": {
    url: "https://escapefromtarkov.fandom.com/wiki/Painkiller",
    subTasks: [
      { item: "Morphine injector", foundInRaid: true },
      { item: "Morphine injector", foundInRaid: true },
      { item: "Morphine injector", foundInRaid: true },
      { item: "Morphine injector", foundInRaid: true },
    ],
  },
  "Sanitary Standards - Part 2": {
    url: "https://escapefromtarkov.fandom.com/wiki/Sanitary_Standards_-_Part_2",
    subTasks: [
      { item: "Gas analyzer", foundInRaid: true },
      { item: "Gas analyzer", foundInRaid: true },
    ],
  },
  "What’s on the Flash Drive?": {
    url: "https://escapefromtarkov.fandom.com/wiki/What%E2%80%99s_on_the_Flash_Drive%3F",
    subTasks: [
      { item: "Secure Flash drive", foundInRaid: true },
      { item: "Secure Flash drive", foundInRaid: true },
    ],
  },
  "Friend From the West - Part 1": {
    url: "https://escapefromtarkov.fandom.com/wiki/Friend_From_the_West_-_Part_1",
  },
  "Friend From the West - Part 2": {
    url: "https://escapefromtarkov.fandom.com/wiki/Friend_From_the_West_-_Part_2",
  },
  "Ice Cream Cones": {
    url: "https://escapefromtarkov.fandom.com/wiki/Ice_Cream_Cones",
    subTasks: [
      {
        item: "AK-74 5.45x39 6L31 60-round magazine",
        foundInRaid: false,
      },
      {
        item: "AK-74 5.45x39 6L31 60-round magazine",
        foundInRaid: false,
      },
      {
        item: "AK-74 5.45x39 6L31 60-round magazine",
        foundInRaid: false,
      },
    ],
  },
  "Chemical - Part 1": {
    url: "https://escapefromtarkov.fandom.com/wiki/Chemical_-_Part_1",
  },
  "Chemical - Part 2": {
    url: "https://escapefromtarkov.fandom.com/wiki/Chemical_-_Part_2",
  },
  "Fishing Gear": { url: "https://escapefromtarkov.fandom.com/wiki/Fishing_Gear" },
  "Gunsmith - Part 4": {
    url: "https://escapefromtarkov.fandom.com/wiki/Gunsmith_-_Part_4",
  },
  "Gunsmith - Part 5": {
    url: "https://escapefromtarkov.fandom.com/wiki/Gunsmith_-_Part_5",
  },
  "Pharmacist": { url: "https://escapefromtarkov.fandom.com/wiki/Pharmacist" },
  "Scrap Metal": { url: "https://escapefromtarkov.fandom.com/wiki/Scrap_Metal" },
  "Tigr Safari": { url: "https://escapefromtarkov.fandom.com/wiki/Tigr_Safari" },
  "Chemical - Part 3": {
    url: "https://escapefromtarkov.fandom.com/wiki/Chemical_-_Part_3",
  },
  "Chemical - Part 4 (choice)": {
    url: "https://escapefromtarkov.fandom.com/wiki/Chemical_-_Part_4",
  },
  "Eagle Eye": { url: "https://escapefromtarkov.fandom.com/wiki/Eagle_Eye" },
  "Humanitarian Supplies": {
    url: "https://escapefromtarkov.fandom.com/wiki/Humanitarian_Supplies",
  },
  "Broadcast - Part 1": {
    url: "https://escapefromtarkov.fandom.com/wiki/Broadcast_-_Part_1",
  },
  "Cargo X - Part 1": {
    url: "https://escapefromtarkov.fandom.com/wiki/Cargo_X_-_Part_1",
  },
  "Cargo X - Part 2": {
    url: "https://escapefromtarkov.fandom.com/wiki/Cargo_X_-_Part_2",
  },
  "Cargo X - Part 3": {
    url: "https://escapefromtarkov.fandom.com/wiki/Cargo_X_-_Part_3",
  },
  "Cargo X - Part 4": {
    url: "https://escapefromtarkov.fandom.com/wiki/Cargo_X_-_Part_4",
  },
  "Farming - Part 1": {
    url: "https://escapefromtarkov.fandom.com/wiki/Farming_-_Part_1",
  },
  "Farming - Part 2": {
    url: "https://escapefromtarkov.fandom.com/wiki/Farming_-_Part_2",
    subTasks: [
      { item: "Power cord", foundInRaid: true },
      { item: "Power cord", foundInRaid: true },
      { item: "T-Shaped plug", foundInRaid: true },
      { item: "T-Shaped plug", foundInRaid: true },
      { item: "T-Shaped plug", foundInRaid: true },
      { item: "T-Shaped plug", foundInRaid: true },
      { item: "Printed circuit board", foundInRaid: true },
      { item: "Printed circuit board", foundInRaid: true },
    ],
  },
  "Spa Tour - Part 1": {
    url: "https://escapefromtarkov.fandom.com/wiki/Spa_Tour_-_Part_1",
  },
  "Spa Tour - Part 2": {
    url: "https://escapefromtarkov.fandom.com/wiki/Spa_Tour_-_Part_2",
  },
  "Spa Tour - Part 3": {
    url: "https://escapefromtarkov.fandom.com/wiki/Spa_Tour_-_Part_3",
    subTasks: [
      { item: "WD-40 (100ml)", foundInRaid: true },
      { item: "WD-40 (400ml)", foundInRaid: true },
      { item: "Clin window cleaner", foundInRaid: true },
      { item: "Clin window cleaner", foundInRaid: true },
      { item: "Corrugated hose", foundInRaid: true },
      { item: "Corrugated hose", foundInRaid: true },
      { item: "Ox bleach", foundInRaid: true },
      { item: "Ox bleach", foundInRaid: true },
    ],
  },
  "Spa Tour - Part 4": {
    url: "https://escapefromtarkov.fandom.com/wiki/Spa_Tour_-_Part_4",
  },
  "Spa Tour - Part 5": {
    url: "https://escapefromtarkov.fandom.com/wiki/Spa_Tour_-_Part_5",
  },
  "Spa Tour - Part 6": {
    url: "https://escapefromtarkov.fandom.com/wiki/Spa_Tour_-_Part_6",
  },
  "Spa Tour - Part 7": {
    url: "https://escapefromtarkov.fandom.com/wiki/Spa_Tour_-_Part_7",
    subTasks: [
      { item: "Morphine injector", foundInRaid: true },
      { item: "Morphine injector", foundInRaid: true },
      { item: "Morphine injector", foundInRaid: true },
      { item: "Morphine injector", foundInRaid: true },
      { item: "Alkaline cleaner for heat exchangers", foundInRaid: true },
      { item: "Alkaline cleaner for heat exchangers", foundInRaid: true },
      { item: "Corrugated hose", foundInRaid: true },
      { item: "Corrugated hose", foundInRaid: true },
      { item: "Propane tank (5L)", foundInRaid: true },
      { item: "Propane tank (5L)", foundInRaid: true },
    ],
  },
  "The Cult - Part 1": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Cult_-_Part_1",
  },
  "The Cult - Part 2": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Cult_-_Part_2",
  },
  "Gunsmith - Part 6": {
    url: "https://escapefromtarkov.fandom.com/wiki/Gunsmith_-_Part_6",
  },
  "A Fuel Matter": { url: "https://escapefromtarkov.fandom.com/wiki/A_Fuel_Matter" },
  "Big Sale": { url: "https://escapefromtarkov.fandom.com/wiki/Big_Sale" },
  "Broadcast - Part 2": {
    url: "https://escapefromtarkov.fandom.com/wiki/Broadcast_-_Part_2",
  },
  "Database - Part 1": {
    url: "https://escapefromtarkov.fandom.com/wiki/Database_-_Part_1",
  },
  "Database - Part 2": {
    url: "https://escapefromtarkov.fandom.com/wiki/Database_-_Part_2",
  },
  "Gunsmith - Part 7": {
    url: "https://escapefromtarkov.fandom.com/wiki/Gunsmith_-_Part_7",
  },
  "Make ULTRA Great Again": {
    url: "https://escapefromtarkov.fandom.com/wiki/Make_ULTRA_Great_Again",
  },
  "Only Business": { url: "https://escapefromtarkov.fandom.com/wiki/Only_Business" },
  "Shaking up the Teller": {
    url: "https://escapefromtarkov.fandom.com/wiki/Shaking_up_the_Teller",
  },
  "Gunsmith - Part 8": {
    url: "https://escapefromtarkov.fandom.com/wiki/Gunsmith_-_Part_8",
  },
  "Seaside Vacation": {
    url: "https://escapefromtarkov.fandom.com/wiki/Seaside_Vacation",
  },
  "The Punisher - Part 1": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Punisher_-_Part_1",
  },
  "Setup": { url: "https://escapefromtarkov.fandom.com/wiki/Setup" },
  "The Punisher - Part 2": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Punisher_-_Part_2",
    subTasks: [
      { item: "Lower half-mask", foundInRaid: true },
      { item: "Lower half-mask", foundInRaid: true },
      { item: "Lower half-mask", foundInRaid: true },
      { item: "Lower half-mask", foundInRaid: true },
      { item: "Lower half-mask", foundInRaid: true },
      { item: "Lower half-mask", foundInRaid: true },
      { item: "Lower half-mask", foundInRaid: true },
    ],
  },
  "Gunsmith - Part 9": {
    url: "https://escapefromtarkov.fandom.com/wiki/Gunsmith_-_Part_9",
  },
  "The Punisher - Part 3": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Punisher_-_Part_3",
  },
  "Courtesy Visit": {
    url: "https://escapefromtarkov.fandom.com/wiki/Courtesy_Visit",
  },
  "Gunsmith - Part 10": {
    url: "https://escapefromtarkov.fandom.com/wiki/Gunsmith_-_Part_10",
  },
  "Health Care Privacy - Part 1": {
    url: "https://escapefromtarkov.fandom.com/wiki/Health_Care_Privacy_-_Part_1",
  },
  "Health Care Privacy - Part 2": {
    url: "https://escapefromtarkov.fandom.com/wiki/Health_Care_Privacy_-_Part_2",
  },
  "The Punisher - Part 4": {
    url: "https://escapefromtarkov.fandom.com/wiki/The_Punisher_-_Part_4",
    subTasks: [
      { item: "Bars A-2607 95Kh18 knife", foundInRaid: true },
      { item: "Bars A-2607 95Kh18 knife", foundInRaid: true },
      { item: "Bars A-2607 95Kh18 knife", foundInRaid: true },
      { item: "Bars A-2607 95Kh18 knife", foundInRaid: true },
      { item: "Bars A-2607 95Kh18 knife", foundInRaid: true },
    ],
  },
  "Informed Means Armed": {
    url: "https://escapefromtarkov.fandom.com/wiki/Informed_Means_Armed",
  },
  "Lost Contact": { url: "https://escapefromtarkov.fandom.com/wiki/Lost_Contact" },
  "Chumming": { url: "https://escapefromtarkov.fandom.com/wiki/Chumming" },
  "Debtor": { url: "https://escapefromtarkov.fandom.com/wiki/Debtor" },
  "House Arrest - Part 1": {
    url: "https://escapefromtarkov.fandom.com/wiki/House_Arrest_-_Part_1",
  },
  "Assessment - Part 1": {
    url: "https://escapefromtarkov.fandom.com/wiki/Assessment_-_Part_1",
  },
  "Assessment - Part 2": {
    url: "https://escapefromtarkov.fandom.com/wiki/Assessment_-_Part_2",
  },
  "Assessment - Part 3": {
    url: "https://escapefromtarkov.fandom.com/wiki/Assessment_-_Part_3",
  },
  "Getting Acquainted": {
    url: "https://escapefromtarkov.fandom.com/wiki/Getting_Acquainted",
  },
  "Key to the Tower": {
    url: "https://escapefromtarkov.fandom.com/wiki/Key_to_the_Tower",
  },
  "Knock-Knock": { url: "https://escapefromtarkov.fandom.com/wiki/Knock-Knock" },
  "Network Provider - Part 1": {
    url: "https://escapefromtarkov.fandom.com/wiki/Network_Provider_-_Part_1",
    subTasks: [
      { item: "Electronic components", foundInRaid: true },
      { item: "Electronic components", foundInRaid: true },
      { item: "Electronic components", foundInRaid: true },
      { item: "Electronic components", foundInRaid: true },
      { item: "Military COFDM Wireless Signal Transmitter", foundInRaid: true },
      { item: "Military COFDM Wireless Signal Transmitter", foundInRaid: true },
      { item: "Military COFDM Wireless Signal Transmitter", foundInRaid: true },
      { item: "Military COFDM Wireless Signal Transmitter", foundInRaid: true },
      { item: "Gas analyzer", foundInRaid: true },
      { item: "Gas analyzer", foundInRaid: true },
      { item: "Gas analyzer", foundInRaid: true },
      { item: "Gas analyzer", foundInRaid: true },
      { item: "Broken GPhone smartphone", foundInRaid: true },
      { item: "Broken GPhone smartphone", foundInRaid: true },
      { item: "Broken GPhone smartphone", foundInRaid: true },
      { item: "Broken GPhone smartphone", foundInRaid: true },
    ],
  },
  "Network Provider - Part 2": {
    url: "https://escapefromtarkov.fandom.com/wiki/Network_Provider_-_Part_2",
  },
};

# Escape from Tarkov Task Tracker

![Tarkov Task Tracker](https://i.imgur.com/placeholder-image.png)

A modern, interactive task tracking application inspired by Escape from Tarkov. This app helps players track their progress through trader tasks, boss hunts, hideout upgrades, and prestige levels with a sleek, Tarkov-themed interface.

## Features

- **Task Tracking**: Track completion of tasks from all traders
- **Boss Progression**: Special boss task system with unlockable final tasks
- **Hideout Management**: Track your hideout upgrades
- **Prestige System**: Track your character's progression through the prestige system
- **Collector Tasks**: Find and track rare items for the Collector
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Support**: Continue tracking even when offline

## Technologies Used

- **Frontend**: React 19, TypeScript, Tailwind CSS, Radix UI
- **Backend**: [Convex](https://convex.dev) for real-time database and authentication
- **Styling**: Custom Tarkov-themed UI with the official Bender font
- **Build Tool**: Vite for fast development and optimized production builds

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tarkov-task-tracker.git
cd tarkov-task-tracker

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at http://localhost:5173

## Project Structure

- `/src` - Frontend React application
  - `/components` - React components
  - `/pages` - Page components
  - `/assets` - Static assets like images
- `/convex` - Backend Convex functions
  - `/schema.ts` - Database schema
  - `/tasks.ts` - Task-related functions
  - `/bosses.ts` - Boss progression system
  - `/hideout.ts` - Hideout management
  - `/prestige.ts` - Prestige system
  - `/collector.ts` - Collector item tracking

## Deployment

This project is deployed using Convex. The current deployment is named [`festive-canary-66`](https://dashboard.convex.dev/d/festive-canary-66).

To deploy your own version:

```bash
npm run build
npx convex deploy
```

## Authentication

The app uses [Convex Auth](https://auth.convex.dev/) with Anonymous auth for easy sign-in. You can modify the authentication method in the `convex/auth.ts` file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The MIT License is a permissive license that allows you to:
- Use the code commercially
- Modify the code
- Distribute the code
- Use and modify the code privately

The only requirement is that the license and copyright notice must be included with the software.

## Acknowledgments

- Inspired by Escape from Tarkov by Battlestate Games
- Uses the Bender font family, the official font of Escape from Tarkov
- Special thanks to the Tarkov community for inspiration

---

*Note: This is a fan project and is not affiliated with or endorsed by Battlestate Games.*

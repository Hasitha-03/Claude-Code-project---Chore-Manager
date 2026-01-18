# Chore Manager

A desktop-first web application for managing team chores with an Outlook-style calendar view.

## Features

- **Calendar View**: Month-view calendar displaying all chores
- **Team Management**: Add and manage team members
- **One-time Chores**: Create simple chores with title, description, assignee, due date, priority, and estimated time
- **Recurring Chores**: Daily, weekly, or monthly recurring chores with customizable patterns
- **Status Tracking**: Mark chores as pending or done
- **Local Storage**: All data persisted in browser localStorage

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- date-fns for date manipulation
- lucide-react for icons
- CSS Modules for styling

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the App

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Usage

### Adding Team Members

1. Click on "Team" in the navigation
2. Click "Add Member"
3. Enter name, optional email, and select avatar color
4. Click "Add Member"

### Creating Chores

1. Click on any day in the calendar to create a chore for that date
2. Fill in the form:
   - Title (required)
   - Description (optional)
   - Assigned To (required - select from team members)
   - Due Date (required)
   - Priority (Low/Medium/High)
   - Estimated Time in minutes (optional)
3. For recurring chores, check "Recurring Chore" and configure:
   - Repeat type (Daily/Weekly/Monthly)
   - Interval (every N days/weeks/months)
   - For weekly: select specific days
   - For monthly: select day of month
   - Optional end date

### Managing Chores

- Click on a chore card to edit it
- Use the checkbox to mark chores as complete
- Delete chores from the edit form

## Data Storage

All data is stored in browser localStorage. To clear all data, open browser console and run:

```javascript
localStorage.clear()
```

## Project Structure

```
src/
├── components/
│   ├── calendar/      # Calendar view components
│   ├── chores/        # Chore form and management
│   └── team/          # Team member management
├── services/          # localStorage service
├── types/             # TypeScript type definitions
├── utils/             # Date and recurrence utilities
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## License

MIT

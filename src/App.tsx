import { useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import MonthView from './components/calendar/MonthView';
import TeamManager from './components/team/TeamManager';
import ChoreForm from './components/chores/ChoreForm';
import { ChoreInstance } from './types';
import './App.css';

type View = 'calendar' | 'team';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('calendar');
  const [showChoreForm, setShowChoreForm] = useState(false);
  const [editingChore, setEditingChore] = useState<ChoreInstance | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddChore = (date: string) => {
    setEditingChore(undefined);
    setSelectedDate(date);
    setShowChoreForm(true);
  };

  const handleEditChore = (chore: ChoreInstance) => {
    setEditingChore(chore);
    setSelectedDate(undefined);
    setShowChoreForm(true);
  };

  const handleFormClose = () => {
    setShowChoreForm(false);
    setEditingChore(undefined);
    setSelectedDate(undefined);
  };

  const handleFormSave = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <Calendar size={28} />
          <span>Chore Manager</span>
        </div>
        <div className="navbar-menu">
          <button
            className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}
            onClick={() => setCurrentView('calendar')}
          >
            <Calendar size={20} />
            <span>Calendar</span>
          </button>
          <button
            className={`nav-item ${currentView === 'team' ? 'active' : ''}`}
            onClick={() => setCurrentView('team')}
          >
            <Users size={20} />
            <span>Team</span>
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentView === 'calendar' ? (
          <MonthView
            key={refreshKey}
            onAddChore={handleAddChore}
            onEditChore={handleEditChore}
          />
        ) : (
          <TeamManager />
        )}
      </main>

      {showChoreForm && (
        <ChoreForm
          chore={editingChore}
          initialDate={selectedDate}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { generateCalendarDays, CalendarDay } from '../../utils/dateUtils';
import { storage } from '../../services/storage';
import { ChoreInstance, TeamMember } from '../../types';
import DayCell from './DayCell';
import './MonthView.css';

interface MonthViewProps {
  onAddChore: (date: string) => void;
  onEditChore: (chore: ChoreInstance) => void;
}

export default function MonthView({ onAddChore, onEditChore }: MonthViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [chores, setChores] = useState<ChoreInstance[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = generateCalendarDays(year, month);
    setCalendarDays(days);
    setChores(storage.getChoreInstances());
    setTeamMembers(storage.getTeamMembers());
  };

  const goToPreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleToggleStatus = (choreId: string) => {
    const chore = chores.find(c => c.id === choreId);
    if (chore) {
      const updatedChore = {
        ...chore,
        status: chore.status === 'pending' ? 'done' : 'pending',
        completedAt: chore.status === 'pending' ? new Date().toISOString() : undefined
      } as ChoreInstance;
      storage.saveChoreInstance(updatedChore);
      loadData();
    }
  };

  const getChoresForDate = (dateString: string): ChoreInstance[] => {
    return chores.filter(c => c.dueDate === dateString);
  };

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="month-view">
      <div className="month-header">
        <h1>{format(currentDate, 'MMMM yyyy')}</h1>
        <div className="month-controls">
          <button onClick={goToToday} className="btn-today">
            Today
          </button>
          <button onClick={goToPreviousMonth} className="btn-nav">
            <ChevronLeft size={24} />
          </button>
          <button onClick={goToNextMonth} className="btn-nav">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {weekDays.map(day => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}

        {calendarDays.map((day) => (
          <DayCell
            key={day.dateString}
            day={day}
            chores={getChoresForDate(day.dateString)}
            teamMembers={teamMembers}
            onAddChore={onAddChore}
            onEditChore={onEditChore}
            onToggleStatus={handleToggleStatus}
          />
        ))}
      </div>
    </div>
  );
}

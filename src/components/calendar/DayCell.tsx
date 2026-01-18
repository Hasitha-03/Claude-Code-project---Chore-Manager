import { CalendarDay } from '../../utils/dateUtils';
import { ChoreInstance, TeamMember } from '../../types';
import ChoreCard from './ChoreCard';
import './DayCell.css';

interface DayCellProps {
  day: CalendarDay;
  chores: ChoreInstance[];
  teamMembers: TeamMember[];
  onAddChore: (date: string) => void;
  onEditChore: (chore: ChoreInstance) => void;
  onToggleStatus: (choreId: string) => void;
}

export default function DayCell({
  day,
  chores,
  teamMembers,
  onAddChore,
  onEditChore,
  onToggleStatus
}: DayCellProps) {
  const visibleChores = chores.slice(0, 4);
  const hasMore = chores.length > 4;

  const handleCellClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.chore-card')) {
      return; // Don't trigger if clicking on a chore
    }
    onAddChore(day.dateString);
  };

  return (
    <div
      className={`day-cell ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''}`}
      onClick={handleCellClick}
    >
      <div className="day-number">{day.dayNumber}</div>
      <div className="chores-container">
        {visibleChores.map(chore => (
          <ChoreCard
            key={chore.id}
            chore={chore}
            teamMembers={teamMembers}
            onEdit={() => onEditChore(chore)}
            onToggleStatus={() => onToggleStatus(chore.id)}
          />
        ))}
        {hasMore && (
          <div className="more-indicator">
            +{chores.length - 4} more
          </div>
        )}
      </div>
    </div>
  );
}

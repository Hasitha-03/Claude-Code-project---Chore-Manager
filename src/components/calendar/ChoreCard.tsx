import { Check, Clock } from 'lucide-react';
import { ChoreInstance, TeamMember } from '../../types';
import './ChoreCard.css';

interface ChoreCardProps {
  chore: ChoreInstance;
  teamMembers: TeamMember[];
  onEdit: () => void;
  onToggleStatus: () => void;
}

export default function ChoreCard({ chore, teamMembers, onEdit, onToggleStatus }: ChoreCardProps) {
  const assignedMember = teamMembers.find(m => m.id === chore.assignedTo);

  const handleCheckClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleStatus();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const priorityColors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444'
  };

  return (
    <div
      className={`chore-card ${chore.status === 'done' ? 'completed' : ''} priority-${chore.priority}`}
      onClick={handleCardClick}
      style={{ borderLeftColor: priorityColors[chore.priority] }}
    >
      <div className="chore-content">
        <div className="chore-checkbox" onClick={handleCheckClick}>
          {chore.status === 'done' && <Check size={14} />}
        </div>
        <div className="chore-details">
          <div className="chore-title">{chore.title}</div>
          {assignedMember && (
            <div className="chore-assignee">
              <span
                className="avatar"
                style={{ backgroundColor: assignedMember.avatarColor }}
              >
                {assignedMember.name.charAt(0).toUpperCase()}
              </span>
              <span className="assignee-name">{assignedMember.name}</span>
            </div>
          )}
          {chore.estimatedTime && (
            <div className="chore-time">
              <Clock size={12} />
              <span>{chore.estimatedTime}m</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

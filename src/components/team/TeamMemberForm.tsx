import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TeamMember } from '../../types';
import { storage } from '../../services/storage';
import './TeamMemberForm.css';

interface TeamMemberFormProps {
  member?: TeamMember;
  onClose: () => void;
  onSave: () => void;
}

const AVATAR_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

export default function TeamMemberForm({ member, onClose, onSave }: TeamMemberFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);

  useEffect(() => {
    if (member) {
      setName(member.name);
      setEmail(member.email || '');
      setAvatarColor(member.avatarColor);
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a name');
      return;
    }

    const teamMember: TeamMember = {
      id: member?.id || `member-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || undefined,
      avatarColor
    };

    storage.saveTeamMember(teamMember);
    onSave();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{member ? 'Edit Team Member' : 'New Team Member'}</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <div className="form-group">
            <label>Avatar Color</label>
            <div className="color-picker">
              {AVATAR_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${avatarColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setAvatarColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {member ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { TeamMember } from '../../types';
import { storage } from '../../services/storage';
import TeamMemberForm from './TeamMemberForm';
import './TeamManager.css';

export default function TeamManager() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | undefined>();

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = () => {
    setTeamMembers(storage.getTeamMembers());
  };

  const handleAddMember = () => {
    setEditingMember(undefined);
    setShowForm(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      storage.deleteTeamMember(id);
      loadTeamMembers();
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMember(undefined);
  };

  const handleFormSave = () => {
    loadTeamMembers();
    handleFormClose();
  };

  return (
    <div className="team-manager">
      <div className="team-header">
        <h2>
          <Users size={24} />
          Team Members
        </h2>
        <button className="btn-add" onClick={handleAddMember}>
          <Plus size={20} />
          Add Member
        </button>
      </div>

      <div className="team-list">
        {teamMembers.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <p>No team members yet</p>
            <button className="btn-primary" onClick={handleAddMember}>
              Add Your First Team Member
            </button>
          </div>
        ) : (
          teamMembers.map(member => (
            <div key={member.id} className="team-member-card">
              <div className="member-info">
                <div
                  className="member-avatar"
                  style={{ backgroundColor: member.avatarColor }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="member-details">
                  <div className="member-name">{member.name}</div>
                  {member.email && <div className="member-email">{member.email}</div>}
                </div>
              </div>
              <div className="member-actions">
                <button
                  className="btn-icon"
                  onClick={() => handleEditMember(member)}
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  className="btn-icon btn-danger"
                  onClick={() => handleDeleteMember(member.id)}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <TeamMemberForm
          member={editingMember}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
}

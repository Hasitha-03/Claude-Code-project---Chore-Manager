import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ChoreInstance, ChoreTemplate, TeamMember, Priority, RecurrenceType } from '../../types';
import { storage } from '../../services/storage';
import { generateRecurringInstances } from '../../utils/recurrenceUtils';
import RecurrenceSelector from './RecurrenceSelector';
import './ChoreForm.css';

interface ChoreFormProps {
  chore?: ChoreInstance;
  initialDate?: string;
  onClose: () => void;
  onSave: () => void;
}

export default function ChoreForm({ chore, initialDate, onClose, onSave }: ChoreFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [estimatedTime, setEstimatedTime] = useState<number | ''>('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('daily');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [endDate, setEndDate] = useState('');

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    setTeamMembers(storage.getTeamMembers());

    if (chore) {
      setTitle(chore.title);
      setDescription(chore.description);
      setAssignedTo(chore.assignedTo);
      setDueDate(chore.dueDate);
      setPriority(chore.priority);
      setEstimatedTime(chore.estimatedTime || '');

      // Load template if it's a recurring chore
      if (chore.templateId) {
        const template = storage.getChoreTemplates().find(t => t.id === chore.templateId);
        if (template && template.recurrencePattern) {
          setIsRecurring(true);
          setRecurrenceType(template.recurrencePattern.type);
          setRecurrenceInterval(template.recurrencePattern.interval);
          setDaysOfWeek(template.recurrencePattern.daysOfWeek || []);
          setDayOfMonth(template.recurrencePattern.dayOfMonth || 1);
          setEndDate(template.recurrencePattern.endDate || '');
        }
      }
    } else if (initialDate) {
      setDueDate(initialDate);
    }
  }, [chore, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !dueDate || !assignedTo) {
      alert('Please fill in all required fields');
      return;
    }

    if (isRecurring) {
      // Create or update template
      const templateId = chore?.templateId || `template-${Date.now()}`;
      const template: ChoreTemplate = {
        id: templateId,
        title: title.trim(),
        description: description.trim(),
        assignedTo,
        priority,
        estimatedTime: estimatedTime || undefined,
        isRecurring: true,
        recurrencePattern: {
          type: recurrenceType,
          interval: recurrenceInterval,
          startDate: dueDate,
          endDate: endDate || undefined,
          daysOfWeek: recurrenceType === 'weekly' ? daysOfWeek : undefined,
          dayOfMonth: recurrenceType === 'monthly' ? dayOfMonth : undefined
        },
        createdAt: chore?.createdAt || new Date().toISOString()
      };

      storage.saveChoreTemplate(template);

      // Generate instances
      if (!chore) {
        const instances = generateRecurringInstances(template);
        storage.saveChoreInstances(instances);
      } else {
        // If editing, regenerate future instances
        const allInstances = storage.getChoreInstances();
        const futureInstances = allInstances.filter(
          i => i.templateId !== templateId || i.dueDate < dueDate
        );
        const newInstances = generateRecurringInstances(template);
        storage.saveChoreInstances([...futureInstances, ...newInstances]);
      }
    } else {
      // One-time chore
      const instance: ChoreInstance = {
        id: chore?.id || `chore-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        assignedTo,
        dueDate,
        status: chore?.status || 'pending',
        priority,
        estimatedTime: estimatedTime || undefined,
        completedAt: chore?.completedAt,
        completedBy: chore?.completedBy,
        createdAt: chore?.createdAt || new Date().toISOString()
      };

      storage.saveChoreInstance(instance);
    }

    onSave();
    onClose();
  };

  const handleDelete = () => {
    if (!chore) return;

    if (confirm('Are you sure you want to delete this chore?')) {
      if (chore.templateId) {
        const deleteAll = confirm('Delete all instances of this recurring chore?');
        if (deleteAll) {
          storage.deleteChoreTemplate(chore.templateId);
        } else {
          storage.deleteChoreInstance(chore.id);
        }
      } else {
        storage.deleteChoreInstance(chore.id);
      }
      onSave();
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{chore ? 'Edit Chore' : 'New Chore'}</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Chore title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Assigned To *</label>
              <select
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                required
              >
                <option value="">Select person</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Estimated Time (minutes)</label>
              <input
                type="number"
                value={estimatedTime}
                onChange={e => setEstimatedTime(e.target.value ? parseInt(e.target.value) : '')}
                placeholder="30"
                min="1"
              />
            </div>
          </div>

          <RecurrenceSelector
            isRecurring={isRecurring}
            recurrenceType={recurrenceType}
            interval={recurrenceInterval}
            daysOfWeek={daysOfWeek}
            dayOfMonth={dayOfMonth}
            endDate={endDate}
            onIsRecurringChange={setIsRecurring}
            onRecurrenceTypeChange={setRecurrenceType}
            onIntervalChange={setRecurrenceInterval}
            onDaysOfWeekChange={setDaysOfWeek}
            onDayOfMonthChange={setDayOfMonth}
            onEndDateChange={setEndDate}
          />

          <div className="form-actions">
            {chore && (
              <button type="button" className="btn-delete" onClick={handleDelete}>
                Delete
              </button>
            )}
            <div className="form-actions-right">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {chore ? 'Save Changes' : 'Create Chore'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

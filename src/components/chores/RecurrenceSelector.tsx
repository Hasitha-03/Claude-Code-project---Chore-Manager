import { RecurrenceType } from '../../types';
import './RecurrenceSelector.css';

interface RecurrenceSelectorProps {
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  interval: number;
  daysOfWeek: number[];
  dayOfMonth: number;
  endDate: string;
  onIsRecurringChange: (value: boolean) => void;
  onRecurrenceTypeChange: (value: RecurrenceType) => void;
  onIntervalChange: (value: number) => void;
  onDaysOfWeekChange: (value: number[]) => void;
  onDayOfMonthChange: (value: number) => void;
  onEndDateChange: (value: string) => void;
}

export default function RecurrenceSelector({
  isRecurring,
  recurrenceType,
  interval,
  daysOfWeek,
  dayOfMonth,
  endDate,
  onIsRecurringChange,
  onRecurrenceTypeChange,
  onIntervalChange,
  onDaysOfWeekChange,
  onDayOfMonthChange,
  onEndDateChange
}: RecurrenceSelectorProps) {
  const weekDays = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' }
  ];

  const toggleDayOfWeek = (day: number) => {
    if (daysOfWeek.includes(day)) {
      onDaysOfWeekChange(daysOfWeek.filter(d => d !== day));
    } else {
      onDaysOfWeekChange([...daysOfWeek, day].sort());
    }
  };

  return (
    <div className="recurrence-selector">
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={e => onIsRecurringChange(e.target.checked)}
          />
          <span>Recurring Chore</span>
        </label>
      </div>

      {isRecurring && (
        <div className="recurrence-options">
          <div className="form-row">
            <div className="form-group">
              <label>Repeat</label>
              <select
                value={recurrenceType}
                onChange={e => onRecurrenceTypeChange(e.target.value as RecurrenceType)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="form-group">
              <label>Every</label>
              <input
                type="number"
                value={interval}
                onChange={e => onIntervalChange(parseInt(e.target.value) || 1)}
                min="1"
                max="365"
              />
            </div>
          </div>

          {recurrenceType === 'weekly' && (
            <div className="form-group">
              <label>On Days</label>
              <div className="weekday-selector">
                {weekDays.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    className={`weekday-btn ${daysOfWeek.includes(day.value) ? 'active' : ''}`}
                    onClick={() => toggleDayOfWeek(day.value)}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {recurrenceType === 'monthly' && (
            <div className="form-group">
              <label>Day of Month</label>
              <input
                type="number"
                value={dayOfMonth}
                onChange={e => onDayOfMonthChange(parseInt(e.target.value) || 1)}
                min="1"
                max="31"
              />
            </div>
          )}

          <div className="form-group">
            <label>End Date (optional)</label>
            <input
              type="date"
              value={endDate}
              onChange={e => onEndDateChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

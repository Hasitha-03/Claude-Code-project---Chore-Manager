import { addDays, addMonths, format, parseISO, isBefore } from 'date-fns';
import { RecurrencePattern, ChoreTemplate, ChoreInstance } from '../types';

export function generateRecurringInstances(
  template: ChoreTemplate,
  monthsAhead: number = 3
): ChoreInstance[] {
  if (!template.isRecurring || !template.recurrencePattern) {
    return [];
  }

  const instances: ChoreInstance[] = [];
  const pattern = template.recurrencePattern;
  const startDate = parseISO(pattern.startDate);
  const endDate = pattern.endDate ? parseISO(pattern.endDate) : addMonths(new Date(), monthsAhead);

  let currentDate = startDate;
  let instanceCount = 0;
  const maxInstances = 365; // Safety limit

  while (isBefore(currentDate, endDate) && instanceCount < maxInstances) {
    // Check if this date should have an instance based on the pattern
    if (shouldGenerateInstance(currentDate, pattern)) {
      instances.push(createInstanceFromTemplate(template, currentDate));
      instanceCount++;
    }

    // Move to next potential date
    currentDate = getNextDate(currentDate, pattern);
  }

  return instances;
}

function shouldGenerateInstance(date: Date, pattern: RecurrencePattern): boolean {
  switch (pattern.type) {
    case 'daily':
      return true; // Every day matches

    case 'weekly':
      if (!pattern.daysOfWeek || pattern.daysOfWeek.length === 0) {
        return true; // If no days specified, generate for all days
      }
      return pattern.daysOfWeek.includes(date.getDay());

    case 'monthly':
      if (pattern.dayOfMonth) {
        return date.getDate() === pattern.dayOfMonth;
      }
      return date.getDate() === parseISO(pattern.startDate).getDate();

    default:
      return false;
  }
}

function getNextDate(currentDate: Date, pattern: RecurrencePattern): Date {
  const interval = pattern.interval || 1;

  switch (pattern.type) {
    case 'daily':
      return addDays(currentDate, interval);

    case 'weekly':
      return addDays(currentDate, 1); // Check every day for weekly patterns

    case 'monthly':
      return addMonths(currentDate, interval);

    default:
      return addDays(currentDate, 1);
  }
}

function createInstanceFromTemplate(template: ChoreTemplate, dueDate: Date): ChoreInstance {
  return {
    id: `${template.id}-${format(dueDate, 'yyyy-MM-dd')}`,
    templateId: template.id,
    title: template.title,
    description: template.description,
    assignedTo: template.assignedTo,
    dueDate: format(dueDate, 'yyyy-MM-dd'),
    status: 'pending',
    priority: template.priority,
    estimatedTime: template.estimatedTime,
    createdAt: new Date().toISOString()
  };
}

export function regenerateFutureInstances(
  template: ChoreTemplate,
  fromDate: Date,
  existingInstances: ChoreInstance[]
): ChoreInstance[] {
  if (!template.isRecurring || !template.recurrencePattern) {
    return [];
  }

  // Remove future instances of this template
  const pastInstances = existingInstances.filter(
    instance =>
      instance.templateId !== template.id ||
      isBefore(parseISO(instance.dueDate), fromDate)
  );

  // Generate new instances
  const pattern = { ...template.recurrencePattern, startDate: format(fromDate, 'yyyy-MM-dd') };
  const newTemplate = { ...template, recurrencePattern: pattern };
  const newInstances = generateRecurringInstances(newTemplate);

  return [...pastInstances, ...newInstances];
}

export function getRecurrenceDescription(pattern?: RecurrencePattern): string {
  if (!pattern) return 'Does not repeat';

  const interval = pattern.interval || 1;
  const intervalText = interval > 1 ? ` ${interval}` : '';

  switch (pattern.type) {
    case 'daily':
      return `Every${intervalText} day${interval > 1 ? 's' : ''}`;

    case 'weekly':
      if (pattern.daysOfWeek && pattern.daysOfWeek.length > 0) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayNames = pattern.daysOfWeek.map(d => days[d]).join(', ');
        return `Every${intervalText} week${interval > 1 ? 's' : ''} on ${dayNames}`;
      }
      return `Every${intervalText} week${interval > 1 ? 's' : ''}`;

    case 'monthly':
      if (pattern.dayOfMonth) {
        return `Every${intervalText} month${interval > 1 ? 's' : ''} on day ${pattern.dayOfMonth}`;
      }
      return `Every${intervalText} month${interval > 1 ? 's' : ''}`;

    default:
      return 'Custom recurrence';
  }
}

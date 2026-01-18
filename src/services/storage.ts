import { AppData, TeamMember, ChoreTemplate, ChoreInstance } from '../types';

const STORAGE_KEY = 'chore-manager-data';

const defaultData: AppData = {
  teamMembers: [],
  choreTemplates: [],
  choreInstances: []
};

export const storage = {
  getData(): AppData {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : defaultData;
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return defaultData;
    }
  },

  saveData(data: AppData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  },

  // Team Members
  getTeamMembers(): TeamMember[] {
    return this.getData().teamMembers;
  },

  saveTeamMember(member: TeamMember): void {
    const data = this.getData();
    const index = data.teamMembers.findIndex(m => m.id === member.id);
    if (index >= 0) {
      data.teamMembers[index] = member;
    } else {
      data.teamMembers.push(member);
    }
    this.saveData(data);
  },

  deleteTeamMember(id: string): void {
    const data = this.getData();
    data.teamMembers = data.teamMembers.filter(m => m.id !== id);
    this.saveData(data);
  },

  // Chore Templates
  getChoreTemplates(): ChoreTemplate[] {
    return this.getData().choreTemplates;
  },

  saveChoreTemplate(template: ChoreTemplate): void {
    const data = this.getData();
    const index = data.choreTemplates.findIndex(t => t.id === template.id);
    if (index >= 0) {
      data.choreTemplates[index] = template;
    } else {
      data.choreTemplates.push(template);
    }
    this.saveData(data);
  },

  deleteChoreTemplate(id: string): void {
    const data = this.getData();
    data.choreTemplates = data.choreTemplates.filter(t => t.id !== id);
    // Also delete all instances of this template
    data.choreInstances = data.choreInstances.filter(i => i.templateId !== id);
    this.saveData(data);
  },

  // Chore Instances
  getChoreInstances(): ChoreInstance[] {
    return this.getData().choreInstances;
  },

  saveChoreInstance(instance: ChoreInstance): void {
    const data = this.getData();
    const index = data.choreInstances.findIndex(i => i.id === instance.id);
    if (index >= 0) {
      data.choreInstances[index] = instance;
    } else {
      data.choreInstances.push(instance);
    }
    this.saveData(data);
  },

  deleteChoreInstance(id: string): void {
    const data = this.getData();
    data.choreInstances = data.choreInstances.filter(i => i.id !== id);
    this.saveData(data);
  },

  // Bulk operations
  saveChoreInstances(instances: ChoreInstance[]): void {
    const data = this.getData();
    instances.forEach(instance => {
      const index = data.choreInstances.findIndex(i => i.id === instance.id);
      if (index >= 0) {
        data.choreInstances[index] = instance;
      } else {
        data.choreInstances.push(instance);
      }
    });
    this.saveData(data);
  },

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};

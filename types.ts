
export enum TabType {
    TASK = 'TASK',
    WAREHOUSE = 'WAREHOUSE',
    SCHEDULE = 'SCHEDULE',
    STATISTICS = 'STATISTICS',
    USER = 'USER'
}

export enum TimeFilterType {
    TODAY = 'TODAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    ALL = 'ALL',
    INCOMPLETE = 'INCOMPLETE'
}

export interface Category {
    id: string;
    name: string;
}

export interface Subtask {
    id: string;
    text: string;
    completed: boolean;
}

export interface TaskTemplate {
    id: string;
    text: string;
    priority: 'NORMAL' | 'URGENT';
    categoryId?: string;
    subtasks: string[]; 
}

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    priority: 'NORMAL' | 'URGENT';
    categoryId?: string;
    dueDate?: string;
    subtasks: Subtask[];
    timestamp: number;
}

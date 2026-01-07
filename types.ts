
export enum TabType {
    TASK = 'TASK',
    WAREHOUSE = 'WAREHOUSE',
    SCHEDULE = 'SCHEDULE',
    STORE = 'STORE',
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
    points: number;
}

export interface TaskTemplate {
    id: string;
    text: string;
    priority: 'NORMAL' | 'URGENT';
    categoryId?: string;
    subtasks: { text: string; points: number }[]; 
    frequency?: number;
    recurrenceLimit?: number;
    points?: number;
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
    points: number;
    frequency?: number; // 0 or undefined means one-time
    recurrenceLimit?: number; // Remaining times to repeat
    hidden?: boolean; // If true, hidden from list but kept for stats
    penalized?: boolean; // If true, points have been deducted for overdue
    hasRecurred?: boolean; // If true, the next recurrence task has already been generated
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    targetPoints: number;
    icon?: string;
}

export interface StoreItem {
    id: string;
    name: string;
    cost: number;
    description: string;
    icon: string;
}

export interface PurchaseRecord {
    id: string;
    itemName: string;
    cost: number;
    timestamp: number;
    isGacha: boolean;
}

export interface AppData {
    todos: Todo[];
    categories: Category[];
    templates: TaskTemplate[];
    achievements: Achievement[];
    userPoints: number;
    storeItems: StoreItem[];
    purchaseHistory: PurchaseRecord[];
    isBgmEnabled: boolean;
}

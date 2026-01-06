import React, { useState, useRef, useEffect } from 'react';
import { Todo, Category, Subtask, TaskTemplate, Achievement, StoreItem } from '../types';
import { Icons } from '../constants';

interface StrategicModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const StrategicModal: React.FC<StrategicModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-[#f2f2f2] w-full max-w-2xl border-l-[6px] border-[#313131] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] relative animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-[#2d2d2d] text-white px-6 py-4 flex items-center justify-between overflow-hidden relative">
                    <div className="flex flex-col relative z-10">
                        <span className="text-xl font-black tracking-[0.2em]">{title}</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 transition-colors relative z-10 rounded-sm">
                        <Icons.Close />
                    </button>
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:6px_6px]"></div>
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-400/30"></div>
                </div>
                <div className="p-8 max-h-[85vh] overflow-y-auto">
                    {children}
                </div>
                <div className="h-2 bg-[#1a1a1a] flex">
                    <div className="h-full bg-[#0098dc] w-1/4 shadow-[0_0_10px_#0098dc]"></div>
                    <div className="h-full bg-[#ffcf00] w-8 ml-auto"></div>
                </div>
            </div>
        </div>
    );
};

interface SettingHeaderProps {
    title: string;
    action?: React.ReactNode;
}

export const SettingHeader: React.FC<SettingHeaderProps> = ({ title, action }) => (
    <div className="w-full bg-[#2d2d2d] text-white py-1 px-4 mb-6 mt-10 first:mt-2 shadow-sm flex items-center justify-between overflow-hidden relative border-r-4 border-[#0098dc]">
        <div className="flex items-baseline space-x-4 relative z-10">
            <span className="text-lg font-bold tracking-widest">{title}</span>
        </div>
        {action && <div className="relative z-20">{action}</div>}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:6px_6px]"></div>
    </div>
);

const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
};

interface TaskRowProps {
    todo: Todo;
    categoryName?: string;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleSubtask: (taskId: string, subtaskId: string) => void;
    onAddSubtask: (taskId: string, text: string, points: number) => void;
    onEdit: (todo: Todo) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({ todo, categoryName, onToggle, onDelete, onToggleSubtask, onAddSubtask, onEdit }) => {
    const [newSubtask, setNewSubtask] = useState('');
    const [newSubtaskPoints, setNewSubtaskPoints] = useState(10);
    const [isExpanded, setIsExpanded] = useState(true);
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const priorityColors = {
        NORMAL: 'bg-gray-400',
        URGENT: 'bg-[#ffcf00]'
    };
    
    const priorityLabels = {
        NORMAL: '普通',
        URGENT: '紧急'
    };

    const handleAddSub = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newSubtask.trim()) {
            onAddSubtask(todo.id, newSubtask, newSubtaskPoints);
            setNewSubtask('');
            setNewSubtaskPoints(10);
        }
    };

    const startPress = () => {
        longPressTimer.current = setTimeout(() => {
            onEdit(todo);
        }, 600);
    };

    const endPress = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    return (
        <div className={`flex flex-col mb-4 transition-all duration-300 ${todo.completed ? 'opacity-70' : ''}`}>
            <div 
                className={`flex items-center group border border-transparent hover:border-gray-300 select-none touch-none active:bg-gray-50 transition-colors`}
                onPointerDown={startPress}
                onPointerUp={endPress}
                onPointerLeave={endPress}
            >
                <div className={`w-1.5 h-16 ${priorityColors[todo.priority]} shrink-0 shadow-[2px_0_5px_rgba(0,0,0,0.1)]`}></div>
                
                <div className="flex-1 min-h-[64px] bg-white px-6 py-2 flex items-center justify-between relative overflow-hidden">
                    <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                             {todo.priority === 'URGENT' && (
                                <span className="text-[10px] font-black px-1.5 py-0.5 bg-[#ffcf00] text-[#313131] tracking-widest">
                                    {priorityLabels[todo.priority]}
                                </span>
                            )}
                            {todo.frequency && todo.frequency > 0 && (
                                <div className="flex items-center space-x-1 text-[10px] font-black px-1.5 py-0.5 bg-blue-100 text-[#0098dc] tracking-widest">
                                    <Icons.Repeat />
                                    <span>{todo.frequency}D</span>
                                </div>
                            )}
                            <span className={`text-lg sm:text-xl font-bold tracking-tight transition-all truncate leading-tight ${todo.completed ? 'line-through text-gray-400' : 'text-[#313131]'}`}>
                                {todo.text}
                            </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 pr-2">
                            {categoryName && (
                                <span className="text-[9px] font-black px-1.5 bg-[#313131] text-white tracking-[0.15em] whitespace-nowrap">
                                    {categoryName}
                                </span>
                            )}
                            {/* Points Badge */}
                            <span className="text-[9px] font-black px-1.5 bg-yellow-400 text-black tracking-[0.15em] whitespace-nowrap border border-yellow-500 shadow-sm">
                                +{todo.points || 0} PTS
                            </span>

                            {todo.dueDate && !todo.completed && (
                                <span className="text-[9px] font-black px-1.5 bg-gray-100 text-gray-500 tracking-[0.15em] whitespace-nowrap flex items-center">
                                    <svg className="w-2.5 h-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                                    {todo.dueDate}
                                </span>
                            )}
                            {todo.completed && (
                                <span className="text-[9px] font-black px-1.5 bg-blue-50 text-blue-500 tracking-[0.15em] whitespace-nowrap flex items-center">
                                    <svg className="w-2.5 h-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    已完成: {getTimeAgo(todo.timestamp)}
                                </span>
                            )}
                            <span className="text-[9px] font-black text-gray-400 tracking-tighter jetbrains flex items-center">
                                <span className="mr-2">编号: {todo.id.slice(0, 8)}</span>
                            </span>

                            <button 
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="ml-auto flex items-center space-x-1 text-[9px] font-black text-gray-400 hover:text-[#0098dc] transition-colors uppercase tracking-widest px-2 py-0.5 rounded-sm hover:bg-gray-100"
                            >
                                <span>{isExpanded ? 'Hide' : 'Show'}</span>
                                {isExpanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                        <button 
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => onToggle(todo.id)}
                            className={`px-3 py-1 font-black text-[9px] tracking-widest border transition-colors whitespace-nowrap ${todo.completed ? 'bg-black text-white border-black' : 'border-[#313131] text-[#313131] hover:bg-gray-100'}`}
                        >
                            {todo.completed ? '还原' : '完成'}
                        </button>
                        <button 
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => onDelete(todo.id)}
                            className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                    </div>

                    {todo.completed && <div className="absolute inset-0 bg-black/[0.02] pointer-events-none"></div>}
                </div>
            </div>

            {isExpanded && (
                <div className="ml-1.5 pl-6 mt-1 space-y-1 animate-in slide-in-from-top-2 fade-in duration-200">
                    {todo.subtasks.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between group/sub bg-white/40 hover:bg-white/60 px-3 py-1 transition-colors border-l-2 border-gray-200">
                            <div className="flex items-center">
                                <button 
                                    onClick={() => onToggleSubtask(todo.id, sub.id)}
                                    className={`w-3.5 h-3.5 border flex items-center justify-center mr-3 transition-colors ${sub.completed ? 'bg-black border-black text-white' : 'border-gray-400 text-transparent'}`}
                                >
                                    <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <span className={`text-xs font-bold tracking-tight ${sub.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                    {sub.text}
                                </span>
                            </div>
                            <span className="text-[9px] font-black text-gray-400 tracking-tighter bg-gray-100 px-1 rounded-sm">
                                +{sub.points || 0}
                            </span>
                        </div>
                    ))}
                    {!todo.completed && (
                        <div className="flex items-center pl-3 py-1 border-l-2 border-dashed border-gray-200 gap-2">
                            <span className="text-gray-300 text-xs">+</span>
                            <input 
                                type="text" 
                                placeholder="子任务描述..." 
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                onKeyDown={handleAddSub}
                                className="bg-transparent border-none focus:outline-none text-xs font-bold text-gray-400 placeholder:text-gray-200 flex-1"
                            />
                            <div className="flex items-center border border-gray-200 bg-white">
                                <span className="text-[8px] font-black px-1 text-gray-400">PTS</span>
                                <input
                                    type="number"
                                    value={newSubtaskPoints}
                                    onChange={(e) => setNewSubtaskPoints(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-10 text-[10px] text-center font-black outline-none bg-transparent"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const CategoryManager: React.FC<{ 
    categories: Category[], 
    onAdd: (name: string) => void, 
    onEdit: (id: string, name: string) => void, 
    onDelete: (id: string) => void 
}> = ({ categories, onAdd, onEdit, onDelete }) => {
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    return (
        <div className="bg-white border border-gray-200 p-6 shadow-sm mb-10">
            <h3 className="text-[10px] font-black text-gray-400 tracking-widest italic mb-4">行动扇区管理 / ACTION SECTOR</h3>
            <div className="flex space-x-2 mb-6">
                <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="新扇区名称..."
                    className="flex-1 border-b border-gray-300 focus:border-black focus:outline-none text-sm font-bold py-1"
                />
                <button 
                    onClick={() => { if(newName.trim()){ onAdd(newName); setNewName(''); } }}
                    className="bg-[#2d2d2d] text-white px-4 py-1 text-xs font-bold hover:bg-black transition-colors"
                >
                    新增
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(cat => (
                    <div key={cat.id} className="group flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-2">
                        {editingId === cat.id ? (
                            <input 
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={() => { onEdit(cat.id, editValue); setEditingId(null); }}
                                onKeyDown={(e) => e.key === 'Enter' && (onEdit(cat.id, editValue), setEditingId(null))}
                                className="bg-transparent border-none text-xs font-bold outline-none w-full"
                            />
                        ) : (
                            <span className="text-xs font-bold truncate">{cat.name}</span>
                        )}
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                            <button onClick={() => { setEditingId(cat.id); setEditValue(cat.name); }} className="text-gray-400 hover:text-black">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={() => onDelete(cat.id)} className="text-gray-400 hover:text-red-500">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const StatisticsDashboard: React.FC<{ 
    todos: Todo[],
    achievements: Achievement[],
    totalEarnedPoints: number,
    onAddAchievement: (title: string, description: string, targetPoints: number) => void,
    onDeleteAchievement: (id: string) => void
}> = ({ todos, achievements, totalEarnedPoints, onAddAchievement, onDeleteAchievement }) => {
    const [period, setPeriod] = useState<'WEEK' | 'MONTH' | 'YEAR'>('WEEK');
    const [newAchTitle, setNewAchTitle] = useState('');
    const [newAchDesc, setNewAchDesc] = useState('');
    const [newAchTarget, setNewAchTarget] = useState(1000);

    const filterByPeriod = (todo: Todo) => {
        const now = Date.now();
        const diff = now - todo.timestamp;
        if (period === 'WEEK') return diff <= 3600000 * 24 * 7;
        if (period === 'MONTH') return diff <= 3600000 * 24 * 30;
        if (period === 'YEAR') return diff <= 3600000 * 24 * 365;
        return true;
    };

    const periodTodos = todos.filter(filterByPeriod);
    const completedCount = periodTodos.filter(t => t.completed).length;
    const totalCount = periodTodos.length;
    const rate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    const handleAddAch = () => {
        if(newAchTitle && newAchDesc && newAchTarget > 0) {
            onAddAchievement(newAchTitle, newAchDesc, newAchTarget);
            setNewAchTitle('');
            setNewAchDesc('');
            setNewAchTarget(1000);
        }
    };

    return (
        <div className="space-y-10">
            {/* Stats Cards */}
            <div className="bg-white border border-gray-200 p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-mesh opacity-5 pointer-events-none"></div>
                
                <div className="flex items-center space-x-2 mb-8">
                    {(['WEEK', 'MONTH', 'YEAR'] as const).map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-6 py-1.5 text-[10px] font-black tracking-widest border transition-all ${period === p ? 'bg-[#313131] text-white border-[#313131]' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}
                        >
                            {p === 'WEEK' ? '本周' : p === 'MONTH' ? '本月' : '本年'}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="flex flex-col border-l-4 border-gray-100 pl-6">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">总作战目标</span>
                        <span className="text-5xl font-black italic tracking-tighter leading-none">{totalCount}</span>
                    </div>
                    <div className="flex flex-col border-l-4 border-[#0098dc] pl-6">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">已完成任务</span>
                        <span className="text-5xl font-black italic tracking-tighter text-[#0098dc] leading-none">{completedCount}</span>
                    </div>
                    <div className="flex flex-col border-l-4 border-[#ffcf00] pl-6">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">任务成功率</span>
                        <span className="text-5xl font-black italic tracking-tighter leading-none">{rate}<span className="text-2xl font-bold ml-1">%</span></span>
                    </div>
                </div>

                <div className="relative h-4 bg-gray-100 mb-2 overflow-hidden">
                    <div 
                        className="absolute top-0 left-0 h-full bg-[#0098dc] transition-all duration-1000 ease-out"
                        style={{ width: `${rate}%` }}
                    >
                        <div className="w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[size:20px_20px]"></div>
                    </div>
                </div>
            </div>

            {/* Achievement System */}
            <div className="bg-white border border-gray-200 p-8 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                    <div className="flex flex-col">
                        <h3 className="text-lg font-black italic tracking-tighter">MEDAL SET / 蚀刻章</h3>
                        <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
                            Career Points: {totalEarnedPoints}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="text" placeholder="章名" value={newAchTitle} onChange={e=>setNewAchTitle(e.target.value)} className="w-24 border-b border-gray-300 text-xs font-bold outline-none bg-transparent" />
                        <input type="text" placeholder="描述" value={newAchDesc} onChange={e=>setNewAchDesc(e.target.value)} className="w-32 border-b border-gray-300 text-xs font-bold outline-none bg-transparent hidden sm:block" />
                        <input type="number" placeholder="Target" value={newAchTarget} onChange={e=>setNewAchTarget(parseInt(e.target.value))} className="w-16 border-b border-gray-300 text-xs font-bold outline-none bg-transparent" />
                        <button onClick={handleAddAch} className="bg-[#313131] text-white px-3 py-1 text-[10px] font-black">ADD</button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map(ach => {
                        const isUnlocked = totalEarnedPoints >= ach.targetPoints;
                        const progress = Math.min(100, (totalEarnedPoints / ach.targetPoints) * 100);
                        
                        return (
                            <div key={ach.id} className={`relative flex items-center p-4 border transition-all overflow-hidden group ${isUnlocked ? 'bg-white border-[#ffcf00] shadow-md' : 'bg-gray-50 border-gray-200 grayscale opacity-80'}`}>
                                <div className={`w-12 h-12 flex items-center justify-center mr-4 shrink-0 rounded-full border-2 ${isUnlocked ? 'bg-[#ffcf00] text-white border-[#ffcf00]' : 'bg-gray-200 text-gray-400 border-gray-300'}`}>
                                    <Icons.Medal />
                                </div>
                                <div className="flex-1 min-w-0 z-10">
                                    <h4 className={`text-sm font-black tracking-tight truncate ${isUnlocked ? 'text-[#313131]' : 'text-gray-500'}`}>{ach.title}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold truncate">{ach.description}</p>
                                    <div className="mt-2 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#ffcf00]" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <div className="flex justify-between mt-1 text-[8px] font-black text-gray-400">
                                        <span>{isUnlocked ? 'UNLOCKED' : 'LOCKED'}</span>
                                        <span>{ach.targetPoints} PTS</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onDeleteAchievement(ach.id)}
                                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                >
                                    <Icons.Close />
                                </button>
                                {isUnlocked && <div className="absolute -right-4 -bottom-4 text-6xl text-[#ffcf00] opacity-10 pointer-events-none rotate-12"><Icons.Medal /></div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export const TaskInput: React.FC<{
    categories: Category[],
    onAdd: (text: string, priority: Todo['priority'], categoryId?: string, dueDate?: string, subtasks?: {text: string, points: number}[], points?: number, frequency?: number) => void
}> = ({ categories, onAdd }) => {
    const [text, setText] = useState('');
    const [priority, setPriority] = useState<Todo['priority']>('NORMAL');
    const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
    const [dueDate, setDueDate] = useState('');
    const [subtaskInput, setSubtaskInput] = useState('');
    const [subtaskPoints, setSubtaskPoints] = useState(10);
    const [subtasks, setSubtasks] = useState<{text: string, points: number}[]>([]);
    const [points, setPoints] = useState<number>(100);
    const [frequency, setFrequency] = useState<number>(0);

    const handleAdd = () => {
        if (!text.trim()) return;
        onAdd(text, priority, categoryId, dueDate, subtasks, points, frequency);
        setText('');
        setPriority('NORMAL');
        setCategoryId(undefined);
        setDueDate('');
        setSubtasks([]);
        setPoints(100);
        setFrequency(0);
    };

    const addSub = () => {
        if (subtaskInput.trim()) {
            setSubtasks([...subtasks, { text: subtaskInput.trim(), points: subtaskPoints }]);
            setSubtaskInput('');
            setSubtaskPoints(10);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">目标描述</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="输入作战目标内容..."
                    className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 px-1 text-lg font-bold"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">风险等级</label>
                    <div className="flex space-x-2">
                        {(['NORMAL', 'URGENT'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setPriority(p)}
                                className={`flex-1 py-2 text-[10px] font-black tracking-widest border transition-all ${priority === p ? 'bg-[#313131] text-white border-[#313131]' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}
                            >
                                {p === 'NORMAL' ? '普通' : '紧急'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">作战扇区</label>
                    <select
                        value={categoryId || ''}
                        onChange={(e) => setCategoryId(e.target.value || undefined)}
                        className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 text-sm font-bold"
                    >
                        <option value="">未指定扇区</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>
            
            {/* Points and Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">REWARD (PTS)</label>
                    <input
                        type="number"
                        value={points}
                        onChange={(e) => setPoints(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 text-sm font-bold jetbrains"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">完成时限</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 text-sm font-bold jetbrains"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">循环周期 (天)</label>
                    <div className="flex items-center">
                        <input
                            type="number"
                            value={frequency}
                            onChange={(e) => setFrequency(Math.max(0, parseInt(e.target.value) || 0))}
                            placeholder="0 = 不重复"
                            className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 text-sm font-bold jetbrains"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">子任务分解</label>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={subtaskInput}
                        onChange={(e) => setSubtaskInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addSub()}
                        placeholder="新增子任务步骤..."
                        className="flex-1 bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-1 text-sm font-bold"
                    />
                    <div className="flex items-center bg-gray-100 px-2 rounded-sm shrink-0">
                        <span className="text-[8px] font-black text-gray-500 mr-1">PTS</span>
                        <input 
                            type="number" 
                            value={subtaskPoints}
                            onChange={(e) => setSubtaskPoints(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-10 bg-transparent text-sm font-black outline-none text-center"
                        />
                    </div>
                    <button onClick={addSub} className="px-4 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold transition-colors">添加</button>
                </div>
                <div className="mt-3 space-y-1">
                    {subtasks.map((s, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-1.5 border-l-2 border-gray-300">
                            <span className="text-xs font-bold text-gray-600">{s.text} <span className="text-gray-400 text-[10px] ml-2">+{s.points}pts</span></span>
                            <button onClick={() => setSubtasks(subtasks.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">
                                <Icons.Close />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={handleAdd}
                className="w-full bg-[#313131] text-white py-4 font-black tracking-[0.3em] hover:bg-black transition-all shadow-xl mt-4"
            >
                确认部署
            </button>
        </div>
    );
};

export const TaskEditForm: React.FC<{
    todo: Todo,
    categories: Category[],
    onSave: (id: string, updates: Partial<Todo>) => void,
    onCancel: () => void
}> = ({ todo, categories, onSave, onCancel }) => {
    const [text, setText] = useState(todo.text);
    const [priority, setPriority] = useState<Todo['priority']>(todo.priority);
    const [categoryId, setCategoryId] = useState<string | undefined>(todo.categoryId);
    const [dueDate, setDueDate] = useState(todo.dueDate || '');
    const [subtasks, setSubtasks] = useState<Subtask[]>(todo.subtasks || []);
    const [points, setPoints] = useState<number>(todo.points || 0);
    const [frequency, setFrequency] = useState<number>(todo.frequency || 0);
    
    const [newSubInput, setNewSubInput] = useState('');
    const [newSubPoints, setNewSubPoints] = useState(10);

    const handleSave = () => {
        if (!text.trim()) return;
        onSave(todo.id, { text, priority, categoryId, dueDate, subtasks, points, frequency });
    };

    const addSub = () => {
        if (newSubInput.trim()) {
            setSubtasks([...subtasks, { id: 'sub_' + Date.now(), text: newSubInput.trim(), completed: false, points: newSubPoints }]);
            setNewSubInput('');
            setNewSubPoints(10);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">更新目标描述</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 px-1 text-lg font-bold"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">风险等级</label>
                    <div className="flex space-x-2">
                        {(['NORMAL', 'URGENT'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setPriority(p)}
                                className={`flex-1 py-2 text-[10px] font-black tracking-widest border transition-all ${priority === p ? 'bg-[#313131] text-white border-[#313131]' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}
                            >
                                {p === 'NORMAL' ? '普通' : '紧急'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">作战扇区</label>
                    <select
                        value={categoryId || ''}
                        onChange={(e) => setCategoryId(e.target.value || undefined)}
                        className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 text-sm font-bold"
                    >
                        <option value="">未指定扇区</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">REWARD (PTS)</label>
                    <input
                        type="number"
                        value={points}
                        onChange={(e) => setPoints(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 text-sm font-bold jetbrains"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">预计完成时间</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 text-sm font-bold jetbrains"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">循环周期 (天)</label>
                    <input
                        type="number"
                        value={frequency}
                        onChange={(e) => setFrequency(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 text-sm font-bold jetbrains"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">子任务管理</label>
                <div className="space-y-2">
                    {subtasks.map((sub, idx) => (
                        <div key={sub.id} className="flex items-center space-x-2">
                            <input 
                                value={sub.text}
                                onChange={(e) => {
                                    const newSubs = [...subtasks];
                                    newSubs[idx] = { ...sub, text: e.target.value };
                                    setSubtasks(newSubs);
                                }}
                                className="flex-1 bg-gray-50 border-b border-gray-200 text-sm font-bold py-1 px-2 focus:border-[#313131] outline-none"
                            />
                            <div className="flex items-center bg-gray-100 px-2 rounded-sm shrink-0">
                                <span className="text-[8px] font-black text-gray-500 mr-1">PTS</span>
                                <input 
                                    type="number" 
                                    value={sub.points || 0}
                                    onChange={(e) => {
                                        const newSubs = [...subtasks];
                                        newSubs[idx] = { ...sub, points: Math.max(0, parseInt(e.target.value) || 0) };
                                        setSubtasks(newSubs);
                                    }}
                                    className="w-10 bg-transparent text-sm font-black outline-none text-center"
                                />
                            </div>
                            <button onClick={() => setSubtasks(subtasks.filter(s => s.id !== sub.id))} className="text-gray-400 hover:text-red-500">
                                <Icons.Close />
                            </button>
                        </div>
                    ))}
                    <div className="flex space-x-2 mt-2">
                        <input 
                            value={newSubInput}
                            onChange={(e) => setNewSubInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSub()}
                            placeholder="新增子任务..."
                            className="flex-1 bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-1 text-sm font-bold"
                        />
                        <div className="flex items-center bg-gray-100 px-2 rounded-sm shrink-0">
                            <span className="text-[8px] font-black text-gray-500 mr-1">PTS</span>
                            <input 
                                type="number" 
                                value={newSubPoints}
                                onChange={(e) => setNewSubPoints(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-10 bg-transparent text-sm font-black outline-none text-center"
                            />
                        </div>
                         <button onClick={addSub} className="px-4 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold transition-colors">添加</button>
                    </div>
                </div>
            </div>
            <div className="flex space-x-4">
                <button onClick={onCancel} className="flex-1 bg-white text-[#313131] border border-[#313131] py-4 font-black tracking-[0.3em] hover:bg-gray-100 transition-all">
                    中止
                </button>
                <button onClick={handleSave} className="flex-1 bg-[#313131] text-white py-4 font-black tracking-[0.3em] hover:bg-black transition-all shadow-xl">
                    保存更改
                </button>
            </div>
        </div>
    );
};

export const TemplateRow: React.FC<{
    template: TaskTemplate;
    categoryName?: string;
    onDeploy: (template: TaskTemplate) => void;
    onDelete: (id: string) => void;
    onEdit: (template: TaskTemplate) => void;
}> = ({ template, categoryName, onDeploy, onDelete, onEdit }) => {
    return (
        <div className="flex flex-col mb-3 group">
            <div className="flex items-center bg-white border border-transparent hover:border-gray-300 transition-colors">
                <div className={`w-1 h-full min-h-[50px] ${template.priority === 'URGENT' ? 'bg-[#ffcf00]' : 'bg-gray-300'}`}></div>
                <div className="flex-1 px-4 py-3 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#313131] tracking-tight">{template.text}</span>
                        <div className="flex items-center space-x-2 mt-1">
                             {categoryName && (
                                <span className="text-[9px] font-black px-1.5 bg-[#313131] text-white tracking-[0.15em] whitespace-nowrap">
                                    {categoryName}
                                </span>
                            )}
                            <span className="text-[9px] font-black text-gray-400 tracking-tighter">
                                PTS: {template.points || 0}
                            </span>
                            {template.subtasks.length > 0 && (
                                <span className="text-[9px] font-black text-gray-400 tracking-tighter">
                                    SUB: {template.subtasks.length}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={() => onEdit(template)}
                            className="p-1.5 text-gray-400 hover:text-black transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button 
                            onClick={() => onDeploy(template)}
                            className="px-3 py-1 bg-[#313131] text-white text-[10px] font-black tracking-widest hover:bg-black transition-colors"
                        >
                            DEPLOY
                        </button>
                         <button 
                            onClick={() => onDelete(template.id)}
                            className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                        >
                            <Icons.Close />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TemplateInput: React.FC<{
    categories: Category[];
    onSave: (data: Partial<TaskTemplate>) => void;
    editingTemplate: TaskTemplate | null;
    onCancel: () => void;
}> = ({ categories, onSave, editingTemplate, onCancel }) => {
    const [text, setText] = useState(editingTemplate?.text || '');
    const [priority, setPriority] = useState<TaskTemplate['priority']>(editingTemplate?.priority || 'NORMAL');
    const [categoryId, setCategoryId] = useState<string | undefined>(editingTemplate?.categoryId);
    const [points, setPoints] = useState(editingTemplate?.points || 100);
    const [frequency, setFrequency] = useState(editingTemplate?.frequency || 0);
    const [subtasks, setSubtasks] = useState<{text: string, points: number}[]>(editingTemplate?.subtasks || []);
    const [subInput, setSubInput] = useState('');
    const [subPoints, setSubPoints] = useState(10);

    const handleSave = () => {
        if(!text.trim()) return;
        onSave({
            id: editingTemplate?.id,
            text,
            priority,
            categoryId,
            points,
            frequency,
            subtasks
        });
    };

    const addSub = () => {
        if(subInput.trim()) {
            setSubtasks([...subtasks, { text: subInput.trim(), points: subPoints }]);
            setSubInput('');
            setSubPoints(10);
        }
    }

    return (
         <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">模板名称</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 px-1 text-lg font-bold"
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">默认优先级</label>
                    <div className="flex space-x-2">
                        {(['NORMAL', 'URGENT'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setPriority(p)}
                                className={`flex-1 py-2 text-[10px] font-black tracking-widest border transition-all ${priority === p ? 'bg-[#313131] text-white border-[#313131]' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}
                            >
                                {p === 'NORMAL' ? '普通' : '紧急'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">默认扇区</label>
                    <select
                        value={categoryId || ''}
                        onChange={(e) => setCategoryId(e.target.value || undefined)}
                        className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 text-sm font-bold"
                    >
                        <option value="">未指定扇区</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">默认奖励 (PTS)</label>
                    <input
                        type="number"
                        value={points}
                        onChange={(e) => setPoints(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 text-sm font-bold jetbrains"
                    />
                </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">默认循环 (天)</label>
                    <input
                        type="number"
                        value={frequency}
                        onChange={(e) => setFrequency(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 text-sm font-bold jetbrains"
                    />
                </div>
             </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">预设子任务</label>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={subInput}
                        onChange={(e) => setSubInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addSub()}
                        placeholder="新增子任务..."
                        className="flex-1 bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-1 text-sm font-bold"
                    />
                     <div className="flex items-center bg-gray-100 px-2 rounded-sm shrink-0">
                        <span className="text-[8px] font-black text-gray-500 mr-1">PTS</span>
                        <input 
                            type="number" 
                            value={subPoints}
                            onChange={(e) => setSubPoints(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-10 bg-transparent text-sm font-black outline-none text-center"
                        />
                    </div>
                    <button onClick={addSub} className="px-4 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold transition-colors">添加</button>
                </div>
                <div className="mt-3 space-y-1">
                    {subtasks.map((s, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-1.5 border-l-2 border-gray-300">
                            <span className="text-xs font-bold text-gray-600">{s.text} <span className="text-gray-400 text-[10px] ml-2">+{s.points}pts</span></span>
                            <button onClick={() => setSubtasks(subtasks.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">
                                <Icons.Close />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex space-x-4 pt-4">
                <button onClick={onCancel} className="flex-1 bg-white text-[#313131] border border-[#313131] py-4 font-black tracking-[0.3em] hover:bg-gray-100 transition-all">
                    取消
                </button>
                <button onClick={handleSave} className="flex-1 bg-[#313131] text-white py-4 font-black tracking-[0.3em] hover:bg-black transition-all shadow-xl">
                    保存模板
                </button>
            </div>
         </div>
    );
};

export const ScheduleCalendar: React.FC<{
    todos: Todo[];
    getCategoryName: (id?: string) => string | undefined;
}> = ({ todos, getCategoryName }) => {
    // Simple implementation: Group by date
    const sortedTodos = [...todos]
        .filter(t => t.dueDate && !t.completed)
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

    const grouped = sortedTodos.reduce((acc, todo) => {
        const date = todo.dueDate!;
        if (!acc[date]) acc[date] = [];
        acc[date].push(todo);
        return acc;
    }, {} as Record<string, Todo[]>);

    return (
        <div className="space-y-8">
            {Object.keys(grouped).length === 0 ? (
                <div className="bg-white/40 border-2 border-dashed border-gray-300 py-16 flex flex-col items-center justify-center italic text-gray-400 font-medium">
                    <Icons.Notify />
                    <span className="mt-4 tracking-widest text-[0.7rem]">暂无排期任务</span>
                </div>
            ) : (
                Object.entries(grouped).map(([date, items]: [string, Todo[]]) => (
                    <div key={date} className="relative pl-6 border-l-2 border-gray-200">
                        <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-[#0098dc] border-2 border-white ring-1 ring-gray-200"></div>
                        <div className="mb-4">
                             <span className="text-sm font-black tracking-[0.2em] bg-[#2d2d2d] text-white px-2 py-1">{date}</span>
                        </div>
                        <div className="space-y-3">
                            {items.map(todo => (
                                <div key={todo.id} className="bg-white border-l-4 border-[#ffcf00] p-4 shadow-sm flex justify-between items-center">
                                    <div>
                                        <div className="text-sm font-bold text-[#313131]">{todo.text}</div>
                                        <div className="text-[10px] text-gray-400 mt-1 font-black tracking-wider flex space-x-2">
                                            {todo.categoryId && <span>{getCategoryName(todo.categoryId)}</span>}
                                            {todo.priority === 'URGENT' && <span className="text-red-500">URGENT</span>}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black bg-gray-100 px-2 py-1 text-gray-500 rounded-sm">
                                        +{todo.points} PTS
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export const StoreItemInput: React.FC<{
    item?: StoreItem;
    onSave: (item: Omit<StoreItem, 'id'>) => void;
    onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
    const [name, setName] = useState(item?.name || '');
    const [cost, setCost] = useState(item?.cost || 100);
    const [desc, setDesc] = useState(item?.description || '');
    const [icon, setIcon] = useState(item?.icon || '📦');

    const handleSave = () => {
        if (!name.trim()) return;
        onSave({ name, cost, description: desc, icon });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">商品名称</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="例如：理智顶液"
                        className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 px-1 text-sm font-bold"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">兑换价格 (PTS)</label>
                    <input
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 px-1 text-sm font-bold jetbrains"
                    />
                </div>
            </div>
            
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">商品描述</label>
                <textarea
                    rows={2}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="简短的商品说明..."
                    className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 px-1 text-sm font-bold resize-none"
                />
            </div>
            
             <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">显示图标 (Emoji)</label>
                <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="📦"
                    className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 px-1 text-lg"
                />
            </div>

            <div className="flex space-x-4 pt-4">
                <button onClick={onCancel} className="flex-1 bg-white text-[#313131] border border-[#313131] py-3 font-black tracking-[0.3em] hover:bg-gray-100 transition-all">
                    取消
                </button>
                <button onClick={handleSave} className="flex-1 bg-[#313131] text-white py-3 font-black tracking-[0.3em] hover:bg-black transition-all shadow-xl">
                    保存
                </button>
            </div>
        </div>
    );
};

export const StoreView: React.FC<{
    items: StoreItem[];
    userPoints: number;
    onPurchase: (cost: number, itemName: string) => void;
    onAddItem: (item: Omit<StoreItem, 'id'>) => void;
    onUpdateItem: (id: string, updates: Partial<StoreItem>) => void;
    onDeleteItem: (id: string) => void;
}> = ({ items, userPoints, onPurchase, onAddItem, onUpdateItem, onDeleteItem }) => {
    const [isManagementMode, setIsManagementMode] = useState(false);
    const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleSaveNew = (item: Omit<StoreItem, 'id'>) => {
        onAddItem(item);
        setIsAddModalOpen(false);
    }

    const handleSaveEdit = (updates: Omit<StoreItem, 'id'>) => {
        if(editingItem) {
            onUpdateItem(editingItem.id, updates);
            setEditingItem(null);
        }
    }

    return (
        <div>
            <StrategicModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="入库新物资"
            >
                <StoreItemInput onSave={handleSaveNew} onCancel={() => setIsAddModalOpen(false)} />
            </StrategicModal>

            <StrategicModal
                isOpen={!!editingItem}
                onClose={() => setEditingItem(null)}
                title="更新物资信息"
            >
                {editingItem && (
                    <StoreItemInput 
                        item={editingItem}
                        onSave={handleSaveEdit} 
                        onCancel={() => setEditingItem(null)} 
                    />
                )}
            </StrategicModal>

            <div className="bg-[#2d2d2d] text-white p-6 mb-8 flex justify-between items-end shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <div className="text-[10px] font-black tracking-widest opacity-60 uppercase mb-1">Current Balance</div>
                    <div className="text-4xl font-black jetbrains tracking-tighter text-[#ffcf00]">{userPoints} <span className="text-sm text-white">PTS</span></div>
                </div>
                <div className="relative z-10">
                    <button 
                        onClick={() => setIsManagementMode(!isManagementMode)}
                        className={`text-[9px] font-black px-3 py-1 border transition-colors ${isManagementMode ? 'bg-[#ffcf00] text-black border-[#ffcf00]' : 'border-gray-500 text-gray-400 hover:text-white hover:border-white'}`}
                    >
                        {isManagementMode ? 'EXIT ADMIN' : 'MANAGE STOCK'}
                    </button>
                </div>
                <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#ffcf00]/20 to-transparent skew-x-12 pointer-events-none"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.id} className={`bg-white border border-gray-200 p-6 flex flex-col items-center text-center group hover:border-[#0098dc] transition-colors shadow-sm relative overflow-hidden ${isManagementMode ? 'border-dashed border-gray-400' : ''}`}>
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                        <h3 className="text-lg font-black text-[#313131] mb-1">{item.name}</h3>
                        <p className="text-xs text-gray-400 mb-6 px-4 h-8 overflow-hidden">{item.description}</p>
                        
                        <button 
                            onClick={() => onPurchase(item.cost, item.name)}
                            disabled={userPoints < item.cost || isManagementMode}
                            className={`
                                w-full py-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all
                                ${userPoints >= item.cost 
                                    ? 'bg-[#313131] text-white hover:bg-[#0098dc]' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                                ${isManagementMode ? 'opacity-20 pointer-events-none' : ''}
                            `}
                        >
                            {item.cost} PTS
                        </button>

                        {isManagementMode && (
                             <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                 <button onClick={() => setEditingItem(item)} className="p-2 bg-black text-white rounded-full hover:scale-110 transition-transform">
                                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                 </button>
                                 <button onClick={() => { if(confirm('确认下架该商品吗？')) onDeleteItem(item.id); }} className="p-2 bg-red-600 text-white rounded-full hover:scale-110 transition-transform">
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                 </button>
                             </div>
                        )}

                        {!isManagementMode && userPoints < item.cost && (
                             <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                 <span className="bg-black text-white text-[10px] font-bold px-2 py-1 transform -rotate-12">INSUFFICIENT FUNDS</span>
                             </div>
                        )}
                    </div>
                ))}
                
                {isManagementMode && (
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-gray-50 border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-gray-400 hover:border-[#0098dc] hover:text-[#0098dc] transition-all min-h-[240px]"
                    >
                        <Icons.Plus />
                        <span className="mt-2 text-xs font-black tracking-widest uppercase">Add New Item</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export const SystemSettings: React.FC<{
    isBgmEnabled: boolean;
    onToggleBgm: (enabled: boolean) => void;
    onImportMusic: (file: File) => void;
    currentMusicName: string;
    onDelayTasks: (days: number) => void;
}> = ({ isBgmEnabled, onToggleBgm, onImportMusic, currentMusicName, onDelayTasks }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between shadow-sm">
                <div className="mb-4 md:mb-0">
                    <h3 className="text-sm font-bold text-[#313131] mb-1">背景音乐 / BGM SYSTEM</h3>
                    <p className="text-[10px] text-gray-400 font-medium">启用 PRTS 终端背景音效 (LocalStorage)</p>
                </div>
                <div className="flex items-center space-x-4">
                     {currentMusicName && (
                        <div className="text-[10px] font-bold text-[#0098dc] bg-blue-50 px-2 py-1 truncate max-w-[150px]">
                            {currentMusicName}
                        </div>
                    )}
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[10px] font-black bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 transition-colors uppercase tracking-wider"
                    >
                        导入 (Max 3MB)
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        accept="audio/*" 
                        className="hidden" 
                        onChange={(e) => {
                            if (e.target.files?.[0]) onImportMusic(e.target.files[0]);
                        }}
                    />
                    <button 
                        onClick={() => onToggleBgm(!isBgmEnabled)}
                        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isBgmEnabled ? 'bg-[#0098dc]' : 'bg-gray-300'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${isBgmEnabled ? 'left-7' : 'left-1'}`}></div>
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between shadow-sm">
                <div className="mb-4 md:mb-0">
                    <h3 className="text-sm font-bold text-[#313131] mb-1">紧急延期 / EMERGENCY DELAY</h3>
                    <p className="text-[10px] text-gray-400 font-medium">将所有未完成任务的截止日期推后 1 天</p>
                </div>
                <button 
                    onClick={() => {
                        if(confirm('确认要将所有过期及未完成任务延后一天吗？')) onDelayTasks(1);
                    }}
                    className="bg-[#313131] text-white px-6 py-2 text-xs font-bold hover:bg-red-600 transition-colors uppercase tracking-widest shadow-lg"
                >
                    执行延期
                </button>
            </div>
            
            <div className="text-center mt-10">
                <div className="text-[9px] text-gray-300 font-mono tracking-widest">
                    RHODES ISLAND TERMINAL SYSTEM <br/>
                    DESIGNED FOR DOCTOR
                </div>
            </div>
        </div>
    );
};

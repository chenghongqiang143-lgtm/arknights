
import React, { useState, useRef, useEffect } from 'react';
import { Todo, Category, Subtask, TaskTemplate } from '../types';
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
    onAddSubtask: (taskId: string, text: string) => void;
    onEdit: (todo: Todo) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({ todo, categoryName, onToggle, onDelete, onToggleSubtask, onAddSubtask, onEdit }) => {
    const [newSubtask, setNewSubtask] = useState('');
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
            onAddSubtask(todo.id, newSubtask);
            setNewSubtask('');
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
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center space-x-2">
                             {todo.priority === 'URGENT' && (
                                <span className="text-[10px] font-black px-1.5 py-0.5 bg-[#ffcf00] text-[#313131] tracking-widest">
                                    {priorityLabels[todo.priority]}
                                </span>
                            )}
                            <span className={`text-lg sm:text-xl font-bold tracking-tight transition-all truncate leading-tight ${todo.completed ? 'line-through text-gray-400' : 'text-[#313131]'}`}>
                                {todo.text}
                            </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            {categoryName && (
                                <span className="text-[9px] font-black px-1.5 bg-[#313131] text-white tracking-[0.15em] whitespace-nowrap">
                                    {categoryName}
                                </span>
                            )}
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
                                <span className="w-1 h-1 bg-gray-300 rounded-full mr-2"></span>
                                <span>风险: {priorityLabels[todo.priority]}</span>
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity ml-4 shrink-0">
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    {todo.completed && <div className="absolute inset-0 bg-black/[0.02] pointer-events-none"></div>}
                </div>
            </div>

            <div className="ml-1.5 pl-6 mt-1 space-y-1">
                {todo.subtasks.map(sub => (
                    <div key={sub.id} className="flex items-center group/sub bg-white/40 hover:bg-white/60 px-3 py-1 transition-colors border-l-2 border-gray-200">
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
                ))}
                {!todo.completed && (
                    <div className="flex items-center pl-3 py-1 border-l-2 border-dashed border-gray-200">
                        <span className="text-gray-300 mr-2 text-xs">+</span>
                        <input 
                            type="text" 
                            placeholder="添加子任务..." 
                            value={newSubtask}
                            onChange={(e) => setNewSubtask(e.target.value)}
                            onKeyDown={handleAddSub}
                            className="bg-transparent border-none focus:outline-none text-xs font-bold text-gray-400 placeholder:text-gray-200 w-full"
                        />
                    </div>
                )}
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
    const priorityColors = {
        NORMAL: 'bg-gray-400',
        URGENT: 'bg-[#ffcf00]'
    };

    return (
        <div className="flex flex-col mb-4">
            <div className="flex items-center group border border-transparent hover:border-gray-300 cursor-pointer transition-all" onClick={() => onDeploy(template)}>
                <div className={`w-1.5 h-16 ${priorityColors[template.priority]} shrink-0`}></div>
                <div className="flex-1 bg-white px-6 py-2 flex items-center justify-between relative overflow-hidden group-hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col min-w-0">
                        <span className="text-lg font-bold tracking-tight text-[#313131] truncate">{template.text}</span>
                        <div className="flex items-center space-x-2 mt-1">
                            {categoryName && (
                                <span className="text-[9px] font-black px-1.5 bg-[#313131] text-white tracking-[0.15em]">{categoryName}</span>
                            )}
                            <span className="text-[9px] font-black text-gray-400 tracking-tighter jetbrains">
                                模板编号: {template.id.slice(0, 8)}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity ml-4 shrink-0">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(template); }} 
                            className="p-2 text-gray-400 hover:text-black transition-colors bg-gray-100 hover:bg-gray-200 rounded-sm"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(template.id); }} 
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-100 hover:bg-gray-200 rounded-sm"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Template Steps - Always Visible */}
            {template.subtasks.length > 0 && (
                <div className="ml-1.5 pl-6 mt-1 flex flex-col space-y-1">
                    {template.subtasks.map((step, idx) => (
                        <div key={idx} className="flex items-center px-3 py-1 bg-white/50 border-l-2 border-gray-200 text-gray-500">
                            <div className="w-1 h-1 bg-gray-300 rounded-full mr-3 shrink-0"></div>
                            <span className="text-[10px] font-bold tracking-tight italic">{step}</span>
                        </div>
                    ))}
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

export const StatisticsDashboard: React.FC<{ todos: Todo[] }> = ({ todos }) => {
    const [period, setPeriod] = useState<'WEEK' | 'MONTH' | 'YEAR'>('WEEK');

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

    return (
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
            <div className="flex justify-between text-[8px] font-black text-gray-400 tracking-[0.2em] uppercase">
                <span>部署效率监控</span>
                <span>PRTS 数据同步: 100%</span>
            </div>
        </div>
    );
};

export const TaskInput: React.FC<{
    categories: Category[],
    onAdd: (text: string, priority: Todo['priority'], categoryId?: string, dueDate?: string, subtasks?: string[]) => void
}> = ({ categories, onAdd }) => {
    const [text, setText] = useState('');
    const [priority, setPriority] = useState<Todo['priority']>('NORMAL');
    const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
    const [dueDate, setDueDate] = useState('');
    const [subtaskInput, setSubtaskInput] = useState('');
    const [subtasks, setSubtasks] = useState<string[]>([]);

    const handleAdd = () => {
        if (!text.trim()) return;
        onAdd(text, priority, categoryId, dueDate, subtasks);
        setText('');
        setPriority('NORMAL');
        setCategoryId(undefined);
        setDueDate('');
        setSubtasks([]);
    };

    const addSub = () => {
        if (subtaskInput.trim()) {
            setSubtasks([...subtasks, subtaskInput.trim()]);
            setSubtaskInput('');
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
                    <button onClick={addSub} className="px-4 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold transition-colors">添加</button>
                </div>
                <div className="mt-3 space-y-1">
                    {subtasks.map((s, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-1.5 border-l-2 border-gray-300">
                            <span className="text-xs font-bold text-gray-600">{s}</span>
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

    const handleSave = () => {
        if (!text.trim()) return;
        onSave(todo.id, { text, priority, categoryId, dueDate });
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
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">预计完成时间</label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 text-sm font-bold jetbrains"
                />
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

export const TemplateInput: React.FC<{
    categories: Category[],
    onSave: (data: Partial<TaskTemplate>) => void,
    editingTemplate: TaskTemplate | null,
    onCancel: () => void
}> = ({ categories, onSave, editingTemplate, onCancel }) => {
    const [text, setText] = useState(editingTemplate?.text || '');
    const [priority, setPriority] = useState<Todo['priority']>(editingTemplate?.priority || 'NORMAL');
    const [categoryId, setCategoryId] = useState<string | undefined>(editingTemplate?.categoryId);
    const [subtaskInput, setSubtaskInput] = useState('');
    const [subtasks, setSubtasks] = useState<string[]>(editingTemplate?.subtasks || []);

    const handleSave = () => {
        if (!text.trim()) return;
        onSave({
            id: editingTemplate?.id,
            text,
            priority,
            categoryId,
            subtasks
        });
    };

    const addSub = () => {
        if (subtaskInput.trim()) {
            setSubtasks([...subtasks, subtaskInput.trim()]);
            setSubtaskInput('');
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">模板名称</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="例如：每周作战简报..."
                    className="w-full bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-2 px-1 text-lg font-bold"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">预设风险等级</label>
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
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">所属扇区</label>
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
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">子任务配置</label>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={subtaskInput}
                        onChange={(e) => setSubtaskInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addSub()}
                        placeholder="预设任务步骤..."
                        className="flex-1 bg-white border-b-2 border-gray-200 focus:border-[#313131] outline-none py-1 text-sm font-bold"
                    />
                    <button onClick={addSub} className="px-4 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold transition-colors">添加</button>
                </div>
                <div className="mt-3 space-y-1">
                    {subtasks.map((s, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-1.5 border-l-2 border-gray-300">
                            <span className="text-xs font-bold text-gray-600">{s}</span>
                            <button onClick={() => setSubtasks(subtasks.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">
                                <Icons.Close />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex space-x-4">
                <button
                    onClick={onCancel}
                    className="flex-1 bg-white text-[#313131] border border-[#313131] py-4 font-black tracking-[0.3em] hover:bg-gray-100 transition-all"
                >
                    中止
                </button>
                <button
                    onClick={handleSave}
                    className="flex-1 bg-[#313131] text-white py-4 font-black tracking-[0.3em] hover:bg-black transition-all shadow-xl"
                >
                    存入档案
                </button>
            </div>
        </div>
    );
};

export const ScheduleCalendar: React.FC<{ todos: Todo[], getCategoryName: (id?: string) => string | undefined }> = ({ todos }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [viewMode, setViewMode] = useState<'MONTH' | 'THREE_DAY'>('THREE_DAY');

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const formatDate = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const renderMonthView = () => {
        const days = [];
        const numDays = daysInMonth(currentMonth);
        const firstDay = firstDayOfMonth(currentMonth);

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="bg-white/10 h-32 border border-gray-100 opacity-20"></div>);
        }

        for (let day = 1; day <= numDays; day++) {
            const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const dateStr = formatDate(dateObj);
            const dayTodos = todos.filter(t => t.dueDate === dateStr);
            const isToday = formatDate(new Date()) === dateStr;
            
            days.push(
                <div key={day} className={`bg-white h-32 border border-gray-100 p-2 flex flex-col overflow-hidden group hover:bg-gray-50 transition-colors ${isToday ? 'ring-1 ring-inset ring-[#0098dc]' : ''}`}>
                    <span className={`text-xs font-black jetbrains mb-1 ${isToday ? 'text-[#0098dc]' : 'text-gray-400'}`}>
                        {String(day).padStart(2, '0')}
                        {isToday && <span className="ml-1 text-[8px] uppercase tracking-tighter">Current</span>}
                    </span>
                    <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
                        {dayTodos.map(todo => (
                            <div key={todo.id} className={`text-[8px] font-bold p-1 border-l-2 truncate ${todo.completed ? 'bg-gray-50 border-gray-300 text-gray-400 opacity-60' : 'bg-blue-50 border-blue-400 text-blue-700'}`}>
                                {todo.text}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return (
            <div className="grid grid-cols-7 border-t border-gray-100">
                {days}
            </div>
        );
    };

    const renderThreeDayView = () => {
        const today = new Date();
        const days = [0, 1, 2].map(offset => {
            const d = new Date(today);
            d.setDate(today.getDate() + offset);
            return d;
        });

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-200 border-t border-gray-100 min-h-[400px]">
                {days.map((date, idx) => {
                    const dateStr = formatDate(date);
                    const dayTodos = todos.filter(t => t.dueDate === dateStr);
                    const labels = ["今日作战", "明日预期", "后续展望"];
                    
                    return (
                        <div key={idx} className="bg-white p-6 flex flex-col space-y-4">
                            <div className="flex items-end justify-between border-b-2 border-[#313131] pb-2">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">{labels[idx]}</span>
                                    <span className="text-2xl font-black jetbrains italic leading-none mt-1">
                                        {String(date.getMonth() + 1).padStart(2, '0')}.{String(date.getDate()).padStart(2, '0')}
                                    </span>
                                </div>
                                <span className="text-[10px] font-black text-[#313131] opacity-30 jetbrains uppercase">0{idx + 1}</span>
                            </div>
                            
                            <div className="flex-1 space-y-2 overflow-y-auto pr-2">
                                {dayTodos.length > 0 ? (
                                    dayTodos.map(todo => (
                                        <div key={todo.id} className={`group flex items-center p-3 border border-gray-100 transition-all hover:translate-x-1 ${todo.completed ? 'opacity-50' : 'hover:border-blue-200 bg-gray-50/50'}`}>
                                            <div className={`w-1 h-8 mr-4 ${todo.priority === 'URGENT' ? 'bg-[#ffcf00]' : 'bg-gray-300'}`}></div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-bold text-[#313131] truncate">{todo.text}</div>
                                                <div className="text-[8px] font-black text-gray-400 tracking-tighter jetbrains mt-0.5">ID: {todo.id.slice(0,6)}</div>
                                            </div>
                                            {todo.completed && (
                                                <div className="text-[8px] font-black text-blue-500 uppercase px-1 bg-blue-50">Done</div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
                                        <Icons.Task />
                                        <span className="text-[10px] font-black tracking-widest uppercase mt-4">无部署计划</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-[#2d2d2d] text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-700 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-6">
                    <div className="flex flex-col">
                        <span className="text-xl font-black jetbrains italic tracking-tighter">
                            {viewMode === 'MONTH' 
                                ? `${currentMonth.getFullYear()}.${String(currentMonth.getMonth() + 1).padStart(2, '0')}`
                                : 'TACTICAL TIMELINE'
                            }
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">任务时间轴控制</span>
                    </div>
                    
                    {/* View Switcher */}
                    <div className="flex bg-black/40 p-1 rounded-sm border border-white/5">
                        <button 
                            onClick={() => setViewMode('THREE_DAY')}
                            className={`px-4 py-1.5 text-[9px] font-black tracking-widest transition-all ${viewMode === 'THREE_DAY' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            三日视图
                        </button>
                        <button 
                            onClick={() => setViewMode('MONTH')}
                            className={`px-4 py-1.5 text-[9px] font-black tracking-widest transition-all ${viewMode === 'MONTH' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            月视图
                        </button>
                    </div>
                </div>

                {viewMode === 'MONTH' && (
                    <div className="flex space-x-2">
                        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 hover:bg-white/10 transition-colors border border-white/5 bg-white/5">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={() => setCurrentMonth(new Date())} className="px-4 py-2 text-[10px] font-black tracking-widest hover:bg-white/10 transition-colors border border-white/5 bg-white/5">今日</button>
                        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 hover:bg-white/10 transition-colors border border-white/5 bg-white/5">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                )}
            </div>

            {viewMode === 'MONTH' && (
                <div className="grid grid-cols-7 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center py-2 bg-gray-50 border-b border-gray-200">
                    {['日', '一', '二', '三', '四', '五', '六'].map(d => <div key={d}>{d}</div>)}
                </div>
            )}

            {viewMode === 'MONTH' ? renderMonthView() : renderThreeDayView()}
            
            <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-t border-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-400"></div>
                        <span className="text-[8px] font-black text-gray-400 tracking-tighter uppercase">部署中</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-300"></div>
                        <span className="text-[8px] font-black text-gray-400 tracking-tighter uppercase">已完成</span>
                    </div>
                </div>
                <span className="text-[8px] font-black text-gray-400 jetbrains opacity-50 uppercase tracking-tighter">Rhodes Island Terminal Schedule Management System</span>
            </div>
        </div>
    );
};

export const SystemSettings: React.FC<{
    isBgmEnabled: boolean;
    onToggleBgm: (enabled: boolean) => void;
    onImportMusic: (file: File) => void;
    currentMusicName?: string;
    onDelayTasks: (days: number) => void;
}> = ({ isBgmEnabled, onToggleBgm, onImportMusic, currentMusicName, onDelayTasks }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [delayDays, setDelayDays] = useState(1);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImportMusic(file);
        }
    };

    return (
        <div className="bg-white border border-gray-200 p-8 shadow-sm relative overflow-hidden mb-10 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-mesh pointer-events-none opacity-10"></div>
            <h3 className="text-[10px] font-black text-gray-400 tracking-widest italic mb-6 uppercase">系统配置 / SYSTEM CONFIGURATION</h3>
            
            <div className="space-y-8">
                {/* Task Delay Setting - Moved to top as per request */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 space-y-4 md:space-y-0">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#313131] uppercase tracking-[0.2em]">战术顺延计划</span>
                        <span className="text-[9px] font-black text-gray-400 mt-1 uppercase">TACTICAL POSTPONEMENT SYSTEM</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-gray-200 bg-gray-50 overflow-hidden">
                             <button onClick={() => setDelayDays(Math.max(1, delayDays - 1))} className="px-3 py-1 hover:bg-gray-200 text-sm font-black">-</button>
                             <input 
                                type="number" 
                                value={delayDays}
                                onChange={(e) => setDelayDays(parseInt(e.target.value) || 1)}
                                className="w-12 text-center bg-transparent text-sm font-black jetbrains outline-none"
                             />
                             <button onClick={() => setDelayDays(delayDays + 1)} className="px-3 py-1 hover:bg-gray-200 text-sm font-black">+</button>
                             <span className="px-3 text-[10px] font-black text-gray-400 uppercase border-l border-gray-200">Days</span>
                        </div>
                        <button 
                            onClick={() => onDelayTasks(delayDays)}
                            className="bg-[#313131] text-white px-6 py-2 text-[10px] font-black tracking-widest hover:bg-[#0098dc] transition-all border-r-4 border-[#ffcf00] shadow-lg active:scale-95"
                        >
                            执行顺延
                        </button>
                    </div>
                </div>

                {/* BGM Toggle */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                            <Icons.Music />
                            <span className="text-xs font-bold text-[#313131] uppercase tracking-[0.2em]">终端背景音频</span>
                        </div>
                        <span className="text-[9px] font-black text-gray-400 mt-1 uppercase">BGM ACTIVATION STATE</span>
                    </div>
                    <button 
                        onClick={() => onToggleBgm(!isBgmEnabled)}
                        className={`relative w-16 h-8 transition-colors duration-300 ${isBgmEnabled ? 'bg-[#0098dc]' : 'bg-gray-200'}`}
                    >
                        <div className={`absolute top-1 left-1 w-6 h-6 bg-white transition-transform duration-300 shadow-sm ${isBgmEnabled ? 'translate-x-8' : 'translate-x-0'}`}></div>
                        <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                            <span className={`text-[8px] font-black ${isBgmEnabled ? 'text-white' : 'text-transparent'}`}>ON</span>
                            <span className={`text-[8px] font-black ${!isBgmEnabled ? 'text-gray-400' : 'text-transparent'}`}>OFF</span>
                        </div>
                    </button>
                </div>

                {/* Music Import */}
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#313131] uppercase tracking-[0.2em]">音频源文件导入</span>
                        <div className="flex items-center mt-1 space-x-2">
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Current: </span>
                             <span className="text-[9px] font-bold text-[#0098dc] jetbrains truncate max-w-[150px]">{currentMusicName || 'Rhodes_Island_Theme.mp3'}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="audio/*" 
                            className="hidden" 
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-[#2d2d2d] text-white px-6 py-2 text-[10px] font-black tracking-widest hover:bg-black transition-all border-r-4 border-gray-500 shadow-lg active:scale-95"
                        >
                            导入作战音乐
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 w-24 h-1 bg-gray-100 flex">
                <div className={`h-full bg-[#0098dc] transition-all duration-500 ${isBgmEnabled ? 'w-full' : 'w-0'}`}></div>
            </div>
        </div>
    );
};

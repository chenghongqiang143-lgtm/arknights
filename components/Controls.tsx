
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Todo, Category, Subtask, TaskTemplate, Achievement, StoreItem, PurchaseRecord, TimeFilterType } from '../types';
import { Icons, COLORS } from '../constants';

export const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-[#1a1a1a] z-[9999] flex flex-col items-center justify-center overflow-hidden select-none">
            {/* Hexagon Container */}
            <div className="relative w-32 h-32 flex items-center justify-center">
                 {/* Outer rotating ring */}
                 <div className="absolute inset-0 border border-[#333] loading-hexagon animate-[spin_10s_linear_infinite]"></div>
                 
                 {/* Inner pulses */}
                 <div className="absolute inset-4 bg-[#2d2d2d] loading-hexagon flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                     <Icons.RhodesLogo className="w-16 h-16 text-[#fff] opacity-80 animate-pulse" />
                 </div>
                 
                 {/* Scanning line effect */}
                 <div className="absolute inset-0 loading-hexagon overflow-hidden opacity-30">
                     <div className="w-full h-full bg-gradient-to-b from-transparent via-[#0098dc] to-transparent -translate-y-full animate-[scan_2s_linear_infinite]"></div>
                 </div>
            </div>

            {/* Text */}
            <div className="mt-12 text-center space-y-4">
                <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
                    Rhodes Island
                </h1>
                <div className="flex items-center justify-center space-x-1">
                    <span className="w-1 h-4 bg-[#0098dc] animate-[pulse_0.5s_ease-in-out_infinite]"></span>
                    <span className="w-1 h-3 bg-[#0098dc] animate-[pulse_0.5s_ease-in-out_infinite_0.1s]"></span>
                    <span className="w-1 h-5 bg-[#0098dc] animate-[pulse_0.5s_ease-in-out_infinite_0.2s]"></span>
                    <span className="text-xs font-mono text-gray-400 tracking-[0.3em] ml-2">SYSTEM INITIALIZING</span>
                </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-8 left-8 w-32 h-32 border-l-2 border-t-2 border-white/10"></div>
            <div className="absolute bottom-8 right-8 w-32 h-32 border-r-2 border-b-2 border-white/10"></div>
            
            <div className="absolute bottom-10 font-mono text-[10px] text-gray-600 tracking-widest">
                PRTS TERMINAL CONNECTION ESTABLISHED
            </div>
            
            <style>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
            `}</style>
        </div>
    );
};

interface StrategicModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const StrategicModal: React.FC<StrategicModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
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
                <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
                <div className="h-2 bg-[#1a1a1a] flex">
                    <div className="h-full bg-[#0098dc] w-1/4 shadow-[0_0_10px_#0098dc]"></div>
                    <div className="h-full bg-[#ffcf00] w-8 ml-auto"></div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export const AchievementToast = ({ achievement, onClose }: { achievement: Achievement; onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return createPortal(
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-full duration-500">
            <div className="bg-[#2d2d2d] text-white border-l-4 border-[#ffcf00] shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-stretch min-w-[300px] overflow-hidden">
                <div className="bg-[#ffcf00] w-12 flex items-center justify-center text-black">
                    <Icons.Medal />
                </div>
                <div className="p-4 flex-1">
                    <div className="text-[10px] font-black tracking-widest text-[#ffcf00] uppercase mb-1">徽章解锁</div>
                    <div className="font-bold text-lg leading-none mb-1">{achievement.title}</div>
                    <div className="text-xs text-gray-400">{achievement.description}</div>
                </div>
                <div className="absolute inset-0 border border-white/10 pointer-events-none"></div>
            </div>
        </div>,
        document.body
    );
};

export const PointPopup = ({ points, type }: { points: number, type: 'add' | 'subtract' }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return createPortal(
        <div className="fixed top-24 right-8 z-[90] pointer-events-none">
            <div className={`flex items-center space-x-2 text-xl font-black italic tracking-tighter animate-in slide-in-from-bottom-4 fade-in duration-300 ${type === 'add' ? 'text-[#0098dc]' : 'text-red-500'}`}>
                <span>{type === 'add' ? '+' : ''}{type === 'subtract' ? '-' : ''}{points}</span>
                <span className="text-xs font-normal not-italic tracking-normal opacity-80">PTS</span>
            </div>
        </div>,
        document.body
    );
};

export const DataBackupModal = ({ isOpen, onClose, onImport }: { isOpen: boolean, onClose: () => void, onImport: (data: string) => void }) => {
    const [jsonStr, setJsonStr] = useState('');
    const [mode, setMode] = useState<'EXPORT' | 'IMPORT'>('EXPORT');
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        if (isOpen && mode === 'EXPORT') {
            const data: any = {};
            ['todos', 'categories', 'templates', 'achievements', 'userPoints', 'storeItems', 'purchaseHistory', 'isBgmEnabled'].forEach(key => {
                const item = localStorage.getItem(key);
                if (item) data[key] = JSON.parse(item);
            });
            setJsonStr(JSON.stringify(data, null, 2));
        }
    }, [isOpen, mode]);

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonStr).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const handleImport = () => {
        try {
            JSON.parse(jsonStr); // Validate
            onImport(jsonStr);
            onClose();
        } catch (e) {
            alert('JSON 格式错误，请检查内容。');
        }
    };

    return (
        <StrategicModal isOpen={isOpen} onClose={onClose} title="数据备份与恢复">
            <div className="space-y-6">
                <div className="flex space-x-1 bg-gray-100 p-1 w-fit">
                    <button 
                        onClick={() => { setMode('EXPORT'); setJsonStr(''); }}
                        className={`px-4 py-2 text-xs font-black tracking-widest ${mode === 'EXPORT' ? 'bg-[#313131] text-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
                    >
                        导出备份
                    </button>
                    <button 
                        onClick={() => { setMode('IMPORT'); setJsonStr(''); }}
                        className={`px-4 py-2 text-xs font-black tracking-widest ${mode === 'IMPORT' ? 'bg-[#313131] text-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
                    >
                        恢复数据
                    </button>
                </div>

                {mode === 'EXPORT' && (
                    <div className="space-y-4">
                        <div className="bg-white border border-gray-200 p-4 relative">
                            <textarea 
                                className="w-full h-64 text-xs font-mono bg-gray-50 p-2 border border-gray-200 focus:outline-none resize-none"
                                readOnly
                                value={jsonStr}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button 
                                onClick={handleCopy}
                                className={`px-6 py-2 text-xs font-black tracking-widest uppercase transition-colors ${copySuccess ? 'bg-green-500 text-white' : 'bg-[#0098dc] text-white hover:bg-[#0081bb]'}`}
                            >
                                {copySuccess ? '已复制' : '复制到剪贴板'}
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'IMPORT' && (
                    <div className="space-y-4">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-xs text-yellow-800">
                            警告：恢复数据将覆盖当前所有进度，且无法撤销。请谨慎操作。
                        </div>
                        <textarea 
                            className="w-full h-64 text-xs font-mono bg-white p-2 border border-gray-200 focus:outline-none focus:border-[#0098dc] resize-none"
                            placeholder="在此粘贴备份的 JSON 数据..."
                            value={jsonStr}
                            onChange={e => setJsonStr(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <button 
                                onClick={handleImport}
                                className="bg-red-500 text-white px-6 py-2 text-xs font-black tracking-widest uppercase hover:bg-red-600 shadow-lg"
                            >
                                确认恢复
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </StrategicModal>
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

export const FilterBar: React.FC<{
    current: TimeFilterType;
    onChange: (type: TimeFilterType) => void;
}> = ({ current, onChange }) => {
    const filters = [
        { type: TimeFilterType.TODAY, label: '今日' },
        { type: TimeFilterType.WEEK, label: '本周' },
        { type: TimeFilterType.MONTH, label: '本月' },
        { type: TimeFilterType.ALL, label: '全部' },
        { type: TimeFilterType.INCOMPLETE, label: '未完成' },
    ];

    return (
        <div className="flex space-x-1 mb-6 bg-white p-1 border border-gray-200 w-fit">
            {filters.map(f => (
                <button
                    key={f.type}
                    onClick={() => onChange(f.type)}
                    className={`px-4 py-1 text-[10px] font-black transition-all tracking-widest uppercase ${
                        current === f.type 
                        ? 'bg-[#313131] text-white shadow-sm' 
                        : 'text-gray-400 hover:text-[#313131] hover:bg-gray-100'
                    }`}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
};

interface TaskRowProps {
    todo: Todo;
    categoryName?: string;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleSubtask: (taskId: string, subtaskId: string) => void;
    onAddSubtask: (taskId: string, text: string, points: number) => void;
    onEdit: (todo: Todo) => void;
    systemDate: Date;
}

export const TaskRow: React.FC<TaskRowProps> = ({ todo, categoryName, onToggle, onDelete, onToggleSubtask, onAddSubtask, onEdit, systemDate }) => {
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

    const isLocked = useMemo(() => {
        if (!todo.dueDate || todo.completed) return false;
        const sysDateStr = systemDate.toISOString().split('T')[0]; // Assuming systemDate is already local
        // To be safe with string comparison, we assume todo.dueDate is strictly YYYY-MM-DD
        return todo.dueDate > sysDateStr;
    }, [todo.dueDate, todo.completed, systemDate]);

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

    // Fix: Explicitly check for > 0 to avoid rendering '0' string when frequency is 0
    const showFrequency = todo.frequency !== undefined && todo.frequency > 0;

    return (
        <div className={`flex flex-col mb-4 transition-all duration-300 ${todo.completed ? 'opacity-50 grayscale-[0.8]' : ''}`}>
            <div 
                className={`flex items-center group border bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${todo.priority === 'URGENT' ? 'border-l-4 border-l-[#ffcf00]' : 'border-l-4 border-l-gray-300'}`}
                onTouchStart={startPress}
                onTouchEnd={endPress}
                onMouseDown={startPress}
                onMouseUp={endPress}
                onMouseLeave={endPress}
            >
                <button 
                    onClick={() => onToggle(todo.id)}
                    className={`w-12 h-full min-h-[4rem] flex items-center justify-center shrink-0 border-r border-gray-100 ${todo.completed ? 'bg-[#0098dc] text-white' : 'bg-transparent text-gray-300 hover:text-[#0098dc]'}`}
                >
                     {todo.completed ? (
                         <div className="w-5 h-5 border-2 border-white bg-white flex items-center justify-center">
                             <div className="w-3 h-3 bg-[#0098dc]"></div>
                         </div>
                     ) : (
                         <div className="w-5 h-5 border-2 border-current"></div>
                     )}
                </button>

                <div className="flex-1 p-3 flex flex-col justify-center cursor-pointer relative" onClick={() => setIsExpanded(!isExpanded)}>
                    <div className="flex items-center space-x-2 mb-1">
                        {todo.priority === 'URGENT' && <span className="text-[9px] font-black bg-[#ffcf00] text-black px-1.5 py-0.5 tracking-wider">紧急</span>}
                        {todo.penalized && <span className="text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 tracking-wider">已惩罚</span>}
                        {showFrequency && <div className="flex items-center gap-1 text-[9px] text-[#0098dc]"><Icons.Repeat /> <span>{todo.frequency}天</span></div>}
                        <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">{categoryName}</span>
                    </div>
                    <div className={`font-bold text-gray-800 ${todo.completed ? 'line-through decoration-2 decoration-[#0098dc]' : ''}`}>
                        {todo.text}
                    </div>
                    {todo.dueDate && (
                        <div className="text-[10px] font-mono text-gray-400 mt-1 flex items-center gap-1">
                            <span className={isLocked ? "text-red-500 font-bold" : ""}>{todo.dueDate}</span>
                            {isLocked && <span>[未解锁]</span>}
                        </div>
                    )}
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent"></div>
                </div>

                <div className="pr-4 flex flex-col items-end justify-center shrink-0 space-y-1">
                    <span className="text-xl font-black italic text-[#0098dc] tracking-tighter">{todo.points}<span className="text-[9px] not-italic ml-0.5 font-bold text-gray-400">PTS</span></span>
                </div>
                
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}
                    className="w-10 h-full min-h-[4rem] flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors border-l border-gray-100 opacity-0 group-hover:opacity-100"
                >
                    <Icons.Close />
                </button>
            </div>
            
            {/* Subtasks */}
            {isExpanded && (todo.subtasks.length > 0 || !todo.completed) && (
                <div className="bg-[#f9f9f9] border-l-4 border-l-transparent pl-12 pr-4 py-2 space-y-2 border-b border-r border-gray-200 shadow-inner">
                    {todo.subtasks.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between group/sub">
                            <div className="flex items-center space-x-3">
                                <button 
                                    onClick={() => onToggleSubtask(todo.id, sub.id)}
                                    disabled={todo.completed}
                                    className={`w-3 h-3 border border-gray-400 ${sub.completed ? 'bg-[#0098dc] border-[#0098dc]' : 'hover:border-[#0098dc]'}`}
                                ></button>
                                <span className={`text-xs ${sub.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>{sub.text}</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">{sub.points} PTS</span>
                        </div>
                    ))}
                    {!todo.completed && (
                        <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-100">
                             <div className="w-3 h-3 border border-dashed border-gray-300"></div>
                             <input 
                                 type="text" 
                                 value={newSubtask}
                                 onChange={e => setNewSubtask(e.target.value)}
                                 onKeyDown={handleAddSub}
                                 placeholder="新增子任务..."
                                 className="flex-1 bg-transparent text-xs border-none focus:ring-0 focus:outline-none placeholder-gray-400"
                             />
                             <input
                                type="number"
                                value={newSubtaskPoints}
                                onChange={e => setNewSubtaskPoints(Number(e.target.value))}
                                className="w-10 bg-transparent text-xs text-right border-b border-gray-200 focus:outline-none"
                             />
                             <span className="text-[9px] text-gray-400">PTS</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const TaskInput: React.FC<{
    categories: Category[];
    onAdd: (text: string, priority: Todo['priority'], categoryId: string | undefined, dueDate: string | undefined, subtasks: {text: string, points: number}[], points: number, frequency: number, recurrenceLimit: number) => void;
}> = ({ categories, onAdd }) => {
    const [text, setText] = useState('');
    const [priority, setPriority] = useState<Todo['priority']>('NORMAL');
    const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || '');
    
    // Fix: Use local date string instead of UTC toISOString to avoid "yesterday" bug
    const today = new Date();
    const localDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const [dueDate, setDueDate] = useState<string>(localDateStr);

    const [points, setPoints] = useState(100);
    const [subtasks, setSubtasks] = useState<{text: string, points: number}[]>([]);
    const [newSubText, setNewSubText] = useState('');
    const [newSubPoints, setNewSubPoints] = useState(20);
    const [frequency, setFrequency] = useState(0);
    const [recurrenceLimit, setRecurrenceLimit] = useState(1);

    const handleSubmit = () => {
        if (!text.trim()) return;
        onAdd(text, priority, categoryId, dueDate, subtasks, points, frequency, recurrenceLimit);
        setText('');
        setSubtasks([]);
    };

    const addSub = () => {
        if (newSubText) {
            setSubtasks([...subtasks, { text: newSubText, points: newSubPoints }]);
            setNewSubText('');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">作战目标</label>
                <input 
                    className="w-full bg-white border-b-2 border-gray-300 p-2 focus:border-[#0098dc] focus:outline-none font-bold text-lg" 
                    value={text} 
                    onChange={e => setText(e.target.value)} 
                    placeholder="输入任务名称..."
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">优先级</label>
                    <div className="flex mt-1 space-x-2">
                        <button onClick={() => setPriority('NORMAL')} className={`flex-1 py-2 text-xs font-black border ${priority === 'NORMAL' ? 'bg-[#0098dc] border-[#0098dc] text-white' : 'border-gray-300 text-gray-400'}`}>普通</button>
                        <button onClick={() => setPriority('URGENT')} className={`flex-1 py-2 text-xs font-black border ${priority === 'URGENT' ? 'bg-[#ffcf00] border-[#ffcf00] text-black' : 'border-gray-300 text-gray-400'}`}>紧急</button>
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">分类</label>
                    <select 
                        className="w-full mt-1 bg-white border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none"
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                    >
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                     <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">截止日期</label>
                     <input 
                         type="date"
                         className="w-full mt-1 bg-white border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none"
                         value={dueDate}
                         onChange={e => setDueDate(e.target.value)}
                     />
                </div>
                <div>
                     <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">报酬 (PTS)</label>
                     <input 
                         type="number"
                         className="w-full mt-1 bg-white border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none"
                         value={points}
                         onChange={e => setPoints(Number(e.target.value))}
                     />
                </div>
            </div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                     <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">循环周期 (天)</label>
                     <input 
                         type="number"
                         placeholder="0 为一次性"
                         className="w-full mt-1 bg-white border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none"
                         value={frequency}
                         onChange={e => setFrequency(Number(e.target.value))}
                     />
                </div>
                <div>
                     <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">循环次数限制</label>
                     <input 
                         type="number"
                         placeholder="次数"
                         className="w-full mt-1 bg-white border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none"
                         value={recurrenceLimit}
                         onChange={e => setRecurrenceLimit(Math.max(1, Number(e.target.value)))}
                         min={1}
                     />
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">子任务</label>
                <div className="mt-2 space-y-2">
                    {subtasks.map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm bg-white p-2 border border-gray-100">
                            <span>{s.text}</span>
                            <span className="font-mono text-gray-400">{s.points} PTS</span>
                        </div>
                    ))}
                    <div className="flex space-x-2">
                        <input 
                            className="flex-1 border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none" 
                            placeholder="新子任务..." 
                            value={newSubText}
                            onChange={e => setNewSubText(e.target.value)}
                        />
                         <input 
                            type="number"
                            className="w-20 border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none" 
                            value={newSubPoints}
                            onChange={e => setNewSubPoints(Number(e.target.value))}
                        />
                        <button onClick={addSub} className="bg-gray-200 px-3 hover:bg-[#0098dc] hover:text-white transition-colors">+</button>
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button 
                    onClick={handleSubmit} 
                    className="bg-[#2d2d2d] text-white px-8 py-3 text-xs font-black tracking-[0.2em] uppercase hover:bg-[#0098dc] transition-colors shadow-lg border-b-4 border-black active:border-b-0 active:translate-y-1"
                >
                    确认部署
                </button>
            </div>
        </div>
    );
};

export const TaskEditForm: React.FC<{
    todo: Todo;
    categories: Category[];
    onSave: (id: string, updates: Partial<Todo>) => void;
    onCancel: () => void;
}> = ({ todo, categories, onSave, onCancel }) => {
    const [text, setText] = useState(todo.text);
    const [priority, setPriority] = useState(todo.priority);
    const [points, setPoints] = useState(todo.points);
    const [dueDate, setDueDate] = useState(todo.dueDate || '');
    const [categoryId, setCategoryId] = useState(todo.categoryId || '');

    const handleSave = () => {
        onSave(todo.id, {
            text, priority, points, dueDate, categoryId
        });
    };

    return (
        <div className="space-y-4">
             <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">作战目标</label>
                <input 
                    className="w-full bg-white border-b-2 border-gray-300 p-2 focus:border-[#0098dc] focus:outline-none font-bold text-lg" 
                    value={text} 
                    onChange={e => setText(e.target.value)} 
                />
            </div>
            
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">优先级</label>
                    <div className="flex mt-1 space-x-2">
                        <button onClick={() => setPriority('NORMAL')} className={`flex-1 py-2 text-xs font-black border ${priority === 'NORMAL' ? 'bg-[#0098dc] border-[#0098dc] text-white' : 'border-gray-300 text-gray-400'}`}>普通</button>
                        <button onClick={() => setPriority('URGENT')} className={`flex-1 py-2 text-xs font-black border ${priority === 'URGENT' ? 'bg-[#ffcf00] border-[#ffcf00] text-black' : 'border-gray-300 text-gray-400'}`}>紧急</button>
                    </div>
                 </div>
                 <div>
                     <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">报酬 (PTS)</label>
                     <input 
                         type="number"
                         className="w-full mt-1 bg-white border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none"
                         value={points}
                         onChange={e => setPoints(Number(e.target.value))}
                     />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                     <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">截止日期</label>
                     <input 
                         type="date"
                         className="w-full mt-1 bg-white border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none"
                         value={dueDate}
                         onChange={e => setDueDate(e.target.value)}
                     />
                </div>
                 <div>
                    <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">分类</label>
                    <select 
                        className="w-full mt-1 bg-white border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none"
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                    >
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
            </div>

            <div className="pt-4 flex justify-end space-x-4">
                <button onClick={onCancel} className="text-gray-500 text-xs font-bold hover:text-black">取消</button>
                <button 
                    onClick={handleSave} 
                    className="bg-[#0098dc] text-white px-6 py-2 text-xs font-black tracking-widest uppercase hover:bg-[#0081bb] shadow-sm"
                >
                    保存
                </button>
            </div>
        </div>
    );
};

export const CategoryManager: React.FC<{
    categories: Category[];
    onAdd: (name: string) => void;
    onEdit: (id: string, name: string) => void;
    onDelete: (id: string) => void;
}> = ({ categories, onAdd, onEdit, onDelete }) => {
    const [newCat, setNewCat] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    return (
        <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-black tracking-widest uppercase text-gray-500">分类管理</h3>
            <div className="flex space-x-2">
                <input 
                    className="flex-1 border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none"
                    placeholder="新分类名称..."
                    value={newCat}
                    onChange={e => setNewCat(e.target.value)}
                />
                <button 
                    onClick={() => { if(newCat) { onAdd(newCat); setNewCat(''); } }}
                    className="bg-[#313131] text-white px-4 text-xs font-black tracking-widest"
                >
                    添加
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map(c => (
                    <div key={c.id} className="flex items-center justify-between bg-white p-2 border border-gray-200">
                        {editingId === c.id ? (
                            <input 
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                className="flex-1 bg-gray-50 px-1 mr-2 text-sm"
                                autoFocus
                            />
                        ) : (
                            <span className="text-sm font-bold text-gray-700">{c.name}</span>
                        )}
                        <div className="flex space-x-2">
                            {editingId === c.id ? (
                                <button onClick={() => { onEdit(c.id, editName); setEditingId(null); }} className="text-[#0098dc] text-xs font-bold">保存</button>
                            ) : (
                                <button onClick={() => { setEditingId(c.id); setEditName(c.name); }} className="text-gray-400 hover:text-black">
                                    <div className="w-4 h-4"><Icons.Settings /></div>
                                </button>
                            )}
                            <button onClick={() => onDelete(c.id)} className="text-gray-400 hover:text-red-500">
                                <div className="w-4 h-4"><Icons.Close /></div>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface TemplateRowProps {
    template: TaskTemplate;
    categoryName?: string;
    onDeploy: (template: TaskTemplate) => void;
    onDelete: (id: string) => void;
    onEdit: (template: TaskTemplate) => void;
}

export const TemplateRow: React.FC<TemplateRowProps> = ({ template, categoryName, onDeploy, onDelete, onEdit }) => {
    return (
        <div className="bg-white border-l-4 border-l-[#0098dc] p-4 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex justify-between items-start mb-2">
                <div>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{categoryName || '未分类'}</span>
                     <h4 className="font-bold text-lg leading-tight">{template.text}</h4>
                </div>
                <span className="text-xl font-black italic text-[#0098dc]">{template.points}<span className="text-[9px] not-italic ml-0.5 font-bold text-gray-400">PTS</span></span>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
                <span className={`px-1.5 py-0.5 font-black text-[9px] ${template.priority === 'URGENT' ? 'bg-[#ffcf00] text-black' : 'bg-gray-200 text-gray-600'}`}>
                    {template.priority === 'URGENT' ? '紧急' : '普通'}
                </span>
                <span>{template.subtasks.length} 子任务</span>
                {template.frequency ? <span>循环 {template.frequency}天</span> : null}
            </div>

            <div className="flex space-x-2 mt-2">
                <button 
                    onClick={() => onDeploy(template)}
                    className="flex-1 bg-[#2d2d2d] text-white py-2 text-xs font-black tracking-widest uppercase hover:bg-[#0098dc] transition-colors"
                >
                    部署
                </button>
                <button 
                    onClick={() => onEdit(template)}
                    className="px-3 border border-gray-200 text-gray-500 hover:text-black hover:border-black"
                >
                    编辑
                </button>
                <button 
                    onClick={() => onDelete(template.id)}
                    className="px-3 border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-500"
                >
                    删除
                </button>
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
    const [categoryId, setCategoryId] = useState(editingTemplate?.categoryId || categories[0]?.id || '');
    const [points, setPoints] = useState(editingTemplate?.points || 100);
    const [frequency, setFrequency] = useState(editingTemplate?.frequency || 0);
    const [recurrenceLimit, setRecurrenceLimit] = useState(editingTemplate?.recurrenceLimit || 1);
    const [subtasks, setSubtasks] = useState<{text: string, points: number}[]>(editingTemplate?.subtasks || []);
    const [newSubText, setNewSubText] = useState('');
    const [newSubPoints, setNewSubPoints] = useState(20);

    const handleSubmit = () => {
        if (!text) return;
        onSave({
            id: editingTemplate?.id,
            text, priority, categoryId, points, frequency, recurrenceLimit, subtasks
        });
    };

    return (
        <div className="space-y-4">
             <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">模板名称</label>
                <input 
                    className="w-full bg-white border-b-2 border-gray-300 p-2 focus:border-[#0098dc] focus:outline-none font-bold text-lg" 
                    value={text} 
                    onChange={e => setText(e.target.value)} 
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">默认优先级</label>
                    <div className="flex mt-1 space-x-2">
                        <button onClick={() => setPriority('NORMAL')} className={`flex-1 py-2 text-xs font-black border ${priority === 'NORMAL' ? 'bg-[#0098dc] border-[#0098dc] text-white' : 'border-gray-300 text-gray-400'}`}>普通</button>
                        <button onClick={() => setPriority('URGENT')} className={`flex-1 py-2 text-xs font-black border ${priority === 'URGENT' ? 'bg-[#ffcf00] border-[#ffcf00] text-black' : 'border-gray-300 text-gray-400'}`}>紧急</button>
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">分类</label>
                    <select 
                        className="w-full mt-1 bg-white border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none"
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                    >
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                     <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">报酬 (PTS)</label>
                     <input 
                         type="number"
                         className="w-full mt-1 bg-white border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none"
                         value={points}
                         onChange={e => setPoints(Number(e.target.value))}
                     />
                </div>
                 <div>
                     <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">循环周期 (天)</label>
                     <input 
                         type="number"
                         className="w-full mt-1 bg-white border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none"
                         value={frequency}
                         onChange={e => setFrequency(Number(e.target.value))}
                         placeholder="0 = 不循环"
                     />
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">循环次数限制</label>
                <input 
                    type="number"
                    className="w-full mt-1 bg-white border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none"
                    value={recurrenceLimit}
                    onChange={e => setRecurrenceLimit(Math.max(1, Number(e.target.value)))}
                    min={1}
                />
            </div>

             <div>
                <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">子任务模板</label>
                <div className="mt-2 space-y-2">
                    {subtasks.map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm bg-white p-2 border border-gray-100">
                            <span>{s.text}</span>
                            <span className="font-mono text-gray-400">{s.points} PTS</span>
                        </div>
                    ))}
                    <div className="flex space-x-2">
                        <input 
                            className="flex-1 border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none" 
                            placeholder="新子任务..." 
                            value={newSubText}
                            onChange={e => setNewSubText(e.target.value)}
                        />
                         <input 
                            type="number"
                            className="w-20 border border-gray-300 p-2 text-sm focus:border-[#0098dc] focus:outline-none" 
                            value={newSubPoints}
                            onChange={e => setNewSubPoints(Number(e.target.value))}
                        />
                        <button 
                            onClick={() => { if(newSubText) { setSubtasks([...subtasks, {text: newSubText, points: newSubPoints}]); setNewSubText(''); }}}
                            className="bg-gray-200 px-3 hover:bg-[#0098dc] hover:text-white transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end space-x-4">
                <button onClick={onCancel} className="text-gray-500 text-xs font-bold hover:text-black">取消</button>
                <button 
                    onClick={handleSubmit} 
                    className="bg-[#2d2d2d] text-white px-6 py-2 text-xs font-black tracking-widest uppercase hover:bg-[#0098dc] shadow-sm"
                >
                    保存模板
                </button>
            </div>
        </div>
    );
};

export const ScheduleCalendar: React.FC<{
    todos: Todo[];
    getCategoryName: (id: string | undefined) => string | undefined;
}> = ({ todos, getCategoryName }) => {
    const [viewMode, setViewMode] = useState<'WEEK' | 'MONTH'>('WEEK');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Helper for local date string YYYY-MM-DD
    const toDateString = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // Simple 7-day look ahead (Existing Logic)
    const days = useMemo(() => {
        const result = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const dateStr = toDateString(d);
            
            const tasks = todos.filter(t => t.dueDate === dateStr && !t.completed);
            result.push({ date: d, dateStr, tasks });
        }
        return result;
    }, [todos]);

    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    // Month View Logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const changeMonth = (offset: number) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + offset);
        setCurrentMonth(newMonth);
    };

    const renderMonthGrid = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysCount = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        
        const blanks = Array(firstDay).fill(null);
        const dayNumbers = Array.from({ length: daysCount }, (_, i) => i + 1);
        const allSlots = [...blanks, ...dayNumbers];

        return (
            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
                {weekDays.map(d => (
                    <div key={d} className="bg-[#f4f4f4] text-center text-[10px] font-bold text-gray-400 py-2">
                        {d}
                    </div>
                ))}
                {allSlots.map((day, i) => {
                    if (!day) return <div key={i} className="bg-white aspect-square"></div>;

                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dateObj = new Date(year, month, day);
                    const isSelected = toDateString(selectedDate) === dateStr;
                    const isToday = toDateString(new Date()) === dateStr;
                    
                    // Check for tasks
                    const dayTasks = todos.filter(t => t.dueDate === dateStr && !t.completed);
                    const hasTask = dayTasks.length > 0;
                    const hasUrgent = dayTasks.some(t => t.priority === 'URGENT');

                    return (
                        <button
                            key={i}
                            onClick={() => setSelectedDate(dateObj)}
                            className={`bg-white aspect-square flex flex-col items-center justify-center relative hover:bg-gray-50 transition-colors
                                ${isSelected ? '!bg-[#313131] !text-white' : ''}
                            `}
                        >
                            <span className={`text-xs font-bold ${isToday && !isSelected ? 'text-[#0098dc]' : ''}`}>{day}</span>
                            {hasTask && (
                                <div className="flex gap-0.5 mt-1">
                                    <div className={`w-1 h-1 rounded-full ${hasUrgent ? 'bg-[#ffcf00]' : 'bg-[#0098dc]'}`}></div>
                                </div>
                            )}
                            {isSelected && <div className="absolute inset-0 border-2 border-[#0098dc]"></div>}
                        </button>
                    );
                })}
            </div>
        );
    };

    const selectedTasks = useMemo(() => {
        const dateStr = toDateString(selectedDate);
        return todos.filter(t => t.dueDate === dateStr && !t.completed);
    }, [todos, selectedDate]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-black italic tracking-tighter">日程规划</h2>
                
                {/* View Switcher */}
                <div className="flex bg-gray-200 p-1">
                    <button 
                        onClick={() => setViewMode('WEEK')}
                        className={`px-4 py-1 text-xs font-black transition-all ${viewMode === 'WEEK' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        7日列表
                    </button>
                    <button 
                        onClick={() => setViewMode('MONTH')}
                        className={`px-4 py-1 text-xs font-black transition-all ${viewMode === 'MONTH' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        月视图
                    </button>
                </div>
            </div>

            {viewMode === 'WEEK' ? (
                 <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    {days.map((day, idx) => (
                        <div key={day.dateStr} className="flex group">
                            <div className="w-14 shrink-0 flex flex-col items-center pt-2 border-r-2 border-[#313131] group-hover:border-[#0098dc] transition-colors">
                                <span className="text-2xl font-black leading-none">{day.date.getDate()}</span>
                                <span className="text-[10px] font-bold uppercase text-gray-400">{weekDays[day.date.getDay()]}</span>
                            </div>
                            <div className="flex-1 pl-4 pb-4 border-b border-gray-100">
                                 {day.tasks.length === 0 ? (
                                     <div className="text-xs text-gray-300 font-bold tracking-widest py-2">无作战记录</div>
                                 ) : (
                                     <div className="space-y-2">
                                         {day.tasks.map(t => (
                                             <div key={t.id} className={`flex items-center space-x-2 text-sm p-2 bg-white shadow-sm border-l-2 ${t.priority === 'URGENT' ? 'border-l-[#ffcf00]' : 'border-l-gray-300'}`}>
                                                 <div className="w-1.5 h-1.5 bg-[#0098dc] rounded-full"></div>
                                                 <span className="font-bold text-gray-700 flex-1">{t.text}</span>
                                                 <span className="text-[9px] font-black text-gray-400 uppercase">{getCategoryName(t.categoryId)}</span>
                                             </div>
                                         ))}
                                     </div>
                                 )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-4">
                    {/* Month Controls */}
                    <div className="flex items-center justify-between bg-white p-2 border border-gray-200">
                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100"><Icons.ChevronDown className="rotate-90" /></button>
                        <span className="font-black text-lg">
                            {currentMonth.getFullYear()} <span className="text-[#0098dc]">/</span> {String(currentMonth.getMonth() + 1).padStart(2, '0')}
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100"><Icons.ChevronDown className="-rotate-90" /></button>
                    </div>
                    
                    {renderMonthGrid()}

                    {/* Selected Date Details */}
                    <div className="bg-[#f9f9f9] border-l-4 border-[#0098dc] p-4 mt-4">
                        <div className="text-xs font-bold text-gray-400 mb-2">
                            {selectedDate.getFullYear()}-{String(selectedDate.getMonth()+1).padStart(2,'0')}-{String(selectedDate.getDate()).padStart(2,'0')} 任务列表
                        </div>
                        {selectedTasks.length === 0 ? (
                             <div className="text-sm text-gray-400 font-bold">无作战计划</div>
                        ) : (
                             <div className="space-y-2">
                                 {selectedTasks.map(t => (
                                     <div key={t.id} className="bg-white p-2 shadow-sm flex items-center justify-between border border-gray-100">
                                         <span className="text-sm font-bold text-gray-700">{t.text}</span>
                                         {t.priority === 'URGENT' && <span className="bg-[#ffcf00] text-black text-[9px] px-1 font-black">紧急</span>}
                                     </div>
                                 ))}
                             </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const StatisticsDashboard: React.FC<{
    todos: Todo[];
    achievements: Achievement[];
    totalEarnedPoints: number;
    onAddAchievement: (title: string, description: string, targetPoints: number) => void;
    onDeleteAchievement: (id: string) => void;
}> = ({ todos, achievements, totalEarnedPoints, onAddAchievement, onDeleteAchievement }) => {
    const completedTasks = todos.filter(t => t.completed).length;
    const totalTasks = todos.length;
    const rate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newTarget, setNewTarget] = useState(1000);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#313131] text-white p-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase">累计获得点数</div>
                        <div className="text-4xl font-black text-[#0098dc] mt-1">{totalEarnedPoints} <span className="text-sm text-white">PTS</span></div>
                    </div>
                    <Icons.Stats />
                </div>
                 <div className="bg-white p-6 border border-gray-200 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase">完成率</div>
                        <div className="text-4xl font-black text-[#2d2d2d] mt-1">{rate}%</div>
                        <div className="w-full bg-gray-100 h-1 mt-4">
                            <div className="bg-[#0098dc] h-full" style={{ width: `${rate}%` }}></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 border border-gray-200 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase">已完成任务</div>
                        <div className="text-4xl font-black text-[#2d2d2d] mt-1">{completedTasks} <span className="text-lg text-gray-400">/ {totalTasks}</span></div>
                    </div>
                </div>
            </div>

            <SettingHeader title="成就徽章" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map(ach => {
                    const unlocked = totalEarnedPoints >= ach.targetPoints;
                    return (
                        <div key={ach.id} className={`p-4 border border-gray-200 flex items-center space-x-4 ${unlocked ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
                            <div className={`w-12 h-12 flex items-center justify-center shrink-0 ${unlocked ? 'bg-[#ffcf00] text-black' : 'bg-gray-200 text-gray-400'}`}>
                                <Icons.Medal />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800">{ach.title}</h4>
                                <p className="text-xs text-gray-500">{ach.description}</p>
                                <div className="text-[10px] font-mono text-gray-400 mt-1">需要 {ach.targetPoints} PTS</div>
                            </div>
                            {unlocked && <div className="text-[#0098dc] font-black text-xs transform rotate-12 border-2 border-[#0098dc] px-1">已获取</div>}
                             <button onClick={() => onDeleteAchievement(ach.id)} className="text-gray-300 hover:text-red-500 px-2"><Icons.Close /></button>
                        </div>
                    );
                })}
            </div>

             <div className="mt-8 bg-gray-100 p-4 border border-gray-200">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">添加自定义成就</h4>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <input className="p-2 text-xs border border-gray-300 flex-1" placeholder="成就名称" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                    <input className="p-2 text-xs border border-gray-300 flex-[2]" placeholder="达成条件描述" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                    <input className="p-2 text-xs border border-gray-300 w-24" type="number" placeholder="目标PTS" value={newTarget} onChange={e => setNewTarget(Number(e.target.value))} />
                    <button onClick={() => { if(newTitle) onAddAchievement(newTitle, newDesc, newTarget) }} className="bg-[#313131] text-white px-4 text-xs font-bold">添加</button>
                </div>
            </div>
        </div>
    );
};

export const StoreView: React.FC<{
    items: StoreItem[];
    userPoints: number;
    purchaseHistory: PurchaseRecord[];
    onPurchase: (cost: number, itemName: string) => void;
    onAddItem: (item: Omit<StoreItem, 'id'>) => void;
    onUpdateItem: (id: string, updates: Partial<StoreItem>) => void;
    onDeleteItem: (id: string) => void;
    onGacha: (cost: number) => { rarity: number, reward: string, refund: number } | null;
}> = ({ items, userPoints, purchaseHistory, onPurchase, onAddItem, onUpdateItem, onDeleteItem, onGacha }) => {
    const [newItemName, setNewItemName] = useState('');
    const [newItemCost, setNewItemCost] = useState(100);
    const [newItemDesc, setNewItemDesc] = useState('');
    const [gachaResult, setGachaResult] = useState<{ rarity: number, reward: string } | null>(null);

    const handleGachaClick = () => {
        const result = onGacha(600);
        if (result) {
            setGachaResult(result);
            setTimeout(() => setGachaResult(null), 3000);
        } else {
            alert('PTS 不足！');
        }
    };

    return (
        <div className="space-y-8 relative">
             <div className="flex justify-between items-end bg-[#2d2d2d] text-white p-6 border-l-8 border-[#ffcf00]">
                <div>
                     <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase">可用预算</div>
                     <div className="text-5xl font-black text-white mt-2 flex items-baseline">{userPoints}<span className="text-lg ml-2 font-bold text-[#ffcf00]">PTS</span></div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase">信用等级</div>
                    <div className="text-xl font-bold">LV.5</div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Gacha Banner */}
                 <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 relative overflow-hidden flex flex-col justify-center items-start shadow-xl">
                     <div className="relative z-10">
                        <h3 className="text-2xl font-black italic tracking-tighter mb-1">标准寻访</h3>
                        <p className="text-xs text-gray-400 mb-4 max-w-xs">消耗预算以获取随机物资或干员凭证</p>
                        <button 
                            onClick={handleGachaClick}
                            className="bg-[#ffcf00] text-black px-6 py-2 text-sm font-black tracking-widest uppercase hover:bg-white transition-colors"
                        >
                            寻访一次 (600 PTS)
                        </button>
                     </div>
                     <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('https://raw.githubusercontent.com/Aceship/AN-EN-Tags/master/img/item/AP_GAMEPLAY.png')] bg-contain bg-no-repeat bg-right opacity-20"></div>
                 </div>

                 {items.map(item => (
                     <div key={item.id} className="bg-white border border-gray-200 p-4 flex flex-col justify-between hover:border-[#0098dc] transition-colors group">
                         <div className="flex justify-between items-start">
                             <div className="text-4xl">{item.icon}</div>
                             <div className="text-right">
                                 <div className="font-bold text-lg text-[#0098dc]">{item.cost}</div>
                                 <div className="text-[9px] font-black text-gray-400">PTS</div>
                             </div>
                         </div>
                         <div className="mt-4">
                             <h4 className="font-bold text-gray-800">{item.name}</h4>
                             <p className="text-xs text-gray-500 mt-1 h-8 overflow-hidden">{item.description}</p>
                         </div>
                         <button 
                             onClick={() => { if(userPoints >= item.cost) onPurchase(item.cost, item.name); else alert('预算不足'); }}
                             className={`mt-4 w-full py-2 text-xs font-black uppercase tracking-widest ${userPoints >= item.cost ? 'bg-[#313131] text-white hover:bg-[#0098dc]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                         >
                             购买
                         </button>
                         <button onClick={() => onDeleteItem(item.id)} className="mt-2 text-[10px] text-gray-300 hover:text-red-500 self-center opacity-0 group-hover:opacity-100 transition-opacity">下架商品</button>
                     </div>
                 ))}
             </div>

             <SettingHeader title="采购记录" />
             <div className="bg-white border border-gray-200 max-h-60 overflow-y-auto">
                 {purchaseHistory.slice().reverse().map(record => (
                     <div key={record.id} className="flex justify-between items-center p-3 border-b border-gray-100 text-xs">
                         <span className="font-mono text-gray-400">{new Date(record.timestamp).toLocaleString()}</span>
                         <span className={record.isGacha ? "font-bold text-[#ffcf00]" : "font-bold text-gray-700"}>{record.itemName}</span>
                         <span className="font-mono text-gray-500">-{record.cost} PTS</span>
                     </div>
                 ))}
             </div>

             <div className="bg-gray-100 p-4 border border-gray-200 mt-8">
                 <h4 className="text-xs font-bold text-gray-500 uppercase mb-4">后勤管理</h4>
                 <div className="flex flex-col space-y-2">
                     <div className="flex space-x-2">
                         <input className="flex-1 p-2 text-xs border border-gray-300" placeholder="商品名称" value={newItemName} onChange={e => setNewItemName(e.target.value)} />
                         <input className="w-24 p-2 text-xs border border-gray-300" type="number" placeholder="价格" value={newItemCost} onChange={e => setNewItemCost(Number(e.target.value))} />
                         <input className="w-16 p-2 text-xs border border-gray-300" placeholder="图标" value={newItemName ? newItemName[0] : '?'} readOnly />
                     </div>
                     <input className="w-full p-2 text-xs border border-gray-300" placeholder="描述" value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} />
                     <button 
                         onClick={() => { if(newItemName) onAddItem({ name: newItemName, cost: newItemCost, description: newItemDesc, icon: '📦' }) }}
                         className="bg-[#313131] text-white py-2 text-xs font-black uppercase tracking-widest hover:bg-black"
                     >
                         上架商品
                     </button>
                 </div>
             </div>

             {/* Gacha Result Overlay */}
             {gachaResult && (
                 <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 animate-in fade-in duration-300">
                     <div className="text-center">
                         <div className={`text-6xl mb-4 animate-bounce ${gachaResult.rarity === 6 ? 'text-[#ffcf00]' : gachaResult.rarity === 5 ? 'text-white' : 'text-[#0098dc]'}`}>
                             {'★'.repeat(gachaResult.rarity)}
                         </div>
                         <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">{gachaResult.reward}</h2>
                         <div className="h-1 w-32 bg-white mx-auto mt-4"></div>
                         <p className="text-gray-400 text-xs mt-2 tracking-[0.5em] uppercase">RECRUITMENT SUCCESSFUL</p>
                     </div>
                 </div>
             )}
        </div>
    );
};

export const SystemSettings: React.FC<{
    isBgmEnabled: boolean;
    onToggleBgm: (val: boolean) => void;
    onImportMusic: (file: File) => void;
    currentMusicName: string;
    onDelayTasks: (days: number) => void;
    onDeleteAllTasks: () => void;
    onPurgeCompleted: () => void;
    onBackup: () => void;
    onRestore: () => void;
}> = ({ isBgmEnabled, onToggleBgm, onImportMusic, currentMusicName, onDelayTasks, onDeleteAllTasks, onPurgeCompleted, onBackup, onRestore }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-black italic tracking-tighter">系统设置</h2>
            
            <div className="bg-white border border-gray-200 p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-sm">音频接口</h4>
                        <p className="text-xs text-gray-400">切换背景环境音</p>
                    </div>
                    {/* Arknights Style Toggle: Rectangular, sharp edges, distinct states */}
                    <button 
                        onClick={() => onToggleBgm(!isBgmEnabled)}
                        className={`w-14 h-6 flex items-center p-0.5 border transition-colors ${isBgmEnabled ? 'border-[#0098dc] bg-[#0098dc]/10' : 'border-gray-400 bg-gray-100'}`}
                    >
                        <div className={`w-6 h-4 bg-[#0098dc] shadow-sm transition-transform duration-300 ${isBgmEnabled ? 'translate-x-7 bg-[#0098dc]' : 'translate-x-0 bg-gray-400'}`}></div>
                    </button>
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center space-x-3">
                        <Icons.Music />
                        <span className="text-xs font-mono text-gray-500">{currentMusicName || '默认环境音'}</span>
                    </div>
                    <label className="cursor-pointer bg-gray-100 px-3 py-1 text-xs font-bold hover:bg-gray-200 text-gray-600">
                        上传文件
                        <input type="file" className="hidden" accept="audio/*" onChange={e => { if(e.target.files?.[0]) onImportMusic(e.target.files[0]) }} />
                    </label>
                </div>
            </div>

            <SettingHeader title="数据管理" />
            
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={onBackup}
                    className="bg-[#2d2d2d] text-white p-4 text-left hover:bg-[#0098dc] transition-colors group"
                >
                    <div className="text-[10px] font-black tracking-widest text-gray-400 group-hover:text-white uppercase">Export / Import</div>
                    <div className="font-bold text-lg">数据备份与恢复</div>
                </button>
                <button 
                    onClick={onPurgeCompleted}
                    className="bg-white border border-gray-200 p-4 text-left hover:border-red-500 hover:text-red-500 transition-colors"
                >
                    <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Cleanup</div>
                    <div className="font-bold text-lg">清理已完成任务</div>
                </button>
            </div>

            <SettingHeader title="调试与重置" />

            <div className="space-y-2">
                <div className="flex items-center justify-between bg-red-50 border border-red-100 p-3">
                    <span className="text-xs font-bold text-red-800">战术推演 (所有任务推迟1天)</span>
                    <button onClick={() => onDelayTasks(1)} className="text-xs bg-red-100 text-red-800 px-2 py-1 font-bold hover:bg-red-200">执行</button>
                </div>
                <div className="flex items-center justify-between bg-red-50 border border-red-100 p-3">
                    <span className="text-xs font-bold text-red-800">清除所有数据 (慎用)</span>
                    <button onClick={() => { if(confirm('确认要删除所有数据吗？此操作不可逆。')) onDeleteAllTasks() }} className="text-xs bg-red-500 text-white px-2 py-1 font-bold hover:bg-red-600">执行</button>
                </div>
            </div>

            <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto text-gray-200 mb-4"><Icons.RhodesLogo /></div>
                <div className="text-[10px] text-gray-400 font-mono">
                    RHODES ISLAND PHARMACEUTICAL INC.<br/>
                    TERMINAL SYSTEM V2.0.5<br/>
                    UID: DR.0000001
                </div>
            </div>
        </div>
    );
};

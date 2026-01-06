
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { TabType, TimeFilterType, Todo, Category, Subtask, TaskTemplate, Achievement, StoreItem } from './types';
import { Layout } from './components/Layout';
import { SettingHeader, TaskRow, TaskInput, CategoryManager, TemplateRow, TemplateInput, StatisticsDashboard, ScheduleCalendar, StrategicModal, TaskEditForm, SystemSettings, StoreView } from './components/Controls';
import { Icons } from './constants';

// --- Loading Component ---
interface LoadingScreenProps {
    progress: number;
    logs: string[];
    error: string | null;
    onRetry: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, logs, error, onRetry }) => {
    return (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center text-white overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black opacity-80"></div>
            
            {/* Hexagon Decoration */}
            <div className="relative w-32 h-32 mb-12 animate-pulse">
                <div className="absolute inset-0 border-2 border-[#0098dc] loading-hexagon opacity-50 scale-110"></div>
                <div className="absolute inset-0 border border-white loading-hexagon flex items-center justify-center bg-white/5 backdrop-blur-sm">
                    <Icons.RhodesLogo className="w-16 h-16 text-white" />
                </div>
            </div>

            {/* Error State */}
            {error ? (
                <div className="z-10 flex flex-col items-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-[#ffcf00] text-xl font-black tracking-widest uppercase border-b-2 border-[#ffcf00] pb-2 mb-2">
                        Connection Timed Out
                    </div>
                    <div className="text-gray-400 text-xs jetbrains max-w-md text-center">
                        PRTS failed to synchronize with the neural network. 
                        Error Code: {error}
                    </div>
                    <button 
                        onClick={onRetry}
                        className="px-8 py-3 bg-white text-black font-black tracking-[0.2em] hover:bg-[#0098dc] hover:text-white transition-all uppercase"
                    >
                        Reconnect
                    </button>
                </div>
            ) : (
                /* Loading State */
                <div className="z-10 w-full max-w-md px-8 flex flex-col">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-2xl font-black italic tracking-tighter">PRTS <span className="text-[#0098dc] text-sm font-normal not-italic tracking-widest ml-2">SYSTEM BOOT</span></span>
                        <span className="text-4xl font-black jetbrains text-[#0098dc] opacity-80">{progress}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-1 w-full bg-gray-800 relative overflow-hidden mb-6">
                        <div 
                            className="h-full bg-white transition-all duration-300 ease-out" 
                            style={{ width: `${progress}%` }}
                        ></div>
                        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-[#0098dc] to-transparent opacity-50"></div>
                    </div>

                    {/* Terminal Logs */}
                    <div className="h-24 overflow-hidden border-l-2 border-white/20 pl-4 flex flex-col justify-end">
                        {logs.slice(-4).map((log, idx) => (
                            <div key={idx} className="text-[10px] jetbrains text-gray-500 uppercase tracking-wide leading-relaxed animate-in slide-in-from-left-2 fade-in duration-300">
                                <span className="text-[#0098dc] mr-2">&gt;&gt;</span>{log}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="absolute bottom-8 left-8 text-[10px] text-gray-600 font-bold tracking-[0.3em] uppercase">
                Rhodes Island Neural Network
            </div>
        </div>
    );
};

const App = () => {
    // --- App Loading State ---
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const [loadLogs, setLoadLogs] = useState<string[]>([]);
    const [loadError, setLoadError] = useState<string | null>(null);

    // --- Data State ---
    const [activeTab, setActiveTab] = useState<TabType>(TabType.TASK);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [templates, setTemplates] = useState<TaskTemplate[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
    
    const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilterType>(TimeFilterType.ALL);
    const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>('ALL');
    const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(null);
    const [editingTask, setEditingTask] = useState<Todo | null>(null);
    const [userName, setUserName] = useState<string>('Doctor');
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState('');
    
    // Points State
    const [userPoints, setUserPoints] = useState<number>(0);
    const [totalEarnedPoints, setTotalEarnedPoints] = useState<number>(0); // New state for lifetime points
    
    // Music State
    const [isBgmEnabled, setIsBgmEnabled] = useState(false);
    const [bgmSource, setBgmSource] = useState<string | null>(null);
    const [bgmName, setBgmName] = useState<string>('');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

    // --- Loading Logic ---
    const addLog = (msg: string) => setLoadLogs(prev => [...prev, msg]);

    const initializeApp = async () => {
        setLoadError(null);
        setLoadProgress(0);
        setLoadLogs(['Initializing PRTS Kernel...', 'Checking secure connection...']);
        
        // Timeout Promise
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('TIMEOUT')), 8000)
        );

        const loadSequence = async () => {
            // Stage 1: Environment Check
            await new Promise(r => setTimeout(r, 600)); 
            setLoadProgress(20);
            addLog('Environment verification complete.');
            
            // Stage 2: Font & Resource Check
            await document.fonts.ready;
            setLoadProgress(45);
            addLog('Visual interface resources loaded.');
            await new Promise(r => setTimeout(r, 400)); 

            // Stage 3: Data Synchronization
            setLoadProgress(60);
            addLog('Synchronizing local database...');
            
            try {
                const savedTasks = localStorage.getItem('ri_tasks');
                const savedCats = localStorage.getItem('ri_categories');
                const savedTemplates = localStorage.getItem('ri_templates');
                const savedAchievements = localStorage.getItem('ri_achievements');
                const savedStoreItems = localStorage.getItem('ri_store_items');
                const savedName = localStorage.getItem('ri_user_name');
                const savedBgmEnabled = localStorage.getItem('ri_bgm_enabled');
                const savedBgmSource = localStorage.getItem('ri_bgm_source');
                const savedBgmName = localStorage.getItem('ri_bgm_name');
                const savedPoints = localStorage.getItem('ri_user_points');
                const savedTotalPoints = localStorage.getItem('ri_total_earned_points');
                
                setLoadProgress(80);
                addLog('Parsing user configuration...');
                await new Promise(r => setTimeout(r, 300)); 

                if (savedTasks) setTodos(JSON.parse(savedTasks) as Todo[]);
                else setTodos([
                    { 
                        id: '1', text: '完成每日常规演习', completed: false, priority: 'NORMAL', categoryId: 'cat_1', timestamp: Date.now(),
                        subtasks: [{ id: 'sub1', text: '战术演习LS-5', completed: false, points: 20 }, { id: 'sub2', text: '资源保障SK-5', completed: true, points: 20 }],
                        points: 100,
                        frequency: 1
                    },
                    { 
                        id: '2', text: '整合运动动态监控', completed: true, priority: 'URGENT', categoryId: 'cat_2', timestamp: Date.now() - 3600000 * 24 * 3,
                        subtasks: [],
                        points: 200,
                        frequency: 0
                    },
                ]);

                if (savedCats) setCategories(JSON.parse(savedCats) as Category[]);
                else setCategories([{ id: 'cat_1', name: '日常演习' }, { id: 'cat_2', name: '敌情监控' }, { id: 'cat_3', name: '资源筹备' }]);

                if (savedTemplates) setTemplates(JSON.parse(savedTemplates) as TaskTemplate[]);
                else setTemplates([
                    { id: 'tmp_1', text: '每周常规剿灭', priority: 'URGENT', categoryId: 'cat_1', subtasks: [{text: '切尔诺伯格', points: 50}, {text: '龙门外环', points: 50}] }
                ]);
                
                if (savedAchievements) setAchievements(JSON.parse(savedAchievements) as Achievement[]);
                else setAchievements([
                    { id: 'ach_1', title: '初级干员', description: '累计获得 1000 积分', targetPoints: 1000 },
                    { id: 'ach_2', title: '资深干员', description: '累计获得 5000 积分', targetPoints: 5000 },
                    { id: 'ach_3', title: '荣誉博士', description: '累计获得 10000 积分', targetPoints: 10000 },
                ]);

                if (savedStoreItems) setStoreItems(JSON.parse(savedStoreItems) as StoreItem[]);
                else setStoreItems([
                    { id: '1', name: '理智药剂', cost: 100, description: '恢复部分精力，适合短时加班。', icon: '🧪' },
                    { id: '2', name: '源石碎片', cost: 500, description: '稀有的矿物结晶，用途广泛。', icon: '💎' },
                    { id: '3', name: '龙门币箱', cost: 1000, description: '一箱龙门通用货币。', icon: '💰' },
                    { id: '4', name: '高级作战记录', cost: 2000, description: '记录了高阶作战技巧的录像带。', icon: '📼' },
                    { id: '5', name: '至纯源石', cost: 5000, description: '极其珍贵的高纯度源石。', icon: '💠' },
                    { id: '6', name: '招聘许可', cost: 300, description: '罗德岛公开招募凭证。', icon: '📄' },
                ]);

                if (savedName) setUserName(savedName);
                if (savedPoints) setUserPoints(parseInt(savedPoints) || 0);
                if (savedTotalPoints) setTotalEarnedPoints(parseInt(savedTotalPoints) || 0);
                else setTotalEarnedPoints(parseInt(savedPoints) || 0); // Fallback sync
                
                // Restore Audio and State
                if (savedBgmSource) {
                    setBgmSource(savedBgmSource);
                    addLog('Audio subsystem: Custom track loaded.');
                    if (savedBgmEnabled !== null) {
                         setIsBgmEnabled(JSON.parse(savedBgmEnabled));
                    } else {
                         setIsBgmEnabled(true);
                    }
                } else {
                    if (savedBgmEnabled) setIsBgmEnabled(JSON.parse(savedBgmEnabled));
                }

                if (savedBgmName) setBgmName(savedBgmName);

            } catch (e) {
                console.error("Data corruption detected, resetting defaults.");
                addLog('WARNING: Local data corrupted. Resetting to factory defaults.');
            }

            // Stage 4: Audio System
            setLoadProgress(90);
            addLog('Initializing audio subsystems...');
            if (!audioRef.current) {
                audioRef.current = new Audio();
                audioRef.current.loop = true;
                audioRef.current.volume = 0.4;
            }
            
            setLoadProgress(100);
            addLog('PRTS Online. Welcome, Doctor.');
            await new Promise(r => setTimeout(r, 500)); 
        };

        try {
            await Promise.race([loadSequence(), timeoutPromise]);
            setIsLoading(false);
        } catch (error: any) {
            if (error.message === 'TIMEOUT') {
                setLoadError('TIMEOUT_0x00F1_NETWORK_LAG');
                addLog('CRITICAL: Handshake timeout.');
            } else {
                setLoadError('UNKNOWN_0x0000');
                addLog('CRITICAL: System failure.');
            }
        }
    };

    // Run on Mount
    useEffect(() => {
        initializeApp();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Sync BGM with state
    useEffect(() => {
        if (isLoading || !audioRef.current) return; 
        
        if (isBgmEnabled && bgmSource) {
            if (audioRef.current.src !== bgmSource) {
                audioRef.current.src = bgmSource;
            }
            if (audioRef.current.volume !== 0.4) audioRef.current.volume = 0.4;
            
            audioRef.current.play().catch(err => {
                console.warn("Autoplay blocked or audio error:", err);
            });
        } else {
            audioRef.current.pause();
        }
        
        localStorage.setItem('ri_bgm_enabled', JSON.stringify(isBgmEnabled));
    }, [isBgmEnabled, bgmSource, isLoading]);

    useEffect(() => {
        if (isLoading) return; 
        localStorage.setItem('ri_tasks', JSON.stringify(todos));
        localStorage.setItem('ri_categories', JSON.stringify(categories));
        localStorage.setItem('ri_templates', JSON.stringify(templates));
        localStorage.setItem('ri_achievements', JSON.stringify(achievements));
        localStorage.setItem('ri_store_items', JSON.stringify(storeItems));
        localStorage.setItem('ri_user_name', userName);
        localStorage.setItem('ri_user_points', userPoints.toString());
        localStorage.setItem('ri_total_earned_points', totalEarnedPoints.toString());
    }, [todos, categories, templates, achievements, storeItems, userName, userPoints, totalEarnedPoints, isLoading]);

    const handleImportMusic = (file: File) => {
        if (file.size > 3 * 1024 * 1024) {
            alert("警告：音频文件过大。\n\n为确保终端稳定性(LocalStorage限制)，请使用小于 3MB 的音频文件。");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Audio = e.target?.result as string;
            if (base64Audio) {
                try {
                    localStorage.setItem('ri_bgm_source', base64Audio);
                    localStorage.setItem('ri_bgm_name', file.name);
                    localStorage.setItem('ri_bgm_enabled', 'true'); 
                    
                    setBgmSource(base64Audio);
                    setBgmName(file.name);
                    setIsBgmEnabled(true);
                } catch (err) {
                    alert("缓存失败：浏览器存储空间不足。\n请尝试更小的文件或清理缓存。");
                    console.error("Storage failed", err);
                }
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDelayTasks = (days: number) => {
        setTodos(prev => prev.map(todo => {
            if (!todo.completed && todo.dueDate) {
                const date = new Date(todo.dueDate);
                date.setDate(date.getDate() + days);
                return { ...todo, dueDate: date.toISOString().split('T')[0] };
            }
            return todo;
        }));
    };

    const addTask = (text: string, priority: Todo['priority'], categoryId?: string, dueDate?: string, subtasks: {text: string, points: number}[] = [], points: number = 0, frequency: number = 0) => {
        const newTodo: Todo = {
            id: Math.random().toString(36).substring(2, 11),
            text,
            completed: false,
            priority,
            categoryId,
            dueDate,
            subtasks: subtasks.map(s => ({ id: Math.random().toString(36).substring(2, 7), text: s.text, completed: false, points: s.points })),
            timestamp: Date.now(),
            points,
            frequency
        };
        setTodos(prev => [newTodo, ...prev]);
        setIsTaskModalOpen(false);
    };

    const updateTask = (id: string, updates: Partial<Todo>) => {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
        setEditingTask(null);
    };

    const toggleTodo = (id: string) => {
        setTodos(prev => {
            const todo = prev.find(t => t.id === id);
            if (!todo) return prev;

            const isNowCompleted = !todo.completed;
            const points = todo.points || 0;
            
            // Logic: Update points
            if (isNowCompleted) {
                setUserPoints(c => c + points);
                setTotalEarnedPoints(c => c + points);
                
                // RECURRENCE LOGIC
                if (todo.frequency && todo.frequency > 0) {
                    const nextDueDate = new Date(todo.dueDate || new Date());
                    nextDueDate.setDate(nextDueDate.getDate() + todo.frequency);
                    const dateStr = nextDueDate.toISOString().split('T')[0];

                    const recurringTask: Todo = {
                        ...todo,
                        id: Math.random().toString(36).substring(2, 11),
                        completed: false,
                        dueDate: dateStr,
                        timestamp: Date.now(),
                        subtasks: todo.subtasks.map(s => ({...s, completed: false}))
                    };
                    // Insert new task and update current one
                    return [recurringTask, ...prev.map(t => t.id === id ? { ...t, completed: true, timestamp: Date.now() } : t)];
                }
            } else {
                setUserPoints(c => Math.max(0, c - points));
                setTotalEarnedPoints(c => Math.max(0, c - points));
            }

            return prev.map(t => t.id === id ? { ...t, completed: isNowCompleted, timestamp: Date.now() } : t);
        });
    };

    const deleteTodo = (id: string) => {
        setTodos(prev => prev.filter(t => t.id !== id));
    };

    const toggleSubtask = (taskId: string, subtaskId: string) => {
        setTodos(prev => prev.map(todo => {
            if (todo.id === taskId) {
                const subtask = todo.subtasks.find(s => s.id === subtaskId);
                const points = subtask?.points || 0;
                
                if (subtask) {
                    const isNowCompleted = !subtask.completed;
                    if (isNowCompleted) {
                        setUserPoints(c => c + points);
                        setTotalEarnedPoints(c => c + points);
                    } else {
                        setUserPoints(c => Math.max(0, c - points));
                        setTotalEarnedPoints(c => Math.max(0, c - points));
                    }
                }

                const newSubtasks = todo.subtasks.map(sub => sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub);
                return { ...todo, subtasks: newSubtasks };
            }
            return todo;
        }));
    };

    const addSubtask = (taskId: string, text: string, points: number) => {
        const newSub: Subtask = { id: 'sub_' + Math.random().toString(36).substring(2, 11), text, completed: false, points };
        setTodos(prev => prev.map(todo => todo.id === taskId ? { ...todo, subtasks: [...todo.subtasks, newSub] } : todo));
    };

    const saveTemplate = (data: Partial<TaskTemplate>) => {
        if (data.id) {
            setTemplates(prev => prev.map(t => t.id === data.id ? (data as TaskTemplate) : t));
        } else {
            const newTmp: TaskTemplate = {
                id: 'tmp_' + Date.now(),
                text: data.text || '未命名模板',
                priority: (data.priority as Todo['priority']) || 'NORMAL',
                categoryId: data.categoryId,
                subtasks: data.subtasks || [],
                points: data.points || 100,
                frequency: data.frequency || 0
            };
            setTemplates(prev => [newTmp, ...prev]);
        }
        setEditingTemplate(null);
        setIsTemplateModalOpen(false);
    };

    const deployTemplate = (tmp: TaskTemplate) => {
        addTask(tmp.text, tmp.priority, tmp.categoryId, undefined, tmp.subtasks, tmp.points, tmp.frequency);
        setActiveTab(TabType.TASK);
    };

    const deleteTemplate = (id: string) => {
        setTemplates(prev => prev.filter(t => t.id !== id));
    };

    const addCategory = (name: string) => setCategories(prev => [...prev, { id: 'cat_' + Date.now(), name }]);
    const editCategory = (id: string, name: string) => setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
    const deleteCategory = (id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id));
        setTodos(prev => prev.map(t => t.categoryId === id ? { ...t, categoryId: undefined } : t));
        setTemplates(prev => prev.map(t => t.categoryId === id ? { ...t, categoryId: undefined } : t));
    };

    // Store Handlers
    const handlePurchase = (cost: number, itemName: string) => {
        if (userPoints >= cost) {
            setUserPoints(prev => prev - cost);
            alert(`已兑换物资: [${itemName}]`);
        }
    };
    
    const addStoreItem = (item: Omit<StoreItem, 'id'>) => {
        setStoreItems(prev => [...prev, { ...item, id: 'item_' + Date.now() }]);
    };
    
    const updateStoreItem = (id: string, updates: Partial<StoreItem>) => {
        setStoreItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    };
    
    const deleteStoreItem = (id: string) => {
        setStoreItems(prev => prev.filter(i => i.id !== id));
    };
    
    const addAchievement = (title: string, description: string, targetPoints: number) => {
        setAchievements(prev => [...prev, { id: 'ach_' + Date.now(), title, description, targetPoints }]);
    }
    
    const deleteAchievement = (id: string) => {
        setAchievements(prev => prev.filter(a => a.id !== id));
    }

    const getCategoryName = (id?: string) => categories.find(c => c.id === id)?.name;

    const filteredTodos = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const now = new Date();
        
        const getWeekRange = () => {
            const start = new Date(now);
            start.setDate(now.getDate() - now.getDay());
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            return { start, end };
        };
        const { start: weekStart, end: weekEnd } = getWeekRange();

        return todos.filter(t => {
            if (selectedTimeFilter === TimeFilterType.ALL) return true;
            if (selectedTimeFilter === TimeFilterType.INCOMPLETE) return !t.completed;
            
            if (!t.dueDate) return false;
            const taskDate = new Date(t.dueDate);
            
            if (selectedTimeFilter === TimeFilterType.TODAY) return t.dueDate === todayStr;
            if (selectedTimeFilter === TimeFilterType.WEEK) return taskDate >= weekStart && taskDate <= weekEnd;
            if (selectedTimeFilter === TimeFilterType.MONTH) return taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear();
            
            return true;
        });
    }, [todos, selectedTimeFilter]);

    const activeTasks = filteredTodos.filter(t => !t.completed);
    const archivedTasks = filteredTodos.filter(t => t.completed);

    const groupedActiveTasks = useMemo(() => {
        if (selectedTimeFilter !== TimeFilterType.ALL) return null;
        const groups: { [key: string]: Todo[] } = {};
        activeTasks.forEach(t => {
            const catId = t.categoryId || 'unassigned';
            if (!groups[catId]) groups[catId] = [];
            groups[catId].push(t);
        });
        return groups;
    }, [activeTasks, selectedTimeFilter]);

    // Computed: Filtered Templates
    const filteredTemplates = useMemo(() => {
        if (selectedTemplateCategory === 'ALL') return templates;
        return templates.filter(t => t.categoryId === selectedTemplateCategory);
    }, [templates, selectedTemplateCategory]);

    const TacticalFilterBar = () => (
        <div className="flex flex-wrap gap-3 mb-8 px-1">
            {[
                { type: TimeFilterType.TODAY, label: '今日' },
                { type: TimeFilterType.WEEK, label: '本周' },
                { type: TimeFilterType.MONTH, label: '本月' },
                { type: TimeFilterType.ALL, label: '全部' },
                { type: TimeFilterType.INCOMPLETE, label: '未完成' }
            ].map(filter => (
                <button 
                    key={filter.type}
                    onClick={() => setSelectedTimeFilter(filter.type)} 
                    className={`
                        flex-1 sm:flex-none
                        px-4 sm:px-6
                        py-3 sm:py-2
                        text-[0.8rem] sm:text-[0.65rem]
                        font-black tracking-widest border transition-all
                        ${selectedTimeFilter === filter.type 
                            ? 'bg-[#313131] text-white border-[#313131] shadow-[0_4px_10px_rgba(0,0,0,0.2)]' 
                            : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400 hover:text-black'}
                    `}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );

    const WarehouseCategoryBar = () => (
        <div className="flex flex-wrap gap-3 mb-8 px-1">
            <button 
                onClick={() => setSelectedTemplateCategory('ALL')} 
                className={`
                    flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-2 text-[0.8rem] sm:text-[0.65rem] font-black tracking-widest border transition-all
                    ${selectedTemplateCategory === 'ALL' 
                        ? 'bg-[#313131] text-white border-[#313131] shadow-[0_4px_10px_rgba(0,0,0,0.2)]' 
                        : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400 hover:text-black'}
                `}
            >
                全部
            </button>
            {categories.map(cat => (
                <button 
                    key={cat.id}
                    onClick={() => setSelectedTemplateCategory(cat.id)} 
                    className={`
                        flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-2 text-[0.8rem] sm:text-[0.65rem] font-black tracking-widest border transition-all
                        ${selectedTemplateCategory === cat.id 
                            ? 'bg-[#313131] text-white border-[#313131] shadow-[0_4px_10px_rgba(0,0,0,0.2)]' 
                            : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400 hover:text-black'}
                    `}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );

    const handleFABClick = () => {
        if (activeTab === TabType.WAREHOUSE) {
            setIsTemplateModalOpen(true);
        } else {
            setIsTaskModalOpen(true);
        }
    };

    const handleStartEditName = () => {
        setTempName(userName);
        setIsEditingName(true);
    };

    const handleSaveName = () => {
        if (tempName.trim()) {
            setUserName(tempName.trim());
        }
        setIsEditingName(false);
    };

    // --- Render ---
    if (isLoading) {
        return <LoadingScreen progress={loadProgress} logs={loadLogs} error={loadError} onRetry={initializeApp} />;
    }

    return (
        <>
            <StrategicModal 
                isOpen={isTaskModalOpen} 
                onClose={() => setIsTaskModalOpen(false)} 
                title="部署作战目标" 
            >
                <TaskInput categories={categories} onAdd={addTask} />
            </StrategicModal>

            <StrategicModal 
                isOpen={!!editingTask} 
                onClose={() => setEditingTask(null)} 
                title="更新作战目标" 
            >
                {editingTask && (
                    <TaskEditForm 
                        todo={editingTask} 
                        categories={categories} 
                        onSave={updateTask} 
                        onCancel={() => setEditingTask(null)} 
                    />
                )}
            </StrategicModal>

            <StrategicModal 
                isOpen={isTemplateModalOpen || !!editingTemplate} 
                onClose={() => { setIsTemplateModalOpen(false); setEditingTemplate(null); }} 
                title={editingTemplate ? "更新任务模板" : "录入新模板"} 
            >
                <TemplateInput 
                    categories={categories} 
                    onSave={saveTemplate} 
                    editingTemplate={editingTemplate} 
                    onCancel={() => { setIsTemplateModalOpen(false); setEditingTemplate(null); }} 
                />
            </StrategicModal>

            <Layout activeTab={activeTab} onTabChange={setActiveTab}>
                <div className="fixed bottom-6 right-6 z-[80] scale-90 sm:scale-100">
                    <button 
                        onClick={handleFABClick}
                        className="w-16 h-16 bg-[#2d2d2d] text-white flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.4)] hover:bg-black transition-all border-r-4 border-[#0098dc] relative overflow-hidden active:scale-95"
                    >
                        <Icons.Plus />
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 animate-pulse"></div>
                    </button>
                </div>

                {activeTab === TabType.TASK && (
                    <div className="animate-in fade-in duration-500 pb-32">
                        <SettingHeader title="作战目标" />
                        <TacticalFilterBar />
                        {activeTasks.length > 0 ? (
                            <div className="space-y-3">
                                {selectedTimeFilter === TimeFilterType.ALL && groupedActiveTasks ? (
                                    Object.entries(groupedActiveTasks as Record<string, Todo[]>).map(([catId, groupTodos]) => (
                                        <div key={catId} className="space-y-3">
                                            <div className="flex items-center space-x-2 py-2">
                                                <div className="h-4 w-1 bg-[#313131]"></div>
                                                <span className="text-xs font-bold text-gray-500">{catId === 'unassigned' ? '未分类' : getCategoryName(catId)}</span>
                                            </div>
                                            {groupTodos.map(todo => (
                                                <TaskRow key={todo.id} todo={todo} categoryName={getCategoryName(todo.categoryId)} onToggle={toggleTodo} onDelete={deleteTodo} onToggleSubtask={toggleSubtask} onAddSubtask={addSubtask} onEdit={setEditingTask} />
                                            ))}
                                        </div>
                                    ))
                                ) : (
                                    activeTasks.map(todo => (
                                        <TaskRow key={todo.id} todo={todo} categoryName={getCategoryName(todo.categoryId)} onToggle={toggleTodo} onDelete={deleteTodo} onToggleSubtask={toggleSubtask} onAddSubtask={addSubtask} onEdit={setEditingTask} />
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className="bg-white/40 border-2 border-dashed border-gray-300 py-16 flex flex-col items-center justify-center italic text-gray-400 font-medium">
                                <Icons.Task />
                                <span className="mt-4 tracking-widest text-[0.7rem]">无待办目标</span>
                            </div>
                        )}
                        
                        {archivedTasks.length > 0 && (
                            <>
                                <SettingHeader title="已完成目标" />
                                <div className="space-y-2 opacity-60">
                                    {archivedTasks.map(todo => (
                                        <TaskRow key={todo.id} todo={todo} categoryName={getCategoryName(todo.categoryId)} onToggle={toggleTodo} onDelete={deleteTodo} onToggleSubtask={toggleSubtask} onAddSubtask={addSubtask} onEdit={setEditingTask} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === TabType.WAREHOUSE && (
                    <div className="animate-in fade-in duration-500 pb-32">
                        <SettingHeader title="任务模板仓库" />
                        <WarehouseCategoryBar />
                        {filteredTemplates.length > 0 ? (
                            <div className="space-y-3">
                                { (filteredTemplates as TaskTemplate[]).map(tmp => (
                                    <TemplateRow key={tmp.id} template={tmp} categoryName={getCategoryName(tmp.categoryId)} onDeploy={deployTemplate} onDelete={deleteTemplate} onEdit={setEditingTemplate} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white/40 border-2 border-dashed border-gray-300 py-16 flex flex-col items-center justify-center italic text-gray-400 font-medium">
                                <Icons.Warehouse />
                                <span className="mt-4 tracking-widest text-[0.7rem]">
                                    {selectedTemplateCategory === 'ALL' ? '仓库目前为空' : '该扇区下无可用模板'}
                                </span>
                            </div>
                        )}
                    </div>
                )}
                
                {activeTab === TabType.SCHEDULE && (
                    <div className="animate-in fade-in duration-500 pb-32">
                        <SettingHeader title="日程排期" />
                        <ScheduleCalendar todos={todos} getCategoryName={getCategoryName} />
                    </div>
                )}

                {activeTab === TabType.STORE && (
                    <div className="animate-in fade-in duration-500 pb-32">
                        <SettingHeader title="采购中心" />
                        <StoreView 
                            items={storeItems}
                            userPoints={userPoints} 
                            onPurchase={handlePurchase} 
                            onAddItem={addStoreItem}
                            onUpdateItem={updateStoreItem}
                            onDeleteItem={deleteStoreItem}
                        />
                    </div>
                )}

                {activeTab === TabType.STATISTICS && (
                    <div className="animate-in fade-in duration-500 pb-32">
                        <SettingHeader title="效率统计" />
                        <StatisticsDashboard 
                            todos={todos} 
                            achievements={achievements} 
                            totalEarnedPoints={totalEarnedPoints}
                            onAddAchievement={addAchievement}
                            onDeleteAchievement={deleteAchievement}
                        />
                        
                        <div className="mt-10 bg-white p-8 border border-gray-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-mesh opacity-10 pointer-events-none"></div>
                            <h3 className="text-[10px] font-black text-gray-400 tracking-widest italic mb-8">作战扇区数据分布</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                {categories.map(cat => {
                                    const catTodos = todos.filter(t => t.categoryId === cat.id);
                                    const catCompleted = catTodos.filter(t => t.completed).length;
                                    const catRate = catTodos.length === 0 ? 0 : Math.round((catCompleted / catTodos.length) * 100);
                                    return (
                                        <div key={cat.id} className="flex flex-col group">
                                            <div className="flex justify-between items-baseline mb-2">
                                                <span className="text-xs font-bold text-[#313131] uppercase tracking-[0.2em]">{cat.name}</span>
                                                <span className="text-[10px] font-black text-gray-400 jetbrains transition-colors group-hover:text-blue-500">{catCompleted} / {catTodos.length}</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 relative">
                                                <div className="absolute top-0 left-0 h-full bg-[#313131] transition-all duration-700" style={{ width: `${catRate}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === TabType.USER && (
                    <div className="animate-in fade-in duration-500 pb-32">
                        <SettingHeader title="用户中心" />
                        <div className="bg-white p-10 border border-gray-200 flex flex-col md:flex-row items-center md:space-x-12 shadow-sm relative overflow-hidden group mb-10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-mesh pointer-events-none opacity-10"></div>
                            <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0 mb-6 md:mb-0 relative">
                                <div className="w-12 h-12 border-4 border-gray-200 rotate-45 group-hover:rotate-0 transition-transform duration-500"></div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                {isEditingName ? (
                                    <div className="flex items-center space-x-2">
                                        <input 
                                            autoFocus
                                            type="text"
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                                            className="text-3xl font-black italic tracking-tighter border-b-2 border-[#313131] outline-none bg-transparent"
                                        />
                                        <button onClick={handleSaveName} className="p-2 bg-[#313131] text-white text-xs font-bold">保存</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <h2 className="text-3xl font-black italic tracking-tighter mb-2 uppercase text-[#2d2d2d]">{userName}</h2>
                                        <button onClick={handleStartEditName} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-black">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                    </div>
                                )}
                                <p className="text-gray-400 font-bold jetbrains tracking-widest text-[0.6rem]">ID: 00000001 | 罗德岛战略终端</p>
                            </div>
                        </div>

                        <SettingHeader title="数据管理" />
                        <CategoryManager categories={categories} onAdd={addCategory} onEdit={editCategory} onDelete={deleteCategory} />

                        <SettingHeader title="系统设置" />
                        <SystemSettings 
                            isBgmEnabled={isBgmEnabled} 
                            onToggleBgm={setIsBgmEnabled} 
                            onImportMusic={handleImportMusic} 
                            currentMusicName={bgmName}
                            onDelayTasks={handleDelayTasks}
                        />
                    </div>
                )}
            </Layout>
        </>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

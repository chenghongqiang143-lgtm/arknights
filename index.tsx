
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from './components/Layout';
import { 
    TaskRow, 
    TaskInput, 
    SettingHeader, 
    TaskEditForm, 
    CategoryManager, 
    TemplateRow, 
    TemplateInput, 
    ScheduleCalendar,
    StatisticsDashboard,
    StoreView,
    SystemSettings,
    StrategicModal,
    FilterBar,
    AchievementToast,
    PointPopup,
    DataBackupModal
} from './components/Controls';
import { 
    Todo, 
    TabType, 
    Category, 
    TaskTemplate, 
    Achievement, 
    StoreItem, 
    PurchaseRecord,
    Subtask,
    TimeFilterType,
    AppData
} from './types';
import { Icons } from './constants';

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            if (typeof window === 'undefined') return initialValue;
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.log(error);
        }
    };
    return [storedValue, setValue];
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
    { id: 'ach_1', title: '初出茅庐', description: '累计获得 1000 PTS', targetPoints: 1000 },
    { id: 'ach_2', title: '资深干员', description: '累计获得 5000 PTS', targetPoints: 5000 },
    { id: 'ach_3', title: '罗德岛之锋', description: '累计获得 10000 PTS', targetPoints: 10000 },
    { id: 'ach_4', title: '巴别塔的恶灵', description: '累计获得 50000 PTS', targetPoints: 50000 },
    { id: 'ach_5', title: '全勤奖', description: '累计获得 100000 PTS', targetPoints: 100000 },
];

const App = () => {
    const [activeTab, setActiveTab] = useState<TabType>(TabType.TASK);
    const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
    const [categories, setCategories] = useLocalStorage<Category[]>('categories', [
        { id: '1', name: '日常事务' },
        { id: '2', name: '紧急作战' }
    ]);
    const [templates, setTemplates] = useLocalStorage<TaskTemplate[]>('templates', []);
    const [achievements, setAchievements] = useLocalStorage<Achievement[]>('achievements', DEFAULT_ACHIEVEMENTS);
    const [userPoints, setUserPoints] = useLocalStorage<number>('userPoints', 0);
    const [storeItems, setStoreItems] = useLocalStorage<StoreItem[]>('storeItems', [
        { id: '1', name: '理智药剂', cost: 500, description: '恢复精神状态', icon: '💉' },
        { id: '2', name: '源石', cost: 1000, description: '珍贵的矿物', icon: '💎' }
    ]);
    const [purchaseHistory, setPurchaseHistory] = useLocalStorage<PurchaseRecord[]>('purchaseHistory', []);
    const [isBgmEnabled, setIsBgmEnabled] = useLocalStorage<boolean>('isBgmEnabled', false);
    const [bgmSrc, setBgmSrc] = useState<string>('');

    // Achievement Notification State
    const [notifiedAchievements, setNotifiedAchievements] = useLocalStorage<string[]>('notified_achievements', []);
    const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null);

    // Point change popup state
    const [pointChange, setPointChange] = useState<{ amount: number, type: 'add' | 'subtract' } | null>(null);
    const prevUserPoints = useRef(userPoints);

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(null);
    const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
    
    // UI States
    const [showCompleted, setShowCompleted] = useState(false);
    const [warehouseCategory, setWarehouseCategory] = useState<string>('ALL');
    
    // System Date and Filters
    const [systemDate, setSystemDate] = useState(new Date());
    const [taskFilter, setTaskFilter] = useState<TimeFilterType>(TimeFilterType.ALL);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.loop = true;
        }
        if (bgmSrc) {
            audioRef.current.src = bgmSrc;
        }
    }, [bgmSrc]);

    useEffect(() => {
        if (audioRef.current) {
            if (isBgmEnabled && bgmSrc) {
                audioRef.current.play().catch(e => console.log('Audio play failed', e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isBgmEnabled, bgmSrc]);

    // Track point changes
    useEffect(() => {
        const diff = userPoints - prevUserPoints.current;
        if (diff !== 0) {
            setPointChange({ amount: Math.abs(diff), type: diff > 0 ? 'add' : 'subtract' });
            setTimeout(() => setPointChange(null), 2000); // clear after animation
        }
        prevUserPoints.current = userPoints;
    }, [userPoints]);

    // Helper for local date string YYYY-MM-DD
    const toDateString = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // Auto penalty check for overdue tasks
    useEffect(() => {
        const checkOverdue = () => {
            const todayStr = toDateString(systemDate);
            let penaltyPoints = 0;
            const updatedTodos = todos.map(t => {
                if (t.dueDate && t.dueDate < todayStr && !t.completed && !t.penalized) {
                    const penalty = Math.floor(t.points * 0.5); // Penalty is 50% of potential reward
                    penaltyPoints += penalty;
                    return { ...t, penalized: true };
                }
                return t;
            });

            if (penaltyPoints > 0) {
                setTodos(updatedTodos);
                setUserPoints(prev => Math.max(0, prev - penaltyPoints));
                alert(`检测到未完成的过期任务，已扣除 ${penaltyPoints} PTS 作为惩罚。`);
            }
        };
        
        // Run check when date changes or on load
        checkOverdue();
    }, [systemDate, todos, setTodos, setUserPoints]);

    // Calculate total earned points (for achievements)
    const totalEarnedPoints = useMemo(() => {
        return todos.reduce((acc, t) => acc + (t.completed ? t.points : 0), 0) + 
               todos.reduce((acc, t) => acc + t.subtasks.filter(s => s.completed).reduce((sAcc, s) => sAcc + s.points, 0), 0);
    }, [todos]);

    // Check for new achievements
    useEffect(() => {
        achievements.forEach(ach => {
            if (totalEarnedPoints >= ach.targetPoints && !notifiedAchievements.includes(ach.id)) {
                setCurrentNotification(ach);
                setNotifiedAchievements(prev => [...prev, ach.id]);
            }
        });
    }, [totalEarnedPoints, achievements, notifiedAchievements]);

    const getFilteredTasks = () => {
        let filtered = todos.filter(t => !t.hidden);
        const sysDateStr = toDateString(systemDate);
        
        // Use showCompleted state to toggle visibility
        if (!showCompleted) {
            filtered = filtered.filter(t => !t.completed);
        }

        switch (taskFilter) {
            case TimeFilterType.TODAY:
                filtered = filtered.filter(t => t.dueDate === sysDateStr);
                break;
            case TimeFilterType.WEEK:
                const weekEnd = new Date(systemDate);
                weekEnd.setDate(weekEnd.getDate() + 7);
                const weekEndStr = toDateString(weekEnd);
                filtered = filtered.filter(t => {
                    if (!t.dueDate) return false;
                    return t.dueDate >= sysDateStr && t.dueDate <= weekEndStr;
                });
                break;
            case TimeFilterType.MONTH:
                filtered = filtered.filter(t => {
                    if (!t.dueDate) return false;
                    const d = new Date(t.dueDate);
                    const [tY, tM, tD] = t.dueDate.split('-').map(Number);
                    return tM === systemDate.getMonth() + 1 && tY === systemDate.getFullYear();
                });
                break;
            case TimeFilterType.INCOMPLETE:
                filtered = filtered.filter(t => !t.completed);
                break;
            case TimeFilterType.ALL:
            default:
                break;
        }

        // Sort by completion (completed last) then by date/timestamp
        return filtered.sort((a, b) => {
            if (a.completed === b.completed) {
                return b.timestamp - a.timestamp;
            }
            return a.completed ? 1 : -1;
        });
    };

    const getFilteredTemplates = () => {
        let filtered = templates;
        // Filter by warehouse category if not ALL
        if (warehouseCategory !== 'ALL') {
            filtered = filtered.filter(t => t.categoryId === warehouseCategory);
        }
        return filtered;
    }

    const activeTasks = getFilteredTasks();
    const visibleTemplates = getFilteredTemplates();

    const handleAddTodo = (text: string, priority: Todo['priority'], categoryId: string | undefined, dueDate: string | undefined, subtasks: {text: string, points: number}[], points: number, frequency: number, recurrenceLimit: number) => {
        const newTodo: Todo = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            text,
            completed: false,
            priority,
            categoryId,
            dueDate,
            subtasks: subtasks.map(s => ({ ...s, id: Math.random().toString(36).substr(2, 9), completed: false })),
            points,
            frequency,
            recurrenceLimit,
            timestamp: Date.now()
        };
        setTodos(prev => [newTodo, ...prev]);
        setIsTaskModalOpen(false);
    };

    const handleToggleTodo = (id: string) => {
        setTodos(prevTodos => {
            const targetIndex = prevTodos.findIndex(t => t.id === id);
            if (targetIndex === -1) return prevTodos;

            const targetTask = prevTodos[targetIndex];
            const sysDateStr = toDateString(systemDate);

            // Lock Check
            if (!targetTask.completed && targetTask.dueDate && targetTask.dueDate > sysDateStr) {
                alert("未到执行时间 (已锁定)");
                return prevTodos;
            }

            const isCompleting = !targetTask.completed;
            let nextTask: Todo | null = null;
            let updatedTask = { 
                ...targetTask, 
                completed: isCompleting, 
                timestamp: Date.now() 
            };

            // Recurrence Logic
            // Conditions: Completing + Has Frequency + Has Limit > 1 + Has Not Recurred Yet
            if (isCompleting && 
                targetTask.frequency && targetTask.frequency > 0 && 
                targetTask.recurrenceLimit && targetTask.recurrenceLimit > 1 && 
                !targetTask.hasRecurred) {
                
                const nextDate = new Date(systemDate);
                nextDate.setDate(nextDate.getDate() + targetTask.frequency);
                
                nextTask = {
                    ...targetTask,
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                    completed: false,
                    dueDate: toDateString(nextDate),
                    timestamp: Date.now(),
                    subtasks: targetTask.subtasks.map(s => ({ ...s, completed: false })),
                    recurrenceLimit: targetTask.recurrenceLimit - 1,
                    hasRecurred: false,
                    penalized: false
                };

                updatedTask.hasRecurred = true;
            }

            // Update Points Side Effect
            if (isCompleting) {
                setUserPoints(p => p + targetTask.points);
            } else {
                setUserPoints(p => Math.max(0, p - targetTask.points));
            }

            const newTodos = [...prevTodos];
            newTodos[targetIndex] = updatedTask;
            
            if (nextTask) {
                return [nextTask, ...newTodos];
            }
            return newTodos;
        });
    };

    const handleDeleteTodo = (id: string) => {
        setTodos(prev => prev.filter(t => t.id !== id));
    };

    const handleToggleSubtask = (taskId: string, subtaskId: string) => {
        setTodos(prev => prev.map(t => {
            if (t.id === taskId) {
                const subtask = t.subtasks.find(s => s.id === subtaskId);
                if (subtask) {
                    if (!subtask.completed) setUserPoints(p => p + subtask.points);
                    else setUserPoints(p => Math.max(0, p - subtask.points));
                }
                return {
                    ...t,
                    subtasks: t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s)
                };
            }
            return t;
        }));
    };

    const handleAddSubtask = (taskId: string, text: string, points: number) => {
        setTodos(prev => prev.map(t => {
            if (t.id === taskId) {
                return {
                    ...t,
                    subtasks: [...t.subtasks, { id: Math.random().toString(36).substr(2, 9), text, points, completed: false }]
                };
            }
            return t;
        }));
    };

    const handleEditTodo = (id: string, updates: Partial<Todo>) => {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
        setEditingTodo(null);
    };

    const handleAddCategory = (name: string) => {
        setCategories(prev => [...prev, { id: Date.now().toString(), name }]);
    };
    const handleEditCategory = (id: string, name: string) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
    };
    const handleDeleteCategory = (id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    const handleSaveTemplate = (data: Partial<TaskTemplate>) => {
        if (data.id) {
            setTemplates(prev => prev.map(t => t.id === data.id ? { ...t, ...data } as TaskTemplate : t));
        } else {
            const newTemplate: TaskTemplate = {
                id: Date.now().toString(),
                text: data.text || '新建模板',
                priority: data.priority || 'NORMAL',
                categoryId: data.categoryId,
                subtasks: data.subtasks || [],
                points: data.points || 0,
                frequency: data.frequency || 0,
                recurrenceLimit: data.recurrenceLimit || 1
            };
            setTemplates(prev => [...prev, newTemplate]);
        }
        setIsTemplateModalOpen(false);
        setEditingTemplate(null);
    };
    
    const handleDeployTemplate = (template: TaskTemplate) => {
        const dateStr = toDateString(systemDate);
        
        handleAddTodo(
            template.text, 
            template.priority, 
            template.categoryId, 
            dateStr, 
            template.subtasks, 
            template.points || 0, 
            template.frequency || 0,
            template.recurrenceLimit || 1
        );
        setActiveTab(TabType.TASK);
    };

    const handlePurchase = (cost: number, itemName: string) => {
        if (userPoints >= cost) {
            setUserPoints(p => p - cost);
            setPurchaseHistory(prev => [...prev, { id: Date.now().toString(), itemName, cost, timestamp: Date.now(), isGacha: false }]);
        }
    };

    const handleGacha = (cost: number) => {
        if (userPoints < cost) return null;
        
        setUserPoints(p => p - cost);
        
        const validItems = storeItems.filter(i => i.cost > 0);
        
        if (validItems.length === 0) {
            return { rarity: 3, reward: '无可用物资', refund: cost };
        }

        const totalWeight = validItems.reduce((sum, item) => sum + (10000 / item.cost), 0);
        let random = Math.random() * totalWeight;
        let selectedItem = validItems[0];

        for (const item of validItems) {
            const weight = 10000 / item.cost;
            if (random < weight) {
                selectedItem = item;
                break;
            }
            random -= weight;
        }

        let rarity = 3;
        if (selectedItem.cost >= 2000) rarity = 6;
        else if (selectedItem.cost >= 1000) rarity = 5;
        else if (selectedItem.cost >= 500) rarity = 4;

        const rewardName = selectedItem.name;
        
        setPurchaseHistory(prev => [...prev, { 
            id: Date.now().toString(), 
            itemName: `寻访获得: ${rewardName}`, 
            cost: cost, 
            timestamp: Date.now(), 
            isGacha: true 
        }]);
        
        return { rarity, reward: rewardName, refund: 0 };
    };

    const handleImportMusic = (file: File) => {
        const url = URL.createObjectURL(file);
        setBgmSrc(url);
    };

    const handleRestoreData = (json: string) => {
        try {
            const data: Partial<AppData> = JSON.parse(json);
            if (data.todos) setTodos(data.todos);
            if (data.categories) setCategories(data.categories);
            if (data.templates) setTemplates(data.templates);
            if (data.achievements) setAchievements(data.achievements);
            if (data.userPoints !== undefined) setUserPoints(data.userPoints);
            if (data.storeItems) setStoreItems(data.storeItems);
            if (data.purchaseHistory) setPurchaseHistory(data.purchaseHistory);
            if (data.isBgmEnabled !== undefined) setIsBgmEnabled(data.isBgmEnabled);
            alert('数据恢复成功');
        } catch (e) {
            console.error(e);
            alert('数据恢复失败：格式错误');
        }
    };

    // Grouping Logic
    const groupedTasks = activeTasks.reduce((groups, task) => {
        const catId = task.categoryId || 'uncategorized';
        if (!groups[catId]) groups[catId] = [];
        groups[catId].push(task);
        return groups;
    }, {} as Record<string, Todo[]>);

    const sortedCategoryIds = Object.keys(groupedTasks).sort((a, b) => {
        if (a === 'uncategorized') return 1;
        if (b === 'uncategorized') return -1;
        return 0;
    });

    return (
        <Layout 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            systemDate={systemDate}
            onDateChange={setSystemDate}
        >
            {pointChange && (
                <PointPopup points={pointChange.amount} type={pointChange.type} />
            )}

            {currentNotification && (
                <AchievementToast 
                    achievement={currentNotification} 
                    onClose={() => setCurrentNotification(null)} 
                />
            )}

            {activeTab === TabType.TASK && (
                <div className="space-y-8 animate-in fade-in duration-500 pb-32">
                    <div className="mt-4">
                        <SettingHeader title="进行中任务" 
                            action={
                                <div className="flex items-center gap-2">
                                    <label className="text-xs font-bold text-white flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={showCompleted} 
                                            onChange={(e) => setShowCompleted(e.target.checked)} 
                                            className="accent-[#0098dc]"
                                        />
                                        显示已完成
                                    </label>
                                </div>
                            }
                        />
                        <FilterBar current={taskFilter} onChange={setTaskFilter} />
                        <div className="space-y-6">
                            {activeTasks.length === 0 && <div className="text-gray-400 text-xs font-bold tracking-widest text-center py-8">暂无作战记录</div>}
                            
                            {sortedCategoryIds.map(catId => {
                                const categoryName = catId === 'uncategorized' ? '未分类' : categories.find(c => c.id === catId)?.name || '未知分类';
                                return (
                                    <div key={catId} className="space-y-2">
                                        <div className="flex items-center space-x-2 text-[#0098dc] opacity-80 pl-2 border-l-2 border-[#0098dc]">
                                            <span className="text-[10px] font-black tracking-widest uppercase">{categoryName}</span>
                                        </div>
                                        {groupedTasks[catId].map(todo => (
                                            <TaskRow 
                                                key={todo.id} 
                                                todo={todo} 
                                                categoryName={categoryName}
                                                onToggle={handleToggleTodo} 
                                                onDelete={handleDeleteTodo}
                                                onToggleSubtask={handleToggleSubtask}
                                                onAddSubtask={handleAddSubtask}
                                                onEdit={setEditingTodo}
                                                systemDate={systemDate}
                                            />
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="fixed bottom-6 right-6 z-[80] scale-90 sm:scale-100">
                        <button 
                            onClick={() => setIsTaskModalOpen(true)}
                            className="w-16 h-16 bg-[#2d2d2d] text-white flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.4)] hover:bg-black transition-all border-r-4 border-[#0098dc] relative overflow-hidden active:scale-95"
                        >
                            <Icons.Plus />
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 animate-pulse"></div>
                        </button>
                    </div>
                </div>
            )}

            {activeTab === TabType.WAREHOUSE && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center mb-6">
                         <h2 className="text-xl font-black italic tracking-tighter">作战记录模板</h2>
                         <button 
                             onClick={() => { setEditingTemplate(null); setIsTemplateModalOpen(true); }}
                             className="bg-[#313131] text-white px-4 py-2 text-xs font-black tracking-widest uppercase hover:bg-[#0098dc] transition-colors"
                         >
                             创建模板
                         </button>
                    </div>
                    
                    {/* Warehouse Category Filter */}
                    <div className="flex space-x-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                        <button 
                            onClick={() => setWarehouseCategory('ALL')}
                            className={`px-3 py-1 text-xs font-black whitespace-nowrap border ${warehouseCategory === 'ALL' ? 'bg-[#0098dc] text-white border-[#0098dc]' : 'bg-white text-gray-400 border-gray-300'}`}
                        >
                            全部
                        </button>
                        {categories.map(c => (
                            <button 
                                key={c.id}
                                onClick={() => setWarehouseCategory(c.id)}
                                className={`px-3 py-1 text-xs font-black whitespace-nowrap border ${warehouseCategory === c.id ? 'bg-[#0098dc] text-white border-[#0098dc]' : 'bg-white text-gray-400 border-gray-300'}`}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {visibleTemplates.map(t => (
                            <TemplateRow 
                                key={t.id} 
                                template={t} 
                                categoryName={categories.find(c => c.id === t.categoryId)?.name}
                                onDeploy={handleDeployTemplate}
                                onDelete={id => setTemplates(prev => prev.filter(p => p.id !== id))}
                                onEdit={(t) => { setEditingTemplate(t); setIsTemplateModalOpen(true); }}
                            />
                        ))}
                        {visibleTemplates.length === 0 && (
                            <div className="col-span-full text-center text-gray-400 text-xs font-bold py-10">
                                暂无符合条件的模板
                            </div>
                        )}
                    </div>

                    <div className="mt-12">
                         <CategoryManager 
                             categories={categories} 
                             onAdd={handleAddCategory} 
                             onEdit={handleEditCategory} 
                             onDelete={handleDeleteCategory} 
                         />
                    </div>
                </div>
            )}

            {activeTab === TabType.SCHEDULE && (
                <div className="animate-in fade-in duration-500">
                    <ScheduleCalendar todos={todos} getCategoryName={id => categories.find(c => c.id === id)?.name} />
                </div>
            )}

            {activeTab === TabType.STORE && (
                <div className="animate-in fade-in duration-500">
                    <StoreView 
                        items={storeItems} 
                        userPoints={userPoints} 
                        purchaseHistory={purchaseHistory}
                        onPurchase={handlePurchase}
                        onAddItem={(item) => setStoreItems(prev => [...prev, { ...item, id: Date.now().toString() }])}
                        onUpdateItem={(id, updates) => setStoreItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i))}
                        onDeleteItem={(id) => setStoreItems(prev => prev.filter(i => i.id !== id))}
                        onGacha={handleGacha}
                    />
                </div>
            )}

            {activeTab === TabType.STATISTICS && (
                <div className="animate-in fade-in duration-500">
                    <StatisticsDashboard 
                        todos={todos} 
                        achievements={achievements}
                        totalEarnedPoints={totalEarnedPoints}
                        onAddAchievement={(title, description, targetPoints) => setAchievements(prev => [...prev, { id: Date.now().toString(), title, description, targetPoints }])}
                        onDeleteAchievement={id => setAchievements(prev => prev.filter(a => a.id !== id))}
                    />
                </div>
            )}

            {activeTab === TabType.USER && (
                <div className="animate-in fade-in duration-500">
                    <SystemSettings 
                        isBgmEnabled={isBgmEnabled}
                        onToggleBgm={setIsBgmEnabled}
                        onImportMusic={handleImportMusic}
                        currentMusicName={bgmSrc ? '自定义音乐' : ''}
                        onDelayTasks={(days) => setTodos(prev => prev.map(t => (!t.completed && t.dueDate) ? { 
                            ...t, 
                            dueDate: (() => {
                                const d = new Date(t.dueDate);
                                d.setDate(d.getDate() + days);
                                return toDateString(d);
                            })() 
                        } : t))}
                        onDeleteAllTasks={() => setTodos([])}
                        onPurgeCompleted={() => setTodos(prev => prev.filter(t => !t.completed))}
                        onBackup={() => setIsBackupModalOpen(true)}
                        onRestore={() => setIsBackupModalOpen(true)}
                    />
                </div>
            )}

            <StrategicModal 
                isOpen={isTaskModalOpen} 
                onClose={() => setIsTaskModalOpen(false)} 
                title="部署作战目标" 
            >
                <TaskInput categories={categories} onAdd={handleAddTodo} />
            </StrategicModal>

            <StrategicModal 
                isOpen={!!editingTodo} 
                onClose={() => setEditingTodo(null)} 
                title="编辑任务"
            >
                {editingTodo && (
                    <TaskEditForm 
                        todo={editingTodo} 
                        categories={categories} 
                        onSave={handleEditTodo} 
                        onCancel={() => setEditingTodo(null)} 
                    />
                )}
            </StrategicModal>

            <StrategicModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                title={editingTemplate ? "编辑模板" : "新建模板"}
            >
                <TemplateInput 
                    categories={categories} 
                    onSave={handleSaveTemplate} 
                    editingTemplate={editingTemplate}
                    onCancel={() => setIsTemplateModalOpen(false)}
                />
            </StrategicModal>

            <DataBackupModal 
                isOpen={isBackupModalOpen} 
                onClose={() => setIsBackupModalOpen(false)} 
                onImport={handleRestoreData}
            />

        </Layout>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

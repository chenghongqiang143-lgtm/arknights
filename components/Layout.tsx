
import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import { Icons } from '../constants';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    systemDate: Date;
    onDateChange: (date: Date) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, systemDate, onDateChange }) => {
    const checkShouldCollapse = () => {
        if (typeof window === 'undefined') return true;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isLandscape = width > height;
        
        if (width >= 1024 || isLandscape) {
            return false;
        }
        return true;
    };

    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        setIsCollapsed(checkShouldCollapse());
        const handleResize = () => {
            setIsCollapsed(checkShouldCollapse());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sidebarWidth = isCollapsed ? 'w-[5rem]' : 'w-[15rem]';

    const formattedDate = `${systemDate.getFullYear()}.${String(systemDate.getMonth() + 1).padStart(2, '0')}.${String(systemDate.getDate()).padStart(2, '0')}`;

    const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            // Fix: Create date from value string explicitly to avoid timezone shifts
            const [y, m, d] = e.target.value.split('-').map(Number);
            onDateChange(new Date(y, m - 1, d));
        }
    };

    // Helper to get local date string YYYY-MM-DD
    const toLocalISOString = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const dateInputValue = toLocalISOString(systemDate);

    return (
        <div className="flex h-screen w-full bg-[#f4f4f4] overflow-hidden select-none">
            <aside className={`${sidebarWidth} pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] box-content bg-[#313131]/90 backdrop-blur-xl flex flex-col shrink-0 border-r border-white/5 z-40 shadow-2xl transition-all duration-300 relative`}>
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-[0.75rem] top-[calc(6rem+env(safe-area-inset-top))] w-6 h-6 bg-[#2d2d2d] text-white flex items-center justify-center rounded-full border border-gray-600 z-50 hover:bg-black transition-colors"
                >
                    <div className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                </button>

                <div className="h-[5rem] flex items-center justify-center border-b border-white/5 overflow-hidden shrink-0">
                    <div className="w-8 h-8 bg-white/10 rounded-sm flex items-center justify-center shrink-0">
                        <div className="w-4 h-4 bg-white transform rotate-45"></div>
                    </div>
                    {!isCollapsed && <span className="ml-3 text-white font-black tracking-tighter text-[0.7rem] animate-in slide-in-from-left-2 uppercase">Rhodes Island</span>}
                </div>

                <nav className="flex flex-col flex-1 pt-8 px-2 space-y-3 overflow-y-auto scrollbar-hide">
                    <SidebarTab 
                        icon={<Icons.Task />} 
                        label="作战任务" 
                        active={activeTab === TabType.TASK} 
                        onClick={() => onTabChange(TabType.TASK)} 
                        collapsed={isCollapsed}
                    />
                    <SidebarTab 
                        icon={<Icons.Warehouse />} 
                        label="后勤仓库" 
                        active={activeTab === TabType.WAREHOUSE} 
                        onClick={() => onTabChange(TabType.WAREHOUSE)} 
                        collapsed={isCollapsed}
                    />
                    <SidebarTab 
                        icon={<Icons.Notify />} 
                        label="日程规划" 
                        active={activeTab === TabType.SCHEDULE} 
                        onClick={() => onTabChange(TabType.SCHEDULE)} 
                        collapsed={isCollapsed}
                    />
                    <SidebarTab 
                        icon={<Icons.Store />} 
                        label="采购中心" 
                        active={activeTab === TabType.STORE} 
                        onClick={() => onTabChange(TabType.STORE)} 
                        collapsed={isCollapsed}
                    />
                    <SidebarTab 
                        icon={<Icons.Stats />} 
                        label="档案资料" 
                        active={activeTab === TabType.STATISTICS} 
                        onClick={() => onTabChange(TabType.STATISTICS)} 
                        collapsed={isCollapsed}
                    />
                    
                    <div className="flex-1 min-h-[2rem]"></div>
                    
                    <SidebarTab 
                        icon={<Icons.User />} 
                        label="博士档案" 
                        active={activeTab === TabType.USER} 
                        onClick={() => onTabChange(TabType.USER)} 
                        special
                        collapsed={isCollapsed}
                    />
                    <div className="h-safe-bottom shrink-0 pb-[env(safe-area-inset-bottom)]"></div>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col relative min-w-0">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.015] -rotate-12">
                        <div className="text-[18rem] font-black italic whitespace-nowrap uppercase">Rhodes Island</div>
                    </div>
                    
                    <div className="absolute -bottom-16 -left-16 text-[#313131] opacity-[0.035] scale-[2.5] origin-bottom-left rotate-12">
                        <Icons.RhodesLogo className="w-64 h-64" />
                    </div>

                    <div className="absolute bottom-10 right-10 flex flex-col items-end opacity-[0.05]">
                        <div className="text-[4rem] font-black jetbrains leading-none">01</div>
                        <div className="h-1 w-24 bg-[#313131] mt-2"></div>
                        <div className="text-[0.6rem] font-black tracking-widest mt-1">SECTOR ARCHIVE / L-BASE</div>
                    </div>
                </div>

                <header className="min-h-[5rem] pt-[env(safe-area-inset-top)] pl-8 pr-[calc(2rem+env(safe-area-inset-right))] bg-white/95 backdrop-blur-md flex items-center justify-between border-b border-gray-200 z-30 shadow-sm box-content">
                    <div className="flex h-[5rem] items-center">
                        <div className="flex items-center bg-[#2d2d2d] text-white h-full px-8 space-x-4 relative">
                            <div className="w-5 h-5 flex items-center justify-center">
                                <Icons.Settings />
                            </div>
                            <span className="text-xl font-bold tracking-[0.3em] uppercase whitespace-nowrap">终端</span>
                            <div className="absolute top-0 right-0 w-0 h-0 border-t-[5rem] border-t-white border-l-[1.5rem] border-l-transparent"></div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6 h-[5rem]">
                        <div className="text-right hidden sm:block">
                            <div className="text-[0.6rem] font-black tracking-tighter text-gray-400 leading-none">RHODES ISLAND</div>
                            <div className="text-[0.6rem] font-black tracking-tighter text-gray-400 leading-none">PRTS V2.0.5</div>
                        </div>
                        <div className="relative group cursor-pointer">
                            <div className="bg-[#2d2d2d] text-white px-6 py-2 text-[0.7rem] font-black tracking-[0.2em] jetbrains shadow-lg select-none whitespace-nowrap border-r-4 border-[#0098dc] flex items-center group-hover:bg-[#0081bb] transition-colors">
                                {formattedDate}
                                <span className="ml-2 text-[0.5rem] opacity-50">▼</span>
                            </div>
                            <input 
                                type="date" 
                                value={dateInputValue}
                                onChange={handleDateInput}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto relative pl-4 pr-[calc(1rem+env(safe-area-inset-right))] sm:pl-12 sm:pr-[calc(3rem+env(safe-area-inset-right))] py-10 z-10">
                    <div className="relative max-w-6xl mx-auto">
                        {children}
                    </div>
                </div>

                <div className="h-2 bg-[#1a1a1a] flex shrink-0 pb-[env(safe-area-inset-bottom)]">
                    <div className="h-full bg-[#0098dc] w-1/4 shadow-[0_0_10px_#0098dc]"></div>
                    <div className="h-full bg-[#ffcf00] w-4 ml-2"></div>
                </div>
            </main>
        </div>
    );
};

interface SidebarTabProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
    special?: boolean;
    collapsed?: boolean;
}

const SidebarTab: React.FC<SidebarTabProps> = ({ icon, label, active, onClick, special, collapsed }) => {
    return (
        <button 
            onClick={onClick}
            title={collapsed ? label : undefined}
            className={`
                w-full flex flex-row items-center min-h-[3.5rem] transition-all duration-200 relative border-l-4 shrink-0
                ${active 
                    ? 'bg-white text-black border-white shadow-[0px_4px_12px_rgba(0,0,0,0.5),_4px_4px_0px_rgba(45,45,45,1)] z-10 translate-x-1' 
                    : 'bg-black/40 text-gray-300 border-transparent hover:bg-black/60 hover:text-white'}
                ${special ? 'mt-8' : ''}
                ${collapsed ? 'px-0 justify-center' : 'px-4 space-x-4'}
            `}
        >
            <div className={`shrink-0 flex items-center justify-center w-6 h-6 transition-transform duration-200 ${active ? 'text-black scale-110' : 'text-gray-400'}`}>
                {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
            </div>
            {!collapsed && (
                <span className="text-[0.9rem] font-bold tracking-widest whitespace-nowrap animate-in fade-in slide-in-from-left-2 uppercase">
                    {label}
                </span>
            )}
        </button>
    );
};

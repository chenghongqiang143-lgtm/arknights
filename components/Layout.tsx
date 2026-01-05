
import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import { Icons } from '../constants';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: TabType;
     onTabChange: (tab: TabType) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
    // Force expanded in landscape on wider screens, collapse only when truly narrow
    const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };
        window.addEventListener('resize', handleResize);
        
        const now = new Date();
        const formatted = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
        setCurrentDate(formatted);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sidebarWidth = isCollapsed ? 'w-[5rem]' : 'w-[15rem]';

    return (
        <div className="flex h-screen w-full bg-[#f2f2f2] overflow-hidden select-none">
            {/* Sidebar with Gaussian Blur and Safe Area Support */}
            <aside className={`${sidebarWidth} pt-[env(safe-area-inset-top)] bg-[#444444]/85 backdrop-blur-xl flex flex-col shrink-0 border-r border-white/10 z-40 shadow-2xl transition-all duration-300 relative`}>
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

                <div className="h-[5rem] flex items-center justify-center border-b border-white/5 overflow-hidden">
                    <div className="w-8 h-8 bg-white/10 rounded-sm flex items-center justify-center shrink-0">
                        <div className="w-4 h-4 bg-white transform rotate-45"></div>
                    </div>
                    {!isCollapsed && <span className="ml-3 text-white font-black tracking-tighter text-[0.7rem] animate-in slide-in-from-left-2 uppercase">Rhodes Island</span>}
                </div>

                <nav className="flex flex-col flex-1 pt-8 px-2 space-y-3">
                    <SidebarTab 
                        icon={<Icons.Task />} 
                        label="任务" 
                        active={activeTab === TabType.TASK} 
                        onClick={() => onTabChange(TabType.TASK)} 
                        collapsed={isCollapsed}
                    />
                    <SidebarTab 
                        icon={<Icons.Warehouse />} 
                        label="仓库" 
                        active={activeTab === TabType.WAREHOUSE} 
                        onClick={() => onTabChange(TabType.WAREHOUSE)} 
                        collapsed={isCollapsed}
                    />
                    <SidebarTab 
                        icon={<Icons.Notify />} 
                        label="日程" 
                        active={activeTab === TabType.SCHEDULE} 
                        onClick={() => onTabChange(TabType.SCHEDULE)} 
                        collapsed={isCollapsed}
                    />
                    <SidebarTab 
                        icon={<Icons.Stats />} 
                        label="统计" 
                        active={activeTab === TabType.STATISTICS} 
                        onClick={() => onTabChange(TabType.STATISTICS)} 
                        collapsed={isCollapsed}
                    />
                    
                    <div className="flex-1"></div>
                    
                    <SidebarTab 
                        icon={<Icons.User />} 
                        label="用户" 
                        active={activeTab === TabType.USER} 
                        onClick={() => onTabChange(TabType.USER)} 
                        special
                        collapsed={isCollapsed}
                    />
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative min-w-0">
                {/* Header with Safe Area Support */}
                <header className="min-h-[5rem] pt-[env(safe-area-inset-top)] bg-white/95 backdrop-blur-md flex items-center justify-between border-b border-gray-200 z-30 shadow-sm box-content">
                    <div className="flex h-[5rem] items-center">
                        <div className="flex items-center bg-[#2d2d2d] text-white h-full px-8 space-x-4 relative">
                            <div className="w-5 h-5 flex items-center justify-center">
                                <Icons.Settings />
                            </div>
                            <span className="text-xl font-bold tracking-[0.3em] uppercase whitespace-nowrap">终端</span>
                            <div className="absolute top-0 right-0 w-0 h-0 border-t-[5rem] border-t-white border-l-[1.5rem] border-l-transparent"></div>
                        </div>
                    </div>

                    <div className="px-8 flex items-center space-x-6 h-[5rem]">
                        <div className="text-right hidden sm:block">
                            <div className="text-[0.6rem] font-black tracking-tighter text-gray-400 leading-none">RHODES ISLAND</div>
                            <div className="text-[0.6rem] font-black tracking-tighter text-gray-400 leading-none">PRTS V2.0.5</div>
                        </div>
                        <div className="bg-[#2d2d2d] text-white px-6 py-2 text-[0.7rem] font-black tracking-[0.2em] jetbrains shadow-lg select-none whitespace-nowrap border-r-4 border-[#0098dc]">
                            {currentDate}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto relative px-4 sm:px-12 py-10">
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none -rotate-12 select-none">
                        <div className="text-[15rem] font-black italic whitespace-nowrap uppercase">Rhodes Island</div>
                    </div>
                    
                    <div className="relative z-10 max-w-6xl mx-auto">
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
                w-full flex flex-row items-center h-[3.5rem] transition-all duration-200 relative border-l-4
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

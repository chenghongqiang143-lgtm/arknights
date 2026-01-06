
import React from 'react';

export const COLORS = {
    RHODES_WHITE: '#f4f4f4',
    RHODES_DARK: '#2d2d2d',
    RHODES_BLUE: '#0098dc',
    RHODES_GREY: '#e0e0e0',
    RHODES_TEXT_MUTED: '#888888',
};

export const Icons = {
    RhodesLogo: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
            <path d="M50 10 L90 85 L10 85 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M50 25 L80 80 L20 80 Z" />
            <rect x="47" y="45" width="6" height="20" />
            <path d="M35 60 L65 60" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    Back: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <path d="M15 18l-6-6 6-6" />
        </svg>
    ),
    Settings: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
    ),
    Task: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mb-1">
            <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.5l6 3.75v7.5l-6 3.75-6-3.75v-7.5l6-3.75zM7 9v1h10V9H7zm0 3v1h10v-1H7zm0 3v1h7v-1H7z" />
        </svg>
    ),
    Warehouse: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mb-1">
            <path d="M3 4h18v2H3V4zm0 5h8v4H3V9zm10 0h8v11h-8V9zm-10 6h8v5H3v-5zM5 11h4v1H5v-1zm10 0h4v1h-4v-1zm-10 6h4v1H5v-1z" />
        </svg>
    ),
    Notify: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mb-1">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
        </svg>
    ),
    Stats: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mb-1">
            <path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z" />
        </svg>
    ),
    User: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mb-1">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
    ),
    Store: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mb-1">
            <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/>
        </svg>
    ),
    Plus: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6">
            <path d="M12 5v14M5 12h14" />
        </svg>
    ),
    Close: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6">
            <path d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    Music: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
    ),
    Volume: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
    ),
    ChevronDown: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M6 9l6 6 6-6" />
        </svg>
    ),
    ChevronUp: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M18 15l-6-6-6 6" />
        </svg>
    ),
    Repeat: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
        </svg>
    ),
    Medal: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 17l-2.47 1.48.47-2.88L7.9 13.56l2.89-.42L12 10.5l1.21 2.64 2.89.42-2.09 2.04.47 2.88zM12 2l-5.5 9h11z" opacity=".3"/>
            <path d="M12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z"/>
        </svg>
    )
};

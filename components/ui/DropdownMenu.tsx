import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

const DropdownMenuContext = React.createContext<{
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    triggerRect: DOMRect | null;
    setTriggerRect: React.Dispatch<React.SetStateAction<DOMRect | null>>;
} | null>(null);

interface DropdownMenuProps {
    children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null);

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleOutsideClick = () => {
            setIsOpen(false);
            setTriggerRect(null);
        };
        if (isOpen) {
            window.addEventListener('click', handleOutsideClick);
            window.addEventListener('scroll', handleOutsideClick, true);
        }
        return () => {
            window.removeEventListener('click', handleOutsideClick);
            window.removeEventListener('scroll', handleOutsideClick, true);
        };
    }, [isOpen]);

    return (
        <DropdownMenuContext.Provider value={{ isOpen, setIsOpen, triggerRect, setTriggerRect }}>
            <div className="relative inline-block text-left">{children}</div>
        </DropdownMenuContext.Provider>
    );
}

interface DropdownMenuTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
}

export function DropdownMenuTrigger({ children, asChild }: DropdownMenuTriggerProps) {
    const context = React.useContext(DropdownMenuContext);
    if (!context) throw new Error('DropdownMenuTrigger must be used within a DropdownMenu');

    const handleTriggerClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        context.setTriggerRect(rect);
        context.setIsOpen(!context.isOpen);
    };

    return (
        <div 
            onClick={handleTriggerClick} 
            className="cursor-pointer"
        >
            {children}
        </div>
    );
}

interface DropdownMenuContentProps {
    children: React.ReactNode;
    align?: 'start' | 'end';
    className?: string;
}

export function DropdownMenuContent({ children, align = 'end', className }: DropdownMenuContentProps) {
    const context = React.useContext(DropdownMenuContext);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!context || !context.isOpen || !context.triggerRect || !mounted) return null;

    const { triggerRect } = context;
    
    // Position the menu relative to the trigger button using viewport coordinates
    const availableSpaceBelow = window.innerHeight - triggerRect.bottom;
    const menuHeight = 280; // Estimated height for the menu with all items
    const shouldFlipUp = availableSpaceBelow < menuHeight;

    const style: React.CSSProperties = {
        position: 'fixed',
        top: shouldFlipUp 
            ? `${triggerRect.top - 8}px` 
            : `${triggerRect.bottom + 8}px`,
        transform: shouldFlipUp ? 'translateY(-100%)' : 'none',
        left: align === 'end' 
            ? `${triggerRect.right - 192}px` 
            : `${triggerRect.left}px`,
        zIndex: 9999,
    };

    // Edge detection to ensure menu stays within viewport horizontally
    if (triggerRect.right - 192 < 16) {
        style.left = '16px';
    } else if (triggerRect.right > window.innerWidth - 16) {
        style.left = `${window.innerWidth - 192 - 16}px`;
    }

    return createPortal(
        <div 
            style={style}
            onClick={(e) => e.stopPropagation()}
            className={cn(
                "w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 text-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
                className
            )}
        >
            {children}
        </div>,
        document.body
    );
}

export function DropdownMenuItem({ children, onClick, className, asChild }: any) {
    const context = React.useContext(DropdownMenuContext);
    if (!context) throw new Error('DropdownMenuItem must be used within a DropdownMenu');

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) onClick(e);
        context.setIsOpen(false);
        context.setTriggerRect(null);
    };

    return (
        <div
            onClick={handleClick}
            className={cn(
                "relative flex cursor-pointer select-none items-center rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-slate-800 dark:focus:bg-slate-800 active:scale-95",
                className
            )}
        >
            {children}
        </div>
    );
}

export function DropdownMenuSeparator({ className }: any) {
    return <div className={cn("-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800", className)} />;
}

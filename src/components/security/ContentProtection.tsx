import { useEffect, useCallback } from 'react';

/**
 * CONTENT PROTECTION SYSTEM
 * 
 * Comprehensive anti-theft protection to prevent unauthorized copying of content:
 * - Right-click disabled (context menu blocked)
 * - Text selection disabled (except in form inputs)
 * - Keyboard shortcuts blocked (Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+P, F12)
 * - Print protection with watermark
 * - Image drag & drop disabled
 * 
 * Legal Note: This is a deterrent, not a 100% guarantee.
 * Determined users can still access content via browser dev tools.
 */

const ContentProtection: React.FC = () => {

    // Block right-click context menu
    const handleContextMenu = useCallback((e: MouseEvent) => {
        const target = e.target as HTMLElement;
        // Allow right-click in form elements for accessibility
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
        }
        e.preventDefault();
        return false;
    }, []);

    // Block text selection
    const handleSelectStart = useCallback((e: Event) => {
        const target = e.target as HTMLElement;
        // Allow selection in form elements
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
        }
        e.preventDefault();
        return false;
    }, []);

    // Block keyboard shortcuts
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Block Ctrl/Cmd + key combinations
        if (e.ctrlKey || e.metaKey) {
            // Ctrl+C (Copy) - allow in input fields
            if (e.key === 'c' || e.key === 'C') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
                    e.preventDefault();
                    return false;
                }
            }
            // Ctrl+U (View Source)
            if (e.key === 'u' || e.key === 'U') {
                e.preventDefault();
                return false;
            }
            // Ctrl+S (Save Page)
            if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                return false;
            }
            // Ctrl+P (Print)
            if (e.key === 'p' || e.key === 'P') {
                e.preventDefault();
                return false;
            }
            // Ctrl+Shift+I (DevTools)
            if ((e.key === 'i' || e.key === 'I') && e.shiftKey) {
                e.preventDefault();
                return false;
            }
            // Ctrl+Shift+J (Console)
            if ((e.key === 'j' || e.key === 'J') && e.shiftKey) {
                e.preventDefault();
                return false;
            }
            // Ctrl+Shift+C (Inspect Element)
            if ((e.key === 'c' || e.key === 'C') && e.shiftKey) {
                e.preventDefault();
                return false;
            }
        }
        // Block F12 (DevTools)
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
    }, []);

    // Block image drag & drop
    const handleDragStart = useCallback((e: DragEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    }, []);

    // Block copy event
    const handleCopy = useCallback((e: ClipboardEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
            e.preventDefault();
            return false;
        }
    }, []);

    useEffect(() => {
        // Add event listeners
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('selectstart', handleSelectStart);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('dragstart', handleDragStart);
        document.addEventListener('copy', handleCopy);

        // Add CSS to disable text selection
        const style = document.createElement('style');
        style.id = 'content-protection-styles';
        style.textContent = `
            /* Disable text selection globally except in forms */
            body:not(input):not(textarea):not([contenteditable="true"]) {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            
            /* Allow selection in form elements */
            input, textarea, [contenteditable="true"] {
                -webkit-user-select: text;
                -moz-user-select: text;
                -ms-user-select: text;
                user-select: text;
            }
            
            /* Disable image dragging */
            img {
                -webkit-user-drag: none;
                -khtml-user-drag: none;
                -moz-user-drag: none;
                -o-user-drag: none;
                user-drag: none;
                pointer-events: none;
            }
            
            /* Re-enable pointer events for images in interactive contexts */
            a img, button img, [role="button"] img {
                pointer-events: auto;
            }
            
            /* Print protection - hide content and show watermark */
            @media print {
                body * {
                    visibility: hidden !important;
                }
                body::before {
                    visibility: visible !important;
                    content: "© ${new Date().getFullYear()} Recharge Travels & Tours Pvt Ltd. All Rights Reserved. This content is protected by copyright law. Unauthorized reproduction is prohibited.";
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 48px;
                    color: rgba(0, 0, 0, 0.3);
                    white-space: nowrap;
                    z-index: 999999;
                    font-family: Arial, sans-serif;
                    font-weight: bold;
                    text-align: center;
                    width: 200%;
                }
                body::after {
                    visibility: visible !important;
                    content: "PROTECTED CONTENT - DO NOT COPY";
                    position: fixed;
                    top: 20%;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 24px;
                    color: rgba(255, 0, 0, 0.5);
                    font-family: Arial, sans-serif;
                    font-weight: bold;
                    z-index: 999999;
                }
            }
        `;
        document.head.appendChild(style);

        // Cleanup
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('selectstart', handleSelectStart);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('dragstart', handleDragStart);
            document.removeEventListener('copy', handleCopy);
            const styleEl = document.getElementById('content-protection-styles');
            if (styleEl) styleEl.remove();
        };
    }, [handleContextMenu, handleSelectStart, handleKeyDown, handleDragStart, handleCopy]);

    // DevTools detection (optional - logs to console)
    useEffect(() => {
        const detectDevTools = () => {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;

            if (widthThreshold || heightThreshold) {
                console.warn('⚠️ Developer tools detected. Content is protected by copyright.');
            }
        };

        window.addEventListener('resize', detectDevTools);
        detectDevTools();

        return () => window.removeEventListener('resize', detectDevTools);
    }, []);

    return null; // This component doesn't render anything visible
};

export default ContentProtection;

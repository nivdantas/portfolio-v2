'use client';

import React from 'react';

interface ScrollButtonProps {
    targetId: string;
    children: React.ReactNode;
}

const ScrollButton = ({ targetId, children }: ScrollButtonProps) => {
    const handleScroll = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <button
            onClick={handleScroll}
            className="cursor-pointer"
        >
            {children}
        </button>
    );
};

export default ScrollButton;

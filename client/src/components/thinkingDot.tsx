import React from 'react';

const ThinkingDots = () => {
    return (
        <div className="flex space-x-1">
            <span
                className="w-1 h-1 bg-black rounded-full animate-[bounce_1s_infinite] motion-safe:translate-y-[10px]"
                style={{ animationDelay: '0s' }}
            ></span>
            <span
                className="w-1 h-1 bg-black rounded-full animate-[bounce_1s_infinite] motion-safe:translate-y-[14px]"
                style={{ animationDelay: '0.2s' }}
            ></span>
            <span
                className="w-1 h-1 bg-black rounded-full animate-[bounce_1s_infinite] motion-safe:translate-y-[18px]"
                style={{ animationDelay: '0.4s' }}
            ></span>
        </div>
    );
};

export default ThinkingDots;

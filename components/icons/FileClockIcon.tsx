import React from 'react';

export const FileClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v18"></path>
        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
        <circle cx="8" cy="16" r="4"></circle>
        <path d="M9.5 17.5 8 16.25V14"></path>
    </svg>
);

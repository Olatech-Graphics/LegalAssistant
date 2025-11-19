import React from 'react';

export const SignalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.288 15.038a5.25 5.25 0 017.424 0M5.136 11.886a8.25 8.25 0 0111.728 0M2 8.734a11.25 11.25 0 0115.912 0M12 18.375a.375.375 0 110-.75.375.375 0 010 .75z"
    />
  </svg>
);

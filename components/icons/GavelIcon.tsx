import React from 'react';

export const GavelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M13.5 6.223l2.673 2.674m-2.673-2.674L10.827 8.897m2.674-2.674L14.7 4.5l-1.2 1.2m1.2-1.2l-2.674 2.673M3 13.5l6.75 6.75m0 0l6.75-6.75M9.75 20.25l6.75-6.75M3 13.5h18"
    />
  </svg>
);


import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-7.19c0-.868.351-1.666.923-2.261Z"
      clipRule="evenodd"
    />
    <path d="M6.143 10.725a.75.75 0 01.022-1.06l1.06-1.06a.75.75 0 011.06 0l1.062 1.06a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.061 0l-1.06-1.061a.75.75 0 01-.022-1.061Zm-3.53 3.53a.75.75 0 011.06 0l1.061 1.06a.75.75 0 010 1.062l-1.06 1.06a.75.75 0 01-1.061 0l-1.06-1.06a.75.75 0 010-1.061l1.06-1.06Z" />
  </svg>
);

export default SparklesIcon;

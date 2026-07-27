/**
 * Helper functions for generating className strings
 * Prevents complex inline expressions in JSX
 */

/**
 * Get view mode button className
 * @param {string} currentMode - Current view mode
 * @param {string} buttonMode - Button's target mode
 * @param {string} position - Button position ('left' or 'right')
 * @returns {string} className string
 */
export const getViewModeButtonClassName = (currentMode, buttonMode, position) => {
  const baseClasses = position === 'left' 
    ? 'rounded-r-none h-9 px-3' 
    : 'rounded-l-none h-9 px-3';
  
  const activeClasses = 'bg-blue-600 hover:bg-blue-700 text-white';
  const inactiveClasses = 'text-gray-600 hover:bg-gray-50';
  
  return `${baseClasses} ${currentMode === buttonMode ? activeClasses : inactiveClasses}`;
};

/**
 * Get pagination button className
 * @param {number|string} page - Page number
 * @param {number} currentPage - Current page
 * @returns {string} className string
 */
export const getPaginationButtonClassName = (page, currentPage) => {
  if (page === currentPage) {
    return 'bg-blue-600 hover:bg-blue-700';
  }
  return 'border-gray-300';
};



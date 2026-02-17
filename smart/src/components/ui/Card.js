'use client';

const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseStyles =
    'rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-soft-md transition-all duration-200';

  const hoverStyles = hover
    ? 'hover:shadow-soft-lg hover:border-gray-300 dark:hover:border-gray-700'
    : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;

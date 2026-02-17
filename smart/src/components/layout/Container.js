'use client';

const Container = ({ children, className = '', ...props }) => (
  <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`} {...props}>
    {children}
  </div>
);

export default Container;

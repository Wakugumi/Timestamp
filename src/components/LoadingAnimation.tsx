import React from 'react';
import './LoadingAnimation.scss';

const LoadingAnimation: React.FC<{ className? : string}> = ({className}) => {
  return (
    <div className={`loading-animation ${className}`}>
      <span className="dot" style={{ animationDelay: '0s' }}>•</span>
      <span className="dot" style={{ animationDelay: '0.2s' }}>•</span>
      <span className="dot" style={{ animationDelay: '0.4s' }}>•</span>
    </div>
  );
};

export default LoadingAnimation;

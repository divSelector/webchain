import React from 'react';

export default function ChainSVG() {

    const ring = {
      xIncrement: 40,
      yCenter: 60,
      radius: 30,
      total: 6
    };

    const viewWidth = (ring.total * ring.xIncrement) + ring.xIncrement
    const viewHeight = ring.yCenter * 2

    function generateCircles(className, radius) {
        const circleData = Array.from({ length: ring.total });
        return circleData.map((_, index) => {
          const cx = (index + 1) * ring.xIncrement;
          return <circle 
                    key={`${className}-${index}`} 
                    className={className} 
                    cx={cx} 
                    cy={ring.yCenter} 
                    r={radius}
                />;
        });
      }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg" 
        viewBox={`0 0 ${viewWidth} ${viewHeight}`} 
        width={viewWidth} 
        height={viewHeight}
      >
        {generateCircles("outer-circle", ring.radius)}
        {generateCircles("inner-circle", ring.radius/2)}
      </svg>
    );
  }
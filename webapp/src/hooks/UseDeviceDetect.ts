import React, { useEffect, useState } from 'react';

const useDeviceDetect = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const handleWindowResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return { mobile: width <= 768, currentWidth: width };
};

export default useDeviceDetect;

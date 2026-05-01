import React, { useEffect, useRef } from 'react';

const AdBanner = () => {
  const bannerRef = useRef(null);

  useEffect(() => {
    // 1. Prevent duplicate ads when React Strict Mode runs twice in development
    if (bannerRef.current && bannerRef.current.firstChild) {
      return;
    }

    // 2. Define the global configuration for Adsterra
    window.atOptions = {
      'key': 'f0526281c5a1a34c7102ac44df6061d1',
      'format': 'iframe',
      'height': 50,
      'width': 320,
      'params': {}
    };

    // 3. Dynamically create the script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://www.highperformanceformat.com/f0526281c5a1a34c7102ac44df6061d1/invoke.js';

    // 4. Append the script inside our target div
    if (bannerRef.current) {
      bannerRef.current.appendChild(script);
    }

    // 5. Cleanup function if the component unmounts
    return () => {
      if (bannerRef.current) {
        bannerRef.current.innerHTML = '';
      }
    };
  }, []); // Empty dependency array ensures this only runs once on mount

  return (
    // This div is the container where the Adsterra iframe will render
    <div 
      ref={bannerRef} 
      style={{ width: '320px', height: '50px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}
    />
  );
};

export default AdBanner;
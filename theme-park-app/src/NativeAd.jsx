import React, { useEffect } from 'react';

const NativeAd = () => {
  useEffect(() => {
    // 1. Check if we already injected the script to prevent duplicates
    if (document.querySelector('script[src*="9f001c4dc1d0d533a2a3cc0022754884/invoke.js"]')) {
      return;
    }

    // 2. Create the script element provided by Adsterra
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = '//pl29304074.profitablecpmratenetwork.com/9f001c4dc1d0d533a2a3cc0022754884/invoke.js';

    // 3. Append the script to the document body
    document.body.appendChild(script);
  }, []);

  // 4. Render the specific div ID that the Adsterra script targets
  return (
    <div 
      id="container-9f001c4dc1d0d533a2a3cc0022754884" 
      style={{ margin: '20px auto', textAlign: 'center' }} 
    />
  );
};

export default NativeAd;
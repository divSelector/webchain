import { useEffect, useRef } from 'react';
import React from 'react';

export default function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function documentHeight() {
      return Math.max(
        document.documentElement.clientHeight, 
        window.innerHeight || 0
      );
    }

    function documentWidth() {
        return Math.max(
            document.documentElement.clientWidth, 
            window.innerWidth || 0
        )
      }

    function handleResize() {
        canvas.height = documentHeight();
        canvas.width = documentWidth();
    }
  
    handleResize();

    const chars = 'ç”°ç”±ç”²ç”³ç”´ç”µç”¶ç”·ç”¸ç”¹ç”ºç”»ç”¼ç”½ç”¾ç”¿ç•€ç•ç•‚ç•ƒç•„ç•…ç•†ç•‡ç•ˆç•‰ç•Šç•‹ç•Œç•ç•Žç•ç•ç•‘';
    const charArray = chars.split('');
    const font_size = 20;
    
    const columns = Math.floor(canvas.width / font_size);
    const drops = new Array(columns).fill(1);

    const rainColor = getComputedStyle(document.documentElement).getPropertyValue('--matrix-rain-color')

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas on each frame
      ctx.fillStyle = 'transparent';
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = rainColor;
      ctx.font = `${font_size}px arial`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * font_size, drops[i] * font_size);

        if (drops[i] * font_size > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    window.addEventListener('resize', handleResize);
    const animationId = setInterval(draw, 40);

    return () => {
      clearInterval(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

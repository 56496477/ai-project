import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        RufflePlayer: any;
    }
}

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for Ruffle to be loaded
    const loadRuffle = () => {
        if (window.RufflePlayer) {
            const ruffle = window.RufflePlayer.newest();
            const player = ruffle.createPlayer();
            const container = containerRef.current;
            if (container) {
                container.innerHTML = '';
                container.appendChild(player);

                // Configure Ruffle for transparency and audio
                player.config = {
                    backgroundColor: null, // Makes the background transparent
                    autoplay: "on",        // Auto-start playback
                    unmuteOverlay: "visible", // Show overlay if audio is blocked
                    letterbox: "on",       // Prevent distortion
                };

                // The SWF is in public/common.swf, so we access it as /common.swf
                player.load({
                    url: "/common.swf",
                    // Also setting wmode here as a fallback/redundancy
                    wmode: "transparent",
                    backgroundColor: null,
                });
            }
        } else {
            // Retry after a short delay if Ruffle isn't ready yet
            setTimeout(loadRuffle, 100);
        }
    };

    loadRuffle();
  }, []);

  return (
    <div 
      ref={containerRef} 
      // style={{ 
      //   width: '800px', 
      //   height: '600px',
      //   boxShadow: '0 20px 50px rgba(0,0,0,0.3)', // Add shadow for better depth
      //   borderRadius: '16px', // Rounded corners
      //   overflow: 'hidden', // Clip content to rounded corners
      // }} 
    />
  );
}

export default App;

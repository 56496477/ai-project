import { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        RufflePlayer: any;
    }
}

interface RufflePlayerProps {
    swfUrl: string;
    onAnimEnd?: () => void;
    onReady?: () => void;
    width?: string | number;
    height?: string | number;
}

export const RufflePlayer = ({ swfUrl, onReady, width = "100%", height = "100%" }: RufflePlayerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const didCallReadyRef = useRef(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 100; // 10 seconds

        const loadRuffle = () => {
            if (window.RufflePlayer) {
                try {
                    const ruffle = window.RufflePlayer.newest();
                    
                    if (!playerRef.current) {
                        const player = ruffle.createPlayer();
                        playerRef.current = player;
                        const container = containerRef.current;
                        if (container) {
                            container.innerHTML = '';
                            container.appendChild(player);
                        }
                        if (!didCallReadyRef.current) {
                            didCallReadyRef.current = true;
                            onReady?.();
                        }

                        player.config = {
                            backgroundColor: null, 
                            autoplay: "on",
                            unmuteOverlay: "hidden", 
                            letterbox: "on",
                            splashScreen: false,
                        };
                    }

                    const player = playerRef.current;
                    console.log(`[RufflePlayer] Loading SWF: ${swfUrl}`);
                    player.load({
                        url: swfUrl,
                        wmode: "transparent",
                        backgroundColor: null,
                    });
                    setError(null);
                } catch (e: any) {
                    console.error("Ruffle Error:", e);
                    setError(`Ruffle Error: ${e.message}`);
                }
            } else {
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(loadRuffle, 100);
                } else {
                    setError("Ruffle failed to load. Please check internet connection.");
                }
            }
        };

        loadRuffle();
    }, [swfUrl]);

    if (error) {
        return (
            <div style={{ width, height, background: 'rgba(255,0,0,0.1)', color: 'red', fontSize: '10px', overflow: 'auto' }}>
                {error}
            </div>
        );
    }

    return (
        <div 
            ref={containerRef} 
            style={{ 
                width: width, 
                height: height,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }} 
        />
    );
};

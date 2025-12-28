import { useEffect, useState } from 'react';

interface LoadingScreenProps {
    onFinish: () => void;
    canFinish?: boolean;
}

export const ModernLoadingScreen = ({ onFinish, canFinish = true }: LoadingScreenProps) => {
    const [progress, setProgress] = useState(0);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Simulate loading process
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 99) return prev;
                const diff = Math.random() * 10;
                const next = prev + diff;
                
                return Math.min(next, 99);
            });
        }, 100);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!canFinish) return;
        if (isFading) return;
        if (progress < 99) return;

        setProgress(100);
        setIsFading(true);
        const t = setTimeout(onFinish, 1000);
        return () => clearTimeout(t);
    }, [canFinish, isFading, onFinish, progress]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            opacity: isFading ? 0 : 1,
            transition: 'opacity 1s ease-in-out',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
            <div style={{
                marginBottom: '40px',
                textAlign: 'center',
                animation: 'float 3s ease-in-out infinite'
            }}>
                <h1 style={{
                    fontSize: '3rem',
                    color: '#2d3436',
                    marginBottom: '10px',
                    fontWeight: '300',
                    letterSpacing: '5px'
                }}>REUNION</h1>
                <p style={{
                    color: '#636e72',
                    fontSize: '1rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                }}>Time Capsule</p>
            </div>

            <div style={{
                width: '300px',
                height: '4px',
                background: '#dfe6e9',
                borderRadius: '2px',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #0984e3, #00cec9)',
                    borderRadius: '2px',
                    transition: 'width 0.2s ease-out'
                }} />
            </div>

            <p style={{
                marginTop: '15px',
                color: '#b2bec3',
                fontSize: '0.8rem',
                fontStyle: 'italic'
            }}>
                {progress < 30 ? "Initializing memory banks..." :
                 progress < 60 ? "Recovering lost moments..." :
                 progress < 90 ? "Polishing the timeline..." :
                 "Ready to reunite."}
            </p>

            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </div>
    );
};

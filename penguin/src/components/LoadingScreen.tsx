import { useEffect, useState } from 'react';

interface LoadingScreenProps {
    onFinish: () => void;
}

export const LoadingScreen = ({ onFinish }: LoadingScreenProps) => {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("Initializing...");

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + 2;
                if (next > 30 && next < 60) setStatusText("Loading assets...");
                if (next > 60 && next < 90) setStatusText("Syncing memories...");
                if (next >= 100) {
                    clearInterval(timer);
                    setTimeout(onFinish, 800);
                    return 100;
                }
                return next;
            });
        }, 50);

        return () => clearInterval(timer);
    }, [onFinish]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#008080', // Windows 95 teal
            fontFamily: "'Courier New', Courier, monospace",
            color: 'white'
        }}>
            <div style={{ 
                border: '2px solid #dfdfdf',
                borderRightColor: '#404040',
                borderBottomColor: '#404040',
                padding: '2px', 
                width: '320px',
                backgroundColor: '#c0c0c0',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.3)'
            }}>
                <div style={{ 
                    backgroundColor: '#000080', // Title bar blue
                    color: 'white', 
                    padding: '2px 5px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <span>System Boot</span>
                    <span>X</span>
                </div>
                <div style={{ padding: '20px', color: 'black', textAlign: 'center' }}>
                    <p style={{ marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Reunion: Time Capsule</p>
                    <p style={{ marginBottom: '20px', fontSize: '12px' }}>{statusText}</p>
                    <div style={{
                        width: '100%',
                        height: '20px',
                        border: '2px solid #808080',
                        borderRightColor: 'white',
                        borderBottomColor: 'white',
                        padding: '1px',
                        backgroundColor: 'white'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            backgroundColor: '#000080',
                            transition: 'width 0.1s linear'
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

import { useEffect, useState } from 'react';
import { RESOURCES } from '../constants/resources';

interface DialogueBoxProps {
    text: string;
    onComplete?: () => void;
    speed?: number; // ms per char
}

export const DialogueBox = ({ text, onComplete, speed = 50 }: DialogueBoxProps) => {
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
        setDisplayedText('');
        let i = 0;
        const timer = setInterval(() => {
            i++;
            if (i <= text.length) {
                setDisplayedText(text.slice(0, i));
            } else {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed, onComplete]);

    return (
        <div 
            className="absolute left-1/2 -translate-x-1/2 z-50 animate-bounce-slight pointer-events-none"
            style={{
                // Adjusted position: move down significantly to account for empty space in SWF
                // Assuming 500px container and pet is at bottom, and ~400px empty space
                // Top of container is 0. Pet head is roughly at 400px down? 
                // Let's position it around top: 250px which is middle of container, or use bottom.
                // If the pet is at the bottom of the 500px box, and the empty space is at the top...
                // The visual pet is in the bottom 100-200px.
                // So the bubble should be around bottom: 200px or so.
                bottom: '250px', 
                width: '180px',
                minHeight: '90px',
                backgroundImage: `url(${RESOURCES.OTHER.DIALOG_BG})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                padding: '20px 20px 35px 20px', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
            }}
        >
            <p className="text-black text-xs font-bold leading-relaxed break-words w-full select-none">
                {displayedText}
            </p>
        </div>
    );
};

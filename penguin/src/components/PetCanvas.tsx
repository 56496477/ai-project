import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Stage, Container, Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';
import type { AnimationState } from '../types';

interface PetCanvasProps {
  animation: AnimationState;
}

// --- 2.5D Drawing Helpers ---
// We simulate 3D by drawing shapes with slight offsets and shading

const COLORS = {
  BODY: 0x2C3E50,
  BELLY: 0xFFFFFF,
  BEAK: 0xFFB900,
  BEAK_SHADOW: 0xE0A800,
  FOOT: 0xFFA500,
  FOOT_SHADOW: 0xCC8400,
  SCARF: 0xE74C3C,
  SCARF_SHADOW: 0xC0392B,
  CHEEK: 0xFFC0CB,
};

const drawPseudo3DBody = (g: PIXI.Graphics) => {
  g.clear();

  // Shadow (Ellipse at bottom)
  g.beginFill(0x000000, 0.2);
  g.drawEllipse(0, 95, 70, 15);
  g.endFill();

  // Feet (Back Layer) - Drawn first
  // Left Foot
  g.beginFill(COLORS.FOOT_SHADOW);
  g.drawEllipse(-45, 82, 28, 14); // Shadow part
  g.endFill();
  g.beginFill(COLORS.FOOT);
  g.drawEllipse(-45, 80, 28, 14); // Main part
  g.endFill();
  
  // Right Foot
  g.beginFill(COLORS.FOOT_SHADOW);
  g.drawEllipse(45, 82, 28, 14);
  g.endFill();
  g.beginFill(COLORS.FOOT);
  g.drawEllipse(45, 80, 28, 14);
  g.endFill();

  // Body (Main Shape) - Slightly egg-shaped
  // Draw subtle gradient/shading by layering
  g.beginFill(0x1a252f); // Darker shadow side
  g.drawEllipse(5, 5, 80, 90); // Offset shadow
  g.endFill();
  
  g.beginFill(COLORS.BODY);
  g.drawEllipse(0, 0, 80, 90);
  g.endFill();

  // Highlight on head (Glossy look)
  g.beginFill(0xFFFFFF, 0.1);
  g.drawEllipse(-20, -60, 20, 10); // Specular highlight
  g.endFill();

  // Belly (White patch)
  g.beginFill(0xEEEEEE); // Shadow
  g.drawEllipse(0, 28, 60, 55);
  g.endFill();
  g.beginFill(COLORS.BELLY);
  g.drawEllipse(0, 25, 60, 55);
  g.endFill();

  // Scarf
  // Wrap around neck
  g.beginFill(COLORS.SCARF_SHADOW);
  g.drawRoundedRect(-65, -15, 130, 20, 10);
  g.endFill();
  g.beginFill(COLORS.SCARF);
  g.drawRoundedRect(-65, -18, 130, 20, 10);
  g.endFill();
  
  // Scarf Tail
  g.beginFill(COLORS.SCARF_SHADOW);
  g.drawRoundedRect(35, -5, 20, 45, 5);
  g.endFill();
  g.beginFill(COLORS.SCARF);
  g.drawRoundedRect(32, -5, 20, 45, 5);
  g.endFill();
};

const drawWing = (g: PIXI.Graphics) => {
  g.clear();
  // Shadow
  g.beginFill(0x1a252f);
  g.drawEllipse(2, 22, 18, 35);
  g.endFill();
  
  // Main
  g.beginFill(COLORS.BODY);
  g.drawEllipse(0, 20, 18, 35);
  g.endFill();
};

const Penguin25D = ({ animation }: { animation: AnimationState }) => {
  const containerRef = useRef<PIXI.Container>(null);
  const leftWingRef = useRef<PIXI.Graphics>(null);
  const rightWingRef = useRef<PIXI.Graphics>(null);
  const faceRef = useRef<PIXI.Graphics>(null);
  const propsRef = useRef<PIXI.Graphics>(null);
  
  // State refs
  const stateRef = useRef({
    tick: 0,
    blinkTimer: 0,
    isBlinking: false,
    particles: [] as {x: number, y: number, vx: number, vy: number, life: number}[],
    animPhase: 0, // 0: Start, 1: Action, 2: End
    propPos: { x: 0, y: 0, r: 0 }, // Prop generic position
  });

  useEffect(() => {
    // Reset state on animation change
    stateRef.current.tick = 0;
    stateRef.current.animPhase = 0;
    stateRef.current.particles = [];
    stateRef.current.propPos = { x: 0, y: 0, r: 0 };
    
    const ticker = PIXI.Ticker.shared;
    
    const animate = (delta: number) => {
      stateRef.current.tick += 0.05 * delta;
      const t = stateRef.current.tick;
      const s = stateRef.current; // Shorthand
      
      // --- 1. Global Animation & Transforms ---
      if (containerRef.current) {
        const c = containerRef.current;
        c.rotation = 0;
        c.scale.set(1, 1);
        c.position.set(200, 250);

        if (animation === 'IDLE') {
          // Breathing
          c.scale.y = 1 + Math.sin(t * 1.5) * 0.02;
          c.scale.x = 1 - Math.sin(t * 1.5) * 0.01;
        } else if (animation === 'WALK') {
          // Play/Walk: Jump around excitedly
          const jumpH = Math.abs(Math.sin(t * 8)) * 30;
          c.position.y = 250 - jumpH;
          c.rotation = Math.sin(t * 8) * 0.1;
          c.scale.x = 1 + (jumpH > 5 ? -0.05 : 0.05); // Squash/Stretch
          c.scale.y = 1 + (jumpH > 5 ? 0.05 : -0.05);
        } else if (animation === 'JUMP') {
          c.position.y = 250 + Math.sin(t * 5) * -50;
          c.scale.x = 1 - Math.sin(t * 5) * 0.1;
        } else if (animation === 'SLEEP') {
          // Sleep pose
          c.position.y = 260; // Lower
          c.rotation = 0.1; // Tilt head
          c.scale.y = 1 + Math.sin(t * 0.8) * 0.02;
        } else if (animation === 'EAT') {
          // Complex Eat Sequence (4s duration approx t=0..12)
          if (t < 3) {
             // Phase 1: Anticipation (Lean back, open mouth)
             c.rotation = -0.15;
             c.scale.y = 1.05;
             c.scale.x = 0.95;
          } else if (t < 5) {
             // Phase 2: Catch (Lung forward)
             const p = (t - 3) / 2;
             c.rotation = -0.15 + p * 0.3;
             c.position.y = 250 - Math.sin(p * Math.PI) * 20;
             c.scale.x = 1 + Math.sin(p * Math.PI) * 0.1; // Stretch
          } else {
             // Phase 3: Chew (Bounce)
             c.scale.y = 1 + Math.sin(t * 15) * 0.04;
             c.scale.x = 1 - Math.sin(t * 15) * 0.03;
             c.position.y = 250;
             c.rotation = 0;
          }
        } else if (animation === 'SHOWER') {
          // 0-2s (t<6): Scrub
          // 2-3s (t<9): Rinse
          // 3-4s (t<12): Shake
          if (t < 6) {
             // Rubbing body
             c.rotation = Math.sin(t * 8) * 0.05;
             c.position.x = 200 + Math.sin(t * 4) * 5;
          } else if (t < 9) {
             // Rinse (Cower slightly)
             c.scale.y = 0.95;
             c.scale.x = 1.05;
             c.position.y = 255;
          } else {
             // Shake dry
             c.rotation = Math.sin(t * 30) * 0.1;
             c.scale.x = 1 + Math.sin(t * 30) * 0.05;
             c.position.y = 250;
          }
        } else if (animation === 'PLAY') {
           // Sequence:
           // t < 3: Ball falls in. Penguin looks.
           // t < 7.5: Penguin runs to ball.
           // t < 8.5: Kick.
           // t > 8.5: Celebrate.
           
           if (t < 3) {
              // Idle/Watch
              c.position.x = 120; // Start left
              c.scale.x = 1; // Face right
              c.rotation = 0;
           } else if (t < 7.5) {
              // Run right
              const progress = (t - 3) / 4.5;
              c.position.x = 120 + progress * 80; // Move to 200
              c.position.y = 250 - Math.abs(Math.sin(t * 12)) * 15; // Fast waddle
              c.rotation = Math.sin(t * 12) * 0.1;
           } else if (t < 8.5) {
               // Kick pose
               c.position.x = 200;
               c.position.y = 250;
               c.rotation = -0.3; // Lean back
               c.scale.x = 1.1; // Stretch leg (implied)
           } else {
              // Cheer
              c.rotation = 0;
              c.position.y = 250 - Math.abs(Math.sin(t * 10)) * 20;
              c.scale.y = 1 + Math.sin(t * 10) * 0.1;
              c.scale.x = 1 - Math.sin(t * 10) * 0.05;
           }
        }
      }

      // --- 2. Wings ---
      if (leftWingRef.current && rightWingRef.current) {
        const lw = leftWingRef.current;
        const rw = rightWingRef.current;
        
        lw.position.set(-70, -10);
        rw.position.set(70, -10);
        
        let wingAngle = 0.2;
        
        if (animation === 'PLAY') { 
           if (t >= 3 && t < 7.5) {
             wingAngle = 0.8 + Math.sin(t * 20) * 0.5; // Flap fast running
           } else if (t > 8.5) {
             wingAngle = 1.0 + Math.sin(t * 15) * 0.3; // Cheer
           }
        } else if (animation === 'SHOWER') {
           if (t < 6) {
             // Scrubbing motion
             lw.rotation = -0.5 + Math.sin(t * 10) * 0.3;
             rw.rotation = 0.5 - Math.sin(t * 10) * 0.3;
             lw.position.x = -60 + Math.sin(t * 10) * 5;
             rw.position.x = 60 - Math.sin(t * 10) * 5;
             return; 
           } else if (t >= 9) {
             // Shake
             wingAngle = 0.8 + Math.sin(t * 30) * 0.4;
           }
        } else if (animation === 'EAT') {
           if (t > 5) { // Chewing happy flap
             wingAngle = 0.4 + Math.sin(t * 20) * 0.2;
           }
        }
        
        lw.rotation = -wingAngle;
        rw.rotation = wingAngle;
      }

      // --- 3. Face (Dynamic 2.5D) ---
      if (faceRef.current) {
        const g = faceRef.current;
        g.clear();
        
        // Blink Logic
        stateRef.current.blinkTimer -= delta;
        if (stateRef.current.blinkTimer <= 0) {
          stateRef.current.isBlinking = !stateRef.current.isBlinking;
          stateRef.current.blinkTimer = stateRef.current.isBlinking ? 5 : 150 + Math.random() * 200;
        }
        
        // Override blink for expressions
        let isBlinking = stateRef.current.isBlinking || animation === 'SLEEP';
        let expression = 'NORMAL'; // NORMAL, HAPPY, SHOCK, EXCITED
        
        if (animation === 'EAT' && t > 5) {
           isBlinking = true; // Happy eyes closed
           expression = 'HAPPY';
        } else if (animation === 'SHOWER') {
           if (t < 9) {
             isBlinking = true; // Enjoying
             expression = 'HAPPY';
           } else {
             expression = 'SHOCK'; // Shaking
             isBlinking = false;
           }
        } else if (animation === 'PLAY') {
           if (t < 7.5) expression = 'EXCITED'; // Running
           else if (t < 8.5) expression = 'SHOCK'; // Kick focus
           else expression = 'HAPPY'; // Cheer
        }

        const eyeY = -45;
        const eyeX = 25;

        // Eyes (Whites)
        if (!isBlinking) {
           // Left Eye
           g.beginFill(0xDDDDDD); 
           g.drawEllipse(-eyeX, eyeY + 2, 20, 25);
           g.endFill();
           g.beginFill(0xFFFFFF);
           g.drawEllipse(-eyeX, eyeY, 20, 25);
           g.endFill();
           
           // Right Eye
           g.beginFill(0xDDDDDD);
           g.drawEllipse(eyeX, eyeY + 2, 20, 25);
           g.endFill();
           g.beginFill(0xFFFFFF);
           g.drawEllipse(eyeX, eyeY, 20, 25);
           g.endFill();

           // Pupils
           let pX = 0, pY = 0;
           if (animation === 'IDLE') {
              pX = Math.sin(t * 0.5) * 3;
           } else if (animation === 'EAT' && t < 5) {
              pY = -5; // Look up at food
           } else if (animation === 'PLAY') { // Watch ball
              if (t < 3) pX = 8; // Look right
              else if (t < 7.5) pX = 5; // Look fwd
              else pY = 5; // Look down at ball
           } else if (animation === 'SHOWER' && t >= 9) {
              // Shaking eyes go crazy
              pX = Math.sin(t * 50) * 5;
              pY = Math.cos(t * 50) * 5;
           }
           
           g.beginFill(0x000000);
           g.drawCircle(-eyeX + pX - 2, eyeY + pY, 7); 
           g.drawCircle(eyeX + pX - 2, eyeY + pY, 7);  
           g.endFill();

           // Highlights
           g.beginFill(0xFFFFFF);
           g.drawCircle(-eyeX + pX - 5, eyeY + pY - 4, 3);
           g.drawCircle(eyeX + pX - 5, eyeY + pY - 4, 3);
           g.endFill();
        } else {
           // Closed Eyes
           g.lineStyle(3, 0x000000);
           if (expression === 'HAPPY') {
             // ^ ^ eyes
             g.moveTo(-eyeX - 10, eyeY + 5);
             g.lineTo(-eyeX, eyeY - 5);
             g.lineTo(-eyeX + 10, eyeY + 5);
             
             g.moveTo(eyeX - 10, eyeY + 5);
             g.lineTo(eyeX, eyeY - 5);
             g.lineTo(eyeX + 10, eyeY + 5);
           } else if (expression === 'SHOCK') {
             // > < eyes
             g.moveTo(-eyeX - 10, eyeY - 5);
             g.lineTo(-eyeX, eyeY + 5);
             g.lineTo(-eyeX + 10, eyeY - 5);
             
             g.moveTo(eyeX - 10, eyeY + 5);
             g.lineTo(eyeX, eyeY - 5);
             g.lineTo(eyeX + 10, eyeY + 5);
           } else {
             // U U eyes (Sleep)
             g.moveTo(-eyeX - 10, eyeY);
             g.quadraticCurveTo(-eyeX, eyeY + 5, -eyeX + 10, eyeY);
             g.moveTo(eyeX - 10, eyeY);
             g.quadraticCurveTo(eyeX, eyeY + 5, eyeX + 10, eyeY);
           }
           g.lineStyle(0);
        }

        // Beak (2.5D Layered)
        g.beginFill(COLORS.BEAK_SHADOW);
        g.drawEllipse(0, -15, 18, 10);
        g.endFill();
        
        let beakOpen = 0;
        if (animation === 'EAT') {
           if (t < 3) beakOpen = 5; // Open waiting
           else if (t < 5) beakOpen = 12; // Wide open catch
           else beakOpen = Math.abs(Math.sin(t * 15)) * 5; // Chewing
        } else if (animation === 'PLAY') {
           if (t < 7.5) beakOpen = 5; // Panting
           else if (t > 8.5) beakOpen = 8; // Cheer
        }
        
        // Upper Beak
        g.beginFill(COLORS.BEAK);
        g.drawEllipse(0, -18 - beakOpen/2, 18, 8);
        g.endFill();
        // Highlight on beak
        g.beginFill(0xFFFFFF, 0.4);
        g.drawEllipse(-5, -20 - beakOpen/2, 6, 3);
        g.endFill();

        // Lower Beak (if open)
        if (beakOpen > 1) {
           g.beginFill(COLORS.BEAK);
           g.drawEllipse(0, -15 + beakOpen/2, 14, 6);
           g.endFill();
           
           // Tongue (visible when wide open)
           if (beakOpen > 8) {
             g.beginFill(0xFF6666);
             g.drawCircle(0, -12 + beakOpen/2, 4);
             g.endFill();
           }
        }

        // Cheeks
        if (expression === 'HAPPY' || animation === 'SHOWER') {
           g.beginFill(COLORS.CHEEK, 0.6);
           g.drawCircle(-50, -25, 12);
           g.drawCircle(50, -25, 12);
           g.endFill();
        }
      }

      // --- 4. Props (Dynamic) ---
      if (propsRef.current) {
        const g = propsRef.current;
        g.clear();

        if (animation === 'SLEEP') {
           // Zzz bubbles
           const zOffset = (t * 20) % 60;
           g.lineStyle(3, 0xFFFFFF);
           drawZ(g, 60, -80 - zOffset, 1 - zOffset/60);
           drawZ(g, 80, -50 - zOffset, 0.7 - zOffset/60);
           g.lineStyle(0);
        } else if (animation === 'EAT') {
           if (t < 5) {
             // Fish falling
             let fishY = -150 + t * 40; // Fall down
             if (fishY > -20) fishY = -20; // Stop at mouth roughly
             
             // If t > 4.8, fish disappears (eaten)
             if (t < 4.8) {
                g.beginFill(0x3498DB);
                g.drawEllipse(0, fishY, 25, 12); // Fish Body
                g.drawPolygon([-25, fishY, -35, fishY - 10, -35, fishY + 10]); // Tail
                g.endFill();
                g.beginFill(0xFFFFFF);
                g.drawCircle(-15, fishY - 2, 2);
                g.endFill();
             }
           }
        } else if (animation === 'SHOWER') {
           if (t < 9) {
              // Shower Head
              g.beginFill(0x95A5A6);
              g.drawRect(-30, -180, 60, 10); // Pipe
              g.drawEllipse(0, -170, 40, 10); // Head
              g.endFill();
              
              // Water drops
              if (Math.random() < 0.3) {
                s.particles.push({
                  x: (Math.random() - 0.5) * 60,
                  y: -170,
                  vx: 0,
                  vy: 5 + Math.random() * 5,
                  life: 1.0
                });
              }
              // Bubbles (Only in first phase)
              if (t < 6 && Math.random() < 0.1) {
                 s.particles.push({
                   x: (Math.random() - 0.5) * 80,
                   y: 50 + (Math.random() - 0.5) * 50,
                   vx: (Math.random() - 0.5),
                   vy: -1 - Math.random(),
                   life: 1.5
                 });
              }
              
              // Draw particles
              s.particles = s.particles.filter(p => p.life > 0 && p.y < 200);
              s.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.vy > 0) {
                   // Water drop
                   g.beginFill(0x3498DB, 0.6);
                   g.drawCircle(p.x, p.y, 3);
                   g.endFill();
                } else {
                   // Bubble
                   p.life -= 0.02;
                   g.lineStyle(1, 0xFFFFFF, p.life);
                   g.drawCircle(p.x, p.y, 5 * p.life);
                   g.lineStyle(0);
                }
              });
           } else {
              // Shake phase: Water drops flying off
              if (Math.random() < 0.5) {
                 g.beginFill(0x3498DB, 0.6);
                 const r = 60 + Math.random() * 20;
                 const ang = Math.random() * Math.PI * 2;
                 g.drawCircle(Math.cos(ang) * r, Math.sin(ang) * r, 2);
                 g.endFill();
              }
           }
        } else if (animation === 'PLAY') { 
           // Ball Position relative to center
           // Penguin is at c.position
           // We need to draw ball in props (attached to container? Yes propsRef is inside Container)
           // If propsRef is inside Container, it moves WITH penguin.
           // WAIT. propsRef is inside Container.
           // If I want ball to be independent, I should counter-translate it?
           // OR: I should move penguin and ball separately.
           // Currently logic moves `c` (Container). So `propsRef` moves with `c`.
           // If penguin moves to x=200, propsRef moves to x=200.
           // So if ball is at absolute x=300, and penguin is at x=200.
           // Props coord: 100.
           
           const penguinX = containerRef.current?.position.x || 200;
           // We need absolute coordinates logic, then convert to relative.
           
           let absBallX = 300;
           let absBallY = 250;
           
           if (t < 3) { // 0-1s (t=0..3)
              absBallX = 300; 
              absBallY = 250 - Math.abs(Math.cos(t * 3)) * 100 * Math.exp(-t*0.5); 
              if (absBallY > 250) absBallY = 250;
           } else if (t < 7.5) { // 1-2.5s (t=3..7.5)
              absBallX = 300 - (t-3) * 10; 
              absBallY = 250;
           } else { // Kick!
              const kt = t - 7.5;
              absBallX = 250 - kt * 30; 
              absBallY = 250 - kt * 30 + kt*kt*2; 
           }
           
           // Convert to relative (Container is at penguinX, 250)
           // But penguinY also changes!
           const penguinY = containerRef.current?.position.y || 250;
           
           const relX = absBallX - penguinX; // If penguin is at 200, ball at 300 -> rel 100. Correct.
           const relY = absBallY - penguinY; // If penguin is at 250, ball at 250 -> rel 0. Correct.
           
           // Adjust for coordinate system (Container is [200, 250] in Stage? No.)
           // Stage center is 50%, 50%.
           // Container position is set in animate: c.position.set(...)
           // The Container is rendered at [200, 250] initially but `animate` overrides it.
           // So `relX` is relative to the `Graphics` origin (0,0) inside the Container.
           
           // BUT wait. `Container` is `position={[200, 250]}` in JSX.
           // `animate` sets `c.position.set(...)`.
           // So `c` moves in the Stage.
           // `propsRef` is inside `c`.
           // So `propsRef` origin is `c.position`.
           
           // My `relX` calculation assumes `penguinX` is the container's x.
           // Yes.
           
           g.beginFill(0xFFFFFF);
           g.drawCircle(relX, relY, 15);
           g.endFill();
           // Ball patterns
           g.beginFill(0x333333);
           g.drawPolygon([
              relX, relY - 15, 
              relX + 10, relY - 5,
              relX + 6, relY + 10,
              relX - 6, relY + 10,
              relX - 10, relY - 5
           ]);
           g.endFill();
        }
      }
    };

    ticker.add(animate);
    return () => {
      ticker.remove(animate);
    };
  }, [animation]);

  return (
    <Container ref={containerRef} position={[200, 250]}>
      {/* Back Wing - Left wing behind body for depth */}
      <Graphics ref={leftWingRef} draw={drawWing} />
      
      {/* Main Body */}
      <Graphics draw={drawPseudo3DBody} />
      
      {/* Front Wing - Right wing in front */}
      <Graphics ref={rightWingRef} draw={drawWing} />
      
      {/* Face & Props on top */}
      <Graphics ref={faceRef} />
      <Graphics ref={propsRef} />
    </Container>
  );
};

// Helper for drawing 'Z'
const drawZ = (g: PIXI.Graphics, x: number, y: number, alpha: number) => {
   g.lineStyle(3, 0xFFFFFF, alpha);
   const s = 15;
   g.moveTo(x, y);
   g.lineTo(x + s, y);
   g.lineTo(x, y + s);
   g.lineTo(x + s, y + s);
   g.lineStyle(0);
};

const PetCanvas: React.FC<PetCanvasProps> = ({ animation }) => {
  return (
    <Stage 
      width={400} 
      height={500} 
      options={{ backgroundAlpha: 0, antialias: true, resolution: 2 }} // High res for crisp look
      style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      <Penguin25D animation={animation} />
    </Stage>
  );
};

export default PetCanvas;

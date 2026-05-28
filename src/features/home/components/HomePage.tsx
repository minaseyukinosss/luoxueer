"use client";

import { type MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ANIMATION_CONFIG, PARTICLE_POSITIONS } from "@/features/home/constants/animations";
import type { MousePosition, ParticleSetter } from "@/features/home/types/particle";
import "@/features/home/styles/home-page.css";

export default function HomePage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const particleSettersRef = useRef<ParticleSetter[]>([]);

  const handleMouseMove = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    const mousePosition: MousePosition = {
      x: event.clientX,
      y: event.clientY,
    };

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    particleSettersRef.current.forEach((setter, index) => {
      const multiplier = ANIMATION_CONFIG.PARTICLE.BASE_MULTIPLIER + index * ANIMATION_CONFIG.PARTICLE.INCREMENT;
      setter.setX((mousePosition.x - centerX) * multiplier);
      setter.setY((mousePosition.y - centerY) * multiplier);
    });
  }, []);

  const createRipple = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    const ripple = document.createElement("div");
    ripple.className = "ripple-effect";
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    document.body.appendChild(ripple);

    gsap.fromTo(
      ripple,
      { scale: ANIMATION_CONFIG.RIPPLE.SCALE_FROM, opacity: 1 },
      {
        scale: ANIMATION_CONFIG.RIPPLE.SCALE_TO,
        opacity: 0,
        duration: ANIMATION_CONFIG.RIPPLE.DURATION,
        ease: ANIMATION_CONFIG.RIPPLE.EASE,
        onComplete: () => ripple.remove(),
      },
    );
  }, []);

  useEffect(() => {
    const initializeParticles = () => {
      if (mainRef.current) {
        const particles = mainRef.current.querySelectorAll(".particle");
        particles.forEach((particle, index) => {
          const setX = gsap.quickTo(particle, "x", {
            duration: ANIMATION_CONFIG.PARTICLE.DURATION,
            ease: ANIMATION_CONFIG.PARTICLE.EASE,
          });
          const setY = gsap.quickTo(particle, "y", {
            duration: ANIMATION_CONFIG.PARTICLE.DURATION,
            ease: ANIMATION_CONFIG.PARTICLE.EASE,
          });
          particleSettersRef.current[index] = { setX, setY };
        });
      }
    };

    const initializeTextAnimations = () => {
      const greetingTexts = document.querySelectorAll(".greeting-container .info-text");
      if (greetingTexts.length > 0) {
        gsap.fromTo(
          greetingTexts,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: ANIMATION_CONFIG.TEXT_ENTRANCE.GREETING.DURATION,
            stagger: ANIMATION_CONFIG.TEXT_ENTRANCE.GREETING.STAGGER,
            ease: ANIMATION_CONFIG.TEXT_ENTRANCE.GREETING.EASE,
          },
        );
      }

      const nameTexts = document.querySelectorAll(".name-container .info-text");
      if (nameTexts.length > 0) {
        gsap.fromTo(
          nameTexts,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: ANIMATION_CONFIG.TEXT_ENTRANCE.NAME.DURATION,
            delay: ANIMATION_CONFIG.TEXT_ENTRANCE.NAME.DELAY,
            ease: ANIMATION_CONFIG.TEXT_ENTRANCE.NAME.EASE,
          },
        );
      }

      const wishesTexts = document.querySelectorAll(".wishes-container .info-text");
      if (wishesTexts.length > 0) {
        gsap.fromTo(
          wishesTexts,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: ANIMATION_CONFIG.TEXT_ENTRANCE.WISHES.DURATION,
            delay: ANIMATION_CONFIG.TEXT_ENTRANCE.WISHES.DELAY,
            stagger: ANIMATION_CONFIG.TEXT_ENTRANCE.WISHES.STAGGER,
            ease: ANIMATION_CONFIG.TEXT_ENTRANCE.WISHES.EASE,
          },
        );
      }
    };

    const initializeHoverEffects = () => {
      const allTexts = document.querySelectorAll(".info-text");
      if (allTexts.length === 0) return;

      const cleanupCallbacks: Array<() => void> = [];

      allTexts.forEach((text) => {
        const handleMouseEnter = () => {
          gsap.to(text, {
            scale: ANIMATION_CONFIG.HOVER.SCALE,
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: ANIMATION_CONFIG.HOVER.EASE,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(text, {
            scale: 1,
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: ANIMATION_CONFIG.HOVER.EASE,
          });
        };

        text.addEventListener("mouseenter", handleMouseEnter);
        text.addEventListener("mouseleave", handleMouseLeave);
        cleanupCallbacks.push(() => {
          text.removeEventListener("mouseenter", handleMouseEnter);
          text.removeEventListener("mouseleave", handleMouseLeave);
        });
      });

      return () => cleanupCallbacks.forEach((cleanup) => cleanup());
    };

    initializeParticles();
    initializeTextAnimations();
    const cleanupHoverEffects = initializeHoverEffects();

    return () => {
      cleanupHoverEffects?.();
    };
  }, []);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden font-['Poppins'] bg-gradient-to-br from-[#ecfcff] via-[#a6efff] to-[#a6efff]"
      ref={mainRef} 
      onMouseMove={handleMouseMove} 
      onClick={createRipple}
    >
      <div className="flex flex-col justify-center items-center h-screen mx-[10%] relative z-[2]">
        <div className="flex flex-col justify-center items-center h-[80%] gap-8">
          <div className="absolute w-full h-full pointer-events-none z-[1]">
            {PARTICLE_POSITIONS.map((_, index) => (
              <div key={index} className="particle" />
            ))}
          </div>
          
          <div className="flex flex-col items-center gap-2 page-transition-element">
            <span className="info-text primary">HAPPY<span>WISH</span></span>
            <span className="info-text primary">BIRTHDAY<span>HEALTH</span></span>
          </div>
          
          <div className="flex flex-col items-center my-4 page-transition-element">
            <span className="info-text highlight">LUNA XUEYI<span>SUCCESS</span></span>
          </div>
          
          <div className="flex flex-col items-center gap-3 page-transition-element">
            <span className="info-text secondary">BRIGHT FUTURE<span>WEALTHY</span></span>
            <span className="info-text secondary">HAPPINESS<span>FOREVER</span></span>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-screen h-screen">
        <Image
          src="/images/home/home-portrait.webp"
          alt="Birthday Image"
          fill
      style={{ objectFit: "cover" }}
          priority
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-full z-[1] bg-gradient-to-t from-black/20 to-black/20"></div>
    </div>
  );
}

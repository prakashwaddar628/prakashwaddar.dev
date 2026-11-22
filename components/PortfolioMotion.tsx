"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PortfolioMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const glow = document.querySelector<HTMLElement>(".pointer-glow");
    const progress = document.querySelector<HTMLElement>(".scroll-progress");
    const root = document.documentElement;
    let frame = 0;
    let x = 0, y = 0, targetX = 0, targetY = 0, vx = 0, vy = 0;
    let following = false;
    let scrollChanged = true;
    let pointerTarget: Element | null = null;
    let pointerChanged = false;
    let active: HTMLElement | null = null;
    let hero: HTMLElement | null = null;

    function reset(element: HTMLElement | null) {
      for (const name of ["--rx", "--ry", "--mx", "--my"]) element?.style.removeProperty(name);
    }

    function draw() {
      frame = 0;
      if (scrollChanged && progress) {
        const distance = root.scrollHeight - window.innerHeight;
        const ratio = distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0;
        progress.style.transform = `scaleX(${ratio})`;
        scrollChanged = false;
      }
      if (!following || !glow) return;
      if (pointerChanged) updateHover();
      vx = (vx + (targetX - x) * .12) * .72;
      vy = (vy + (targetY - y) * .12) * .72;
      x += vx;
      y += vy;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(targetX - x) + Math.abs(targetY - y) + Math.abs(vx) + Math.abs(vy) > .2) schedule();
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function scheduleProgress() {
      scrollChanged = true;
      schedule();
    }

    function clearPointer() {
      following = false;
      pointerChanged = false;
      pointerTarget = null;
      vx = vy = 0;
      glow?.classList.remove("visible");
      reset(active);
      reset(hero);
      active = hero = null;
    }

    function move(event: PointerEvent) {
      if (!motion.matches || !pointer.matches || event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!following) {
        x = targetX;
        y = targetY;
        following = true;
        glow?.classList.add("visible");
      }
      pointerTarget = event.target instanceof Element ? event.target : null;
      pointerChanged = true;
      schedule();
    }

    function updateHover() {
      pointerChanged = false;
      const next = pointerTarget?.closest<HTMLElement>("[data-tilt], [data-magnetic]") ?? null;
      const nextHero = pointerTarget?.closest<HTMLElement>(".hero") ?? null;
      if (next !== active) reset(active);
      if (nextHero !== hero) reset(hero);
      active = next;
      hero = nextHero;
      for (const element of [active, hero]) {
        if (!element) continue;
        const box = element.getBoundingClientRect();
        const dx = Math.max(-.5, Math.min(.5, (targetX - box.left) / box.width - .5));
        const dy = Math.max(-.5, Math.min(.5, (targetY - box.top) / box.height - .5));
        element.style.setProperty("--mx", `${dx * 22}px`);
        element.style.setProperty("--my", `${dy * 22}px`);
        element.style.setProperty("--rx", `${-dy * 9}deg`);
        element.style.setProperty("--ry", `${dx * 9}deg`);
      }
    }

    const observer = new IntersectionObserver(entries => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        // Content stays visible before the observer runs or if JavaScript is unavailable.
        if (motion.matches) target.animate(
          [{ opacity: .4, transform: "translateY(20px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 620, easing: "cubic-bezier(.2,.7,.2,1)" },
        );
        observer.unobserve(target);
      }
    }, { threshold: .12 });

    document.querySelectorAll("[data-reveal]").forEach(element => observer.observe(element));
    window.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", clearPointer);
    window.addEventListener("blur", clearPointer);
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress);
    motion.addEventListener("change", clearPointer);
    pointer.addEventListener("change", clearPointer);
    const resize = new ResizeObserver(scheduleProgress);
    resize.observe(document.body);
    schedule();

    return () => {
      observer.disconnect();
      resize.disconnect();
      clearPointer();
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", clearPointer);
      window.removeEventListener("blur", clearPointer);
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
      motion.removeEventListener("change", clearPointer);
      pointer.removeEventListener("change", clearPointer);
    };
  }, [pathname]);

  return <><div aria-hidden="true" className="pointer-glow" /><div aria-hidden="true" className="scroll-progress" /></>;
}

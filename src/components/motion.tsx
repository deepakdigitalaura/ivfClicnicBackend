"use client";
import * as React from "react";
import Image from "next/image";
import { useEdit } from "@/components/editor/edit-context";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  type Variants,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- Reveal ---------- */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as: As = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: any;
}) {
  // Memoize so a parent re-render doesn't create a new component type
  // (which would remount this subtree and replay the entrance animation).
  const MotionAs = React.useMemo(() => motion.create(As as any), [As]);
  // In the inline editor, selecting/editing re-renders the whole page tree, and
  // framer's `whileInView`+`once` then reverts any now-off-screen section to its
  // hidden initial state (opacity:0) without re-revealing it — content "vanishes".
  // (Verified: editing leaves ~15 off-screen heading <em>s at opacity 0.) So we
  // render statically visible while editing. The public site keeps the animation
  // (no provider → editing false → byte-identical). Trade-off: the editor has no
  // scroll-in animation, but the layout/design/content is identical to the live site.
  if (useEdit()?.editMode) {
    return <As className={className}>{children}</As>;
  }
  return (
    <MotionAs
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className={className}
    >
      {children}
    </MotionAs>
  );
}

/* ---------- Stagger ---------- */
export const Stagger = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}>(function Stagger({ children, className, stagger = 0.08, delay = 0 }, ref) {
  // See Reveal: static in the editor so a re-render can't strand off-screen cards
  // at opacity:0. Public unchanged (byte-identical).
  if (useEdit()?.editMode) {
    return <div ref={ref} className={className}>{children}</div>;
  }
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

const childVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  // See Reveal/Stagger: visible-by-default in the editor (no hidden variant).
  if (useEdit()?.editMode) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div variants={childVariants} className={className}>
      {children}
    </motion.div>
  );
}

/* ---------- Word reveal headline ---------- */
export function WordReveal({
  text,
  className,
  accentClass = "",
  italicWord,
}: {
  text: string;
  className?: string;
  accentClass?: string;
  italicWord?: string;
}) {
  const words = text.split(" ");
  return (
    <motion.h1
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
      className={className}
    >
      {words.map((w, i) => {
        const isAccent = italicWord && w.toLowerCase().includes(italicWord.toLowerCase());
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom pr-[0.25em] pb-[0.2em] -mb-[0.2em]">
            <motion.span
              variants={{
                hidden: { y: "125%", opacity: 0 },
                show: { y: "0%", opacity: 1, transition: { duration: 0.9, ease: EASE } },
              }}
              className={`inline-block ${isAccent ? accentClass : ""}`}
            >
              {w}
            </motion.span>
          </span>
        );
      })}
    </motion.h1>
  );
}

/* ---------- Parallax image scale ---------- */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  ratio = "aspect-[4/5]",
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 45vw",
  editPath,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  ratio?: string;
  /** Set on above-the-fold LCP images so Next preloads them (no lazy). */
  priority?: boolean;
  sizes?: string;
  /** In the inline editor, makes this image click-to-replace (the CMS dot-path
   *  the upload writes to). Ignored on the public site. */
  editPath?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.04]);
  const ctx = useEdit();
  const editing = !!ctx?.editMode && !!editPath;
  // Box is statically sized (ratio) → reserves layout space (no CLS). The
  // parallax transform animates an inner layer only; next/image with `fill`
  // + explicit `sizes` gives a srcset and, when priority, a preload for LCP.
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${ratio} ${className ?? ""}${editing ? " bfi-editable bfi-editable-img" : ""}`}
      {...(editing
        ? {
            "data-edit-path": editPath,
            "data-bfi-selected": ctx!.selected === editPath ? "true" : undefined,
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              ctx!.select(editPath!, "image");
            },
          }
        : {})}
    >
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${imgClassName ?? ""}`}
        />
      </motion.div>
    </div>
  );
}

/* ---------- Magnetic Button ---------- */
export function Magnetic({
  children,
  className,
  strength = 16,
  onClick,
  as: As = "button",
  href,
  target,
  rel,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  as?: any;
  href?: string;
  target?: string;
  rel?: string;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 20 });
  const y = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    x.set((mx / r.width) * strength);
    y.set((my / r.height) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };

  const MotionTag = React.useMemo(() => motion.create(As as any), [As]);
  return (
    <MotionTag
      ref={ref as any}
      href={href}
      target={target}
      rel={rel}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      style={{ x, y }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/* ---------- Animated counter ---------- */
export function Counter({ to, suffix = "", duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref} className="whitespace-nowrap">
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ---------- Marquee ---------- */
export function Marquee({
  children,
  speed = 40,
  className,
  fadeColor,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  fadeColor?: string;
}) {
  const from = fadeColor ?? "var(--ivory)";
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <div
        className="flex w-max gap-12 animate-[marquee_var(--d)_linear_infinite]"
        style={{ ["--d" as any]: `${speed}s` }}
      >
        <div className="flex shrink-0 items-center gap-12">{children}</div>
        <div className="flex shrink-0 items-center gap-12" aria-hidden>{children}</div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24" style={{ background: `linear-gradient(to right, ${from}, transparent)` }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24" style={{ background: `linear-gradient(to left, ${from}, transparent)` }} />
    </div>
  );
}

/* ---------- Scroll-rotating element ---------- */
export function ScrollRotate({
  children,
  className,
  range = 120,
}: {
  children: React.ReactNode;
  className?: string;
  range?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-range / 2, range / 2]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.04, 0.96]);
  return (
    <motion.div ref={ref} style={{ rotate, scale }} className={className}>
      {children}
    </motion.div>
  );
}

/* ---------- Tilt / lift card wrapper ---------- */
export function LiftCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Floating element ---------- */
export function Float({
  children,
  className,
  amplitude = 8,
  duration = 5,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Hero background gradient blobs ---------- */
export function GradientField({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="absolute -top-32 -right-20 h-[36rem] w-[36rem] rounded-full bg-[color:var(--rose)]/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-24 h-[30rem] w-[30rem] rounded-full bg-[color:var(--plum)]/20 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[color:var(--gold)]/15 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import { BookOpen, Dna } from "lucide-react";
import { cn } from "@/lib/utils";

const LOADING_DURATION_MS = 2000;
const TILT_MAX = 4;

export function AnimatedAICard() {
  const [phase, setPhase] = useState<"loading" | "content">("loading");
  const [progress, setProgress] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = (e.clientX - cx) / (rect.width / 2);
    const y = (e.clientY - cy) / (rect.height / 2);
    targetTiltRef.current = {
      x: Math.max(-TILT_MAX, Math.min(TILT_MAX, -y * TILT_MAX)),
      y: Math.max(-TILT_MAX, Math.min(TILT_MAX, x * TILT_MAX)),
    };
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        setTilt(targetTiltRef.current);
      });
    }
  }, []);
  const onMouseLeave = useCallback(() => {
    targetTiltRef.current = { x: 0, y: 0 };
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setTilt({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(100, (elapsed / LOADING_DURATION_MS) * 100);
      setProgress(p);
      if (p < 100) {
        requestAnimationFrame(tick);
      } else {
        setPhase("content");
      }
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative w-full max-w-[min(550px,88vw)] h-[min(460px,65vh)] rounded-[22px] overflow-hidden",
        "bg-[hsl(220,18%,10%)] border border-emerald-500/20",
        "shadow-[0_0_0_1px_hsl(160_50%_40%/0.08),0_8px_32px_-8px_hsl(0_0%_0%/0.4),0_0_60px_-12px_hsl(160_50%_45%/0.15)]",
        "transition-shadow duration-300 hover:shadow-[0_0_0_1px_hsl(160_50%_40%/0.12),0_8px_40px_-8px_hsl(0_0%_0%/0.45),0_0_80px_-12px_hsl(160_50%_45%/0.2)]",
        "hover:border-emerald-500/30"
      )}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {phase === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 animate-fade-in">
          <p className="text-sm font-medium text-white/90 mb-4">Generating notes…</p>
          <div className="w-full max-w-[280px] h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full w-0 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 animate-progress-fill"
              style={{ animationDuration: `${LOADING_DURATION_MS}ms` }}
            />
          </div>
          <p className="text-xs text-white/50 mt-3 tabular-nums">{Math.round(progress)}%</p>
        </div>
      )}

      {phase === "content" && (
        <div className="absolute inset-0 flex flex-col animate-fade-in" style={{ animationDuration: "500ms" }}>
          <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
              <h3 className="text-base font-semibold text-white">Lecture 5: Cellular Biology</h3>
            </div>
          </div>
          <div
            className={cn(
              "flex-1 overflow-y-auto overflow-x-hidden px-5 py-4",
              "scrollbar-hero"
            )}
          >
            <p className="text-sm text-white/80 leading-relaxed mb-4">
              Cell theory is the foundation of modern biology. It describes the basic structural and functional unit of all living organisms.
            </p>
            <ul className="text-sm text-white/75 space-y-2 mb-4 list-disc list-inside">
              <li>All living organisms are composed of one or more cells.</li>
              <li>The cell is the basic unit of structure and organization in organisms.</li>
              <li>Cells arise from pre-existing cells.</li>
            </ul>
            <div className="flex items-center gap-2 mb-3">
              <Dna className="w-4 h-4 text-emerald-400 shrink-0" />
              <h4 className="text-sm font-semibold text-white">Types of Cells</h4>
            </div>
            <p className="text-sm text-white/75 leading-relaxed mb-4">
              Prokaryotic cells (e.g. bacteria) lack a nucleus; DNA is in the cytoplasm. Eukaryotic cells have a membrane-bound nucleus and organelles. 🧬
            </p>
            <div className="rounded-lg border border-white/10 overflow-hidden mb-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-white/5">
                    <th className="text-left py-2 px-3 text-white/80 font-medium">Feature</th>
                    <th className="text-left py-2 px-3 text-white/80 font-medium">Prokaryotic</th>
                    <th className="text-left py-2 px-3 text-white/80 font-medium">Eukaryotic</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-t border-white/10">
                    <td className="py-2 px-3">Nucleus</td>
                    <td className="py-2 px-3">No membrane-bound nucleus</td>
                    <td className="py-2 px-3">Membrane-bound nucleus</td>
                  </tr>
                  <tr className="border-t border-white/10">
                    <td className="py-2 px-3">Organelles</td>
                    <td className="py-2 px-3">Few or none</td>
                    <td className="py-2 px-3">Many (mitochondria, ER, etc.)</td>
                  </tr>
                  <tr className="border-t border-white/10">
                    <td className="py-2 px-3">Size</td>
                    <td className="py-2 px-3">Typically 0.1–5 µm</td>
                    <td className="py-2 px-3">Typically 10–100 µm</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h4 className="text-sm font-semibold text-white mb-2">Key organelles</h4>
            <p className="text-sm text-white/75 leading-relaxed mb-4">
              Mitochondria produce ATP (energy). Chloroplasts carry out photosynthesis in plants. The endoplasmic reticulum and Golgi are involved in protein and lipid transport.
            </p>
            <h4 className="text-sm font-semibold text-white mb-2">Summary</h4>
            <p className="text-sm text-white/75 leading-relaxed mb-4">
              Understanding cell types and structures is essential for genetics, physiology, and disease. 📋
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

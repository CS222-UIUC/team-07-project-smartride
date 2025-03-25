import { useEffect, useState } from "react";
import cycleAnim from "../../assets/cycle_anim.gif";
import cycleLast from "../../assets/cycle_last_frame.png";
import cycleLastTrp from "../../assets/cycle_trp.png";

const AnimLogo = ({ onFinish }: { onFinish: () => void }) => {
  const [step, setStep] = useState<"anim" | "fadeout">("anim");
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const loopCount = 2;
    const oneLoopDuration = 800; // in ms
    const totalDuration = loopCount * oneLoopDuration; // 6400ms = 6.4s

    const t1 = setTimeout(() => {
      setStep("fadeout");
      // Let one frame render before starting fade
      requestAnimationFrame(() => setFade(true));
    }, totalDuration);

    const t2 = setTimeout(() => {
      onFinish();
    }, totalDuration/2);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish]);

  return (
    <div className="aspect-square w-full rounded-full flex items-center justify-center overflow-hidden relative shadow-lg">
      {step === "anim" && (
        <img
          src={cycleAnim}
          alt="Cycling animation"
          className="w-full h-full object-cover"
        />
      )}

      {step === "fadeout" && (
        <>
          {/* Transparent background image */}
          <img
            src={cycleLastTrp}
            alt="Transparent background"
            className="w-full h-full object-cover absolute top-0 left-0"
          />

          {/* Full image fading out */}
          <img
            src={cycleLast}
            alt="Full cyclist"
            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ${
              fade ? "opacity-0" : "opacity-100"
            }`}
          />
        </>
      )}
    </div>
  );
};

export default AnimLogo;

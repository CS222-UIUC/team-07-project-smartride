import { useEffect, useState } from "react";
import cycleAnim from "../../assets/cycle_anim.gif";
import cycleLast from "../../assets/cycle_last_frame.png";
import cycleLastTrp from "../../assets/cycle_trp.png";

const AnimLogo = ({ onFinish }: { onFinish: () => void }) => {
  const [step, setStep] = useState<"anim" | "fadeout">("anim");
  const [fade, setFade] = useState(false);

  const loopCount = 2;
  const oneLoopDuration = 800; // in ms
  const animDuration = loopCount * oneLoopDuration; // 6400ms = 6.4s
  const fadeDuration = animDuration * 0.6;

  useEffect(() => {

    const t1 = setTimeout(() => {
      setStep("fadeout");
      // Let one frame render before starting fade
      requestAnimationFrame(() => setFade(true));
    }, animDuration);

    const t2 = setTimeout(() => {
      onFinish();
    }, fadeDuration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish, animDuration, fadeDuration]);

  return (
    <div className="aspect-square w-full rounded-full flex items-center justify-center overflow-hidden relative shadow-lg p-6">
          
      {step === "anim" && (
        <img
          src={cycleAnim}
          alt="Cycling animation"
          className="w-full h-full object-cover absolute bottom-6 left-0 z-10"
        />
      )}

      {step === "fadeout" && (
        <>
          {/* Transparent background image */}
          <img
            src={cycleLastTrp}
            alt="Transparent background"
            className="w-full h-full object-cover absolute bottom-6 left-0 z-10"
          />

          {/* Full image fading out */}
          <img
            src={cycleLast}
            alt="Full cyclist"
            style={{ transition: `opacity ${fadeDuration}ms ease-in-out` }}
            className={`w-full h-full object-cover absolute bottom-6 left-0 transition-opacity z-10 ${
              fade ? "opacity-0" : "opacity-100"
            }`}
          />
        </>
      )}
      <div className="absolute bottom-0 left-0 w-full h-[8%] bg-white z-0" />
    </div>
  );
};

export default AnimLogo;

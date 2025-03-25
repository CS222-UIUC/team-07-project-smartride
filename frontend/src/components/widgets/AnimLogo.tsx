import { useEffect, useState } from "react";
import cycleAnim from "../../assets/cycle_anim.gif";
import cycleLast from "../../assets/cycle_last_frame.png";
import cycleLastTrp from "../../assets/cycle_trp.png";

interface AnimLogoProps {
  animDuration: number;
  fadeDuration: number;
  onFinish: () => void;
}

const AnimLogo = ({ animDuration, fadeDuration, onFinish }: AnimLogoProps) => {
  const [step, setStep] = useState<"anim" | "fadeout">("anim");
  const [fade, setFade] = useState(false);
  const [circleIn, setCircleIn] = useState(false); // for future animation
  const [finalPosition, setFinalPosition] = useState(false);

  useEffect(() => {
    const tMid = setTimeout(() => {
      setCircleIn(true);
      requestAnimationFrame(() => setFinalPosition(true));
    }, animDuration / 2);

    const t1 = setTimeout(() => {
      setStep("fadeout");
      requestAnimationFrame(() => setFade(true));
    }, animDuration);
    const t2 = setTimeout(() => {
      onFinish();
    }, animDuration + fadeDuration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(tMid);
    };
  }, [onFinish, animDuration, fadeDuration]);

  return (
    <div
      className={`
    aspect-square w-full max-w-[220px] overflow-hidden relative flex items-center justify-center
    transition-all duration-700 ease-in-out
    ${
      circleIn ? "rounded-full bg-green-800 shadow-lg" : "rounded-none bg-white"
    }
    ${finalPosition ? "scale-100 -translate-y-8" : "scale-125 translate-y-0"}
  `}
    >
      {/* Layers below stay the same */}

      {step === "anim" && (
        <img
          src={cycleAnim}
          alt="Cycling animation"
          className="w-full h-full object-cover absolute bottom-6 left-0 z-10"
        />
      )}

      {step === "fadeout" && (
        <>
          <img
            src={cycleLastTrp}
            alt="Transparent background"
            className="w-full h-full object-cover absolute bottom-6 left-0 z-10"
          />
          <img
            src={cycleLast}
            alt="Full cyclist"
            style={{ transition: `opacity ${fadeDuration}ms ease-in-out` }}
            className={`w-full h-full object-cover absolute bottom-6 left-0 z-10 ${
              fade ? "opacity-0" : "opacity-100"
            }`}
          />
        </>
      )}

      {/* White base rectangle filler */}
      <div className="absolute bottom-0 left-0 w-full h-[15%] bg-white z-0" />
    </div>
  );
};

export default AnimLogo;

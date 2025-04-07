import { useNavigate } from "react-router-dom";
import AnimLogo from "@/components/widgets/AnimLogo.tsx";
import { useEffect, useState } from "react";
import { useAuthCheck } from "@/api/web/auth.ts";

const LoadPage = () => {
  const loopCount = 2;
  const oneLoopDuration = 800;
  const animDuration = loopCount * oneLoopDuration;
  const fadeDuration = animDuration * 0.6;
  const liftDuration = animDuration * 0.5;

  const [logoLifted, setLogoLifted] = useState(false);
  const [startTimers, setStartTimers] = useState(false);

  const isLoggedIn = useAuthCheck();
  const navigate = useNavigate();

  useEffect(() => {
    const t0 = setTimeout(() => {
      setStartTimers(true);
    }, 5000);
    if (isLoggedIn !== null) setStartTimers(true);
    if (!startTimers) return;
    const t1 = setTimeout(() => {
      setLogoLifted(true);
    }, animDuration + fadeDuration);

    const t2 = setTimeout(
      () => {
        if (isLoggedIn === true) void navigate("/home");
        else void navigate("/start");
      },
      animDuration + fadeDuration + liftDuration + 100,
    );

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [
    startTimers,
    animDuration,
    fadeDuration,
    liftDuration,
    navigate,
    isLoggedIn,
  ]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-white px-4">
      <div className="w-full max-w-xs flex flex-col justify-center">
        <div
          style={{
            transitionDuration: `${liftDuration.toString()}ms`,
          }}
          className={`
    transition-all ease-in-out w-[80%] max-w-[200px] mx-auto items-center justify-center
    ${logoLifted ? "translate-y-0" : "translate-y-20"}
  `}
        >
          <AnimLogo
            animDuration={animDuration}
            fadeDuration={fadeDuration}
            play={true}
            startTimers={startTimers}
          />
        </div>

        <div className={"mt-6 opacity-0 pointer-events-none"}>
          <h1 className="text-2xl font-bold text-center text-green-800">
            SmartRide
          </h1>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Welcome! Please login or create a new account.
          </p>

          <div className="mt-6 w-full flex flex-col gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-md shadow transition w-full"
            >
              Login
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-md shadow transition w-full"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadPage;

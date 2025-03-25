// import reactLogo from './../../assets/react.svg';
// import viteLogo from '/vite.svg';
import { Link } from "react-router-dom";
import AnimLogo from "./../widgets/AnimLogo.tsx";
import { useEffect, useState } from "react";

const StartPage = () => {
  const loopCount = 2;
  const oneLoopDuration = 800;
  const animDuration = loopCount * oneLoopDuration;
  const fadeDuration = animDuration * 0.6;
  const liftDuration = animDuration * 0.5;

  const [showContent, setShowContent] = useState(false);
  const [logoLifted, setLogoLifted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setLogoLifted(true);
    }, animDuration + fadeDuration); // adjust as needed

    return () => clearTimeout(t);
  }, [animDuration, fadeDuration]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-white px-4">
      <div className="w-full max-w-xs flex flex-col justify-center">
        <div
          style={{
            transitionDuration: `${liftDuration}ms`,
          }}
          className={`
    transition-all ease-in-out w-[80%] max-w-[200px] mx-auto items-center justify-center
    ${logoLifted ? "translate-y-0" : "translate-y-20"}
  `}
        >
          <AnimLogo
            animDuration={animDuration}
            fadeDuration={fadeDuration}
            onFinish={() => setShowContent(true)}
          />
        </div>

        <div
          className={`transition-opacity duration-1000 mt-6 ${
            showContent ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <h1 className="text-2xl font-bold text-center text-green-800">
            SmartRide
          </h1>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Welcome! Please login or create a new account.
          </p>

          <div className="mt-6 w-full flex flex-col gap-3">
            <Link to="/login">
              <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-md shadow transition w-full">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-md shadow transition w-full">
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;

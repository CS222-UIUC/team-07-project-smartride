// import reactLogo from './../../assets/react.svg';
// import viteLogo from '/vite.svg';
import { Link } from 'react-router-dom';
import AnimLogo from "./../widgets/AnimLogo.tsx";
const StartPage: React.FC = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full text-white px-4">
        <div className="w-full max-w-xs flex flex-col items-center">
          <AnimLogo onFinish={() => console.log("Animation finished")} />

          <h1 className="text-3xl font-bold mt-4 text-center">Vite + React</h1>
          <h2 className="text-lg font-medium mt-2 text-center">Web Mobile Cycling App</h2>
          <p className="text-sm text-gray-200 mt-3 text-center">
            Welcome to SmartRide. Click below to Login.
          </p>

          <div className="mt-6 w-full flex flex-col gap-3">
            <Link to="/login">
              <button className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-md shadow transition w-full">
                Go to Login
              </button>
            </Link>

            <Link to="/map">
              <button className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-md shadow transition w-full">
                Go to Map
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  export default StartPage;
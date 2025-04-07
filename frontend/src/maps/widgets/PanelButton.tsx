import { SlidersHorizontal } from "lucide-react";

const PanelButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-4 right-4 z-[9999] bg-white p-3 rounded-full shadow-lg"
    >
      <SlidersHorizontal className="w-5 h-5 text-black" />
    </button>
  );
};

export default PanelButton;

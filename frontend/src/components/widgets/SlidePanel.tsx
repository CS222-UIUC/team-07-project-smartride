import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface SlidePanelProps {
  direction: "bottom" | "right";
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const SlidePanel: React.FC<SlidePanelProps> = ({
  direction,
  isOpen,
  onClose,
  children,
}) => {
  const isFromBottom = direction === "bottom";

  const variants = {
    hidden: {
      x: isFromBottom ? 0 : "100%",
      y: isFromBottom ? "100%" : 0,
    },
    visible: {
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      x: isFromBottom ? 0 : "100%",
      y: isFromBottom ? "100%" : 0,
      transition: { type: "spring", stiffness: 300, damping: 35 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[9999]">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className={`absolute bg-white shadow-xl rounded-t-2xl pointer-events-auto
              ${isFromBottom ? "bottom-0 left-0 w-full h-[75%]" : "right-0 top-0 h-full w-[85%]"}`}
          >
            <div className="flex justify-end p-2">
              <button type="button" onClick={onClose}>
                <X className="h-6 w-6 text-gray-500 hover:text-black" />
              </button>
            </div>
            <div className="h-full overflow-y-auto px-4 pb-8">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SlidePanel;

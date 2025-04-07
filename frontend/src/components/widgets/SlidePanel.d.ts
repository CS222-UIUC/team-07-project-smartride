import { ReactNode } from "react";
interface SlidePanelProps {
    direction: "bottom" | "right";
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}
declare const SlidePanel: React.FC<SlidePanelProps>;
export default SlidePanel;

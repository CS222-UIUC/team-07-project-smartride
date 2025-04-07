import { Point } from "./manage/structure.ts";
interface MapPanelProps {
    isOpen: boolean;
    onClose: () => void;
    points: Point[];
    onReorder: (from: number, to: number) => void;
    onToggleType: (id: string) => void;
    onRemove: (id: string) => void;
}
declare const MapPanel: React.FC<MapPanelProps>;
export default MapPanel;

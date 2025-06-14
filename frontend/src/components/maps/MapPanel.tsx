import SlidePanel from "@/components/widgets/SlidePanel.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Card } from "@/components/ui/card.tsx";
import { MoveUp, MoveDown, Trash2, MapPin } from "lucide-react";
import { Point } from "@/types/MapRoute.ts";

interface MapPanelProps {
  isOpen: boolean;
  onClose: () => void;
  points: Point[];
  onReorder: (from: number, to: number) => void;
  onToggleType: (id: string) => void;
  onRemove: (id: string) => void;
}

const MapPanel: React.FC<MapPanelProps> = ({
  isOpen,
  onClose,
  points,
  onReorder,
  onToggleType,
  onRemove,
}) => {
  const move = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= points.length) return;
    onReorder(index, next);
  };

  return (
    <SlidePanel direction="bottom" isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold px-2">Selected Points</h2>
      <ScrollArea className="h-[60vh] mt-2">
        <div className="space-y-2">
          {points.map((pt, i) => (
            <Card key={pt.id} className="p-2 flex justify-between items-center">
              <div className="text-sm">
                <div>{pt.label}</div>
                <div className="text-muted-foreground text-xs">
                  {pt.coordinates.lat.toFixed(5)},{" "}
                  {pt.coordinates.lng.toFixed(5)} ({pt.type})
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => {
                    move(i, -1);
                  }}
                >
                  <MoveUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => {
                    move(i, 1);
                  }}
                >
                  <MoveDown className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => {
                    onToggleType(pt.id);
                  }}
                >
                  <MapPin className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => {
                    onRemove(pt.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </SlidePanel>
  );
};

export default MapPanel;

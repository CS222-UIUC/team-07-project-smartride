import SlidePanel from "@/components/widgets/SlidePanel";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { MoveUp, MoveDown, Trash2, MapPin } from "lucide-react";

export interface Point {
  id: string;
  label: string;
  lat: number;
  lng: number;
  type: "main" | "waypoint";
}

interface MapPanelProps {
  isOpen: boolean;
  onClose: () => void;
  points: Point[];
  onPointsChange: (points: Point[]) => void;
}

const MapPanel = ({
  isOpen,
  onClose,
  points,
  onPointsChange,
}: MapPanelProps) => {
  const move = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= points.length) return;
    const newPoints = [...points];
    [newPoints[index], newPoints[next]] = [newPoints[next], newPoints[index]];
    onPointsChange(newPoints);
  };

  const toggleType = (index: number) => {
    const newPoints = [...points];
    newPoints[index].type =
      newPoints[index].type === "main" ? "waypoint" : "main";
    onPointsChange(newPoints);
  };

  const remove = (index: number) => {
    const newPoints = [...points];
    newPoints.splice(index, 1);
    onPointsChange(newPoints);
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
                  {pt.lat.toFixed(5)}, {pt.lng.toFixed(5)} ({pt.type})
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    move(i, -1);
                  }}
                >
                  <MoveUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    move(i, 1);
                  }}
                >
                  <MoveDown className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    toggleType(i);
                  }}
                >
                  <MapPin className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    remove(i);
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

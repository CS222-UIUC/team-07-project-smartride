import { Button } from "@/components/ui/button.tsx";
import { ArrowLeft, User } from "lucide-react";

interface TopBarProps {
  title: string;
  onBack?: () => void;
  onProfile?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ title, onBack, onProfile }) => {
  return (
    <div className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-2 border-b shadow-sm bg-white">
      <div className="w-1/5">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="text-lg font-medium text-center w-3/5 truncate">
        {title}
      </div>
      <div className="w-1/5 flex justify-end">
        {onProfile && (
          <Button variant="ghost" size="icon" onClick={onProfile}>
            <User className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TopBar;

interface TopBarProps {
    title: string;
    onBack?: () => void;
    onProfile?: () => void;
}
declare const TopBar: React.FC<TopBarProps>;
export default TopBar;

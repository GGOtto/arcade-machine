import "./SideMenu.css";

interface SideMenuProps {
    isSideMenuOpen: boolean;
    setSideMenuOpen: (arg: boolean) => void;
}

export default function SideMenu(props: SideMenuProps) {
    const {isSideMenuOpen, setSideMenuOpen} = props;

    return (
        <div className={`side-menu-${isSideMenuOpen ? "open" : "closed"}`}>
        </div>
    )
}
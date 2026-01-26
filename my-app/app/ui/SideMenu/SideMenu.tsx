import "./SideMenu.css";
import {FaXmark} from "react-icons/fa6";

interface SideMenuProps {
    isSideMenuOpen: boolean;
    setSideMenuOpen: (arg: boolean) => void;
}

export default function SideMenu(props: SideMenuProps) {
    const {isSideMenuOpen, setSideMenuOpen} = props;

    return (
        <div className={`side-menu-${isSideMenuOpen ? "open" : "closed"}`}>
            <div className="menu-x-button" onClick={() => setSideMenuOpen(false)}>
                <FaXmark/>
            </div>
        </div>
    );
}
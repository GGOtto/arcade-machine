import "./SiteHeader.css";
import NavBar from "../NavBar/NavBar";
import {FaBars} from "react-icons/fa6";

export default function SiteHeader() {
    return (
        <div className="site-header">
            <div className="site-title">
                <h1 className="title-text">
                    Test Header - Hello World
                </h1>
                <FaBars className="menu-icon"/>
            </div>
            <NavBar tabs={["Page 1", "Page 2", "Page 3"]} urls={["/", "/games","/puzzles"]}/>
        </div>
    )
}
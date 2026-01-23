"use client";

import "./SiteHeader.css";
import NavBar from "../NavBar/NavBar";
import {FaBars,FaXmark} from "react-icons/fa6";
import {useState} from "react";
import SideMenu from "../SideMenu/SideMenu";

export default function SiteHeader() {
    const [isSideMenuOpen, setSideMenuOpen] = useState<boolean>(false);

    return (
        <div className="site-header">
            <div className={`site-title site-title-${isSideMenuOpen ? "slim" : "normal"}`}>
                <h1 className="title-text">
                    Test Header - Hello World
                </h1>
                <div className="menu-button" onClick={() => setSideMenuOpen(!isSideMenuOpen)}>
                    <FaBars className="menu-icon"/>
                </div>
            </div>
            <NavBar tabs={["Home", "Games", "Puzzles"]} urls={["/", "/games","/puzzles"]}/>
            <SideMenu isSideMenuOpen={isSideMenuOpen} setSideMenuOpen={setSideMenuOpen}/>
        </div>
    )
}
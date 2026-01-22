
"use client";
import "./NavBar.css";

interface NavBarProps {
    tabs: string[];
    urls: string[];
}

export default function NavBar(props: NavBarProps) {
    const {tabs, urls} = props;

    return (
        <nav className="navbar">
            {tabs.map((tab,index) => (
                <a className="tab" href={urls[index]} key={index}>
                    {tab}
                </a>
            ))}
        </nav>
    )
}

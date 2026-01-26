"use client"; 
import "./GameContainer.css";
import {useState} from "react";
import {FaPlay,FaCircleInfo} from "react-icons/fa6";

interface GameContainerProps {
    name: string;
    content?: string;
    url?: string;
}

export default function GameContainer(props: GameContainerProps) {
    const {name, content, url} = props;

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="game-container">
            <div className="container-header">
                <div className="game-title">
                    {name}
                </div>
                <div className="info-button" onClick={() => {setIsOpen(!isOpen)}}>
                    <FaCircleInfo/>
                </div>
                {url && (
                <a className="game-link" href={url}>
                    <FaPlay/>
                </a>
            )}
            </div>
            <div className={`dropdown-${isOpen ? 'open' : 'closed'}`}>
                {content ? content : "..."}
            </div>
        </div>
    )
}

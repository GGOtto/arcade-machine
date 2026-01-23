"use client"; 
import "./GameContainer.css";
import {useState} from "react";

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
            <div className="game-title" onClick={() => {setIsOpen(!isOpen)}}>
                {name}
            </div>
            <div className={`dropdown-${isOpen ? 'open' : 'closed'}`}>
                {content ? content : ""}
                {url && (
                    <a className="game-link" href={url}>
                        Play
                    </a>
                )}
            </div>
        </div>
    )
}

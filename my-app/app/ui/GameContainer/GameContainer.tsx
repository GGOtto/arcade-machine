"use client"; 
import "./GameContainer.css";
import {useState} from "react";

interface GameContainerProps {
    name: string;
    content?: string;
}

export default function GameContainer(props: GameContainerProps) {
    const {name, content} = props;

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="game-container">
            <div className="game-title" onClick={() => {setIsOpen(!isOpen)}}>
                {name}
            </div>
            <div className={`dropdown-${isOpen ? 'open' : 'closed'}`}>
                {content ? content : "..."}
            </div>
        </div>
    )
}

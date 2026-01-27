"use client"; 
import "./GameContainer.css";
import {useState} from "react";
import {FaPlay} from "react-icons/fa6";

interface GameContainerProps {
    name: string;
    content?: string;
    url?: string;
}

export default function GameContainer(props: GameContainerProps) {
    const {name, content, url} = props;

    return (
        <a className="game-container" href={url ? url : "/"}>
            <div className="container-header">
                <div className="game-title">
                    {name}
                </div>
            </div>
            <div className="container-content">
                {content ? content : "..."}
            </div>
        </a>
    )
}

import "./GameContainer.css";

interface GameContainerProps {
    name: string
}

export default function GameContainer(props: GameContainerProps) {
    const {name} = props;
    return (
        <div className="game-container">
            {name}
        </div>
    )
}
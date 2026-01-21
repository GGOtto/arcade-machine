import Image from "next/image";
import "./styles/page.css";

export default function Home() {
  return (
    <div className="main-page-container">
      <div className="main-page">
        <h1 className="title">The Arcade Machine</h1>
        <div className="game-type-container puzzles-container">Puzzles</div>
        <div className="game-type-container card-games">Card Games</div>
        <div className="game-type-container dice-games">Dice Games</div>
      </div>
    </div>
  );
}

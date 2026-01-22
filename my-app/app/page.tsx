import GameContainer from "./components/GameContainer/GameContainer";
import "./page.css";

export default function Home() {
  return (
    <div className="main-page-container">
      <div className="main-page">
        <h1 className="title">The Arcade Machine</h1>
        <GameContainer name="Yahtzee" content="Hello World"/>
      </div>
    </div>
  );
}

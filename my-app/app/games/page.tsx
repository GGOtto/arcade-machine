import "./page.css";
import GameContainer from "../ui/GameContainer/GameContainer";

export default function Page() {
    return (
        <main className="games">
            <GameContainer name="Asteroids" url="/games/asteroids"/>
            <GameContainer name="Paint Splash" url="/games/paintsplash"/>
            <GameContainer name="Yahtzee"/>
            <GameContainer name="Hearts"/>
            <GameContainer name="Moon Defense"/>
        </main>
    );
}
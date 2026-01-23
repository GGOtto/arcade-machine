import "./page.css";
import GameContainer from "../ui/GameContainer/GameContainer";

export default function Page() {
    return (
        <main className="games">
            Games
            <GameContainer name="Asteroids" url="/games/asteroids"/>
            <GameContainer name="Paint Splash" url="/games/paintsplash"/>
        </main>
    );
}
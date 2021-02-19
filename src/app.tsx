import { BrowserRouter, Route, Switch } from "react-router-dom";
import GameCreate from "./pages/game-create";
import GamePlay from "./pages/game-play";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/:gameId" component={GamePlay} />
        <Route path="/" component={GameCreate} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;

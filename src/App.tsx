import "./App.scss";
import { currentRoute } from "./constants/routes";
import { useSettings } from "./store/store";

function App() {
  // Implemented without router to deploy on github_pages
  const address = useSettings((state) => state.address);

  console.log("address", address);

  return <>{currentRoute[address]}</>;
}

export default App;

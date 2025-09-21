import Home from "./pages/Home";
import ToastProvider from "./components/ToastProvider";

const App = () => (
  <>
    <ToastProvider />
    <Home />
  </>
);

export default App;

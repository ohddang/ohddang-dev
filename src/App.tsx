import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./page/Home";
import Playground from "./page/playground/Playground";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="w-full bg-gray-500/10 position: relative font-notoSans">
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;

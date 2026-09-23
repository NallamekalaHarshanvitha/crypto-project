import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "./pages/Home";
import { CoinDetail } from "./pages/CoinDetail";
import Profile from "./pages/profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coin/:id" element={<CoinDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
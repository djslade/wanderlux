import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import { Home } from "./routes/Home";
import { Signup } from "./routes/Signup";
import { Login } from "./routes/Login";
import { Feed } from "./routes/Feed";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Signup />} path="signup" />
        <Route element={<Login />} path="/login" />
        <Route element={<Feed />} path="feed" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

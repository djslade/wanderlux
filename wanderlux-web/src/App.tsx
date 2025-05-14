import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import { Home } from "./routes/Home";
import { Signup } from "./routes/Signup";
import { Login } from "./routes/Login";
import { Feed } from "./routes/Feed";
import { UnauthWrapper } from "./components/UnauthWrapper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<UnauthWrapper child={<Signup />} />} path="signup" />
        <Route element={<UnauthWrapper child={<Login />} />} path="/login" />
        <Route element={<Feed />} path="feed" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

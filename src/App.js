import Home from "./components/Home";
import Login from "./components/Login";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import User from "./components/User";
import List from "./components/List";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />}></Route>
          <Route path="/login" exact element={<Login />}></Route>
          <Route path="/user" exact element={<User />}></Route>
          <Route path="/list" exact element={<List />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

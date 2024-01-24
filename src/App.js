import Home from "./components/Home";
import Login from "./components/Login";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import User from "./components/User";
import List from "./components/List";
import Policy from "./components/Policy";
import Issue from "./components/Issue";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />}></Route>
          <Route path="/login" exact element={<Login />}></Route>
          <Route path="/user" exact element={<User />}></Route>
          <Route path="/list" exact element={<List />}></Route>
          <Route path="/policy" exact element={<Policy />}></Route>
          <Route path="/issue" exact element={<Issue />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

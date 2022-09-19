import React from "react";
import CreateLink from "./CreateLink";
import Header from "./Header";
import LinkList from "./LinkList";
import { Route, Routes } from "react-router-dom";

import Login from "./Login";
import Search from "./Search";

/* 
class App extends Component {
  render() {
    return <LinkList />;
  }
}
*/

/*
const App = () => {
  return <CreateLink />;
};
*/

/*
const App = () => {
  return (
    <div className="center w85">
      <Header />
      <div className="ph3 pv1 background-gray">
        <Routes>
          <Route path="/" element={<LinkList />} />
          <Route path="/create" element={<CreateLink />} />
        </Routes>
      </div>
    </div>
  );
};
*/

const App = () => {
  return (
    <div className="center w85">
      <Header />
      <div className="ph3 pv1 background-gray">
        <Routes>
          <Route path="/" element={<LinkList />} />
          <Route path="/create" element={<CreateLink />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

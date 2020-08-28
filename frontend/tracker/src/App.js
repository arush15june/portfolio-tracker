import React from 'react';
import TopBar from "./Components/TopBar/TopBar.jsx"
import Home from "./views/Home.jsx"
import Portfolio from "./views/Portfolio.jsx"

import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const homeContainerStyle = {
  display: "flex",
  flexFlow: "column nowrap",
}

const rootContainerStyle = {
  display: "flex",
  width: "100%",
  flex: "1 100%",
  justifyContent:"center",
}

const centeredContainerStyle = {
  display: "flex",
  margin:"auto",
  // justifyContent:"center",
  flexFlow:"column nowrap",
  minWidth:"50%",
  padding:"1rem"
}

function App() {
  return (
    <>
      <Router>
        <main style={rootContainerStyle} className={"bp3-dark"}>
          <section style={centeredContainerStyle}>
            <header> 
              <TopBar />
            </header>
            <section style={homeContainerStyle}>
                <Switch>
                  <Route path="/portfolio/:id">
                    <Portfolio />
                  </Route>
                  <Route path="/">
                    <Home />
                  </Route>
                </Switch>
            </section>
          </section>
        </main>
      </Router>
    </>
  );
}

export default App;

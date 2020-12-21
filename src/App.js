import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles/app.css";
import "font-awesome/css/font-awesome.min.css";
import LoginForm from "./components/LoginForm";
import Table from "./components/Table";
import { Component } from "react";

class App extends Component {
  state = {
    displayLoginMessage: false,
  };

  setLoggedIn = () => {
    setTimeout(() => {
      this.setState({ displayLoginMessage: true });
    }, 1000);
  };

  getLoginMessageClass = () => {
    const { displayLoginMessage } = this.state;
    let messageClass = "loginMessageContainer ";
    setTimeout(() => {
      this.setState({ displayLoginMessage: false });
    }, 2000);
    if (displayLoginMessage) {
      return messageClass;
    } else {
      return (messageClass += "loginHide");
    }
  };
  render() {
    const { getLoginMessageClass, setLoggedIn } = this;
    const { displayLoginMessage } = this.state;
    return (
      <Router>
        <Switch>
          <Route path="/login">
            <LoginForm onLogin={setLoggedIn} />
          </Route>
          <Route path="">
            {displayLoginMessage && (
              <div className={getLoginMessageClass()}>Logged in</div>
            )}
            <Table />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;

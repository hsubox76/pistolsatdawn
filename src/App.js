import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import firebase from 'firebase';

import './App.css';
import Navbar from './components/Navbar';
import DuelPage from './components/DuelPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyCRhaqcCK05666U-ZU1CI8x1i4arK6AmfA",
  authDomain: "pistolsatdawn-923af.firebaseapp.com",
  databaseURL: "https://pistolsatdawn-923af.firebaseio.com",
  storageBucket: "pistolsatdawn-923af.appspot.com",
  messagingSenderId: "829654912644"
};
firebase.initializeApp(config);


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'none',
      user: null,
      userData: null,
      currentArgument: null
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ page: 'home', user });
        const userPath = `users/${user.uid}`;
        firebase.database().ref(userPath).on('value', (snapshot) => {
          const userData = snapshot.val() || {};
          this.setState({ userData });
        })
      } else {
        this.setState({ page: 'login', user: null });
      }
    });
  }
  handleArgumentClick(argumentId) {
    this.setState({
      currentArgument: argumentId,
      page: 'duel'
    });
  }
  render() {
    return (
      <Router>
        <div className="app">
          <Navbar
            setPage={(page) => this.setState({ page })}
            user={this.state.user}
            onLogout={() => firebase.auth().signOut()}
          />
          <div className="main-container">
            <Route exact path="/" render={() => {
              if (this.state.user && this.state.userData) {
                return (
                  <HomePage
                    user={this.state.user}
                    userData={this.state.userData}
                    onArgumentClick={(argumentId) => this.handleArgumentClick(argumentId)}
                  />
                );
              } else {
                return <div>loading...</div>
              }
            }} />
            <Route path="/login" render={() => (
              <LoginPage user={this.state.user} />
            )} />
            <Route path="/duel/:id" render={({match}) => (
              <DuelPage argumentId={match.params.id} />
            )} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;

import React, { Component } from 'react';
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
      userData: null
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
  render() {
    let page = <div>loading</div>;
    switch(this.state.page) {
      case('login'):
        page = <LoginPage user={this.state.user} />;
        break;
      case('home'):
        if (this.state.user && this.state.userData) {
          page = <HomePage user={this.state.user} userData={this.state.userData} />;
        }
        break;
      case('duel'):
        page = <DuelPage />;
        break;
      default:
        page = <div>loading</div>;
    }
    return (
      <div className="app">
        <Navbar
          setPage={(page) => this.setState({ page })}
          user={this.state.user}
          onLogout={() => firebase.auth().signOut()}
        />
        <div className="main-container">
          {page}
        </div>
      </div>
    );
  }
}

export default App;

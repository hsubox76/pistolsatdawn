import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';
import './index.scss';
import firebase from 'firebase';
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
      finishedAuthCheck: false,
      user: null,
      userData: null,
      currentArgument: null
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ finishedAuthCheck: false });
      if (user) {
        this.setState({ page: 'home', user });
        const userPath = `users/${user.uid}`;
        firebase.database().ref(userPath).on('value', (snapshot) => {
          const userData = snapshot.val() || {};
          this.setState({ userData, finishedAuthCheck: true });
        })
      } else {
        this.setState({ page: 'login', user: null, finishedAuthCheck: true });
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
        <div className="columns">
          <div className="column">
          <Navbar
            setPage={(page) => this.setState({ page })}
            user={this.state.user}
            onLogout={() => firebase.auth().signOut()}
          />
          <section className="section">
            <Route exact path="/" render={() => {
              if (!this.state.finishedAuthCheck) {
                return <div>loading...</div>;
              }
              if (this.state.user && this.state.userData) {
                return (
                  <HomePage
                    user={this.state.user}
                    userData={this.state.userData}
                    onArgumentClick={(argumentId) => this.handleArgumentClick(argumentId)}
                  />
                );
              } else {
                return <Redirect to='/login' />
              }
            }} />
            <Route path="/login" render={() => this.state.finishedAuthCheck && this.state.user && this.state.userData
              ? <Redirect to='/' />
              : <LoginPage />} />
            <Route path="/duel/:id" render={({match}) => (
              <DuelPage argumentId={match.params.id} user={this.state.user} />
            )} />
          </section>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;

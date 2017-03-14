import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';

import '../styles/HomePage.css';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startArgumentFormOpen: false
    };
  }
  componentDidMount() {
    const dbArguments = firebase.database().ref('arguments');
    const argParticipating = this.props.userData.argumentsParticipating || [];
    argParticipating.forEach(argKey => {
      dbArguments.child(argKey).on('value', (snapshot) => {
        if (snapshot.val()) {
          this.setState({ [argKey]: snapshot.val() });
        }
      });
    });
  }
  handleStartArgument() {
    const db = firebase.database();
    const argParticipating = this.props.userData.argumentsParticipating || [];
    const newArgumentKey = db.ref('arguments').push({
      title: this._argumentTitle.value,
      usersParticipating: [this.props.user.uid]
    }).key;
    db.ref(`arguments/${newArgumentKey}`).on('value', snapshot => {
      if (snapshot.val()) {
        this.setState({ [newArgumentKey]: snapshot.val() });
      }
    });
    db.ref(`users/${this.props.user.uid}/argumentsParticipating`)
      .set(argParticipating.concat(newArgumentKey));
    this.setState({ startArgumentFormOpen: false });
  }
  render() {
    const argParticipating = this.props.userData && this.props.userData.argumentsParticipating;
    const startArgumentForm = (
      <div className='start-argument-form'>
        <input
          type="text"
          placeholder="title of argument"
          ref={node => this._argumentTitle = node}
        />
        <div
          className='button'
          onClick={() => this.handleStartArgument()}
        >
          Start it up
        </div>
      </div>
    );
    const openStartArgumentFormButton = (
      <div
        className='button'
        onClick={() => this.setState({ startArgumentFormOpen: true })}
      >
        Start a new argument
      </div>
    );
    if (!this.props.user) {
      return <div>{this.props.route}</div>
    }
    return (
      <div className='home-container'>
        <h2>Welcome {this.props.user.displayName}</h2>
        <div className='arguments-box arguments-participating'>
          <h3>Arguments You're Having</h3>
          <div className='arguments-list arguments-participating-list'>
            {argParticipating && argParticipating.map(argumentKey => {
              return (
                <Link
                  key={argumentKey}
                  className="argument-link"
                  to={`duel/${argumentKey}`}
                >
                  {this.state[argumentKey] && this.state[argumentKey].title}
                </Link>
              );
            })}
          </div>
          {this.state.startArgumentFormOpen && startArgumentForm}
          {!this.state.startArgumentFormOpen && openStartArgumentFormButton}
        </div>
        <div className='arguments-box arguments-spectating'>
          <h3>Arguments You're Watching</h3>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  user: PropTypes.object,
  onArgumentClick: PropTypes.func
};

export default HomePage;
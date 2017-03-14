import React, { Component, PropTypes } from 'react';
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
        Start an argument
      </div>
    );
    return (
      <div className='home-container'>
        <h2>Welcome {this.props.user.displayName}</h2>
        <div className='arguments-box arguments-participating'>
          <h3>Arguments You're Having</h3>
          <div className='arguments-participating-list'>
            {argParticipating && argParticipating.map(argumentKey => {
              return <div key={argumentKey}>{argumentKey} {this.state[argumentKey] && this.state[argumentKey].title}</div>
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
  user: PropTypes.object
};

export default HomePage;
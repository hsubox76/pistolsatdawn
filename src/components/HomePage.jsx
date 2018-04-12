import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startArgumentFormOpen: false
    };
  }
  componentDidMount() {
    const db = firebase.database();
    const dbArguments = firebase.database().ref('arguments');
    const argParticipating = this.props.userData.argumentsParticipating || [];
    argParticipating.forEach(argKey => {
      const argument = dbArguments.child(argKey);
      argument.on('value', (argSnap) => {
        if (argSnap.val()) {
          const argumentData = argSnap.val();
          db.ref(`users/${argumentData.originator}`).once('value', userSnap => {
            if (userSnap.val()) {
              this.setState({ [argKey]: Object.assign({}, argumentData, { originator: userSnap.val() }) });
            }
          });
        }
      });
    });
  }
  handleStartArgument() {
    const db = firebase.database();
    const argParticipating = this.props.userData.argumentsParticipating || [];
    const newArgumentKey = db.ref('arguments').push({
      title: this._argumentTitle.value,
      messages: [],
      originator: this.props.user.uid
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
      <form className="content">
        <div className="field">
          <label className="label">Description</label>
          <div className="control">
            <input
              type="text"
              className="input"
              placeholder="a short description of this argument"
              ref={node => this._argumentTitle = node}
            />
          </div>
        </div>
        <div
          className="button is-info"
          onClick={() => this.handleStartArgument()}
        >
          Start it up
        </div>
      </form>
    );
    if (!this.props.user) {
      return <div>{this.props.route}</div>
    }
    return (
      <div className="container">

        <div className="content">
          <p className="title is-size-3">Welcome {this.props.user.displayName}</p>
        </div>
          
        <div className="content">
          <p className="title is-size-4 has-text-primary">Arguments You're Having</p>
        </div>

        <div className="columns is-multiline">
          {argParticipating && argParticipating.map(argumentKey => {
            return this.state[argumentKey] && (
              <div className="column is-one-third" key={argumentKey}>
                <div className="card">
                  <div className="card-header has-background-primary">
                    <p className="card-header-title is-size-5 has-text-white">
                      {this.state[argumentKey].title}
                    </p>
                  </div>
                  <div className="card-content">
                    <Link
                      className="argument-link"
                      to={`duel/${argumentKey}`}
                    >
                      <div>Participants: {this.state[argumentKey].originator.displayName}</div>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="column is-one-third">
            <div className="card">
              <div className="card-header has-background-info">
                <p className="card-header-title is-size-5 has-text-white">
                  Start a new argument
                </p>
              </div>
              <div className="card-content">
                {startArgumentForm}
              </div>
            </div>
          </div>
        </div>
          
        <div className="content">
          <p className="title is-size-4 has-text-primary">Arguments You're Watching</p>
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
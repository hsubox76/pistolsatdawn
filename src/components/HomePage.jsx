import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import _ from 'lodash';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startArgumentFormOpen: false
    };
  }
  componentDidMount() {
    const db = firebase.database();
    const dbArguments = db.ref('arguments');
    const argParticipating = this.props.userData.argumentsParticipating || [];
    argParticipating.forEach(argKey => {
      const argument = dbArguments.child(argKey);
      argument.on('value', (argSnap) => {
        if (argSnap.val()) {
          const argument = argSnap.val();
          argument.statements = _.map(argument.statements, (statement, key) => {
            return _.assign({}, statement, { id: key });
          });
          db.ref(`users/${argument.originator}`).once('value', userSnap => {
            if (userSnap.val()) {
              this.setState({ [argKey]: Object.assign({}, argument, { originator: userSnap.val() }) });
            }
          });
        }
      });
    });
  }
  componentWillUnmount() {
    const dbArguments = firebase.database().ref('arguments');
    const argParticipating = this.props.userData.argumentsParticipating || [];
    argParticipating.forEach(argKey => {
      const argument = dbArguments.child(argKey);
      argument.off();
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
        const argument = snapshot.val();
        argument.statements = _.map(argument.statements, (statement, key) => {
          return _.assign({}, statement, { id: key });
        });
        this.setState({ [newArgumentKey]: argument });
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
            const argument = this.state[argumentKey];
            if (argument) {
              console.log(argument.statements);
            }
            return argument && (
              <div className="column is-one-third" key={argumentKey}>
                <div className="card">
                  <div className="card-header has-background-primary">
                    <p className="card-header-title is-size-5 has-text-white">
                      {argument.title}
                    </p>
                  </div>
                  <div className="card-content">
                    <Link
                      className="argument-link"
                      to={`duel/${argumentKey}`}
                    >
                      Go to argument
                    </Link>
                    <p>Last statement: {_.get(argument.statements, 'length') > 0 ? _.last(argument.statements).content : 'none'}</p>
                    <p>Participants: {argument.originator.displayName}</p>
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
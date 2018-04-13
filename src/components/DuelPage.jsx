import React, { Component, PropTypes } from 'react';
import DebateBox from './DebateBox';
import SpectatorBox from './SpectatorBox';
import firebase from 'firebase';
import { get } from 'lodash';

class DuelPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      argument: null
    };
  }
  componentDidMount() {
    firebase.database().ref(`arguments/${this.props.argumentId}`)
      .on('value', snapshot => {
        if (snapshot.val()) {
          const argument = snapshot.val();
          this.setState({ argument });
          firebase.database()
            .ref(`users/${argument.originator}`)
            .on('value', userSnap => {
              if (userSnap.val()) {
                this.setState({ originator: userSnap.val() });
              }
            })
        }
      });
  }
  componentWillUnmount() {
    firebase.database().ref(`arguments/${this.props.argumentId}`)
      .off();
  }
  render() {
    if (!this.state.argument) {
      return <div className='duel-container'>loading...</div>;
    }
    return (
      <div className="container">
        <div className="content">
          <div className="hero is-primary">
            <div className="hero-body">
              <div className="content">
                <h1 className="title is-size-3 has-text-weight-bold">
                  {this.state.argument.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="level">
            <div className="level-left">
              <div className="box">
                Participants: {get(this.state, 'originator.displayName')}
              </div>
            </div>
          </div>
        </div>
        <div className='columns'>
          <DebateBox
            user={this.props.user}
            originator={this.state.originator}
            argument={Object.assign({}, this.state.argument, { id: this.props.argumentId })}
          />
          <SpectatorBox />
        </div>
      </div>
    );
  }
}

DuelPage.propTypes = {
  argumentId: PropTypes.string
};

export default DuelPage;
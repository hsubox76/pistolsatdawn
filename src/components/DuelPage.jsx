import React, { Component, PropTypes } from 'react';
import DebateBox from './DebateBox';
import SpectatorBox from './SpectatorBox';
import firebase from 'firebase';

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
          this.setState({argument: snapshot.val()});
        }
      });
  }
  render() {
    if (!this.state.argument) {
      return <div className='duel-container'>loading...</div>;
    }
    return (
      <div className='columns'>
        <DebateBox argument={this.state.argument} />
        <SpectatorBox />
      </div>
    );
  }
}

DuelPage.propTypes = {
  argumentId: PropTypes.string
};

export default DuelPage;
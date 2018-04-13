import React, { PropTypes } from 'react';
import firebase from 'firebase';
import _ from 'lodash';

class DebateBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      argumentText: ''
    };
  }

  handleSubmitArgument = (e) => {
    e.preventDefault();
    this.setState({ argumentText: '' });
    const db = firebase.database();
    const newStatement = {
      user: this.props.user.uid,
      content: this.state.argumentText,
      createdAt: Date.now()
    };
    db
      .ref(`arguments/${this.props.argument.id}/statements`)
      .push(newStatement);
    // TODO: Push some data to user account - most recent statement, most recent argument, etc
  }

  render() {
    const { argument } = this.props;
    return (
      <div className="column is-half">
        <div className="card">
          <div className="card-header has-background-primary">
            <p className="card-header-title has-text-white is-size-4">
              "the dialogue"
            </p>
          </div>
          <div className="card-content">
            <div className="content">
              <span className="tag is-info">smartness</span>
            </div>
            {argument.statements && _.map(argument.statements, (statement, key) => {
              const classes = ['box'];
              const isOriginator = statement.user === argument.originator;
              if (isOriginator) {
                classes.push('has-text-light');
                classes.push('has-background-1');
              } else {
                classes.push('has-text-light');
                classes.push('has-background-2');
              }
              return (
                <div key={key} className={classes.join(' ')}>
                  <span>{isOriginator && this.props.originator && this.props.originator.displayName}: </span>
                  <span>{statement.content}</span>
                </div>
              );
            })}
            <form className="content" onSubmit={this.handleSubmitArgument}>
              <div className="field">
                <div className="control">
                  <textarea
                    className="textarea"
                    rows="5"
                    onChange={e => this.setState({ argumentText: e.target.value })}
                    placeholder="Type your next argument here"
                    value={this.state.argumentText}
                  />
                </div>
              </div>
              <button className="button is-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

DebateBox.propTypes = {
  argument: PropTypes.object
};

export default DebateBox;
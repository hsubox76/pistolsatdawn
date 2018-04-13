import React, {Component} from 'react';
import firebase from 'firebase';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'login'
    };
  }
  onModeClick(e, mode) {
    e.preventDefault();
    this.setState({ mode });
  }
  onFormSubmit = (e) => {
    e.preventDefault();
    if (this.state.mode === 'register' && this._password1.value === this._password2.value) {
      firebase.auth()
        .createUserWithEmailAndPassword(this._email.value, this._password1.value)
        .then((user) => {
          const displayName = this._displayName.value;
          return user.updateProfile({
            //TODO: Validate display name
            displayName
          }).then(() => user);
        })
        .then(user => {
          return firebase.database().ref(`users/${user.uid}`).set({
            displayName: this._displayName.value,
            argumentsParticipating: []
          });
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.error(errorCode, errorMessage);
        });
    } else if (this.state.mode === 'login') {
      firebase.auth()
        .signInWithEmailAndPassword(this._email.value, this._password1.value)
        .then(function() {
          console.log('success');
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.error(errorCode, errorMessage);
        });
    }
  }
  render() {
    const isLoginMode = this.state.mode === 'login';
    const loginText = isLoginMode
      ? (
        <div className='content'>
          <p className='title is-size-3'>log in</p>
          <p className='subtitle is-size-5'>
          new? <a onClick={e => this.onModeClick(e, 'register')}><b>create an account</b></a>.
          </p>
        </div>
      )
      : (
        <div className='content'>
          <p className='title is-size-3'>create an account</p>
          <p className='subtitle is-size-5'>
          already have one? <a onClick={e => this.onModeClick(e, 'login')}><b>go to log in page</b></a>.
          </p>
        </div>
      );
    return (
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-5">
            <form className="box" onSubmit={this.onFormSubmit}>
              {loginText}
              <div className="content">
                {!isLoginMode && (
                  <div className="field">
                    <label className="label">Display name</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        placeholder='Socrates'
                        ref={node => node && (this._displayName = node)}
                      />
                    </div>
                  </div>
                )}
                <div className="field">
                  <label className="label">Email address</label>
                  <p className="control">
                    <input
                    className="input"
                      type='email'
                      placeholder='example@exampleco.net'
                      ref={node => node && (this._email = node)}
                    />
                  </p>
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <input
                    className="input"
                    type='password'
                    ref={node => node && (this._password1 = node)}
                  />
                </div>
                {!isLoginMode && (
                  <div className="field">
                    <label className="label">Confirm Password</label>
                    <input
                      className="input"
                      type='password'
                      ref={node => node && (this._password2 = node)}
                    />
                  </div>)}
                <button className='button'>submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
} 

export default LoginPage;
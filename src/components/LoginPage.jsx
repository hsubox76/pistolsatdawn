import React, {Component} from 'react';
import '../styles/LoginPage.css';
import firebase from 'firebase';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'login'
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }
  onModeClick(e, mode) {
    e.preventDefault();
    this.setState({ mode });
  }
  onFormSubmit(e) {
    e.preventDefault();
    if (this.state.mode === 'register' && this._password1.value === this._password2.value) {
      firebase.auth()
        .createUserWithEmailAndPassword(this._email.value, this._password1.value)
        .then((user) => {
          return user.updateProfile({
            //TODO: Validate display name
            displayName: this._displayName.value
          })
        })
        .then(user => {
          return firebase.database().ref('users').child(user.uid).set({
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
        <div className='login-text'>
          <div className='form-title'>log in</div>
          <a className='click' onClick={e => this.onModeClick(e, 'register')}>
          new? create an account here.
          </a>
        </div>
      )
      : (
        <div className='login-text'>
          <div className='form-title'>create an account</div>
          <a className='click' onClick={e => this.onModeClick(e, 'login')}>
          already have one? log in here.
          </a>
        </div>
      );
    return (
      <div className='login-container'>
        <form className='login-box' onSubmit={this.onFormSubmit}>
          {loginText}
          {!isLoginMode && 
          <input
            type='text'
            placeholder='display name'
            ref={node => this._displayName = node}
          />}
          <input
            type='email'
            placeholder='email address'
            ref={node => this._email = node}
          />
          <input
            type='password'
            placeholder='password'
            ref={node => this._password1 = node}
          />
          {!isLoginMode && 
          <input
            type='password'
            placeholder='confirm password'
            ref={node => this._password2 = node}
          />}
          <button className='button'>submit</button>
        </form>
      </div>
    );
  }
} 

export default LoginPage;
import React from 'react';
import { connect } from 'react-redux';
import { facebookLogin } from '../actions';
import { statusChangeCallback } from '../utils/facebookAuth';

class FacebookLoginButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFacebookSDKLoaded: false,
    }

    this.handleClick = this._handleClick.bind(this);
    this.onFacebookLoginSuccess = this._onFacebookLoginSuccess.bind(this);
    this.checkFacebookSDK = this._checkFacebookSDK.bind(this);
  }

  componentDidMount() {
    this.checkFacebookSDK();
  }

  _checkFacebookSDK() {
    if (this.state.isFacebookSDKLoaded) { return }

    if (!window.FB) {
      setTimeout(this.checkFacebookSDK, 100);
    } else {
      this.setState({isFacebookSDKLoaded: true});
      this.forceUpdate();
    }
  }

  _onFacebookLoginSuccess() {
    window.FB.api('/me?fields=id,name,email,permissions', (response) => {
      console.log('response', response);
      console.log('Successful login for: ' + response.name);
      console.log(`Thanks for loggin in ${response.name}`);
      console.log('avatar url', `http://graph.facebook.com/${response.id}/picture?type=normal`);
      this.props.facebookLogin({
        id: response.id,
        username: response.name,
        email: response.email || null,
      });
    });
  }

  _handleClick(event) {
    event.preventDefault();
    window.FB.getLoginStatus(response => {
      statusChangeCallback(response, this.onFacebookLoginSuccess);
    });
  }


  render() {
    if (!window.FB) {
      return null;
    }

    return (
      <div className="FacebookLoginButton__root">
        <button onClick={this.handleClick}>
          <i className="fa fa-facebook-official"/> Log in with facebook
        </button>
      </div>
    );
  }
}

export default connect(
  null,
  { facebookLogin }
)(FacebookLoginButton);
import React from "react";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";

//See the below documentation
//https://developers.google.com/identity/sign-in/web/reference

const CLIENT_ID =
  "962111814513-g1ua1np0naemaos41ve9uj7ggq0av4mb.apps.googleusercontent.com";

class GoogleAuth extends React.Component {
  componentDidMount() {
    // load the gapi library
    window.gapi.load("client:auth2", () => {
      // initializing the library
      window.gapi.client
        .init({
          clientId: CLIENT_ID,
          scope: "email",
        })
        .then(() => {
          //get the 'auth' object
          this.auth = window.gapi.auth2.getAuthInstance();
          this.onAuthChange(this.auth.isSignedIn.get());
          this.auth.isSignedIn.listen(this.onAuthChange);
        });
    });
  }

  onAuthChange = (isSignedIn) => {
    if (isSignedIn) {
      return this.props.signIn(this.auth.currentUser.get().getId());
    } else {
      this.props.signOut();
    }
  };

  onSignOutClick = () => {
    this.auth.signOut();
  };

  onSignInClick = () => {
    this.auth.signIn();
  };

  renderAuthButton() {
    if (this.props.isSignedIn === null) {
      return "Auth not loaded yet.";
    } else if (this.props.isSignedIn) {
      return (
        <button onClick={this.onSignOutClick} className="ui red google button">
          <i className="google icon"></i>
          Sign Out
        </button>
      );
    } else {
      return (
        <button onClick={this.onSignInClick} className="ui red google button">
          <i className="google icon"></i>
          Sign In
        </button>
      );
    }
  }

  render() {
    return <div className="item">{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);

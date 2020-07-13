import React from "react";
import { auth } from "../../Firebase";
import * as routes from "../../Constants/routes";

interface Props {
  history?: any;
}

interface State {
  error: any;
}

export class SignOutComponent extends React.Component<Props, State> {

  public onSubmit = (event: any) => {
    const { history } = this.props;

    auth.doSignOut()
      .then(() => {
        this.setState({error: null});
        history.push(routes.SIGN_IN);
      })
      .catch((e: any) => {
        this.setState({error: e});
      });

    event.preventDefault();
  };

  render() {
    return (
      <a className={'nav-link'} onClick={e => this.onSubmit(e)}>
        Sign Out
      </a>
    );
  }
}
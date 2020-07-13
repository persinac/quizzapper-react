import React from "react";
import { withRouter } from "react-router-dom";
import { SignOutComponent } from "./SignOut";

const SignUpComponent = ({ history }: { [key: string]: any }) => (
  <div>
    <SignOutComponent history={history}/>
  </div>
);

export const SignOut = withRouter(SignUpComponent);
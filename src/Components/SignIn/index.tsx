import React from "react";
import { withRouter } from "react-router-dom";
import '../../Styles/general.css';
import '../../Styles/signin.css';
import {Wrapper} from "./wrapper";

const SignInComponent = ({ history }: { [key: string]: any }) => (
	<Wrapper history={history}/>
);

export const SignIn = withRouter(SignInComponent);
import React from "react";
import Card from "react-bootstrap/Card";
import {GoogleSignIn} from "./GoogleSignIn";
import {SignUpLink} from "../SignUp";
import {PasswordForgetLink} from "../PasswordForget";
import {SignInForm} from "./SignInForm";
import {authUserContext} from "../../Firebase/AuthUserContext";
import * as routes from "../../Constants/routes";

interface InterfaceProps {
	history?: any;
	authUser?: any;
}

interface InterfaceState {
	renderChild: boolean;
}

export class Wrapper extends React.Component<InterfaceProps, InterfaceState> {
	constructor(props: InterfaceProps) {
		super(props);
		this.state = { renderChild: true };
	}

	public render() {
		return (
			<authUserContext.Consumer>
				{authUser => {
					// console.log(`History: ${this.props.history.location.pathname}`);
					// console.log(authUser);
					if(this.props.history.location.pathname === '/pw-forget' || this.props.history.location.pathname === '/signup') {
						// return <BackToSignIn />
						return null;
					} else if(!authUser) {
						return this.returnComponent()
					}
					}
				}
			</authUserContext.Consumer>
		);
	}

	public onSubmit = (event: any) => {
		this.props.history.push(routes.SIGN_IN);
	};

	private returnBackToSignIn() {
		return (
			<form onSubmit={event => this.onSubmit(event)}>
				<button type="submit" className="btn float-right login_btn">
					Back to Sign In
				</button>
			</form>
		)
	}

	private returnComponent() {
		return (
			<div className={"signin-container height-100"}>
			<div className="signin-child-container">
				<div className="d-flex justify-content-center h-100">
					<Card className={'signin-card'}>
						<div className="card-header">
							<h3>Sign In</h3>
							<div className="d-flex justify-content-end social_icon">
								<GoogleSignIn
									history={this.props.history}
								/>
							</div>
						</div>
						<div className="card-body">
							<SignInForm
								history={this.props.history}
							/>
						</div>
						<div className="card-footer">
							<SignUpLink />
							<PasswordForgetLink />
						</div>
					</Card>
				</div>
			</div>
		</div>
		);
	}
}
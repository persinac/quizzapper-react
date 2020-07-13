import React from "react";
import * as routes from "../../Constants/routes";
import '../../Styles/general.css'

interface InterfaceProps {
	history?: any;
	authUser?: any;
}

interface InterfaceState {
	renderChild: boolean;
}

export class BackToSignIn extends React.Component<InterfaceProps, InterfaceState> {
	constructor(props: InterfaceProps) {
		super(props);
	}
	public onSubmit = (event: any) => {
		this.props.history.push(routes.SIGN_IN);
	};

	private returnBackToSignIn() {
		return (
			<form onSubmit={event => this.onSubmit(event)} className={"width-100"}>
				<button type="submit" className="btn login_btn width-100">
					Back to Sign In
				</button>
			</form>
		)
	}

	render() {
		return this.returnBackToSignIn();
	}
}
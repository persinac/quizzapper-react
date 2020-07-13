import React from "react";
import * as routes from "../../Constants/routes";
import { auth } from "../../Firebase";
import {Roles} from "../../State";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface InterfaceProps {
	email?: string;
	error?: any;
	history?: any;
	password?: string;
}

interface InterfaceState {
	email: string;
	error: any;
	password: string;
	roles: Roles;
}

export class SignInForm extends React.Component<InterfaceProps, InterfaceState> {
	private static INITIAL_STATE = {
		email: "",
		error: {},
		password: "",
		roles: {
			isAdmin: true,
			isMember: true
		}
	};

	private static propKey(propertyName: string, value: any): object {
		return { [propertyName]: value };
	}

	constructor(props: InterfaceProps) {
		super(props);
		this.state = { ...SignInForm.INITIAL_STATE };
	}

	public onSubmit = (event: any) => {
		const { email, password } = this.state;
		const { history } = this.props;

		auth.doSignInWithEmailAndPassword(email, password)
			.then(() => {
				this.setState(() => ({ ...SignInForm.INITIAL_STATE }));
				history.push(routes.HOME);
			})
			.catch((error: any) => {
				this.setState(SignInForm.propKey("error", error));
			});

		event.preventDefault();
	};

	public render() {
		const { email, password, error } = this.state;
		return (
			<form onSubmit={event => this.onSubmit(event)}>
				<div className="input-group form-group">
					<div className="input-group-prepend">
	          <span className="input-group-text">
	              <FontAwesomeIcon icon={faUser}/>
	          </span>
					</div>
					<input
						value={email}
						onChange={event => this.setStateWithEvent(event, "email")}
						type="text"
						placeholder="Email Address"
						className="form-control"
					/>
				</div>
				<div className="input-group form-group">
					<div className="input-group-prepend">
	          <span className="input-group-text">
	              <FontAwesomeIcon icon={faUser}/>
	          </span>
					</div>
					<input
						value={password}
						onChange={event => this.setStateWithEvent(event, "password")}
						type="password"
						placeholder="Password"
						className="form-control"
					/>
				</div>
				<button type="submit" className="btn float-right login_btn">
					Sign In
				</button>

				<div className="input-group form-group">
					{error && <p className={"signin-error"}>{error.message}</p>}
				</div>
			</form>
		);
	}

	private setStateWithEvent(event: any, columnType: string): void {
		this.setState(SignInForm.propKey(columnType, (event.target as any).value));
	}
}
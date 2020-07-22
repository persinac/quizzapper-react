import React from "react";
import { Link } from 'react-router-dom';

import * as ROUTES from '../../Constants/routes';
import {ChangeEvent, FormEvent} from "react";
import { auth, db } from "../../Firebase";
import { Roles } from "../../State";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

interface ISignUpProps {
	email?: string;
	error?: any;
	history?: any;
	passwordOne?: string;
	passwordTwo?: string;
	username?: string;
};

interface IFormState {
	username: string,
	email: string,
	passwordOne: string,
	passwordTwo: string,
	error?: IError | null,
	roles: Roles
};

interface IError {
	message: string;
}

const INITIAL_STATE = {
	username: '',
	email: '',
	passwordOne: '',
	passwordTwo: '',
	error: {
		message: ""
	},
	roles: {
		isAdmin: false,
		isMember: true
	}
};

export class SignUpForm extends React.Component<ISignUpProps, Partial<IFormState>> {
	constructor(props: ISignUpProps) {
		super(props);
		this.state = {...INITIAL_STATE};
	}

	private onSubmit = (event: FormEvent<HTMLFormElement>) => {
		const { email, passwordOne, username, roles } = this.state;
		const { history } = this.props;
		if(email && passwordOne && username) {
			auth.doCreateUserWithEmailAndPassword(email, passwordOne)
				.then((authUser: any) => {
					this.setState({...INITIAL_STATE});
					// Create a user in your own accessible Firebase Database too
					db.doCreateUser(authUser.user.uid, username, email, roles)
						.then(() => {
							this.setState(() => ({...INITIAL_STATE}));
							history.push(ROUTES.HOME);
						})
						.catch((error: any) => {
							this.setState(error);
						});
				})
				.catch((error: any) => {
					this.setState(error);
				});
		}
		event.preventDefault();
	};

	private onChange = (event: ChangeEvent<HTMLInputElement>) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const {
			username,
			email,
			passwordOne,
			passwordTwo,
			error
		} = this.state;

		const isInvalid =
			passwordOne !== passwordTwo ||
			passwordOne === '' ||
			email === '' ||
			username === '';

		return (
			<form onSubmit={this.onSubmit}>
				<div className="input-group form-group">
					<div className="input-group-prepend">
            <span className="input-group-text">
              <FontAwesomeIcon icon={faUser}/>
            </span>
					</div>
					<input
						name="username"
						value={username}
						onChange={this.onChange}
						type="text"
						placeholder="Full Name"
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
					name="email"
					value={email}
					onChange={this.onChange}
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
					name="passwordOne"
					value={passwordOne}
					onChange={this.onChange}
					type="password"
					placeholder="Password"
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
					name="passwordTwo"
					value={passwordTwo}
					onChange={this.onChange}
					type="password"
					placeholder="Confirm Password"
					className="form-control"
				/>
				</div>
				<button disabled={isInvalid} type="submit" className="btn login_btn">Sign Up</button>

				{error && <p>{error.message}</p>}
			</form>
		);
	}
}

export const SignUpLink = () => (
	<p>Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link></p>
);
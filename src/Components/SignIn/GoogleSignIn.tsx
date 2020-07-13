import React from "react";
import * as routes from "../../Constants/routes";
import { auth, db } from "../../Firebase";
import {Roles} from "../../State";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from '@fortawesome/free-brands-svg-icons'

interface InterfaceProps {
	history?: any;
}

interface InterfaceState {
	error: any;
	roles: Roles;
	authUser?: any;
}

export class GoogleSignIn extends React.Component<InterfaceProps, InterfaceState> {
	private static INITIAL_STATE = {
		error: "",
		roles: {
			isAdmin: false,
			isMember: true
		}
	};

	private static propKey(propertyName: string, value: any): object {
		return { [propertyName]: value };
	}

	constructor(props: InterfaceProps) {
		super(props);
		this.state = { ...GoogleSignIn.INITIAL_STATE };
	}

	public onSubmit = (event: any) => {
		const { history } = this.props;

		auth.doSignInWithGoogle()
			.then((socialAuthUser: any) => {

				// query server for list of allowed users/emails
				// redirect if email is not found?
				// this.setState({error: null});
				history.push(routes.HOME);
				// const roles = {isAdmin: false, isMember: true};
				if(socialAuthUser.additionalUserInfo.isNewUser === true) {
					db.doCreateUser(socialAuthUser.user.uid, socialAuthUser.user.email, socialAuthUser.user.email, {isAdmin: false, isMember: true})
						.then(() => {
							console.log('Successfully created user inFirebase DB');
							this.setState(() => ({...GoogleSignIn.INITIAL_STATE}));
							history.push(routes.HOME);
						})
						.catch((error: any) => {
							this.setState(error);
						})
				} else {
					db.getUserById(socialAuthUser.user.uid)
						.then(snapshot => {
							const dbUser = snapshot.val();
							// default empty roles
							if(dbUser !== undefined && dbUser !== null) {
								if (!dbUser.roles) {
									dbUser.roles = {};
								}
								this.setState({authUser: {
										uid: socialAuthUser.user.uid,
										email: socialAuthUser.user.email,
										roles: dbUser.roles,
										...dbUser
									}});
								history.push(routes.HOME);
							}
						})
						.catch((e) => {
							console.log(e);
						})
				}
			})
			.catch((e: any) => {
				this.setState({error: e});
			});

		event.preventDefault();
	};

	public render() {
		const { error } = this.state;
		return (

			<form onClick={e => this.onSubmit(e)}>
            <span>
              <FontAwesomeIcon icon={faGoogle}/>
            </span>
				{error && <p>{error.message}</p>}
			</form>
		);
	}

	private setStateWithEvent(event: any, columnType: string): void {
		this.setState(GoogleSignIn.propKey(columnType, (event.target as any).value));
	}
}
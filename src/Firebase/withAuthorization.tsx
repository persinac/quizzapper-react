import React from "react";
import {withRouter} from "react-router-dom";
import {firebase, db} from "./index";
import {authUserContext} from "./AuthUserContext";
import {ComponentType} from "react";
import {Roles} from "../State";

interface InterfaceProps {
	history?: any;
	roles?: Roles;
}

export const withAuthorization = (condition: any, routeRedirect?: any) => (Component: ComponentType, extras?: any) => {
	class WithAuthorization extends React.Component<InterfaceProps, {}> {
		constructor(props: InterfaceProps) {
			super(props);
		}

		public componentDidMount() {
			firebase.auth.onAuthStateChanged((authUser: any) => {
				authUser ?
					db
						.getUserById(authUser.uid)
						.then(snapshot => {
							const dbUser = snapshot.val();
							// default empty roles
							if(dbUser !== undefined && dbUser !== null) {
								if (!dbUser.roles) {
									dbUser.roles = {};
								}
								// merge auth and db user
								authUser = {
									uid: authUser.uid,
									email: authUser.email,
									roles: dbUser.roles,
									...dbUser
								};
								this.setState({authUser: authUser});
							}
						})
						.catch((e) => {
							console.log(e);
						})
					: this.setState({authUser: null})
			})
		}

		public render() {
			return (
				<authUserContext.Consumer>
					{authUser => {
						return (authUser ? <Component {...authUser} /> : null)
					}
					}
				</authUserContext.Consumer>
			);
		}
	}

	return withRouter(WithAuthorization as any);
};

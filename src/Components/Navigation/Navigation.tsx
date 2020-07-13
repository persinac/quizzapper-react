import React from 'react';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../Constants/routes';
import {SignOut} from '../SignOut';
import {authUserContext} from '../../Firebase/AuthUserContext';
import Nav from "react-bootstrap/Nav";
import * as ROLES from "../../Constants/roles";

interface INavState {
	authUser: any
}

interface INavProps {
	authUser: any
}

class NavigationComponent extends React.Component {
	constructor(props: any) {
		super(props);

		this.state = {
			users: null
		};
	}

	public componentDidMount() { }

	public render() {
		// console.log(this.state);
		return (
			<authUserContext.Consumer>
				{authUser => {
					return (authUser ? this.returnAuthorizedLogin(!!authUser.roles[ROLES.ADMIN]) : this.returnNonAuthorizedLogin())
				}
				}
			</authUserContext.Consumer>
		);
	}

	private returnNonAuthorizedLogin() {
		return (<div></div>);
	}

	private returnAuthorizedLogin(isAdmin: boolean) {
		return (
			<Nav id={'primary-navbar'} className={'navbar navbar-expand-lg navbar-dark sticky-top bg-dark flex-md-nowrap p-0'}>
				<div className={'navbar-brand col-sm-3 col-md-2 mr-0'}><a>Practice Tester</a></div>
				{/*<button className={"navbar-toggler"} type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
				        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className={"navbar-toggler-icon"}></span>
				</button>*/}
				<div className={'navbar-collapse'} id="navbarSupportedContent">
					<ul className={'navbar-nav mr-auto'}>
						<li className={"nav-item active"}>
							<Link className={"nav-link"} to={ROUTES.HOME} onClick={(event) => {
								this.removeActiveClasses();
								(event.target as any).classList.toggle('active')
							}
							}>Home</Link>
						</li>
						<li className={"nav-item"}>
							<Link className={"nav-link"} to={ROUTES.ACCOUNT} onClick={(event) => {
								this.removeActiveClasses();
								(event.target as any).classList.toggle('active')
							}
							}>Account</Link>
						</li>
						{isAdmin ? this.showAdmin() : null}
						<li className={"nav-item"}>
							<Link className={"nav-link"} to={ROUTES.LIST_OF_TEST_ATTEMPTS} onClick={(event) => {
								this.removeActiveClasses();
								(event.target as any).classList.toggle('active')
							}
							}>List of Test Attempts</Link>
						</li>
						<li className={"nav-item"}>
							<Link className={"nav-link"} to={ROUTES.TAKE_TEST} onClick={(event) => {
								this.removeActiveClasses();
								(event.target as any).classList.toggle('active')
							}
							}>Take Test</Link>
						</li>
					</ul>
				</div>
				<ul className={'navbar-nav px-3'}>
					<li className={'nav-item text-nowrap'}>
						<SignOut/>
					</li>
				</ul>
			</Nav>
		)
	}

	private removeActiveClasses(): void {
		[...document.querySelectorAll('.active')].forEach(function(e) {
			e.classList.remove('active');
		});
	}

	private showAdmin() {
		return (<li className={"nav-item"}>
			<Link className={"nav-link"} to={ROUTES.ADMIN} onClick={(event) => {
				this.removeActiveClasses();
				(event.target as any).classList.toggle('active')
			}
			}>Admin</Link>
		</li>)
	}
}

const authCondition = (authUser: any) => {
	return !!authUser
} ;

export const Navigation = NavigationComponent;

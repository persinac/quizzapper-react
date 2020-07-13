import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as routes from '../../Constants/routes';
import { SignUpForm } from './SignUp';
import '../../Styles/signup.css';
import '../../Styles/signin.css';
import Card from 'react-bootstrap/Card';
import {BackToSignIn} from '../General/BackToSignIn';

const SignUpComponent = ({ history }: { [key: string]: any }) => (
	<div className={'signin-container height-100'}>
		<div className={'signin-child-container'}>
			<div className='d-flex justify-content-center h-100'>
				<Card className={'signin-card signup-height'}>
					<div className='card-header'>
						<h3>Sign Up</h3>
					</div>
					<div className='card-body'>
						<SignUpForm history={history}/>
					</div>
					<div className='card-footer signup-card-footer'>
						<BackToSignIn history={history}/>
					</div>
				</Card>
			</div>
		</div>
	</div>
);

export const SignUpLink = () => (
		<div className='d-flex justify-content-center links'>
			Don't have an account? <Link to={routes.SIGN_UP}>Sign Up</Link>
		</div>
);

export const SignUp = withRouter(SignUpComponent);
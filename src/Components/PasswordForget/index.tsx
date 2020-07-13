import React from 'react';
import { Link } from 'react-router-dom';
import { PasswordForgetForm } from './PasswordForgetForm';
import Card from 'react-bootstrap/Card';
import {BackToSignIn} from '../General/BackToSignIn';
import '../../Styles/signup.css';
import '../../Styles/signin.css';

export const PasswordForget = ({ history }: { [key: string]: any }) => (
	<div className={'signin-container height-100'}>
		<div className={'signin-child-container'}>
			<div className='d-flex justify-content-center h-100'>
				<Card className={'signin-card signup-height'}>
					<div className='card-header'>
						<h3>Password Forget</h3>
					</div>
					<div className='card-body'>
						<PasswordForgetForm />
					</div>
					<div className='card-footer signup-card-footer'>
						<BackToSignIn history={history}/>
					</div>
				</Card>
			</div>
		</div>
	</div>
);

export const PasswordForgetLink = () => (
	<div className='d-flex justify-content-center'>
		<Link to='/pw-forget'>Forgot Password?</Link>
	</div>
);
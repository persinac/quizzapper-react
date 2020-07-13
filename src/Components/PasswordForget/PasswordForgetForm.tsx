import React from "react";
import { auth } from "../../Firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import '../../Styles/general.css'

export class PasswordForgetForm extends React.Component {
	private static INITIAL_STATE = {
		email: "",
		error: {}
	};

	private static propKey(propertyName: string, value: string) {
		return { [propertyName]: value };
	}

	constructor(props: any) {
		super(props);

		this.state = { ...PasswordForgetForm.INITIAL_STATE };
	}

	public onSubmit = (event: any) => {
		const { email }: any = this.state;

		auth
			.doPasswordReset(email)
			.then(() => {
				this.setState(() => ({ ...PasswordForgetForm.INITIAL_STATE }));
			})
			.catch((error: any) => {
				this.setState(PasswordForgetForm.propKey("error", error));
			});

		event.preventDefault();
	};

	public render() {
		const { email, error }: any = this.state;
		const isInvalid = email === "";

		return (
			<form onSubmit={(event) => this.onSubmit(event)}>
				<div className="input-group form-group">
					<div className="input-group-prepend">
	          <span className="input-group-text">
	              <FontAwesomeIcon icon={faUser}/>
	          </span>
					</div>
					<input
						value={email}
						onChange={(event) => this.setStateWithEvent(event, "email")}
						type="text"
						placeholder="Email Address"
						className="form-control"
					/>
				</div>
				<button disabled={isInvalid} type="submit" className="btn login_btn width-50">
					Reset My Password
				</button>

				<div className="input-group form-group">
					{error && <p className={"signin-error"}>{error.message}</p>}
				</div>
			</form>
		);
	}

	private setStateWithEvent(event: any, columnType: string): void {
		this.setState(
			PasswordForgetForm.propKey(columnType, (event.target as any).value)
		);
	}
}
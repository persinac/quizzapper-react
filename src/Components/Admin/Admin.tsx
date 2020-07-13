import React from "react";

interface InterfaceProps {
	users?: any;
	some_data?: any;
}

export class Admin extends React.Component<InterfaceProps, {}> {
	constructor(props: any) {
		super(props);
	}

	public render() {
		const {users, some_data}: any = this.props;
		return (
			<div>
				<h4>List of User name</h4>
				<p>(Saved on Sign Up in Firebase Database)</p>

				<ul>
					{Object.keys(users).map(key => {
						return <li key={key}>{users[key].username}</li>;
					})}
				</ul>
				<p></p>
				<div>
					<ul>
						{!!some_data && Object.keys(some_data).map(key => {
							return <li key={key}>{some_data[key].order_num}</li>;
						})}
					</ul>
				</div>
			</div>
		);
	}
}

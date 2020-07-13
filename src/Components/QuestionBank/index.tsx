import React from 'react';
import '../../Styles/general.css';
import {authUserContext} from "../../Firebase/AuthUserContext";
import {QuestionBank} from "./QuestionBank";

interface IProps {}

interface IState {}

class QuestionBankComponent extends React.Component<IProps, IState> {

	constructor(props: any) {
		super(props);
	}

	public componentDidMount() {}

	public render() {
		return (
			<div className={'container'}>
				<div className={'row'}>
				<div className={'width-100'}>
					{this.renderList()}
				</div>
			</div>
			</div>
		);
	}

	private renderList() {
		return (
			<authUserContext.Consumer>
				{authUser => {
					return <QuestionBank authUser={authUser}/>
				}}
			</authUserContext.Consumer>
		)
	}
}

export const QuestionBankPage = QuestionBankComponent;

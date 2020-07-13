import React from "react";
import {IQuestion} from "../../State";
import {Link} from "react-router-dom";
import {CallbackButton} from "../General/CallbackButton";
import {Question} from "./Question";
import {InputTypes} from "../../Enums/inputTypes";
import {authUserContext} from "../../Firebase/AuthUserContext";
const rp = require('request-promise');

interface InterfaceProps {
	authUser?: any;
}

interface IState {
	doesContainShow?: boolean;
	questions?: IQuestion[];
	selectedQuestion?: IQuestion;
	currentPage?: number;
	isNewQuestion?: boolean;
}

export class QuestionBank extends React.Component<InterfaceProps, IState> {
	private post_options = {
		method: 'POST',
		uri: '',
		body: {
			some: 'payload'
		},
		json: true // Automatically stringifies the body to JSON
	};
	constructor(props: any) {
		super(props);

		this.setSelectedQuestionStateWithEvent = this.setSelectedQuestionStateWithEvent.bind(this);
		this.updateQuestionHandler = this.updateQuestionHandler.bind(this);

		this.state = {doesContainShow: false, currentPage: 0};
	}

	public postServerData(body: any, endpoint: string, put: boolean): Promise<any> {
		this.post_options.body = body;
		this.post_options.uri = process.env.REACT_APP_BASE_API_URL + endpoint;
		this.post_options.method = put ? 'PUT' : 'POST';
		return rp(this.post_options)
			.then((parsedBody: any) => {
				return parsedBody;
			})
			.catch((err: any) => {
				return err;
			});
	}

	public componentDidMount() {
		// this will need to be a view in order to get all the data we want to highlight
		const questionURL = process.env.REACT_APP_BASE_API_URL + 'question';
		this.getServerData(questionURL).then(d => {
			const parsedD = JSON.parse(d);
			this.setState({questions: parsedD});
		});
	}

	public shouldComponentUpdate(nextProps: Readonly<InterfaceProps>, nextState: Readonly<IState>, nextContext: any): boolean {
		let shouldUpdate = false;

		if (this.state.currentPage !== nextState.currentPage) {
			shouldUpdate = true;
		} else if (this.state.questions !== nextState.questions) {
			shouldUpdate = true;
		} else if (this.state.selectedQuestion !== nextState.selectedQuestion) {
			shouldUpdate = true;
		}

		return shouldUpdate;
	}

	public getServerData = (builtURI: string): Promise<any> => {
		return rp(builtURI)
			.then((d: any) => {
				return d;
			})
			.catch((e: any) => {
				console.log('ERROR!!!!');
				console.log(e);
			});
	};

	public render() {
		if(this.state.currentPage === 0) {
			return this.renderCard();
		} else {
			return this.renderSummaryDetails();
		}

	}

	private renderCard() {
		return (
			<authUserContext.Consumer>
				{authUser => {
				 return <div className={'table-responsive'}>
					<table className={'table table-striped table-sm'}>
						<thead>
							<tr>
								<th>Question</th>
								<th>Category</th>
								<th>Sub-Category</th>
								<th>Style</th>
								<th>Difficulty</th>
								<th>Is Active</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{this.buildProductHeaderTRs()}
						</tbody>
					</table>
					<div>
						<CallbackButton callback={() => {this.createNewQuestion(authUser)}} text={"Create New Question"} theme={"info"}/>
					</div>
				</div>
				}}
			</authUserContext.Consumer>
		);
	}

	private renderSummaryDetails() {
		return (
			<div>
				<div>
					<CallbackButton callback={() => {this.backToSummaryList()}} text={"Back to Summary List"} theme={"info"}/>
				</div>
				<div>
					<Question
						selectedQuestion={this.state.selectedQuestion}
						submitHandler={this.setSelectedQuestionStateWithEvent}
						updateQuestionHandler={this.updateQuestionHandler}
						isNewQuestion={this.state.isNewQuestion}
					/>
				</div>
			</div>
		);
	}

	private buildProductHeaderTRs() {
		const {questions} = this.state;
		if (!!questions && questions.length > 0) {
			return questions.map((q: IQuestion) => {
				return (

					<tr key={q.questionID}>
						<td>{q.question}</td>
						<td>{q.category}</td>
						<td>{q.subCategory}</td>
						<td>{q.style}</td>
						<td>{q.difficulty}</td>
						<td>{q.isActive}</td>
						<td>
							<CallbackButton callback={() => {this.loadQuestionDetails(q.questionID)}} text={"View"} theme={"info"}/>
						</td>
					</tr>
				)
			});
		}
	}

	private loadQuestionDetails(id: number) {
		const testSummaryURL = process.env.REACT_APP_BASE_API_URL + 'question/' + id;
		this.getServerData(testSummaryURL).then(d => {
			const parsedD = JSON.parse(d);
			this.setState({selectedQuestion: parsedD, currentPage: 1});
		});
	}

	private backToSummaryList() {
		const questionURL = process.env.REACT_APP_BASE_API_URL + 'question';
		this.getServerData(questionURL).then(d => {
			const parsedD = JSON.parse(d);
			this.setState({questions: parsedD, currentPage: 0, selectedQuestion: null, isNewQuestion: null});
		});
	}

	private createNewQuestion(authUser: any) {
		this.setState({
			currentPage: 1,
			selectedQuestion: {
				createdBy: authUser.username,
				createdDatetime: new Date(),
				modifiedBy: authUser.username,
				modifiedDatetime: new Date(),
				isActive: 1
			},
			isNewQuestion: true
		});
	}

	/* generic state handler with event */
	private setSelectedQuestionStateWithEvent(event: any, columnType: string, type: number): void {
		let val = "";
		if (type === InputTypes.SELECT) {
			val = event.value;
		} else if (type === InputTypes.RADIO) {
			val = event.value;
		} else if (type === InputTypes.CHECKBOX) {
			val = event.target.checked;
		} else {
			val = (event.target as any).value;
		}
		// console.log(val);
		this.setState((prevState) => ({
			selectedQuestion: {
				...prevState.selectedQuestion,
				[columnType]: val
			}
		}));
	}

	/* generic state handler with event */
	private updateQuestionHandler(question: IQuestion): void {
		// console.log(val);
		question.appianVersion = "";
		question.documentation = "";
		question.helperTextOne = "";
		question.helperTextTwo = "";
		this.postServerData(question, "question", false)
			.then((v: IQuestion) => {
				this.setState(() => ({
					selectedQuestion: v
				}));
			});

	}
}

// @ts-ignore
export default function Td({ children, to }) {
	// Conditionally wrapping content into a link
	const ContentTag = to ? Link : 'div';

	return (
		<td>
			<ContentTag to={to}>{children}</ContentTag>
		</td>
	);
}
import React from "react";
import {IPagination, IQuestion, ISort} from "../../State";
import {Link} from "react-router-dom";
import {CallbackButton} from "../General/CallbackButton";
import {Question} from "./Question";
import {InputTypes} from "../../Enums/inputTypes";
import {authUserContext} from "../../Firebase/AuthUserContext";
import {getServerData, postServerData} from "../../Utility/APIRequests/getOrRequestData";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faDungeon} from "@fortawesome/free-solid-svg-icons";
import {GridPaging} from "../General/GridPaging";

interface InterfaceProps {
	authUser?: any;
}

interface IState {
	doesContainShow?: boolean;
	questions?: IQuestion[];
	selectedQuestion?: IQuestion;
	currentPage?: number;
	isNewQuestion?: boolean;
	paging?: IPagination;
	sorting?: ISort[];
	totalQuestionCount?: number;
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
	private static INITIAL_PAGING = {startIndex: 0, batchSize: 10};
	private static INITIAL_SORT = [{sortBy: "questionId", ascDesc: "ASC"}];
	constructor(props: any) {
		super(props);

		this.setSelectedQuestionStateWithEvent = this.setSelectedQuestionStateWithEvent.bind(this);
		this.updateQuestionHandler = this.updateQuestionHandler.bind(this);

		this.state = {
			doesContainShow: false,
			currentPage: 0,
			paging: QuestionBank.INITIAL_PAGING,
			sorting: QuestionBank.INITIAL_SORT
		};
	}

	public componentDidMount() {
		// this will need to be a view in order to get all the data we want to highlight
		postServerData(
			{
				pagination: this.state.paging,
				sort: this.state.sorting
			},
			'question',
			false
		).then((d: any) => {
			console.log(d);
			const parsedD = d.data.totalCount > 0 ? d.data : [];
			this.setState({
				questions: parsedD.questions,
				totalQuestionCount: parsedD.totalCount
			});
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
								<th>Topic</th>
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
					 <GridPaging
						 paging={this.state.paging}
						 forwardPageCallback={() => {this.forwardPage()}}
						 backwardPageCallback={() => {this.backwardPage()}}
						 totalCount={this.state.totalQuestionCount}
					 />
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
						<td>{q.testTopic}</td>
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
		getServerData(testSummaryURL).then(d => {
			const parsedD = d.data.questionID !== undefined ? d.data : [];
			this.setState({selectedQuestion: parsedD, currentPage: 1});
		});
	}

	private forwardPage() {
		console.log(this.state);
		if ((this.state.paging.startIndex + this.state.paging.batchSize) <= this.state.totalQuestionCount) {
			this.pageThroughTable(this.state.paging.startIndex + this.state.paging.batchSize)
		}
	}

	private backwardPage() {
		if (this.state.paging.startIndex > 0) {
			this.pageThroughTable(this.state.paging.startIndex - this.state.paging.batchSize)
		}
	}

	private pageThroughTable(newStartIndex: number) {
		let {paging, sorting} = this.state;
		paging.startIndex = newStartIndex;
		postServerData(
			{
				pagination: paging,
				sort: sorting
			},
			'question',
			false
		).then(d => {
			const parsedD = d.data.totalCount > 0 ? d.data : [];
			this.setState({
				questions: parsedD.questions,
				paging: paging,
				totalQuestionCount: parsedD.totalCount
			});
		});
	}

	private backToSummaryList() {
		postServerData(
			{
				pagination: QuestionBank.INITIAL_PAGING,
				sort: QuestionBank.INITIAL_SORT
			},
			'question',
			false
		).then(d => {
			const parsedD = d.data.totalCount > 0 ? d.data : [];
			this.setState({
				questions: parsedD.questions,
				currentPage: 0,
				selectedQuestion: null,
				isNewQuestion: null,
				paging: QuestionBank.INITIAL_PAGING,
				sorting: QuestionBank.INITIAL_SORT,
				totalQuestionCount: parsedD.totalCount
			});
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
		question.softwareVersion = "";
		question.documentation = "";
		question.helperTextOne = "";
		question.helperTextTwo = "";
		postServerData(question, "question/update", false)
			.then((d: any) => {
				console.log(d);
				const parsedD = d.data.questionID !== undefined ? d.data : [];
				this.setState(() => ({
					selectedQuestion: parsedD
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
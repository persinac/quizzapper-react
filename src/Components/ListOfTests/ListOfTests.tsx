import React from "react";
import {ITestAttemptDetailView, ITestSummary} from "../../State";
import {Link} from "react-router-dom";
import {CallbackButton} from "../General/CallbackButton";
import {TestSummaryPage} from "../TestSummaryDetail";
import {getServerData, postServerData} from "../../Utility/APIRequests/getOrRequestData";

interface InterfaceProps {
	authUser?: any;
	fromAdmin: boolean;
}

interface IState {
	doesContainShow?: boolean;
	testSummary?: ITestSummary[];
	selectedSummary?: ITestSummary;
	selectedSummaryDetails?: ITestAttemptDetailView[];
	currentPage?: number;
	summaryID?: number;
}

export class ListOfTests extends React.Component<InterfaceProps, IState> {
	constructor(props: any) {
		super(props);
		this.state = {doesContainShow: false, currentPage: 0};
	}

	public componentDidMount() {
		// this will need to be a view in order to get all the data we want to highlight
		if (this.props.fromAdmin) {
			const testSummaryURL = process.env.REACT_APP_BASE_API_URL + 'test-summary';
			getServerData(testSummaryURL)
				.then((d) => {
					console.log(d);
					const parsedD = d.data.length > 0 ? JSON.parse(d.data) : [];
					this.setState({testSummary: parsedD});
				})
				.catch((e) => {
					console.log(e)
				});
		} else {
			if (!!this.props.authUser.username) {
				postServerData(
					{username: this.props.authUser.username},
					"test-summary",
					false
				).then((d: any) => {
					console.log(d);
					const parsedD = d.data.length > 0 ? JSON.parse(d.data) : [];
					this.setState({
						testSummary: parsedD
					});
				})
				.catch((e) => {
					console.log(e)
				});
			}
		}
	}

	public shouldComponentUpdate(nextProps: Readonly<InterfaceProps>, nextState: Readonly<IState>, nextContext: any): boolean {
		let shouldUpdate = false;

		if (this.state.currentPage !== nextState.currentPage) {
			shouldUpdate = true;
		} else if (this.state.testSummary !== nextState.testSummary) {
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
			<div className={'table-responsive'}>
				<table className={'table table-striped table-sm'}>
					<thead>
						<tr>
							<th>Topic</th>
							<th>Level</th>
							<th>Grade</th>
							<th># Correct</th>
							<th>Duration</th>
							<th>Within Time Limit</th>
							<th>User</th>
							<th>Taken on</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{this.buildProductHeaderTRs()}
					</tbody>
				</table>
			</div>
		);
	}

	private renderSummaryDetails() {
		return (
			<div>
				<div>
					<CallbackButton callback={() => {this.backToSummaryList()}} text={"Back to Summary List"} theme={"info"}/>
				</div>
				<div>
					<TestSummaryPage
						fromAdmin={this.props.fromAdmin}
						summaryID={this.state.summaryID}
						testSummary={this.state.selectedSummary}
						selectedSummaryDetails={this.state.selectedSummaryDetails}
					/>
				</div>
			</div>
		);
	}

	private buildProductHeaderTRs() {
		const {testSummary} = this.state;
		if (!!testSummary && testSummary.length > 0) {
			return testSummary.map((ts: ITestSummary) => {
				return (

					<tr key={ts.testSummaryID}>
						<td>TBD</td>
						<td>TBD</td>
						<td>{(ts.grade*100)}%</td>
						<td>{ts.numberCorrect}</td>
						<td>{ts.duration}</td>
						<td>{ts.withinTimeLimit}</td>
						<td>{ts.createdBy}</td>
						<td>{ts.createdDatetime}</td>
						<td>
							<CallbackButton callback={() => {this.loadSummaryDetails(ts.testSummaryID)}} text={"View"} theme={"info"}/>
						</td>
					</tr>
				)
			});
		}
	}

	private loadSummaryDetails(summaryID: number) {
		const testSummaryURL = process.env.REACT_APP_BASE_API_URL + 'test-summary/detail/' + summaryID;
		getServerData(testSummaryURL)
			.then((d: any) => {
				console.log(d);
				const parsedD = d.data.length > 0 ? JSON.parse(d.data) : [];
				this.setState({selectedSummaryDetails: parsedD, currentPage: 1, summaryID: summaryID});
			})
			.catch((e) => {
				console.log(e)
			});
	}

	private backToSummaryList() {
		this.setState({currentPage: 0, selectedSummaryDetails: null, summaryID: null});
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
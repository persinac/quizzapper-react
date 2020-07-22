import React from "react";
import {IPagination, ISort, ITestAttemptDetailView, ITestSummary} from "../../State";
import {Link} from "react-router-dom";
import {CallbackButton} from "../General/CallbackButton";
import {TestSummaryPage} from "../TestSummaryDetail";
import {GridPaging} from "../General/GridPaging";
import {backwardPage, forwardPage, pageThroughTable} from "../../Utility/APIRequests/paging";

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
	paging?: IPagination;
	sorting?: ISort[];
	totalTestCount?: number;
	summaryDetailPaging?: IPagination;
	summaryDetailSorting?: ISort[];
	summaryDetailTotalCount?: number;
}

export class ListOfTests extends React.Component<InterfaceProps, IState> {
	private static INITIAL_PAGING = {startIndex: 0, batchSize: 2};
	private static INITIAL_SORT = [{sortBy: "createdDatetime", ascDesc: "ASC"}];
	private static INITIAL_SUMMARY_DETAILS_PAGING = {startIndex: 0, batchSize: 10};
	private static INITIAL_SUMMARY_DETAILS_SORT = [{sortBy: "id", ascDesc: "ASC"}];

	constructor(props: any) {
		super(props);
		this.state = {
			doesContainShow: false,
			currentPage: 0,
			paging: ListOfTests.INITIAL_PAGING,
			sorting: ListOfTests.INITIAL_SORT,
			summaryDetailPaging: ListOfTests.INITIAL_SUMMARY_DETAILS_PAGING,
			summaryDetailSorting: ListOfTests.INITIAL_SUMMARY_DETAILS_SORT,
			summaryDetailTotalCount: 0
		};
	}

	public componentDidMount() {
		this.pageThroughTable("");
	}

	public shouldComponentUpdate(nextProps: Readonly<InterfaceProps>, nextState: Readonly<IState>, nextContext: any): boolean {
		let shouldUpdate = false;

		if (this.state.currentPage !== nextState.currentPage) {
			shouldUpdate = true;
		} else if (this.state.testSummary !== nextState.testSummary) {
			shouldUpdate = true;
		} else if (this.state.paging !== nextState.paging) {
			shouldUpdate = true;
		} else if (this.state.summaryDetailPaging !== nextState.summaryDetailPaging) {
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
			<div>
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
				<GridPaging
					paging={this.state.paging}
					forwardPageCallback={() => {this.pageThroughTable("F")}}
					backwardPageCallback={() => {this.pageThroughTable("B")}}
					totalCount={this.state.totalTestCount}
				/>
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
						paging={this.state.summaryDetailPaging}
						sorting={this.state.summaryDetailSorting}
						totalCount={this.state.summaryDetailTotalCount}
						pageForwardCallback={() => {this.pageThroughSummaryTable("F")}}
						pageBackwardCallback={() => {this.pageThroughSummaryTable("B")}}
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

	private pageThroughTable(direction: string) {
		let {paging, sorting} = this.state;
		let newStartIndex: number = 0;
		if (direction === "F") {
			newStartIndex = forwardPage(paging.startIndex, paging.batchSize, this.state.totalTestCount);
		} else if (direction === "B") {
			newStartIndex = backwardPage(paging.startIndex, paging.batchSize);
		}
		paging.startIndex = newStartIndex;
		let endpoint = "test-summary/all";
		if (this.props.fromAdmin) {
			endpoint = "test-summary/all";
		} else {
			if (!!this.props.authUser.username) {
				endpoint = `test-summary/${this.props.authUser.username}`;
			}
		}

		pageThroughTable(
			endpoint,
			paging,
			sorting,
			newStartIndex
		).then((d: any) => {
			console.log(d);
			const parsedD = d.data.totalCount > 0 ? d.data : [];
			this.setState({
				testSummary: parsedD.testSummary,
				totalTestCount: parsedD.totalCount,
				paging: paging
			});
		})
			.catch((e) => {
				console.log(e)
			});
	}

	private pageThroughSummaryTable(direction: string) {
		let {summaryDetailPaging, summaryDetailSorting} = this.state;
		let newStartIndex: number = 0;
		if (direction === "F") {
			newStartIndex = forwardPage(summaryDetailPaging.startIndex, summaryDetailPaging.batchSize, this.state.summaryDetailTotalCount);
		} else if (direction === "B") {
			newStartIndex = backwardPage(summaryDetailPaging.startIndex, summaryDetailPaging.batchSize);
		}
		const endpoint = `test-summary/detail/${this.state.summaryID}`;

		pageThroughTable(
			endpoint,
			{startIndex: newStartIndex, batchSize: summaryDetailPaging.batchSize},
			summaryDetailSorting,
			newStartIndex
		).then((d: any) => {
			const parsedD = d.data.totalCount > 0 ? d.data : [];
			this.setState({
				selectedSummaryDetails: parsedD.testAttemptDetails,
				summaryDetailTotalCount: parsedD.totalCount,
				summaryDetailSorting: summaryDetailSorting,
				summaryDetailPaging: {startIndex: newStartIndex, batchSize: summaryDetailPaging.batchSize}
			});
		})
			.catch((e) => {
				console.log(e)
			});
	}

	private loadSummaryDetails(summaryID: number) {
		let {summaryDetailPaging, summaryDetailSorting} = this.state;
		const newStartIndex: number = 0;
		summaryDetailPaging = ListOfTests.INITIAL_SUMMARY_DETAILS_PAGING;
		summaryDetailSorting = ListOfTests.INITIAL_SUMMARY_DETAILS_SORT;
		const endpoint = `test-summary/detail/${summaryID}`;

		pageThroughTable(
			endpoint,
			summaryDetailPaging,
			summaryDetailSorting,
			newStartIndex
		).then((d: any) => {
			const parsedD = d.data.totalCount > 0 ? d.data : [];
			this.setState({
				summaryID: summaryID,
				currentPage: 1,
				selectedSummaryDetails: parsedD.testAttemptDetails,
				summaryDetailTotalCount: parsedD.totalCount,
				summaryDetailSorting: summaryDetailSorting,
				summaryDetailPaging: summaryDetailPaging
			});
		})
			.catch((e) => {
				console.log(e)
			});
	}

	private backToSummaryList() {
		this.setState({
			currentPage: 0,
			selectedSummaryDetails: null,
			summaryID: null,
			paging: ListOfTests.INITIAL_PAGING,
			sorting: ListOfTests.INITIAL_SORT,
			summaryDetailPaging: ListOfTests.INITIAL_SUMMARY_DETAILS_PAGING,
			summaryDetailSorting: ListOfTests.INITIAL_SUMMARY_DETAILS_SORT,
			summaryDetailTotalCount: 0
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
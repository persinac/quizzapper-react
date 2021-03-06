import React from 'react';
import '../../Styles/general.css';
import {
    IPagination,
    IQuestion, ISort,
    ITestAttempt, ITestAttemptDetailView, ITestResponse, ITestSummary,
} from '../../State';
import {TestSummaryDetail} from "./TestSummaryDetail";
import {CallbackButton} from "../General/CallbackButton";
import {getServerData, postServerData} from "../../Utility/APIRequests/getOrRequestData";
import {GridPaging} from "../General/GridPaging";
const ax = require('axios').default;

interface IProps {
    fromAdmin?: boolean;
    submitHandler?: any;
    testAttempt?: ITestAttempt;
    testResponse?: ITestResponse;
    testQuestion?: IQuestion;
    testSummary?: ITestSummary;
    summaryID?: number;
    paging?: IPagination;
    sorting?: ISort[];
    totalCount?: number;
    selectedSummaryDetails?: ITestAttemptDetailView[];
    pageForwardCallback?: any;
    pageBackwardCallback?: any;
}

interface IState {
    height?: string;
    viewQuestionDetails?: boolean;
    testResponse?: ITestResponse;
    testQuestion?: IQuestion;
}

class TestSummaryDetailComponent extends React.Component<IProps, IState> {
    private readonly summaryID: number;
    private static INITIAL_STATE = {
        height: '',
        viewQuestionDetails: false
    };


    constructor(props: any) {
        super(props);

        this.summaryID = this.props.summaryID;
        this.state = {...TestSummaryDetailComponent.INITIAL_STATE};
    }

    public componentDidMount() { }

    /* super inefficient right now, but needed to see the state update after POST/GET calls to API server */
    shouldComponentUpdate(nextProps: IProps, nextState: IState) {
        return true;
    }

    public render() {
        console.log(this.props);
        const {viewQuestionDetails} = this.state;
        return (
            <div>
                <div className={'row'}>
                    {!!this.props.testSummary ?
                        <p>{this.props.testSummary.createdBy}</p> : null
                    }
                </div>
                <div className={'row'}>
                    <div className={'width-100'}>
                        {!!this.summaryID && viewQuestionDetails === false ?
                            this.renderListOfSummaryDetails() : null
                        }
                    </div>
                </div>
                <div className={'row'}>
                    {viewQuestionDetails === true ?
                        <div className={'width-100'}>
                            <TestSummaryDetail testSummary={this.props.testSummary}
                                               testQuestion={this.state.testQuestion}
                                               testResponse={this.state.testResponse}
                            />
                            <CallbackButton callback={() => {this.loadSummaryView()}} text={"Back to Details"} theme={"info"}/>
                        </div>
                         : null
                    }
                </div>
            </div>
        );
    }

    private renderListOfSummaryDetails() {
        return (
            <div>
                <div className={'table-responsive'}>
                    <table className={'table table-striped table-sm'}>
                        <thead>
                        <tr>
                            <th>Question</th>
                            <th>Correct Answers</th>
                            <th>Your Response(s)</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.buildProductHeaderTRs()}
                        </tbody>
                    </table>
                </div>
                <GridPaging
                    paging={this.props.paging}
                    forwardPageCallback={this.props.pageForwardCallback}
                    backwardPageCallback={this.props.pageBackwardCallback}
                    totalCount={this.props.totalCount}
                />
            </div>
        );
    }

    private buildProductHeaderTRs() {
        const {selectedSummaryDetails, totalCount} = this.props;
        if (!!selectedSummaryDetails && totalCount > 0) {
            return selectedSummaryDetails.map((ts: ITestAttemptDetailView) => {
                return (

                    <tr key={ts.testSummaryID}>
                        <td>{ts.question}</td>
                        <td>{ts.correctAnswer}</td>
                        <td>{ts.response}</td>
                        <td>
                            <CallbackButton callback={() => {this.loadQuestionResponseDetails(ts.responseID)}} text={"View"} theme={"info"}/>
                        </td>
                    </tr>
                )
            });
        }
    }

    private loadQuestionResponseDetails(responseID: number) {
        const url = process.env.REACT_APP_BASE_API_URL + 'test-summary/detail/response/' + responseID;
        getServerData(url).then(d => {
            const parsedD = d.data.testResponse !== undefined ? d.data : [];
            this.setState({
                viewQuestionDetails: true,
                testResponse: parsedD.testResponse,
                testQuestion: parsedD.question
            });
        });

    }

    private loadSummaryView() {
        this.setState({viewQuestionDetails: false})
    }
}

export const TestSummaryPage = TestSummaryDetailComponent;
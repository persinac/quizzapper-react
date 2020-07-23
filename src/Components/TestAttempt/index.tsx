import React from 'react';
import '../../Styles/general.css';
import {
    ICreateTestResponse,
    IQuestion,
    ITestAttempt,
    ITestResponse
} from '../../State';
import {PAGE_TEST_SUMMARY, PAGE_TEST_SETUP, PAGE_TEST} from "../../Constants/Pages";
import {TestAttemptSetupComponent} from "../TestAttemptSetup";
import {authUserContext} from "../../Firebase/AuthUserContext";
import {TestAttemptQuestionComponent} from "../TestAttemptQuestion";
import {InputTypes} from "../../Enums/inputTypes";
import {CountdownComponent} from "../CountdownTimer";
import {getServerData, postServerData} from "../../Utility/APIRequests/getOrRequestData";
const ax = require('axios').default;

interface IProps {
}

interface IState {
    testAttempt?: ITestAttempt;
    testResponses?: ITestResponse[];
    testQuestions?: IQuestion[];
    currentQuestion?: IQuestion;
    containerHeight: string;
    navbarHeight: string;
    page: number;
    testPage: number;
    hasSeenAllQuestions: boolean;
}

class TestAttemptComponent extends React.Component<IProps, IState> {
    private readonly orderID: number;
    private static INITIAL_STATE = {
        containerHeight: '',
        navbarHeight: '',
        testAttempt: {testAttemptID: 0, testLevel: "3", numberOfQuestions: 35, timeLimit: 30},
        error: '',
        page: 0,
        testPage: 0,
        hasSeenAllQuestions: false
    };

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


        this.setTestAttemptStateWithEvent = this.setTestAttemptStateWithEvent.bind(this);
        this.setTestResponseStateWithEvent = this.setTestResponseStateWithEvent.bind(this);
        this.state = {...TestAttemptComponent.INITIAL_STATE};
    }

    public componentDidMount() {
        // this.buildData();
        const primaryNavBarHeight =  window.getComputedStyle(document.getElementById('primary-navbar'), null).getPropertyValue('height');
        const hdrHeight = 0;
        this.setState({containerHeight: `(${primaryNavBarHeight} + ${hdrHeight})`, navbarHeight: primaryNavBarHeight});
    }

    /* super inefficient right now, but needed to see the state update after POST/GET calls to API server */
    shouldComponentUpdate(nextProps: IProps, nextState: IState) {
        // console.log("Should component update - TestAttempt INDEX");
        // console.log(nextState);
        // const shouldRerender: boolean = !didToggle;
        return true;
    }

    public render() {
        const {containerHeight, navbarHeight, page, testAttempt: {timeLimit}} = this.state;
        const rowStyle = {
            height: `calc(100% - ${containerHeight})`
        };
        const containerStyle = {
            height: `calc(100% - ${navbarHeight})`
        };
        let pageClassname = 'col-md-8 order-md-1';
        // const {page} = this.state;
        if(page === PAGE_TEST || page === PAGE_TEST_SETUP || page === PAGE_TEST_SUMMARY) {
        	pageClassname = 'col-md-12 order-md-1';
        }
        console.log(page);
        console.log(timeLimit);
        return (
            <authUserContext.Consumer>
                {authUser => {
                    return (
                        <div className={'bg-light height-100'} style={containerStyle}>
                            <div className={'container'}>
                                <CountdownComponent currentPage={page} minutes={timeLimit * 60000}/>
                                <div className={'py-5 text-center'} id={'order-hdr'}/>
                                <div className={'row'} style={rowStyle}>
                                    <div className={pageClassname}>
                                        {this.renderPage()}
                                        <hr />
                                    </div>
                                </div>
                                <div>
                                    <div className={'row'}>
                                        {this.renderButtons(authUser)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                }
            </authUserContext.Consumer>

        )
    }

    private renderPage() {
        const {page} = this.state;
        if (page === PAGE_TEST_SETUP) {
            return this.renderTestAttemptSetup();
        } else if (page === PAGE_TEST) {
            return this.renderTestAttemptQuestion();
        } else {
            return this.renderTestAttemptSetup();
        }
    }

    private renderTestAttemptSetup() {
        const {testAttempt} = this.state;
        return (
            <div>
                <TestAttemptSetupComponent
                    testAttempt={testAttempt}
                    submitHandler={this.setTestAttemptStateWithEvent}
                />
            </div>
        )
    }

    private renderTestAttemptQuestion() {
        const {testAttempt, currentQuestion, testResponses, testPage} = this.state;
        if (!!testResponses) {
            return (
                <div>
                    <TestAttemptQuestionComponent
                        testAttempt={testAttempt}
                        submitHandler={this.setTestResponseStateWithEvent}
                        testResponse={testResponses[testPage]}
                        testQuestion={currentQuestion}
                        currentPage={testPage+1}
                    />
                </div>
            )
        } else {
            return (
                <div>
                </div>
            )
        }

    }

    private renderButtons(authUser: any) {
        const {page, testPage, testResponses, hasSeenAllQuestions} = this.state;

        if (page === PAGE_TEST_SETUP) {
            return (
                <div>
                    <button
                        type='button'
                        className='btn btn-outline-primary margin-t-10'
                        disabled={this.state.testAttempt.testAttemptID === null || this.state.testAttempt.testAttemptID === undefined}
                        onClick={(e) => {this.startTest(authUser); }}>Start Test
                    </button>
                    {(this.state.testAttempt.testAttemptID === null || this.state.testAttempt.testAttemptID === 0) ? null :
                        <button
                            type='button'
                            className='btn btn-outline-secondary margin-t-10 margin-l-10'
                            onClick={(e) => {
                                this.setState({page: PAGE_TEST_SUMMARY});
                            }}>Test Summary
                        </button>
                    }
                </div>
            );
        } else if (page === PAGE_TEST) {
            // console.log(`${testPage} === ${(testResponses.length - 1)} ???`);
            return (
                <div className='width-100'>
                    {
                        testPage === 0 ? null : <button
                        type='button'
                        className='btn btn-outline-primary margin-t-10'
                        onClick={(e) => {
                            this.pageThroughTest(testPage - 1);
                        }}>Previous Question
                    </button>
                    }
                    {
                        testPage === (testResponses.length - 1) ? null : <button
                            type='button'
                            className='btn btn-outline-primary margin-t-10 margin-l-10'
                            onClick={(e) => { this.pageThroughTest(testPage + 1); }}>Next Question
                        </button>

                    }
                    <button
                        type='button'
                        className='btn btn-outline-success margin-t-10 margin-l-10 floater-rght'
                        disabled={!hasSeenAllQuestions}
                        onClick={(e) => { this.endTest(authUser); }}>Submit Responses
                    </button>
                </div>
            );
        } else if (page === PAGE_TEST_SUMMARY) {
            return (
                <div>
                    <button
                        type='button'
                        className='btn btn-outline-primary margin-t-10'
                        onClick={(e) => { this.setState({page: PAGE_TEST_SETUP}); }}>Return to Test Setup
                    </button>
                </div>
            );
        }
    }

    /* generic state handler with event */
    private setTestAttemptStateWithEvent(event: any, columnType: string, type: number): void {
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
        this.setState((prevState) => ({
            testAttempt: {
                ...prevState.testAttempt,
                [columnType]: val
            }
        }));
    }

    private startTest(authUser: any): void {
        const { testAttempt } = this.state;
        testAttempt.numberOfQuestions = Number(testAttempt.numberOfQuestions) || 35;
        testAttempt.timeLimit = Number(testAttempt.timeLimit) || 30;
        testAttempt.showHelperText = Number(testAttempt.showHelperText) || 2;
        testAttempt.showDocumentation = Number(testAttempt.showDocumentation) || 2;
        testAttempt.testAttemptID = null;
        testAttempt.startDatetime = new Date();
        testAttempt.createdBy = authUser.username;
        testAttempt.createdDatetime = new Date();
        testAttempt.modifiedBy = authUser.username;
        testAttempt.modifiedDatetime = new Date();
        testAttempt.isActive = 1;
        postServerData(
            testAttempt,
            "test-attempt/new",
            false
        ).then((d: any) => {
            console.log(d);
            const parsedD = d.data.testAttempt !== undefined ? d.data : [];
            console.log(parsedD);
            this.setState({
                page: PAGE_TEST,
                testAttempt: parsedD.testAttempt,
                testResponses: parsedD.testResponse
            });
            this.pageThroughTest(0);
        });
    }

    private endTest(authUser: any): void {
        const { testAttempt, testResponses } = this.state;
        testAttempt.endDatetime = new Date();
        testAttempt.userSubmitted = 1;
        testAttempt.modifiedBy = authUser.username;
        testAttempt.modifiedDatetime = new Date();
        const iRequest: ICreateTestResponse = {
            testAttempt: testAttempt,
            testResponse: testResponses
        };
        postServerData(
            iRequest,
            "test-attempt/submit",
            false
        ).then((d: any) => {
            console.log(d);
            const parsedD = d.data.testAttempt !== undefined ? d.data : [];
            this.setState({
                page: PAGE_TEST_SUMMARY,
                testAttempt: parsedD.testAttempt,
                testResponses: parsedD.testResponse
            });
        });
    }

    private pageThroughTest(currentPage: number) {
        const {testResponses, hasSeenAllQuestions} = this.state;
        let tempHasSeenQs = hasSeenAllQuestions;
        const questionID = testResponses[currentPage].questionID;
        const questionURL = `${process.env.REACT_APP_BASE_API_URL}question/${questionID}`;
        // console.log(questionURL);
        getServerData(questionURL).then((d: any) => {


            if (currentPage === (testResponses.length-1) && !tempHasSeenQs) {
                tempHasSeenQs = true
            }

            console.log(`Test Attempt index - page through test`);
            console.log(tempHasSeenQs);
            console.log(hasSeenAllQuestions);
            console.log(currentPage);
            console.log((testResponses.length-1));

            const parsedD = d.data.questionID !== undefined ? d.data : null;
            this.setState({
                currentQuestion: parsedD,
                testPage: currentPage,
                hasSeenAllQuestions: tempHasSeenQs
            });
        });
    }

    /* generic state handler for test taking */
    private setTestResponseStateWithEvent(event: any, columnType: string, type: number, addOrRemove: string, questionID: number, questionValue: number): void {
        const { testResponses } = this.state;
        const val = (event.target as any).value;

        this.setState((prevState) => ({
            testResponses: this.onUpdateResponse(testResponses, questionID, type, addOrRemove, val)
        }));
    }

    /***
     * generic state handler for Order Details with event
     *
     * index => orderDetailId
     * */
    /*private setOrderDetailStateWithEvent(event: any, index: number, columnType: string): void {
        const val = (event.target as any).value;
        this.setState({
            orderDetails: this.onUpdateItem(index, columnType, val)
        });
    }
    */

    private onUpdateResponse = (testResponses: ITestResponse[], questionID: number, inputType: number, addOrRemove: string, value: any) => {
        let idx = -1;

        testResponses.some((t: ITestResponse, internal_i: number) => {
            if (t.questionID === questionID) {
                idx = internal_i;
                return true;
            }
            return false;
        });
        let item: ITestResponse = testResponses[idx];

        const currentResponse: ITestResponse = testResponses.filter((t: ITestResponse) => {
            return t.questionID === questionID;
        })[0];

        let actualResponse = currentResponse.response;
        if (inputType === InputTypes.RADIO) {
            actualResponse = value;
        } else {
            let splitResponses: string[] = !!actualResponse ? actualResponse.split(";") : [];
            if (addOrRemove === "A") {
                if (!!actualResponse) {
                    if (actualResponse.length > 0) {
                        splitResponses.push(value);
                        actualResponse = splitResponses.join(";");
                    } else {
                        actualResponse = value;
                    }
                } else {
                    actualResponse = value;
                }
            } else if (addOrRemove === "R") {
                if (!!actualResponse) {
                    if (actualResponse.length > 1) {
                        splitResponses.splice(splitResponses.indexOf(value), 1);
                        actualResponse = splitResponses.join(";");
                    } else {
                        actualResponse = null;
                    }
                } else {
                    actualResponse = null;
                }
            }
        }
        currentResponse.response = actualResponse;
        testResponses[idx] = item;
        return testResponses;
    };
}

export const TestAttemptPage = TestAttemptComponent;

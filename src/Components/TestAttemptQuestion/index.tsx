import React from 'react';
import '../../Styles/general.css';
import {
    IQuestion,
    ITestAttempt, ITestResponse,
} from '../../State';
import {TestAttemptQuestion} from "./TestAttemptQuestion";

interface IProps {
    submitHandler: any;
    testAttempt: ITestAttempt;
    testResponse: ITestResponse;
    testQuestion?: IQuestion;
    currentPage?: number;
}

interface IState {
    height?: string;
}

export class TestAttemptQuestionComponent extends React.Component<IProps, IState> {
    private static INITIAL_STATE = {
        height: ''
    };

    constructor(props: any) {
        super(props);

        this.state = {...TestAttemptQuestionComponent.INITIAL_STATE};
    }

    public componentDidMount() {
        // console.log("COMPONENT DID MOUNT - TestAttemptQuestionComponent");
        // console.log(this.props.testResponse);
    }

    /* super inefficient right now, but needed to see the state update after POST/GET calls to API server */
    shouldComponentUpdate(nextProps: IProps, nextState: IState) {
        // console.log("Should component update - TestAttemptQuestion INDEX");
        // console.log(nextProps);
        // const shouldRerender: boolean = !didToggle;
        return true;
    }

    public render() {
        return (
            <div className={'row'}>
                <div className={'width-100'}>
                    <TestAttemptQuestion
                        testAttempt={this.props.testAttempt}
                        submitHandler={this.props.submitHandler}
                        testQuestion={this.props.testQuestion}
                        testResponse={this.props.testResponse}
                        currentPage={this.props.currentPage}
                    />
                </div>
            </div>
        );
    }
}
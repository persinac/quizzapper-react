import React from 'react';
import '../../Styles/general.css';
import {
    ITestAttempt,
} from '../../State';
import {TestAttemptSetup} from "./TestAttemptSetup";

interface IProps {
    submitHandler: any;
    testAttempt: ITestAttempt;
}

interface IState {
    height?: string;
}

export class TestAttemptSetupComponent extends React.Component<IProps, IState> {
    private static INITIAL_STATE = {
        height: ''
    };

    constructor(props: any) {
        super(props);

        this.state = {...TestAttemptSetupComponent.INITIAL_STATE};
    }

    public componentDidMount() {}

    public render() {
        return (
            <div className={'row'}>
                <div className={'width-100'}>
                    <TestAttemptSetup
                        testAttempt={this.props.testAttempt}
                        submitHandler={this.props.submitHandler}
                    />
                </div>
            </div>
        );
    }
}
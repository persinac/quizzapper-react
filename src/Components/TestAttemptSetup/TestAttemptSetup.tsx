import React from "react";
import {IOptions, ITestAttempt} from "../../State";
import Card from "react-bootstrap/Card";
import Select from 'react-select';
import {SHOW_DOCUMENTATION, SHOW_HELPER_TEXT, TEST_TOPICS} from "../../Constants/testOptions";
import {InputTypes} from "../../Enums/inputTypes";

interface InterfaceProps {
    submitHandler: any;
    testAttempt: ITestAttempt;
}

interface IState {
    doesContainShow?: boolean;
    suggestions: IOptions[];
    value?: any;
}

export class TestAttemptSetup extends React.Component<InterfaceProps, IState> {
    private symbolKeyVals: IOptions[];
    private constructedKeyValues: boolean;
    constructor(props: any) {
        super(props);

        this.state = {doesContainShow: false, suggestions: [], value: ""};
        // TODO - create these as ENUM or constant
        this.symbolKeyVals = [];
        this.constructedKeyValues = false;
    }

    componentDidMount(): void {
        // console.log(this.props.testAttempt);
    }


    shouldComponentUpdate(nextProps: InterfaceProps, nextState: IState) {
        return true;
    }

    public render() {
        return this.renderCard();
    }

    private renderCard() {
        const { testTopic, testLevel, timeLimit, numberOfQuestions, showDocumentation, showHelperText } = this.props.testAttempt;
        let testTopicValue = !!testTopic ? TEST_TOPICS.filter((o: any) => {
            return o.value === testTopic
        })[0] : {label: '', value: ''};

        let showDocValue = !!showDocumentation ? SHOW_DOCUMENTATION.filter((o: any) => {
            return o.value === showDocumentation
        })[0] : {label: '', value: ''};

        let showHelpTextValue = !!showHelperText ? SHOW_HELPER_TEXT.filter((o: any) => {
            return o.value === showHelperText
        })[0] : {label: '', value: ''};
        return (
            <div className={'the-lonely-card'}>
                <Card>
                    <Card.Header>Test Setup</Card.Header>
                <Card.Body>
                    <div className={'row'}>
                        <div className={`col-md-4 mb-3`}>
                            <label htmlFor={`testTopic`}>Test Topic</label>
                            <Select
                                id={'testTopic'}
                                value={testTopicValue}
                                onChange={(event: any) => this.props.submitHandler(event, 'testTopic', InputTypes.SELECT) }
                                options={TEST_TOPICS}
                            />
                        </div>
                        <div className={`col-md-4 mb-3`}>
                            <label htmlFor={`testLevel`}>Test Level</label>
                            <input
                                id={'testLevel'}
                                value={testLevel}
                                onChange={(event: any) => this.props.submitHandler(event, 'testLevel')}
                                type='text'
                                className={'form-control'}
                            />
                            {/*<ErrorWrapper errorMessage={this.props.productHeaderErrors.e_reference_number} id={'p-q-2'}/>*/}
                        </div>

                        <div className={`col-md-4 mb-3`}>
                            <label htmlFor={`timeLimit`}>Time Limit (minutes only!)</label>
                            <input
                                id={'timeLimit'}
                                value={timeLimit}
                                onChange={(event: any) => this.props.submitHandler(event, 'timeLimit')}
                                type='text'
                                className={'form-control'}
                            />
                        </div>

                    </div>
                    <div className={'row'}>
                        <div className={`col-md-4 mb-3`}>
                            <label htmlFor={`numberOfQuestions`}>Number of Q's</label>
                            <input
                                id={'numberOfQuestions'}
                                value={numberOfQuestions}
                                onChange={(event: any) => this.props.submitHandler(event, 'numberOfQuestions')}
                                type='text'
                                className={'form-control'}
                            />
                        </div>
                        <div className={`col-md-4 mb-3`}>
                            <label htmlFor={`showDocumentation`}>Show Documentation</label>
                            <Select
                                id={'showDocumentation'}
                                value={showDocValue}
                                onChange={(event: any) => this.props.submitHandler(event, 'showDocumentation', InputTypes.SELECT) }
                                options={SHOW_DOCUMENTATION}
                            />
                            {/*<ErrorWrapper errorMessage={this.props.productHeaderErrors.e_reference_number} id={'p-q-3'}/>*/}
                        </div>
                        <div className={`col-md-4 mb-3`}>
                            <label htmlFor={`showHelperText`}>Show Helper Text</label>
                            <Select
                                id={'showHelperText'}
                                value={showHelpTextValue}
                                onChange={(event: any) => this.props.submitHandler(event, 'showHelperText', InputTypes.SELECT) }
                                options={SHOW_HELPER_TEXT}
                            />
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
    }
}

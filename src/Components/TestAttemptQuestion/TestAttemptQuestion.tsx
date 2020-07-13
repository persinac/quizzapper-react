import React from "react";
import {IOptions, IQuestion, ITestAttempt, ITestResponse} from "../../State";
import Card from "react-bootstrap/Card";
import {InputTypes, TestInputTypes} from "../../Enums/inputTypes";

interface InterfaceProps {
    submitHandler: any;
    testAttempt: ITestAttempt;
    testResponse: ITestResponse;
    testQuestion?: IQuestion;
    currentPage?: number;
}

interface IState {
    doesContainShow?: boolean;
    suggestions: IOptions[];
    value?: any;
}

export class TestAttemptQuestion extends React.Component<InterfaceProps, IState> {
    private symbolKeyVals: IOptions[];
    private constructedKeyValues: boolean;
    constructor(props: any) {
        super(props);

        this.state = {doesContainShow: false, suggestions: [], value: ""};
        this.symbolKeyVals = [];
        this.constructedKeyValues = false;
    }

    componentDidMount(): void {}

    shouldComponentUpdate(nextProps: InterfaceProps, nextState: IState) {
        return true;
    }

    public render() {
        return this.renderCard();
    }

    private renderCard() {
        const { testQuestion, testResponse, currentPage, testAttempt } = this.props;
        return (
            <div className={'the-lonely-card'}>
                <Card>
                    <Card.Header>{testAttempt.testTopic} Test Questions</Card.Header>
                <Card.Body>
                    <div className={'row'}>
                        <div className={`col-md-8 mb-3`}>
                            <label htmlFor={`question`}>Question #{currentPage}</label>
                            <p id={'question'}>
                                {!!testQuestion ? testQuestion.question : null}
                            </p>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className={`col-md-12 mb-3`}>
                            {!!testQuestion ? this.renderSpecializedInput(testQuestion, testResponse) : null}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
    }

    private renderSpecializedInput(testQuestion: IQuestion, testResponse: ITestResponse) {
        const answerChoices = testQuestion.answers.split(";");
        let answerResponses = !!testResponse.response ? testResponse.response.split(";") : null;
        let groupedInput: any = [];
        if (testQuestion.style === TestInputTypes.MULTI_SELECTION) {
            answerChoices.forEach((v: string, idx: number) => {
                let checked = false;
                if (!!answerResponses) {
                    if (answerResponses.indexOf(String(idx)) >= 0) {
                        checked = true;
                    }
                }
                const addOrRemove: string = checked ? "R" : "A";
                groupedInput.push(
                    (
                        <div>
                            <input
                                // onChange={(event: any) => this.props.submitHandler(event, 'response')}
                                onClick={(event: any) => this.props.submitHandler(event, 'response', InputTypes.SELECT, addOrRemove, testQuestion.questionID, idx)}
                                id={`question_${testQuestion.questionID}_${idx}`}
                                value={idx}
                                type="checkbox"
                                checked={checked}
                            />
                            <label htmlFor={`question_${testQuestion.questionID}_${idx}`}> {v}</label>
                        </div>
                    )
                )
            });
        } else if (testQuestion.style === TestInputTypes.MULTI_CHOICE) {
            answerChoices.forEach((v: string, idx: number) => {
                let checked = false;
                if (!!answerResponses) {
                    if (answerResponses.indexOf(String(idx)) >= 0) {
                        checked = true;
                    }
                }
                groupedInput.push(
                    (
                        <div>
                            <input
                                // onChange={(event: any) => this.props.submitHandler(event, 'response')}
                                onClick={(event: any) => this.props.submitHandler(event, 'response', InputTypes.RADIO, '', testQuestion.questionID, idx)}
                                id={`question_${testQuestion.questionID}_${idx}`}
                                value={idx}
                                type="radio"
                                checked={checked}
                            />
                            <label htmlFor={`question_${testQuestion.questionID}_${idx}`}> {v}</label>
                        </div>
                    )
                )
            });
        } else {
            groupedInput.push(
                <div>
                    <input
                        id={`question_${testQuestion.questionID}_1`}
                        value={testResponse.questionID}
                        onChange={(event: any) => this.props.submitHandler(event, 'response')}
                        type='text'
                        className={'form-control'}
                    />
                </div>
            )
        }
        return [].concat.apply([], groupedInput);
    }
}

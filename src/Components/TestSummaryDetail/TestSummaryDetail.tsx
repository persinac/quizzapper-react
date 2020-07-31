import React from "react";
import {IOptions, IQuestion, ITestAttempt, ITestAttemptDetailView, ITestResponse, ITestSummary} from "../../State";
import Card from "react-bootstrap/Card";
import {TestInputTypes} from "../../Enums/inputTypes";

interface InterfaceProps {
    submitHandler?: any;
    testAttempt?: ITestAttempt;
    testResponse?: ITestResponse;
    testQuestion?: IQuestion;
    testSummary?: ITestSummary;
    selectedSummaryDetails?: ITestAttemptDetailView[];
}

interface IState {
    doesContainShow?: boolean;
    suggestions: IOptions[];
    value?: any;
}

export class TestSummaryDetail extends React.Component<InterfaceProps, IState> {
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
        const { testQuestion, testResponse} = this.props;
        return (
            <div className={'the-lonely-card'}>
                {!!testQuestion ?
                    <Card>
                        <Card.Header>Question & Response Details</Card.Header>
                        <Card.Body>
                            <div className={'row'}>
                                <div className={`col-md-8 mb-3`}>
                                    <label htmlFor={`question`}>Question</label>
                                    <p id={'question'}>
                                        {!!testQuestion ? testQuestion.question : null}
                                    </p>
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className={`col-md-6 mb-3`}>
                                    <h5>Your Response(s)</h5>
                                    {!!testQuestion ? this.renderSpecializedInput(testQuestion, testResponse, false) : null}
                                </div>
                                <div className={`col-md-6 mb-3`}>
                                    <h5>Correct Response(s)</h5>
                                    {!!testQuestion ? this.renderSpecializedInput(testQuestion, testResponse, true) : null}
                                </div>
                            </div>
                            <hr className="solid" />
                            {!!testQuestion ? this.renderDocumentation(testQuestion) : null}
                            {!!testQuestion ? this.renderHelperText(testQuestion) : null}
                        </Card.Body>
                    </Card> : null
                }
        </div>
    );
    }

    private renderSpecializedInput(testQuestion: IQuestion, testResponse: ITestResponse, showCorrectResponse: boolean) {
        const answerChoices = testQuestion.answers.split(";");
        let answerResponses = !!testResponse.response ? testResponse.response.split(";") : null;
        let correctResponses = !!testQuestion.correctAnswer ? testQuestion.correctAnswer.split(";") : null;
        let groupedInput: any = [];
        if (testQuestion.style === TestInputTypes.MULTI_SELECTION) {
            answerChoices.forEach((v: string, idx: number) => {
                let checked = false;
                if (showCorrectResponse) {
                    if (!!correctResponses) {
                        if (correctResponses.indexOf(String(idx)) >= 0) {
                            checked = true;
                        }
                    }
                } else {
                    if (!!answerResponses) {
                        if (answerResponses.indexOf(String(idx)) >= 0) {
                            checked = true;
                        }
                    }
                }
                groupedInput.push(
                    (
                        <div>
                            <input
                                id={`question_${testQuestion.questionID}_${idx}`}
                                value={idx}
                                type="checkbox"
                                checked={checked}
                                readOnly={true}
                            />
                            <label htmlFor={`question_${testQuestion.questionID}_${idx}`}> {v}</label>
                        </div>
                    )
                )
            });
        } else if (testQuestion.style === TestInputTypes.MULTI_CHOICE) {
            answerChoices.forEach((v: string, idx: number) => {
                let checked = false;
                if (showCorrectResponse) {
                    if (!!correctResponses) {
                        if (correctResponses.indexOf(String(idx)) >= 0) {
                            checked = true;
                        }
                    }
                } else {
                    if (!!answerResponses) {
                        if (answerResponses.indexOf(String(idx)) >= 0) {
                            checked = true;
                        }
                    }
                }
                groupedInput.push(
                    (
                        <div>
                            <input
                                id={`question_${testQuestion.questionID}_${idx}`}
                                value={idx}
                                type="radio"
                                checked={checked}
                                readOnly={true}
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
                        type='text'
                        className={'form-control'}
                        readOnly={true}
                    />
                </div>
            )
        }
        return [].concat.apply([], groupedInput);
    }

    private renderDocumentation(testQuestion: IQuestion) {
        return (
            <div>
                <h5>Supporting Documentation</h5>
                <div className={'row'}>
                    <div className={`col-md-12 mb-3`}>
                        {
                            !!testQuestion.documentation ?
                                <a href={`https://${testQuestion.documentation}`} target="_blank" rel={"noopener noreferrer"}>{testQuestion.documentation}</a> :
                                <p>No documentation for this question yet!!</p>
                        }
                    </div>
                </div>
            </div>
        )
    }

    private renderHelperText(testQuestion: IQuestion) {
        return (
            <div>
                <h5>Hints</h5>
                <div className={'row'}>
                    <div className={`col-md-6 mb-3`}>
                        {
                            !!testQuestion.helperTextOne ?
                                <p>{testQuestion.helperTextOne}</p> : null
                        }
                    </div>
                    <div className={`col-md-6 mb-3`}>
                        {
                            !!testQuestion.helperTextTwo ?
                                <p>{testQuestion.helperTextTwo}</p> : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

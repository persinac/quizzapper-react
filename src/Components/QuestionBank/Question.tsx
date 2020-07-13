import React from "react";
import {IQuestion} from "../../State";
import Card from "react-bootstrap/Card";
import {CallbackButton} from "../General/CallbackButton";
import Select from "react-select";
import {InputTypes} from "../../Enums/inputTypes";
import {TEST_TOPICS} from "../../Constants/testOptions";
import {DIFFICULTY, QUESTION_CATEGORIES, QUESTION_STYLES} from "../../Constants/questionOptions";

interface InterfaceProps {
    authUser?: any;
    selectedQuestion?: IQuestion;
    submitHandler?: any;
    updateQuestionHandler?: any;
    isNewQuestion?: boolean;
}

interface IState {
    doesContainShow?: boolean;
}

export class Question extends React.Component<InterfaceProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {doesContainShow: false};
    }

    public componentDidMount() { }

    public shouldComponentUpdate(nextProps: Readonly<InterfaceProps>, nextState: Readonly<IState>, nextContext: any): boolean {
        let shouldUpdate = false;

        if (this.props.selectedQuestion !== nextProps.selectedQuestion) {
            shouldUpdate = true;
        }

        return shouldUpdate;
    }

    public render() {
        return this.renderCard();
    }

    private renderCard() {
        const {selectedQuestion, isNewQuestion} = this.props;

        let questionStyleValue = !!selectedQuestion.style ? QUESTION_STYLES.filter((o: any) => {
            return o.value === selectedQuestion.style
        })[0] : {label: '', value: ''};

        let testTopicValue = !!selectedQuestion.testTopic ? TEST_TOPICS.filter((o: any) => {
            return o.value === selectedQuestion.testTopic
        })[0] : {label: '', value: ''};

        let categoryValue = !!selectedQuestion.category ? QUESTION_CATEGORIES.filter((o: any) => {
            return o.value === selectedQuestion.category
        })[0] : {label: '', value: ''};

        let subCategoryValue = !!selectedQuestion.subCategory ? QUESTION_CATEGORIES.filter((o: any) => {
            return o.value === selectedQuestion.subCategory
        })[0] : {label: '', value: ''};

        let difficultyValue = !!selectedQuestion.difficulty ? DIFFICULTY.filter((o: any) => {
            return o.value === selectedQuestion.difficulty
        })[0] : {label: '', value: ''};

        return (
            <div className={'row'}>
                <div className={'width-100'}>
                    <div className={'the-lonely-card'}>
                        {!!selectedQuestion ?
                            <Card>
                                <Card.Header>Question #{selectedQuestion.questionID}</Card.Header>
                                <Card.Body>
                                    <div className={'row'}>
                                        <div className={`col-md-8 mb-3`}>
                                            <label htmlFor={`question_${selectedQuestion.questionID}`}>Question</label>
                                            <div>
                                                <input
                                                    id={`question_${selectedQuestion.questionID}`}
                                                    value={selectedQuestion.question}
                                                    onChange={(event: any) => this.props.submitHandler(event, 'question')}
                                                    type='text'
                                                    className={'form-control'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={`col-md-4 mb-3`}>
                                            <label htmlFor={`questionStyle`}>Question Style</label>
                                            <Select
                                                id={'questionStyle'}
                                                value={questionStyleValue}
                                                onChange={(event: any) => this.props.submitHandler(event, 'style', InputTypes.SELECT) }
                                                options={QUESTION_STYLES}
                                            />
                                        </div>
                                        <div className={`col-md-4 mb-3`}>
                                            <label htmlFor={`testTopic`}>Question Topic</label>
                                            <Select
                                                id={'testTopic'}
                                                value={testTopicValue}
                                                onChange={(event: any) => this.props.submitHandler(event, 'testTopic', InputTypes.SELECT) }
                                                options={TEST_TOPICS}
                                            />
                                        </div>
                                        <div className={`col-md-4 mb-3`}>
                                            <label htmlFor={`difficulty`}>Difficulty</label>
                                            <Select
                                                id={'difficulty'}
                                                value={difficultyValue}
                                                onChange={(event: any) => this.props.submitHandler(event, 'difficulty', InputTypes.SELECT) }
                                                options={DIFFICULTY}
                                            />
                                        </div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={`col-md-6 mb-3`}>
                                            <label htmlFor={`category`}>Category</label>
                                            <Select
                                                id={'category'}
                                                value={categoryValue}
                                                onChange={(event: any) => this.props.submitHandler(event, 'category', InputTypes.SELECT) }
                                                options={QUESTION_CATEGORIES}
                                            />
                                        </div>
                                        <div className={`col-md-6 mb-3`}>
                                            <label htmlFor={`subCategory`}>Sub Category</label>
                                            <Select
                                                id={'subCategory'}
                                                value={subCategoryValue}
                                                onChange={(event: any) => this.props.submitHandler(event, 'subCategory', InputTypes.SELECT) }
                                                options={QUESTION_CATEGORIES}
                                            />
                                        </div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={`col-md-8 mb-3`}>
                                            <label htmlFor={`question`}>Question Choices</label>
                                            <input
                                                id={`question`}
                                                value={selectedQuestion.answers}
                                                onChange={(event: any) => this.props.submitHandler(event, 'answers')}
                                                type='text'
                                                className={'form-control'}
                                            />
                                        </div>
                                        <div className={`col-md-4 mb-3`}>
                                            <label htmlFor={`correctAnswer`}>Correct Answers</label>
                                            <input
                                                id={`correctAnswer`}
                                                value={selectedQuestion.correctAnswer}
                                                onChange={(event: any) => this.props.submitHandler(event, 'correctAnswer')}
                                                type='text'
                                                className={'form-control'}
                                            />
                                        </div>
                                    </div>
                                </Card.Body>
                                <Card.Footer>
                                    <div>
                                        <CallbackButton callback={(event: any) => this.props.updateQuestionHandler(selectedQuestion)} text={isNewQuestion ? "Save Question" : "Update Question"}/>
                                    </div>
                                </Card.Footer>
                            </Card> : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}
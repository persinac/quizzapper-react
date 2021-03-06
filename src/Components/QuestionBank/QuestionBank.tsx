import React from "react";
import {IFilterQuery, IPagination, IQuestion, ISort} from "../../State";
import {Link} from "react-router-dom";
import {CallbackButton} from "../General/CallbackButton";
import {Question} from "./Question";
import {InputTypes} from "../../Enums/inputTypes";
import {authUserContext} from "../../Firebase/AuthUserContext";
import {getServerData, postServerData} from "../../Utility/APIRequests/getOrRequestData";
import {GridPaging} from "../General/GridPaging";
import Card from "react-bootstrap/Card";
import {QuestionFilters} from "./QuestionFilters";
import {backwardPage, forwardPage, pageThroughTable} from "../../Utility/APIRequests/paging";

interface InterfaceProps {
    authUser?: any;
}

interface IState {
    doesContainShow?: boolean;
    questions?: IQuestion[];
    selectedQuestion?: IQuestion;
    currentPage?: number;
    isNewQuestion?: boolean;
    paging?: IPagination;
    sorting?: ISort[];
    totalQuestionCount?: number;
    filters?: IFilterQuery[];
    testing?: string;
}

export class QuestionBank extends React.Component<InterfaceProps, IState> {
    private post_options = {
        method: 'POST',
        uri: '',
        body: {
            some: 'payload'
        },
        json: true // Automatically stringifies the body to JSON
    };
    private static INITIAL_PAGING = {startIndex: 0, batchSize: 10};
    private static INITIAL_SORT = [{sortBy: "questionId", ascDesc: "ASC"}];
    private static INITIAL_FILTER = [
        {column: "question", operator: "LIKE", value: ""},
        {column: "testTopic", operator: "=", value: ""},
        {column: "category", operator: "=", value: ""},
        {column: "subCategory", operator: "=", value: ""}
    ];
    constructor(props: any) {
        super(props);

        this.setSelectedQuestionStateWithEvent = this.setSelectedQuestionStateWithEvent.bind(this);
        this.updateQuestionHandler = this.updateQuestionHandler.bind(this);
        this.searchByFilter = this.searchByFilter.bind(this);

        this.state = {
            doesContainShow: false,
            currentPage: 0,
            paging: QuestionBank.INITIAL_PAGING,
            sorting: QuestionBank.INITIAL_SORT,
            filters: QuestionBank.INITIAL_FILTER
        };
    }

    public componentDidMount() {
        // this will need to be a view in order to get all the data we want to highlight
        postServerData(
            {
                pagination: this.state.paging,
                sort: this.state.sorting
            },
            'question',
            false
        ).then((d: any) => {
            console.log(d);
            const parsedD = d.data.totalCount > 0 ? d.data : [];
            this.setState({
                questions: parsedD.questions,
                totalQuestionCount: parsedD.totalCount
            });
        });
    }

    public shouldComponentUpdate(nextProps: Readonly<InterfaceProps>, nextState: Readonly<IState>, nextContext: any): boolean {
        let shouldUpdate = false;
        if (this.state.currentPage !== nextState.currentPage) {
            shouldUpdate = true;
        } else if (this.state.questions !== nextState.questions) {
            shouldUpdate = true;
        } else if (this.state.selectedQuestion !== nextState.selectedQuestion) {
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
            <authUserContext.Consumer>
                {authUser => {
                    return <div>
                        <div>
                            <QuestionFilters
                                filterSearch={this.searchByFilter}
                                testing={this.state.testing}
                            />
                        </div>
                        <Card>
                            <Card.Body>
                                <div className={'table-responsive'}>
                                    <table className={'table table-striped table-sm'}>
                                        <thead>
                                        <tr>
                                            <th>Question</th>
                                            <th>Topic</th>
                                            <th>Category</th>
                                            <th>Sub-Category</th>
                                            <th>Style</th>
                                            <th>Difficulty</th>
                                            <th>Is Active</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.buildProductHeaderTRs()}
                                        </tbody>
                                    </table>
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <GridPaging
                                    paging={this.state.paging}
                                    forwardPageCallback={() => {this.pageThroughQuestionTable("F")}}
                                    backwardPageCallback={() => {this.pageThroughQuestionTable("B")}}
                                    totalCount={this.state.totalQuestionCount}
                                />
                                <div>
                                    <CallbackButton callback={() => {this.createNewQuestion(authUser)}} text={"Create New Question"} theme={"info"}/>
                                </div>
                            </Card.Footer>
                        </Card>
                    </div>
                }}
            </authUserContext.Consumer>
        );
    }

    private renderSummaryDetails() {
        return (
            <div>
                <div>
                    <CallbackButton callback={() => {this.backToSummaryList()}} text={"Back to Summary List"} theme={"info"}/>
                </div>
                <div>
                    <Question
                        selectedQuestion={this.state.selectedQuestion}
                        submitHandler={this.setSelectedQuestionStateWithEvent}
                        updateQuestionHandler={this.updateQuestionHandler}
                        isNewQuestion={this.state.isNewQuestion}
                    />
                </div>
            </div>
        );
    }

    private buildProductHeaderTRs() {
        const {questions} = this.state;
        if (!!questions && questions.length > 0) {
            return questions.map((q: IQuestion) => {
                return (

                    <tr key={q.questionID}>
                        <td>{q.question}</td>
                        <td>{q.testTopic}</td>
                        <td>{q.category}</td>
                        <td>{q.subCategory}</td>
                        <td>{q.style}</td>
                        <td>{q.difficulty}</td>
                        <td>{q.isActive}</td>
                        <td>
                            <CallbackButton callback={() => {this.loadQuestionDetails(q.questionID)}} text={"View"} theme={"info"}/>
                        </td>
                    </tr>
                )
            });
        }
    }

    private loadQuestionDetails(id: number) {
        const testSummaryURL = process.env.REACT_APP_BASE_API_URL + 'question/' + id;
        getServerData(testSummaryURL).then(d => {
            const parsedD = d.data.questionID !== undefined ? d.data : [];
            this.setState({selectedQuestion: parsedD, currentPage: 1});
        });
    }

    private pageThroughQuestionTable(direction: string) {
        let {paging, sorting, filters} = this.state;

        let newStartIndex: number = 0;
        if (direction === "F") {
            newStartIndex = forwardPage(paging.startIndex, paging.batchSize, this.state.totalQuestionCount);
        } else if (direction === "B") {
            newStartIndex = backwardPage(paging.startIndex, paging.batchSize);
        }
        paging.startIndex = newStartIndex;
        pageThroughTable(
            'question',
            paging,
            sorting,
            filters,
            newStartIndex
        ).then(d => {
            const parsedD = d.data.totalCount > 0 ? d.data : [];
            this.setState({
                questions: parsedD.questions,
                paging: paging,
                totalQuestionCount: parsedD.totalCount
            });
        });
    }

    private backToSummaryList() {
        postServerData(
            {
                pagination: {startIndex: 0, batchSize: 10},
                sort: [{sortBy: "questionId", ascDesc: "ASC"}]
            },
            'question',
            false
        ).then(d => {
            const parsedD = d.data.totalCount > 0 ? d.data : [];
            this.setState({
                questions: parsedD.questions,
                currentPage: 0,
                selectedQuestion: null,
                isNewQuestion: null,
                paging: {startIndex: 0, batchSize: 10},
                sorting: [{sortBy: "questionId", ascDesc: "ASC"}],
                totalQuestionCount: parsedD.totalCount
            });
        });
    }

    private searchByFilter(filters: IFilterQuery[]) {
        const copyFilter: IFilterQuery[] = [];

        filters.forEach((f: IFilterQuery) => {
            if (typeof f.value !== "undefined" && f.value) {
                copyFilter.push(f);
            }
        });
        postServerData(
            {
                pagination: {startIndex: 0, batchSize: 10},
                sort: [{sortBy: "questionId", ascDesc: "ASC"}],
                filters: copyFilter
            },
            'question',
            false
        ).then(d => {
            console.log(filters);
            const parsedD = d.data.totalCount > 0 ? d.data : [];
            this.setState({
                questions: parsedD.questions,
                currentPage: 0,
                selectedQuestion: null,
                isNewQuestion: null,
                paging: {startIndex: 0, batchSize: 10},
                sorting: [{sortBy: "questionId", ascDesc: "ASC"}],
                totalQuestionCount: parsedD.totalCount,
                filters: filters
            });
        });
    }

    private createNewQuestion(authUser: any) {
        this.setState({
            currentPage: 1,
            selectedQuestion: {
                createdBy: authUser.username,
                createdDatetime: new Date(),
                modifiedBy: authUser.username,
                modifiedDatetime: new Date(),
                isActive: 1
            },
            isNewQuestion: true
        });
    }

    /* generic state handler with event */
    private setSelectedQuestionStateWithEvent(event: any, columnType: string, type: number): void {
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
            selectedQuestion: {
                ...prevState.selectedQuestion,
                [columnType]: val
            }
        }));
    }

    /* generic state handler with event */
    private updateQuestionHandler(question: IQuestion): void {
        // console.log(val);
        question.softwareVersion = "";
        question.documentation = question.documentation || "";
        question.helperTextOne = question.helperTextOne || "";
        question.helperTextTwo = question.helperTextTwo || "";
        postServerData(question, "question/update", false)
            .then((d: any) => {
                console.log(d);
                const parsedD = d.data.questionID !== undefined ? d.data : [];
                this.setState(() => ({
                    selectedQuestion: parsedD
                }));
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
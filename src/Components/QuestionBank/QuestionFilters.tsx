import React from "react";
import Card from "react-bootstrap/Card";
import {InputTypes} from "../../Enums/inputTypes";
import {IFilterQuery, IPagination, IQuestion, ISort} from "../../State";
import {TEST_TOPICS} from "../../Constants/testOptions";
import {CallbackButton} from "../General/CallbackButton";
import {QUESTION_CATEGORIES, QUESTION_STYLES} from "../../Constants/questionOptions";
import Select from "react-select";

interface InterfaceProps {
    filterSearch?: any;
    testing?: string;
}

interface IState {
    filters?: IFilterQuery[];
}

export class QuestionFilters extends React.Component<InterfaceProps, IState> {
    private readonly INITIAL_FILTER = [
        {column: "question", operator: "LIKE", value: ""},
        {column: "testTopic", operator: "=", value: ""},
        {column: "category", operator: "=", value: ""},
        {column: "subCategory", operator: "=", value: ""},
        {column: "style", operator: "=", value: ""}
    ];

    constructor(props: any) {
        super(props);

        this.state = {
            filters: this.INITIAL_FILTER
        };
    }

    shouldComponentUpdate(nextProps: InterfaceProps, nextState: IState) {
        return true;
    }

    public render() {
        let { filters } = this.state;

        let questionFilterValue = !!filters ? filters.filter((o: IFilterQuery) => {
            return o.column === "question"
        })[0].value : "";

        let questionStyleFilter = filters.filter((f: IFilterQuery) => f.column === "style")[0];
        let testTopicFilter = filters.filter((f: IFilterQuery) => f.column === "testTopic")[0];
        let categoryFilter = filters.filter((f: IFilterQuery) => f.column === "category")[0];
        let suCategoryFilter = filters.filter((f: IFilterQuery) => f.column === "subCategory")[0];

        let questionStyleValue = !!questionStyleFilter ?  QUESTION_STYLES.filter((o: any) => {
            return o.value === questionStyleFilter.value
        })[0] : {label: '', value: ''};

        let testTopicValue = !!testTopicFilter ? TEST_TOPICS.filter((o: any) => {
            return o.value === testTopicFilter.value
        })[0] : {label: '', value: ''};

        let categoryValue = !!categoryFilter ? QUESTION_CATEGORIES.filter((o: any) => {
            return o.value === categoryFilter.value
        })[0] : {label: '', value: ''};

        let subCategoryValue = !!suCategoryFilter ? QUESTION_CATEGORIES.filter((o: any) => {
            return o.value === suCategoryFilter.value
        })[0] : {label: '', value: ''};

        return (
            <div className={'the-lonely-card'}>
                <Card>
                    <Card.Header>Filters</Card.Header>
                    <Card.Body>
                        <div className={'row'}>
                            <div className={`col-md-6 mb-3`}>
                                <label htmlFor={`question`}>Question</label>
                                <input
                                    id={'question'}
                                    value={questionFilterValue}
                                    onChange={(event: any) => this.handleFilterValueEvent(event, 'question', InputTypes.TEXT)}
                                    type='text'
                                    className={'form-control'}
                                />
                                {/*<ErrorWrapper errorMessage={this.props.productHeaderErrors.e_reference_number} id={'p-q-2'}/>*/}
                            </div>
                            <div className={`col-md-4 mb-3`}>
                                <label htmlFor={`questionStyle`}>Question Style</label>
                                <Select
                                    id={'questionStyle'}
                                    value={questionStyleValue}
                                    onChange={(event: any) => this.handleFilterValueEvent(event, 'style', InputTypes.SELECT) }
                                    options={QUESTION_STYLES}
                                />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={`col-md-4 mb-3`}>
                                <label htmlFor={`testTopic`}>Question Topic</label>
                                <Select
                                    id={'testTopic'}
                                    value={testTopicValue}
                                    onChange={(event: any) => this.handleFilterValueEvent(event, 'testTopic', InputTypes.SELECT) }
                                    options={TEST_TOPICS}
                                />
                            </div>
                            <div className={`col-md-4 mb-3`}>
                                <label htmlFor={`category`}>Category</label>
                                <Select
                                    id={'category'}
                                    value={categoryValue}
                                    onChange={(event: any) => this.handleFilterValueEvent(event, 'category', InputTypes.SELECT) }
                                    options={QUESTION_CATEGORIES}
                                />
                            </div>
                            <div className={`col-md-4 mb-3`}>
                                <label htmlFor={`subCategory`}>Sub Category</label>
                                <Select
                                    id={'subCategory'}
                                    value={subCategoryValue}
                                    onChange={(event: any) => this.handleFilterValueEvent(event, 'subCategory', InputTypes.SELECT) }
                                    options={QUESTION_CATEGORIES}
                                />
                            </div>
                        </div>
                    </Card.Body>
                    <Card.Footer>
                        <div className={"floater-rght"}>
                            <CallbackButton callback={() => {this.props.filterSearch(this.state.filters)}} text={"Search"} theme={"info"}/>
                            <CallbackButton callback={() => {this.reset()}} text={"Reset"} theme={"info"}/>
                        </div>
                    </Card.Footer>
                </Card>
            </div>
        )
    }

    private reset() {
        this.props.filterSearch([
            {column: "question", operator: "LIKE", value: ""},
            {column: "testTopic", operator: "=", value: ""},
            {column: "category", operator: "=", value: ""},
            {column: "subCategory", operator: "=", value: ""},
            {column: "style", operator: "=", value: ""}
        ]);
        this.setState({
            filters: [
                {column: "question", operator: "LIKE", value: ""},
                {column: "testTopic", operator: "=", value: ""},
                {column: "category", operator: "=", value: ""},
                {column: "subCategory", operator: "=", value: ""},
                {column: "style", operator: "=", value: ""}
            ]
        });
    }

    /* generic state handler with event */
    private handleFilterValueEvent(event: any, column: string, type: number): void {
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

        this.setState({
            filters: this.constructFilter(this.state.filters, column, val)
        });
    }

    private constructFilter(oldList: IFilterQuery[], column: string, value: string | number | string[]) {
        let filterList = oldList;
        let idx = -1;
        filterList.some((f: IFilterQuery, internal_i: number) => {
            if (f.column === column) {
                idx = internal_i;
                return true;
            }
            return false;
        });
        let filter: IFilterQuery = filterList[idx];
        filter.value = value;
        filterList[idx] = filter;
        return filterList;
    }
}
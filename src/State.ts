import DateTimeFormat = Intl.DateTimeFormat;

export interface IAppState {
	authUser: any;
}

export interface Roles {
	isAdmin: boolean;
	isMember: boolean;
}

export interface QuestionValues {
	[name: string]: string;
}

export interface ICategory {
	categoryID?: number;
	label: string;
	typeOfCategory: number;
	createdBy: string;
	createdDatetime: Date;
	modifiedBy: string;
	modifiedDatetime: Date;
	isActive: number;
}

export interface IQuestion {
	questionID?: number;
	question?: string;
	testTopic?: string;
	style?: string;
	category?: string;
	subCategory?: string;
	correctAnswer?: string;
	answers?: string;
	difficulty?: string;
	softwareVersion?: string;
	documentation?: string;
	helperTextOne?: string;
	helperTextTwo?: string;
	createdBy: string;
	createdDatetime: Date;
	modifiedBy: string;
	modifiedDatetime: Date;
	isActive: number;
}

export interface ITestResponse {
	responseID?: number;
	questionID: number;
	response: string;
	createdBy: string;
	createdDatetime: Date;
	modifiedBy: string;
	modifiedDatetime: Date;
	isActive: number;
}

export interface ITestAttempt {
	testAttemptID?: number;
	testLevel: string;
	testTopic?: string;
	numberOfQuestions: number;
	timeLimit: number;
	showHelperText?: number;
	showDocumentation?: number;
	startDatetime?: Date;
	endDatetime?: Date;
	userSubmitted?: number;
	createdBy?: string;
	createdDatetime?: Date;
	modifiedBy?: string;
	modifiedDatetime?: Date;
	isActive?: number;
}

export interface ITestSummary {
	testSummaryID?: number;
	testAttemptID: number;
	withinTimeLimit: number;
	numberCorrect: number;
	duration: number;
	grade?: number;
	createdBy?: string;
	createdDatetime?: Date;
	modifiedBy?: string;
	modifiedDatetime?: Date;
	isActive?: number;
}

export interface ICreateTestResponse {
	testAttempt?: ITestAttempt;
	testResponse?: ITestResponse[];
}


export interface IOptions {
	label: string;
	value: string | number;
}

/***
 * Views
 */
export interface ITestAttemptDetailView {
	testSummaryID: number;
	withinTimeLimit: number;
	testAttemptID: number;
	responseID: number;
	response: string;
	questionID: number;
	answers: string;
	correctAnswer: string;
	difficulty: string;
	question: string;
}

/***
 * Begin specific ERROR component grouping example
 ***/
export interface SomeValidationError {
	type: string;
	e_length?: string;
	e_width?: string;
	e_quantity?: string;
}

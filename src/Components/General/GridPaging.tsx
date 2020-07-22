import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {IPagination} from "../../State";

interface IProps {
    paging?: IPagination;
    forwardPageCallback?: any;
    backwardPageCallback?: any;
    totalCount?: number;
}

export class GridPaging extends React.Component<IProps, {}> {
    public render() {
        return (
            <div className={'width-100'}>
                <div className={'floater-rght margin-r-perc-5'}>
                    <span
                        className={this.leftArrowStyle()}
                        id={'accord-icon-0'}
                        onClick={this.props.backwardPageCallback}
                    >
                        <FontAwesomeIcon icon={faArrowLeft}/>
                    </span>
                    <span
                        className={this.rightArrowStyle()}
                        id={'accord-icon-0'}
                        onClick={this.props.forwardPageCallback}
                    >
                        <FontAwesomeIcon icon={faArrowRight}/>
                    </span>
                </div>
            </div>
        );
    }

    private leftArrowStyle() {
        const {startIndex} = this.props.paging;
        return startIndex === 0 ? 'margin-t-10 margin-l-10 paging-disabled' : 'margin-t-10 margin-l-10 paging-enabled';
    }

    private rightArrowStyle() {
        const {startIndex, batchSize} = this.props.paging;
        return (startIndex + batchSize) >= this.props.totalCount ? 'margin-t-10 margin-l-10 paging-disabled' : 'margin-t-10 margin-l-10 paging-enabled';
    }
}
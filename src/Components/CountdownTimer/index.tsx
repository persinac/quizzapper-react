import React from 'react';
import '../../Styles/general.css';
import Countdown from "react-countdown";
import {PAGE_TEST} from "../../Constants/Pages";

// Random component
const Completionist = () => <span>You are good to go!</span>;

interface IProps {
    currentPage: number;
    minutes: number;
}

interface IState {
    height?: string;
}

export class CountdownComponent extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public componentDidMount() {}

    shouldComponentUpdate(nextProps: IProps, nextState: IState) {
        return this.props.currentPage !== nextProps.currentPage;
    }

    public render() {
        return (
            <div className={'row'}>
                {this.props.currentPage === PAGE_TEST ?
                    <Countdown date={Date.now() + this.props.minutes}>
                        <Completionist/>
                    </Countdown> : null
                }
            </div>
        );
    }
}
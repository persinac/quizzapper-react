import React from "react";

interface IProps {
    callback?: any;
    className?: string;
    text?: string;
}

export class SimpleButton extends React.Component<IProps, {}> {
    public render() {
        return (
            <button onClick={ this.props.callback } className={ this.props.className }>
                { this.props.text }
            </button>
        );
    }
}
import React from "react";
import {SimpleButton} from "./SimpleButton";

interface IProps {
    callback: any;
    className?: string;
    text?: string;
    theme?: string;
}

export class CallbackButton extends React.Component<IProps, {}> {
    static defaultProps = {
        text: "Default",
        theme: "warning"
    };

    public render() {
        const {theme, ...childProps} = this.props;
        return (
            <SimpleButton {...childProps}
                          className={`btn btn-${theme} btn-sm m-1`}/>
        );
    }
}
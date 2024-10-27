import { MouseEventHandler, ReactElement } from "react";
import './ActionButton.scss'

interface props {
    showLeading?: boolean;
    showTrailing?: boolean;
    leading?: never;
    trailing?: never;
    onClick: (e : any) => void;
    children? : ReactElement;
}

export default function ActionButton ({showLeading, showTrailing, leading, trailing, onClick, children}: props) {
    return (
        <button className="button-action" onClick={onClick}>
            <span style={ {display: (showLeading)? "flex" : "none"} } className="button-action-leading">
                {leading}
            </span>

            <span className="button-action-content">
                {children}
            </span>

            <span style={ {display: (showTrailing)? "flex" : "none"} } className="button-action-trailing">
                {trailing}
            </span>
        </button>
    )

}
import * as React from "react";
// import './index.scss';
// import Picture from './picture';
import Radar from './tactic/radar'

export default class Index extends React.Component{
    public render(){
        return (
            <React.Fragment>
                <Radar></Radar>
            </React.Fragment>
        )
    }
}
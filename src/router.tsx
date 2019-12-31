import * as React from 'react';
import {
    HashRouter,
    Route,
    Switch
} from 'react-router-dom';
import Index from './pages';

export default class Routers extends React.Component<any,any>{
    public render(){
        // console.log("dsafds")
        return (
            <HashRouter>
                <Switch>
                    <Route exact={true} path="/" component={Index} />
                </Switch>
            </HashRouter>
        )
    }
}


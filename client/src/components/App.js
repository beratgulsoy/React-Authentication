import React, {Component} from 'react';
import Header from "./Header";

import { Route, BrowserRouter as Router } from "react-router-dom"
import Welcome from "./Welcome"
import SignUp from "./auth/SignUp";

class App extends Component {
	render() {
		return (
			<div>
				<Router>
					<Header />
					<Route path="/" exact component={Welcome} />
					<Route path="/signup"  component={SignUp} />
				</Router>
			</div>
		);
	}
}

export default App;
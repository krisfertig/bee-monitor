import React from "react";
import { Switch, Redirect } from "react-router-dom";

import * as authService from "../../services/auth";
import * as notificationService from '../../services/notification';

export default function Logout() {

	notificationService.terminate().then(authService.logout);

	return (
		<Switch>
			<Redirect to="/" />
		</Switch>
	);
}

import React from "react";

import { Switch, Redirect } from "react-router-dom";
import { logout } from "../../services/auth";

import * as notificationService from '../../services/notification';

export default function Logout() {

	notificationService.terminate().then(logout);

	return (
		<Switch>
			<Redirect to="/" />
		</Switch>
	);
}

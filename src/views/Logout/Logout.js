import React from "react";

import { Switch, Redirect } from "react-router-dom";
import { logout } from "../../services/auth";

import * as notificationManager from '../../notificationManager';

export default function Logout() {

	notificationManager.terminate().then(logout);

	return (
		<Switch>
			<Redirect to="/" />
		</Switch>
	);
}

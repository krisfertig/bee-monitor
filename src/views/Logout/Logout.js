import React from "react";

import { Switch, Redirect } from "react-router-dom";
import { logout } from "../../services/auth";

export default function Logout() {

	logout();

	return (
		<Switch>
			<Redirect to="/" />
		</Switch>
	);
}

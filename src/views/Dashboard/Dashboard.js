/*eslint-disable*/
import React from "react";
// @material-ui/core components
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import { SERVER_URL, BEE_GRAFANA_SERVICE } from "../../constants";

export default function Dashboard() {

	const screenSize = window.innerHeight;
	const dashboardHeight = screenSize - 150;

	const dashboardUrl = `${SERVER_URL}${BEE_GRAFANA_SERVICE}/d/m2T90j1Zz/bee-monitor?orgId&refresh=1h`;

	const dashboardView = (
		<Hidden>
			<iframe
				src={dashboardUrl}
				width="100%"
				height={dashboardHeight}
				frameBorder="0"
			>
				Não é possível apresentar o painel neste navegador pois não é compatível.
			</iframe>
		</Hidden>
	);

	return (
		<div>
			<GridContainer>
				<GridItem xs={12} sm={12} md={12}>
					{dashboardView}
				</GridItem>
			</GridContainer>
		</div>
	);
}

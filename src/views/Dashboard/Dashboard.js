/*eslint-disable*/
import React from "react";
// @material-ui/core components
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

export default function Dashboard() {

	const screenSize = window.innerHeight;
	const dashboardHeight = screenSize - 150;

	const dashboardView = (
		<Hidden>
			<iframe
				src="https://10.42.0.1/bee-grafana/d/m2T90j1Zz/bee-monitor?orgId=1&refresh=1h&from=1580167870772&to=1580772670772&var-colmeia=colmeia0001"
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

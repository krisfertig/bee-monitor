/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

export default function Dashboard() {
  return (
    <div>
      <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardBody>
            <Hidden only={["sm", "xs"]}>
              <iframe
                  src="http://localhost:1234/d/m2T90j1Zz/bee-monitor?orgId=1&kiosk=tv&refresh=1h"
                  width="100%"
                  height="750" >
              </iframe>
            </Hidden>
            <Hidden only={["lg", "md"]}>
              <GridItem xs={12} sm={12} md={6}>
                <h5>
                  O painel é visível no modo Desktop, dentro de um iframe. Como o iframe ainda não é suportado por dispositivos móveis e tablets,
                  visite o painel usando suas credenciais na página original disponível
                  <a
                    href="http://10.42.0.1:1234/d/m2T90j1Zz/bee-monitor?orgId=1&kiosk=tv&refresh=1h"
                    target="_blank"
                  > aqui </a>
                  .
                </h5>
              </GridItem>
            </Hidden>
            </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
    </div>
  );
}

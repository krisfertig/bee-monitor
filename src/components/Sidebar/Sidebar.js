/*eslint-disable*/
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";

import styles from "assets/jss/material-dashboard-react/components/sidebarStyle.js";

const useStyles = makeStyles(styles);

// verifies if routeName is the one active (in browser input)
function activeRoute(routeName) {
	return window.location.href.indexOf(routeName) > -1 ? true : false;
}

function getLinksComponent(props) {
	const classes = useStyles();
	const { color, routes } = props;

	return (
		<List className={classes.list}>
			{routes.map((prop, key) => {
				var activePro = " ";
				var listItemClasses;
				if (prop.path === "/logout") {
					activePro = classes.activePro + " ";
					listItemClasses = classNames({
						[" " + classes[color]]: true
					});
				} else {
					listItemClasses = classNames({
						[" " + classes[color]]: activeRoute(prop.layout + prop.path)
					});
				}

				const whiteFontClasses = classNames({
					[" " + classes.whiteFont]: activeRoute(prop.layout + prop.path)
				});

				return (
					<NavLink
						to={prop.layout + prop.path}
						className={activePro + classes.item}
						activeClassName="active"
						key={key}
					>
						<ListItem button className={classes.itemLink + listItemClasses}>
							{typeof prop.icon === "string" ? (
								<Icon
									className={classNames(classes.itemIcon, whiteFontClasses, {
										[classes.itemIconRTL]: props.rtlActive
									})}
								>
									{prop.icon}
								</Icon>
							) : (
									<prop.icon
										className={classNames(classes.itemIcon, whiteFontClasses, {
											[classes.itemIconRTL]: props.rtlActive
										})}
									/>
								)}
							<ListItemText
								primary={props.rtlActive ? prop.rtlName : prop.name}
								className={classNames(classes.itemText, whiteFontClasses, {
									[classes.itemTextRTL]: props.rtlActive
								})}
								disableTypography={true}
							/>
						</ListItem>
					</NavLink>
				);
			})}
		</List>
	);
}

function getBrandComponent(props) {
	const classes = useStyles();
	const { logo, logoText } = props;

	return (
		<div className={classes.logo}>
			<a
				href="/app"
				className={classNames(classes.logoLink)}
			>
				<div className={classes.logoImage}>
					<img src={logo} alt="logo" className={classes.img} />
				</div>
				{logoText}
			</a>
		</div>
	);
}

export default function Sidebar(props) {
	const classes = useStyles();

	const links = getLinksComponent(props);

	const brand = getBrandComponent(props);

	return (
		<div>
			<Hidden mdUp implementation="css">
				<Drawer
					variant="temporary"
					anchor="right"
					open={props.open}
					classes={{
						paper: classNames(classes.drawerPaper)
					}}
					onClose={props.handleDrawerToggle}
					ModalProps={{
						keepMounted: true // Better open performance on mobile.
					}}
				>
					{brand}

					<div className={classes.sidebarWrapper}>
						{links}
					</div>

					<div
						className={classes.background}
					/>
				</Drawer>
			</Hidden>
			<Hidden smDown implementation="css">
				<Drawer
					anchor="left"
					variant="permanent"
					open
					classes={{
						paper: classNames(classes.drawerPaper)
					}}
				>
					{brand}

					<div className={classes.sidebarWrapper}>
						{links}
					</div>

					<div
						className={classes.background}
					/>
				</Drawer>
			</Hidden>
		</div>
	);
}

Sidebar.propTypes = {
	handleDrawerToggle: PropTypes.func,
	bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
	logo: PropTypes.string,
	image: PropTypes.string,
	logoText: PropTypes.string,
	routes: PropTypes.arrayOf(PropTypes.object),
	open: PropTypes.bool
};

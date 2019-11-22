/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import ExitToApp from "@material-ui/icons/ExitToApp";

/*
import EmojiNature from '@material-ui/icons/EmojiNature';
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";
*/
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import Logout from "views/Logout/Logout.js";

/*
import TableList from "views/TableList/TableList.js";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
import NotificationsPage from "views/Notifications/Notifications.js";
*/

const dashboardRoutes = [
	{
		path: "/dashboard",
		name: "Painel",
		icon: Dashboard,
		component: DashboardPage,
		layout: "/app"
	},
	{
		path: "/user",
		name: "Meus Dados",
		icon: Person,
		component: UserProfile,
		layout: "/app"
	},
	{
		path: "/logout",
		name: "Sair",
		icon: ExitToApp,
		component: Logout,
		layout: "/app"
	}
	/*
	{
	  path: "/beehive",
	  name: "Colmeias",
	  icon: EmojiNature,
	  component: Icons,
	  layout: "/app"
	},
	/*
	{
	  path: "/table",
	  name: "Table List",
	  rtlName: "قائمة الجدول",
	  icon: "content_paste",
	  component: TableList,
	  layout: "/admin"
	},
	{
	  path: "/typography",
	  name: "Typography",
	  rtlName: "طباعة",
	  icon: LibraryBooks,
	  component: Typography,
	  layout: "/admin"
	},
	{
	  path: "/icons",
	  name: "Icons",
	  //icon: BubbleChart,
	  icon: Person,
	  component: Icons,
	  layout: "/app"
	},
	{
	  path: "/maps",
	  name: "Maps",
	  icon: LocationOn,
	  component: Maps,
	  layout: "/app"
	},
	{
	  path: "/notifications",
	  name: "Notifications",
	  rtlName: "إخطارات",
	  icon: Notifications,
	  component: NotificationsPage,
	  layout: "/admin"
	}*/
];

export default dashboardRoutes;

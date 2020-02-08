// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";

import React from 'react';
import { forwardRef } from 'react';

//import { Redirect } from "react-router-dom";

import * as geolocationService from '../../services/geolocation';

import MaterialTable from 'material-table';

// Table Icons
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

// Actions Icons
import AddLocation from "@material-ui/icons/AddLocation";
//import DashboardIcon from '@material-ui/icons/Dashboard';

// Componentes para mensagem de notificação "Snackbar"
import clsx from 'clsx';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import { red, green } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const localizationTexts = {
	toolbar: {
		searchPlaceholder: 'Pesquisar',
		searchTooltip: 'Pesquisar',
	},
	pagination: {
		firstTooltip: 'Primeira página',
		previousTooltip: 'Página anterior',
		nextTooltip: 'Próxima página',
		lastTooltip: 'Última página',
		labelRowsSelect: 'resultados',
		labelRowsPerPage: 'Resultados por página:',
	},
	header: {
		actions: 'Ações',
	}
};

const styles = {
	//Style Snackbar:
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: red[600],
	},
	icon: {
		fontSize: "20px",
	},
	iconVariant: {
		opacity: "0.9",
		margin: "5px",
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
};

class Beehives extends React.Component {

	constructor({ classes }) {
		super();

		this.queryBeehiveData = this.queryBeehiveData.bind(this);
		this.saveLocation = this.saveLocation.bind(this);
		this.openDashboard = this.openDashboard.bind(this);

		this.renderFeedbackMessage = this.renderFeedbackMessage.bind(this);
		this.handleCloseFeedbackMessage = this.handleCloseFeedbackMessage.bind(this);

		this.classes = classes;

		this.state = {
			data: [],
			feedbackMessage: "",
			isUpdatingBeehiveData: false,
		};
	}

	async componentDidMount() {
		const beehiveData = await this.queryBeehiveData();
		this.setState({ data: beehiveData });
	}

	async saveLocation(event, beehiveData) {
		this.setState({ isUpdatingBeehiveData: true });
		const deviceId = beehiveData.name;

		try {
			await geolocationService.getCurrentPosition(deviceId);

			this.setState({
				feedbackMessage: "success",
				isUpdatingBeehiveData: false,
			});
		} catch (error) {
			//TODO: Melhorar mensagem deste log
			console.log('saveLocation ERROR:', error);

			this.setState({
				feedbackMessage: "error",
				isUpdatingBeehiveData: false,
			});
		}
	}
	
	//TODO: Abrir o painel diretamente na colmeia com o deviceId passado por parâmetro
	openDashboard(event, beehiveData) {
		const deviceId = beehiveData.name;
		console.log('openDashboard deviceId:', deviceId);
	}
	
	async queryBeehiveData() {
		//TODO: GET dos ids das colmeias através de uma api

		const data = [
			{ name: 'colmeia0001' },
			{ name: 'colmeia0003' },
		];
		return data;
	}

	handleCloseFeedbackMessage() {
		this.setState({ feedbackMessage: "" });
	}

	renderFeedbackMessage() {
		const classes = this.classes;
		const { feedbackMessage } = this.state;

		if (!!feedbackMessage) {
			const type = feedbackMessage;
			const Icon = type === 'success' ? CheckCircleIcon : ErrorIcon;
			const successMessage = "Os dados foram salvos com sucesso! Verifique o seu painel para ver os dados atualizados!";
			const message = type === 'success' ? successMessage : "Erro ao salvar os dados!";

			return (
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					open={true}
					autoHideDuration={6000}
					onClose={this.handleCloseFeedbackMessage}
				>
					<SnackbarContent
						className={classes[type]}
						aria-describedby="client-snackbar"
						message={
							<span id="client-snackbar" className={classes.message}>
								<Icon className={clsx(classes.icon, classes.iconVariant)} />
								{message}
							</span>
						}
						action={[
							<IconButton key="close" aria-label="close" color="inherit" onClick={this.handleCloseFeedbackMessage}>
								<CloseIcon className={classes.icon} />
							</IconButton>,
						]}
					/>
				</Snackbar>
			);
		}
		return null;
	}

	render() {
		const feedbackMessageToast = this.renderFeedbackMessage();

		return (
			<div>
				<MaterialTable
					title="Dados das colmeias"
					icons={tableIcons}
					isLoading={this.state.isUpdatingBeehiveData}
					data={this.state.data}
					columns={[
						{ title: 'Nome', field: 'name' },
					]}
					actions={[
						{
							icon: AddLocation,
							tooltip: 'Adicionar nova localização',
							onClick: this.saveLocation,
						},
						/*{
							icon: DashboardIcon,
							tooltip: 'Ver painel',
							onClick: this.openDashboard,
						},*/
					]}
					options={{
						actionsColumnIndex: -1,
					}}
					localization={localizationTexts}
				/>

				{feedbackMessageToast}
			</div>
		);
	}
}

export default withStyles(styles)(Beehives);
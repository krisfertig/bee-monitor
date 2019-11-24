import React from "react";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
//import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

//import * as ButtonMUI from '@material-ui/core/Button';
import clsx from 'clsx';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import { red, green } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';

import api from "../../services/api";

const styles = {
	cardCategoryWhite: {
		color: "rgba(255,255,255,.62)",
		margin: "0",
		fontSize: "14px",
		marginTop: "0",
		marginBottom: "0"
	},
	cardTitleWhite: {
		color: "#FFFFFF",
		marginTop: "0px",
		minHeight: "auto",
		fontWeight: "300",
		fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
		marginBottom: "3px",
		textDecoration: "none"
	},
	cardSpace: {
		marginTop: "20px",
		marginBottom: "30px",
	},

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

class UserProfile extends React.Component {
	constructor({ classes }) {
		super();

		this.handleUserProfileUpdate = this.handleUserProfileUpdate.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleCloseFeedbackMsg = this.handleCloseFeedbackMsg.bind(this);
		this.getFeedbackMessage = this.getFeedbackMessage.bind(this);

		this.classes = classes;

		this.state = {
			username: "",
			email: "",
			firstName: "",
			lastName: "",

			companyName: "",
			companyAddress: "",
			companyPostalCode: "",
			city: "",
			country: "",

			feedbackMsg: "",
		};
	}
	
	async handleUserProfileUpdate(e) {
		e.preventDefault();

		const { username, email, firstName, lastName, companyName, companyAddress, companyPostalCode, city, country } = this.state;

		const data = {
			username,
			email,
			firstName,
			lastName,
			companyName,
			companyAddress,
			companyPostalCode,
			city,
			country
		};
		console.log('handleUserProfileUpdate data', data);

		this.setState({ feedbackMsg: "success" });

		try {
			await api.post("/userProfiles", data);
			//this.props.history.push("/");
			this.setState({ feedbackMsg: "success" });
		} catch (err) {
			console.log(err);
			this.setState({ feedbackMsg: "error" });
		}
	}

	handleCloseFeedbackMsg() {
		console.log('handleCloseFeedbackMsg');
		this.setState({ feedbackMsg: "" });
	}

	getFeedbackMessage() {
		const classes = this.classes;
		const { feedbackMsg } = this.state;

		if (!!feedbackMsg) {
			const type = feedbackMsg;
			const Icon = type === 'success' ? CheckCircleIcon : ErrorIcon;
			const message = type === 'success' ? "Os dados foram salvos com sucesso!" : "Erro ao salvar os dados!";

			return (
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					open={true}
					autoHideDuration={6000}
					onClose={this.handleCloseFeedbackMsg}
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
							<IconButton key="close" aria-label="close" color="inherit" onClick={this.handleCloseFeedbackMsg}>
								<CloseIcon className={classes.icon} />
							</IconButton>,
						]}
					/>
				</Snackbar>
			);
		}
		return null;
	}

	handleChange(event) {
		const inputElement = event.target;
		const inputName = inputElement.id;
		const inputValue = inputElement.value;

		this.setState({ [inputName]: inputValue });
	}

	render() {
		const classes = this.classes;

		const feedbackMsgComponent = this.getFeedbackMessage();

		return (
			<div>
				<GridContainer>
					<GridItem xs={12} sm={12} md={12}>
						<form onSubmit={this.handleUserProfileUpdate}>
							<Card>
								<CardHeader color="warning">
									<h4 className={classes.cardTitleWhite}>Meu Perfil</h4>
								</CardHeader>

								<CardBody>
									<GridContainer>
										<GridItem xs={12} sm={12} md={3}>
											<CustomInput
												labelText="Usuário"
												id="username"
												formControlProps={{
													fullWidth: true,
													required: true,
												}}
												inputProps={{
													value: this.state.username,
													onChange: this.handleChange
												}}
											/>
										</GridItem>
										<GridItem xs={12} sm={12} md={4}>
											<CustomInput
												labelText="E-mail"
												id="email"
												formControlProps={{
													fullWidth: true,
													required: true,
												}}
												inputProps={{
													value: this.state.email,
													onChange: this.handleChange
												}}
											/>
										</GridItem>
									</GridContainer>
									<GridContainer>
										<GridItem xs={12} sm={12} md={3}>
											<CustomInput
												labelText="Nome"
												id="firstName"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													value: this.state.firstName,
													onChange: this.handleChange
												}}
											/>
										</GridItem>
										<GridItem xs={12} sm={12} md={4}>
											<CustomInput
												labelText="Sobrenome"
												id="lastName"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													value: this.state.lastName,
													onChange: this.handleChange
												}}
											/>
										</GridItem>
									</GridContainer>
								</CardBody>

								<div className={classes.cardSpace}></div>

								<CardHeader color="warning">
									<h4 className={classes.cardTitleWhite}>Minha Empresa</h4>
								</CardHeader>

								<CardBody>
									<GridContainer>
										<GridItem xs={12} sm={12} md={4}>
											<CustomInput
												labelText="Nome"
												id="companyName"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													value: this.state.companyName,
													onChange: this.handleChange
												}}
											/>
										</GridItem>
									</GridContainer>
									<GridContainer>
										<GridItem xs={12} sm={12} md={6}>
											<CustomInput
												labelText="Endereço"
												id="companyAddress"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													value: this.state.companyAddress,
													onChange: this.handleChange
												}}
											/>
										</GridItem>
										<GridItem xs={12} sm={12} md={2}>
											<CustomInput
												labelText="CEP"
												id="companyPostalCode"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													value: this.state.companyPostalCode,
													onChange: this.handleChange
												}}
											/>
										</GridItem>
									</GridContainer>
									<GridContainer>
										<GridItem xs={12} sm={12} md={4}>
											<CustomInput
												labelText="Cidade"
												id="city"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													value: this.state.city,
													onChange: this.handleChange
												}}
											/>
										</GridItem>
										<GridItem xs={12} sm={12} md={4}>
											<CustomInput
												labelText="País"
												id="country"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													value: this.state.country,
													onChange: this.handleChange
												}}
											/>
										</GridItem>
									</GridContainer>

								</CardBody>

								<CardFooter>
									<Button
										color="info"
										type="submit"
									>Salvar</Button>
								</CardFooter>
							</Card>
						</form>
					</GridItem>
				</GridContainer>

				{feedbackMsgComponent}

			</div>
		);
	}
}

export default withStyles(styles)(UserProfile);

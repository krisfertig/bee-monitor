import React from "react";

// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CircularProgress from '@material-ui/core/CircularProgress';

// Componentes para mensagem de notificação "Snackbar"
import clsx from 'clsx';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import { red, green, lightBlue } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';

// Componentes para formulário de Select
import CustomSelect from "components/CustomSelect/CustomSelect.js";
import MenuItem from '@material-ui/core/MenuItem';

import api from "../../services/api";

import { BEE_AUTH_SERVICE } from "../../constants";
const userProfilesAPIUrl = `${BEE_AUTH_SERVICE}/v1/userProfiles`;

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

	//Style Save Button:
	buttonProgress: {
		color: lightBlue[500],
		top: "10px",
		right: "50%",
		position: "relative",
	},

	//Other styles:
	wrapper: {
		margin: "1px",
		position: 'relative',
	},
};

class UserProfile extends React.Component {
	constructor({ classes }) {
		super();

		this.handleUserProfileUpdate = this.handleUserProfileUpdate.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleCloseFeedbackMessage = this.handleCloseFeedbackMessage.bind(this);

		this.renderFeedbackMessage = this.renderFeedbackMessage.bind(this);
		this.renderSaveButton = this.renderSaveButton.bind(this);
		this.renderCompanyForm = this.renderCompanyForm.bind(this);
		this.renderUserProfileForm = this.renderUserProfileForm.bind(this);
		this.renderUserRoleForm = this.renderUserRoleForm.bind(this);

		this.getUserProfileData = this.getUserProfileData.bind(this);

		this.classes = classes;

		this.state = {
			username: "",
			email: "",
			firstName: "",
			lastName: "",
			userRole: "",

			companyName: "",
			companyAddress: "",
			companyPostalCode: "",
			city: "",
			country: "",

			feedbackMessage: "",
			isUpdatingUserProfile: false,
			hasNoUserProfile: false,
			userProfileId: "",
		};
	}

	async componentDidMount() {
		try {
			const { data } = await api.get(`${BEE_AUTH_SERVICE}/v1/users`);
			this.setState({
				email: data.email,
				username: data.username,
			});

			await this.getUserProfileData(data.id);

		} catch (err) {
			//TODO: Ajustar mensagem de erro deste log
			console.error("GET userData Error:", err);
		}
	}

	async getUserProfileData(userId) {
		try {
			const userProfileUrl = `${userProfilesAPIUrl}/${userId}`;
			const { data } = await api.get(userProfileUrl);
			const userProfile = data;

			this.setState({
				firstName: userProfile.first_name,
				lastName: userProfile.last_name,
				userRole: userProfile.user_role,
				userProfileId: userProfile.id,
			});
		} catch (err) {
			console.error('Não foi possível requisitar os dados do perfil do usuário', err);
			this.setState({
				hasNoUserProfile: true
			})
		}
	}
	
	async handleUserProfileUpdate(e) {
		e.preventDefault();
		this.setState({ isUpdatingUserProfile: true });

		/*const { username, email, firstName, lastName, userRole, companyName, companyAddress, companyPostalCode, city, country } = this.state;
		const data = {
			username,
			email,
			firstName,
			lastName,
			userRole,
			companyName,
			companyAddress,
			companyPostalCode,
			city,
			country
		};
		*/

		const { firstName, lastName, userRole, hasNoUserProfile, userProfileId } = this.state;
		try {
			const data = { firstName, lastName, userRole };

			if (hasNoUserProfile) {
				await api.post(userProfilesAPIUrl, data);
			} else {
				await api.put(`${userProfilesAPIUrl}/${userProfileId}`, data);
			}

			this.setState({
				feedbackMessage: "success",
				isUpdatingUserProfile: false,
				hasNoUserProfile: false
			});
		} catch (err) {
			//TODO: Ajustar mensagem de erro deste log
			console.error("handleUserProfileUpdate Error:", err);
			this.setState({
				feedbackMessage: "error",
				isUpdatingUserProfile: false
			});
		}
	}

	handleCloseFeedbackMessage() {
		this.setState({ feedbackMessage: "" });
	}

	handleInputChange(event) {
		const inputElement = event.target;
		const inputName = inputElement.id;
		const inputValue = inputElement.value;

		this.setState({ [inputName]: inputValue });
	}

	renderFeedbackMessage() {
		const classes = this.classes;
		const { feedbackMessage } = this.state;

		if (!!feedbackMessage) {
			const type = feedbackMessage;
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

	renderSaveButton() {
		const classes = this.classes;

		return this.state.isUpdatingUserProfile ? (
			<div>
				<Button color="info" disabled={true}>Salvar</Button>
				<CircularProgress size={24} className={classes.buttonProgress} />
			</div>
		) : (
			<Button color="info" type="submit" >Salvar</Button>
		);
	}

	renderCompanyForm() {
		const classes = this.classes;

		return (
			<div>
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
									onChange: this.handleInputChange
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
									onChange: this.handleInputChange
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
									onChange: this.handleInputChange
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
									onChange: this.handleInputChange
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
									onChange: this.handleInputChange
								}}
							/>
						</GridItem>
					</GridContainer>
				</CardBody>
			</div>
		);
	}

	renderUserRoleForm() {
		const handleSelectChange = event => {
			const userRoleValue = event.target.value;
			this.setState({ userRole: userRoleValue });
		};

		// TODO: Melhorar estas constantes. Sugestão: Criar um Map()
		const userRoleApicultor = "Apicultor";
		const userRoleTecnico = "Técnico";
		const userRoleNenhum = "Nenhum";
		// TODO: Melhorar aqui, possivelmente usando um iterador para criar tais componentes e dar push no array
		const menuItems = [
			<MenuItem key={userRoleNenhum} value={userRoleNenhum} >{userRoleNenhum}</MenuItem>,
            <MenuItem key={userRoleApicultor} value={userRoleApicultor} >{userRoleApicultor}</MenuItem>,
            <MenuItem key={userRoleTecnico} value={userRoleTecnico} >{userRoleTecnico}</MenuItem>
        ];

		return (
			<GridItem xs={12} sm={12} md={4}>
				<CustomSelect
					labelText="Cargo"
					id="userRole"
					formControlProps={{
						fullWidth: true,
					}}
					inputProps={{
						value: this.state.userRole,
						onChange: handleSelectChange
					}}
					selectProps={{
						options: menuItems
					}}
				/>
			</GridItem>
		);
	}

	renderUserProfileForm() {
		const classes = this.classes;
		const userRoleForm = this.renderUserRoleForm();

		return (
			<div>
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
									disabled: true,
								}}
								inputProps={{
									value: this.state.username,
									onChange: this.handleInputChange
								}}
							/>
						</GridItem>
						<GridItem xs={12} sm={12} md={4}>
							<CustomInput
								labelText="E-mail"
								id="email"
								formControlProps={{
									fullWidth: true,
									disabled: true,
								}}
								inputProps={{
									value: this.state.email,
									onChange: this.handleInputChange
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
									onChange: this.handleInputChange
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
									onChange: this.handleInputChange
								}}
							/>
						</GridItem>
					</GridContainer>
					<GridContainer>
						{userRoleForm}
					</GridContainer>
				</CardBody>
			</div>
		);
	}

	render() {
		const feedbackMessageToast = this.renderFeedbackMessage();
		const saveButton = this.renderSaveButton();

		// Por enquanto não apresentará formulário de empresa:
		//const companyForm = this.renderCompanyForm();
		const companyForm = null;
		const userProfileForm = this.renderUserProfileForm();

		return (
			<div>
				<GridContainer>
					<GridItem xs={12} sm={12} md={12}>
						<form onSubmit={this.handleUserProfileUpdate}>
							<Card>
								{userProfileForm}
								{companyForm}
								<CardFooter>
									{saveButton}
								</CardFooter>
							</Card>
						</form>
					</GridItem>
				</GridContainer>

				{feedbackMessageToast}
			</div>
		);
	}
}

export default withStyles(styles)(UserProfile);

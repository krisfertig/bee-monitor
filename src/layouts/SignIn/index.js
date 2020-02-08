import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Logo from "../../assets/bee-monitor-logo.png";
import api from "../../services/api";

import * as authService from '../../services/auth';
import * as notificationService from '../../services/notification';
import * as geolocationService from '../../services/geolocation';

import { Form, Container } from "./styles";

import { BEE_AUTH_SERVICE } from "../../constants";

class SignIn extends Component {
	state = {
		email: "",
		password: "",
		error: ""
	};

	handleSignIn = async (e) => {
		e.preventDefault();

		const { email, password } = this.state;

		if (!email || !password) {
			this.setState({ error: "Preencha e-mail e senha para continuar!" });
		} else {
			try {
				const url = `${BEE_AUTH_SERVICE}/v1/sessions`;
				const response = await api.post(url, { email, password });

				authService.login(response.data.token);
				notificationService.init();
				geolocationService.getCurrentPosition();

				this.props.history.push("/app");
			} catch (err) {
				this.setState({
					error:
						"Houve um problema com o login, verifique suas credenciais."
				});
			}
		}
	};

	render() {
		return (
			<Container>
				<Form onSubmit={this.handleSignIn}>
					<img src={Logo} alt="Bee Monitor logo" />
					{this.state.error && <p>{this.state.error}</p>}

					<label htmlFor="signin-email">E-mail</label>
					<input
						id="signin-email"
						type="email"
						placeholder="Endereço de e-mail"
						onChange={e => this.setState({ email: e.target.value })}
					/>

					<label htmlFor="signin-password">Senha</label>
					<input
						id="signin-password"
						type="password"
						placeholder="Senha"
						onChange={e => this.setState({ password: e.target.value })}
					/>

					<button type="submit">Entrar</button>
					<hr />
					<Link to="/signup">Criar conta grátis</Link>
				</Form>
			</Container>
		);
	}
}

export default withRouter(SignIn);

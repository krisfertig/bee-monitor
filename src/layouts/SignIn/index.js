import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Logo from "../../assets/bee-monitor-logo.png";
import api from "../../services/api";
import { login } from "../../services/auth";

//TODO: Talvez mover o arquivo notificationService para dentro de /services, e utilizar como se fosse um serviço
import * as notificationService from '../../services/notification';
import * as geolocationService from '../../services/geolocation';

import { Form, Container } from "./styles";

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
				const response = await api.post("/bee-auth/api/v1/sessions", { email, password });

				login(response.data.token);
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
					<input
						type="email"
						placeholder="Endereço de e-mail"
						onChange={e => this.setState({ email: e.target.value })}
					/>
					<input
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

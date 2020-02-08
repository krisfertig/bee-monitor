import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Logo from "../../assets/bee-monitor-logo.png";

import { Form, Container } from "./styles";
import Tooltip from '@material-ui/core/Tooltip';

import api from "../../services/api";
import { BEE_AUTH_SERVICE } from "../../constants";

class SignUp extends Component {
	state = {
		username: "",
		email: "",
		password: "",
		error: ""
	};

	handleSignUp = async (e) => {
		e.preventDefault();

		const { username, email, password } = this.state;

		if (!username || !email || !password) {
			this.setState({ error: "Preencha todos os dados para se cadastrar" });
		} else {
			try {
				const url = `${BEE_AUTH_SERVICE}/v1/users`;
				await api.post(url, { username, email, password });
				this.props.history.push("/");
			} catch (err) {
				console.log(err);
				this.setState({ error: "Ocorreu um erro ao registrar sua conta." });
			}
		}
	};

	render() {
		return (
			<Container>
				<Form onSubmit={this.handleSignUp}>
					<img src={Logo} alt="Bee Monitor logo" />
					{this.state.error && <p>{this.state.error}</p>}

					<label htmlFor="signup-username">Usuário</label>
					<Tooltip title="Insira um nome de usuário sem espaço">
						<input
							id="signup-username"
							type="text"
							placeholder="Usuário"
							pattern="[^\s]+" //regex for no whitespaces
							onChange={e => this.setState({ username: e.target.value })}
						/>
					</Tooltip>

					<label htmlFor="signup-email">E-mail</label>
					<input
						id="signup-email"
						type="email"
						placeholder="E-mail"
						onChange={e => this.setState({ email: e.target.value })}
					/>

					<label htmlFor="signup-password">Senha</label>
					<input
						id="signup-password"
						type="password"
						placeholder="Senha"
						onChange={e => this.setState({ password: e.target.value })}
					/>

					<button type="submit">Cadastrar grátis</button>
					<hr />
					<Link to="/">Fazer login</Link>
				</Form>
			</Container>
		);
	}
}

export default withRouter(SignUp);

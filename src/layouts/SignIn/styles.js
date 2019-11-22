import styled from "styled-components";

export const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
`;

export const Form = styled.form`

	background: #fff;
	padding: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 300px;

	img {
		margin: 0;
	}

	p {
		color: #ff3333;
		margin: 0 0 20px 0;
		padding: 10px;
		width: 100%;
		text-align: center;
		font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif;
	}

	input {
		flex: 1;
		margin: 0 20px 15px 20px;
		color: #777;
		font-size: 15px;
		width: calc(100% - 20px);
		border: 1px solid #ddd;
		line-height: 46px;
		padding-left: 20px;

		&::placeholder {
			color: #999;
		}
	}

	button {
		color: #fff;
		font-size: 16px;
		background: #fcb963;
		height: 56px;
		border: 0;
		border-radius: 5px;
		width: 100%;
		cursor: pointer;
	}

	hr {
		margin: 20px 0;
		border: none;
		border-bottom: 1px solid #cdcdcd;
		width: 100%;
	}

	a {
		font-size: 16;
		font-weight: bold;
		color: #999;
		text-decoration: none;
		font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif;
	}
`;

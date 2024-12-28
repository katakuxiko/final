import { Button, Form, Input, message, Typography } from "antd";
import { Link, useNavigate } from "react-router";
import { LoginWrapper } from "../LogIn/style";
import { createUser } from "../../Utils/appwriter";
import { useGlobalContext, User } from "../../Utils/globalProvider";

const SignUpPage = () => {
	const { loading, isLogged, setUser, setIsLogged } = useGlobalContext();
	const navigate = useNavigate();

	if (!loading && isLogged) {
		navigate("/");
		return;
	}

	return (
		<LoginWrapper>
			<div className="form">
				<Typography.Title level={3}>Регистрация</Typography.Title>
				<Form
					layout="vertical"
					onFinish={async (i) => {
						const hide = message.loading('Регистрируем...', 10)
						try {
							const result = await createUser(
								i.email,
								i.password,
								i.username
							);
							setUser(result as unknown as User);
							setIsLogged(true);
							navigate("/");
						} catch (error) {
							message.error("Произошла ошибка!");
							console.log(error);
						} finally {
							hide()
						}
					}}
				>
					<Form.Item
						rules={[
							{ required: true, message: "Обязательное поле" },
						]}
						label="Имя пользователя"
						name="username"
					>
						<Input size="large" placeholder="Имя пользователя" />
					</Form.Item>
					<Form.Item
						rules={[
							{ required: true, message: "Обязательное поле" },
							{
								type: "email",
								message: "Введите корректный email",
							},
						]}
						label="Эл. почта"
						name="email"
					>
						<Input size="large" placeholder="example@gmail.com" />
					</Form.Item>
					<Form.Item
						rules={[
							{ required: true, message: "Обязательное поле" },
							{
								min: 8,
								message:
									"Пароль должен содержать минимум 8 символов",
							},
							{
								pattern: /(?=.*\d)/,
								message:
									"Пароль должен содержать минимум одну цифру",
							},
							{
								pattern: /(?=.*[A-Z])/,
								message:
									"Пароль должен содержать минимум одну заглавную букву",
							},
						]}
						name="password"
						label="Пароль"
					>
						<Input.Password size="large" placeholder="Пароль" />
					</Form.Item>

					<Form.Item
						rules={[
							{ required: true, message: "Обязательное поле" },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (
										!value ||
										getFieldValue("password") === value
									) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error("Пароли не совпадают")
									);
								},
							}),
						]}
						name="confirmPassword"
						label="Повторите пароль"
					>
						<Input.Password
							size="large"
							placeholder="Повторите пароль"
						/>
					</Form.Item>

					<Button htmlType="submit" type="primary" block size="large">
						Зарегистрироваться
					</Button>
				</Form>
				<div style={{ paddingTop: "12px" }}>
					<Link
						style={{ textDecoration: "none", color: "blue" }}
						to="/login"
					>
						У меня есть аккаунт!
					</Link>
				</div>
			</div>
		</LoginWrapper>
	);
};

export default SignUpPage;

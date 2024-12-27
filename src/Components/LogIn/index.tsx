import { Button, Form, Input, message, Typography } from "antd";
import { LoginWrapper } from "./style";
import { Link, useNavigate } from "react-router";
import { useGlobalContext, User } from "../../Utils/globalProvider";
import { getCurrentUser, signIn } from "../../Utils/appwriter";

const LoginPage = () => {
	const { loading, isLogged, setUser, setIsLogged } =
		useGlobalContext();
	const navigate = useNavigate();

	if (!loading && isLogged) {
		navigate("/");
		return;
	}

	return (
		<LoginWrapper>
			<div className="form">
				<Typography.Title level={3}>Вход</Typography.Title>
				<Form
					layout="vertical"
					onFinish={async (i) => {
						try {
							await signIn(i.email, i.password);
							const result = await getCurrentUser();
							setUser(result as unknown as User);
							setIsLogged(true);
						} catch (error) {
							message.error("Произошла ошибка");
							console.log(error);
						}
					}}
				>
					<Form.Item
						rules={[
							{ required: true, message: "Обязательное поле" },
							{
								type: "email",
								message: "Введите корректный email",
							},
						]}
						label="Email"
						name="email"
					>
						<Input size="large" placeholder="Email" />
					</Form.Item>
					<Form.Item
						rules={[
							{ required: true, message: "Обязательное поле" },
						]}
						name="password"
						label="Пароль"
					>
						<Input.Password size="large" placeholder="Password" />
					</Form.Item>
					<Button htmlType="submit" type="primary" block size="large">
						Войти
					</Button>
				</Form>
				<div style={{ paddingTop: "12px" }}>
					<Link
						style={{ textDecoration: "none", color: "blue" }}
						to="/sign-up"
					>
						У меня нет аккаунта!
					</Link>
				</div>
			</div>
		</LoginWrapper>
	);
};

export default LoginPage;

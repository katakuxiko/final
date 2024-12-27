import React from "react";
import { LayoutWrapper } from "./style";
import { NavLink, Outlet, useNavigate } from "react-router";
import { Button, Dropdown, Flex, MenuProps, Typography } from "antd";
import { useGlobalContext } from "../Utils/globalProvider";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import { signOut } from "../Utils/appwriter";

const Layout = () => {
	const { loading, isLogged, user, setIsLogged, setUser } =
		useGlobalContext();
	const navigate = useNavigate();
	if (!loading && !isLogged) {
		navigate("/login");
		return;
	}

	const logout = async () => {
		await signOut();
		setUser(null);
		setIsLogged(false);

		navigate("/login");
	};


	const items: MenuProps["items"] = [
		{
			key: "1",
			label: (
				<NavLink to="/">
					<Button type="text" icon={<HomeOutlined />}>
						Главная
					</Button>
				</NavLink>
			),
		},
		{
			key: "2",
			label: (
				<Button
					type="text"
					onClick={() => logout()}
					icon={<LogoutOutlined />}
				>
					Выйти
				</Button>
			),
		},
	];

	return (
		<LayoutWrapper>
			<main className="content">
				<header className="head" style={{ marginBottom: "8px" }}>
					<Flex align="center" justify="space-between">
						<Typography.Title level={2}>
							{user?.email}
						</Typography.Title>
						<Dropdown
							trigger={["click"]}
							menu={{ items }}
							placement="topLeft"
							arrow
						>
							<Button>Меню</Button>
						</Dropdown>
					</Flex>
				</header>
				<Outlet />
			</main>
		</LayoutWrapper>
	);
};

export default Layout;

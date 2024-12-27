import { Button, Flex, message, Typography } from "antd";
import { MainListWrapper } from "./style";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getMySurveys, getSurveys } from "../../Utils/appwriter";
import SurveyItem from "./SurveyItem";

export interface SurveyI {
	$id: string;
	survey: string;
	questions: string[];
	descr: string;
}
const MainList = () => {
	const navigate = useNavigate();

	const [surveys, setSurveys] = useState([]);
	const [mySurveys, setMySurveys] = useState([]);

	const fetchSurveys = async () => {
		try {
			const res = await getSurveys();
			if (res) {
				setSurveys(res);
			}
		} catch (error) {
			message.warning("Не найдены опросы");
			console.log(error);
		}
	};

	const fetchMySurveys = async () => {
		try {
			const res = await getMySurveys();
			if (res) {
				setMySurveys(res);
			}
		} catch (error) {
			message.warning("Не найдены опросы");
			console.log(error);
		}
	};

	useEffect(() => {
		fetchSurveys();
		fetchMySurveys();
	}, []);

	return (
		<MainListWrapper>
			<Flex justify="space-between" style={{ marginBottom: "12px" }}>
				<Typography.Title level={4}>Мои опросы</Typography.Title>
				<Button
					onClick={() => navigate("/add")}
					type="primary"
					size="large"
				>
					Создать опрос
				</Button>
			</Flex>
			<Flex vertical gap={12}>
				<div className="surveys">
					{mySurveys &&
						mySurveys.map((i) => (
							<SurveyItem edit={true} data={i} />
						))}
				</div>

				<Typography.Title level={4}>Все опросы</Typography.Title>
				<div className="surveys">
					{surveys && surveys.map((i) => <SurveyItem data={i} />)}
				</div>
			</Flex>
		</MainListWrapper>
	);
};

export default MainList;
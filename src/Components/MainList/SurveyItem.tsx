import {
	CheckCircleOutlined,
	EditOutlined,
	FundOutlined,
	RightCircleOutlined,
} from "@ant-design/icons";
import { Button, Typography } from "antd";
import { FC } from "react";
import { useNavigate } from "react-router";
import { SurveyI } from ".";
import { SurveyItemWrapper } from "./style";

const SurveyItem: FC<{ data: SurveyI; edit?: boolean }> = ({ data, edit }) => {
	const dataQue = JSON.parse(data.questions[0]);
	const navigate = useNavigate();

	return (
		<SurveyItemWrapper>
			<Typography.Title level={3}>{data.survey}</Typography.Title>
			<Typography.Text>{data.descr ?? "---"}</Typography.Text>
			<Typography.Text>
				Количество вопросов: {dataQue.length}
			</Typography.Text>
			<Button
				onClick={() => {
					navigate(`/go/${data.$id}`);
				}}
				type="primary"
				icon={<RightCircleOutlined />}
			>
				Перейти к опросу
			</Button>
			{edit && (
				<Button
					onClick={() => {
						navigate(`/edit/${data.$id}`);
					}}
					type="primary"
					icon={<EditOutlined />}
				>
					Изменить
				</Button>
			)}
			<Button
				onClick={() => {
					navigate(`/stat/${data.$id}`);
				}}
				type="primary"
				icon={<FundOutlined />}
			>
				Статистика
			</Button>
			<Button
				onClick={() => {
					navigate(`/answers/${data.$id}`);
				}}
				icon={<CheckCircleOutlined />}
			>
				Мои ответы
			</Button>
		</SurveyItemWrapper>
	);
};

export default SurveyItem;

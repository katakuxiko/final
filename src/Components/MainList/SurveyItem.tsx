import React, { FC } from "react";
import { SurveyItemWrapper } from "./style";
import { SurveyI } from ".";
import { Button, Typography } from "antd";
import { EditOutlined, RightCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

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
				icon={<EditOutlined />}
			>
				Статистика
			</Button>
		</SurveyItemWrapper>
	);
};

export default SurveyItem;

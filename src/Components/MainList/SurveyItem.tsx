import {
	CheckCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	FundOutlined,
	RightCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Typography, message } from "antd";
import { FC } from "react";
import { useNavigate } from "react-router";
import { SurveyI } from ".";
import { SurveyItemWrapper } from "./style";
import { deleteSurveyById } from "../../Utils/appwriter";

const SurveyItem: FC<{ data: SurveyI; edit?: boolean }> = ({ data, edit }) => {
	const dataQue = JSON.parse(data.questions[0]);
	const navigate = useNavigate();

	// Обработчик удаления опроса
	const handleDelete = async () => {
		Modal.confirm({
			title: "Вы уверены, что хотите удалить этот опрос?",
			content: "Данное действие необратимо.",
			okText: "Удалить",
			cancelText: "Отмена",
			onOk: async () => {
				try {
					await deleteSurveyById(data.$id); // Вызов функции удаления
					message.success("Опрос успешно удалён");
					window.location.reload();
				} catch (error) {
					message.error("Ошибка при удалении опроса");
					console.error(error);
				}
			},
		});
	};

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
			{edit && (
				<Button
					onClick={handleDelete}
					type="primary"
					danger
					icon={<DeleteOutlined />}
				>
					Удалить
				</Button>
			)}
		</SurveyItemWrapper>
	);
};

export default SurveyItem;

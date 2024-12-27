import { Button, Form, Switch, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getSurveyById, submitSurveyAnswers } from "../../Utils/appwriter";

const SurveyPage = () => {
	const [survey, setSurvey] = useState(null);
	const [answers, setAnswers] = useState({});
	const { surveyId } = useParams();
	const navigate = useNavigate();

	// Загружаем данные опроса
	useEffect(() => {
		const fetchSurvey = async () => {
			try {
				const surveyData = await getSurveyById(surveyId); // Получаем данные опроса по ID
				setSurvey(surveyData);
			} catch (error) {
				message.error("Ошибка при загрузке опроса");
				console.log(error);
			}
		};

		fetchSurvey();
	}, [surveyId]);

	// Обработчик изменения ответа
	const handleAnswerChange = (questionId, selectedOption, value) => {
		setAnswers((prevAnswers) => {
			// Если для этого вопроса еще нет ответа, создаём объект
			const updatedAnswers = { ...prevAnswers };
			if (!updatedAnswers[questionId]) {
				updatedAnswers[questionId] = [];
			}

			// Добавляем или удаляем вариант из массива
			if (value) {
				// Добавляем вариант, если его нет в массиве
				if (!updatedAnswers[questionId].includes(selectedOption)) {
					updatedAnswers[questionId].push(selectedOption);
				}
			} else {
				// Удаляем вариант
				updatedAnswers[questionId] = updatedAnswers[questionId].filter(
					(option) => option !== selectedOption
				);
			}

			return updatedAnswers;
		});
	};

	// Отправка ответов
	const handleSubmit = async () => {
		try {
			console.log(answers);
			await submitSurveyAnswers(surveyId, answers);
			message.success("Ваши ответы отправлены!");
			navigate(`/answers/${surveyId}`);
		} catch (error) {
			message.error("Ошибка при отправке ответов");
			console.error(error);
		}
	};

	if (!survey) {
		return <div>Загрузка опроса...</div>;
	}

	// Десериализация вопросов
	const questions = JSON.parse(survey.questions[0]);

	return (
		<div>
			<Typography.Title level={2}>{survey.survey}</Typography.Title>
			<Typography.Title level={5}>{survey.descr}</Typography.Title>
			<Form onFinish={handleSubmit}>
				{questions.map((question, index) => {
					const correctAnswersCount = question.options.filter(
						(option) => option.correct === true
					).length;

					return (
						<div key={index} style={{ marginBottom: 20 }}>
							<Typography.Title level={4}>
								Вопрос: {question.question}
							</Typography.Title>
							<Form.Item
								name={`question_${index}`}
								valuePropName="checked"
							>
								<div>
									{question.options.map((option, idx) => (
										<div
											key={idx}
											style={{ marginBottom: 10 }}
										>
											<Switch
												size="default"
												checked={answers[
													`question_${index}`
												]?.includes(option.option)}
												onChange={(value) =>
													handleAnswerChange(
														`question_${index}`,
														option.option,
														value
													)
												}
												checkedChildren="Правильный"
												unCheckedChildren="Неправильный"
											/>
											<Typography.Text
												style={{ marginLeft: 12 }}
											>
												{option.option}
											</Typography.Text>
										</div>
									))}
								</div>
							</Form.Item>
							<Typography.Text type="secondary">
								Правильных вариантов: {correctAnswersCount}
							</Typography.Text>
						</div>
					);
				})}
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Отправить ответы
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default SurveyPage;

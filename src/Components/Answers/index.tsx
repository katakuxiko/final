import { Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getSurveyById, getUserAnswers } from "../../Utils/appwriter";

const SurveyResult = () => {
	const [survey, setSurvey] = useState(null);
	const [userAnswers, setUserAnswers] = useState(null);
	const [correctAnswers, setCorrectAnswers] = useState(0);
	const { surveyId } = useParams();

	// Загружаем данные опроса и ответы пользователя
	useEffect(() => {
		const fetchSurvey = async () => {
			try {
				const surveyData = await getSurveyById(surveyId); // Получаем данные опроса по ID
				setSurvey(surveyData);

				// Получаем ответы пользователя только для текущего опроса
				const userResponse = await getUserAnswers(surveyId); // Получаем ответы пользователя
				setUserAnswers(userResponse);
			} catch (error) {
				message.error("Ошибка при загрузке данных");
				console.log(error);
			}
		};

		fetchSurvey();
	}, [surveyId]);

	// Функция для подсчета правильных ответов
	const checkAnswers = () => {
		let correctCount = 0;
		const questions = JSON.parse(survey.questions[0]); // Получаем вопросы и варианты ответа

		questions.forEach((question, index) => {
			const correctOptions = question.options
				.filter((option) => option.correct)
				.map((option) => option.option);

			const userSelectedOptions =
				JSON.parse(userAnswers)[`question_${index}`] || [];

			// Сравниваем, если выбранные пользователем варианты совпадают с правильными
			const isCorrect =
				correctOptions.length === userSelectedOptions.length &&
				correctOptions.every((opt) =>
					userSelectedOptions.includes(opt)
				);

			if (isCorrect) {
				correctCount++;
			}
		});

		setCorrectAnswers(correctCount); // Устанавливаем количество правильных ответов
	};

	// Вызов функции для проверки ответов, если данные загрузились
	useEffect(() => {
		if (survey && userAnswers) {
			checkAnswers();
		}
	}, [survey, userAnswers]);

	if (!survey || !userAnswers) {
		return <div>Загрузка...</div>;
	}

	const questions = JSON.parse(survey.questions[0]); // Десериализация вопросов

	return (
		<div>
			<Typography.Title level={2}>{survey.survey}</Typography.Title>
			<Typography.Title level={5}>{survey.descr}</Typography.Title>

			{/* Выводим результат */}
			<Typography.Text>
				Правильных ответов: {correctAnswers} из {questions.length}
			</Typography.Text>

			<div style={{ marginTop: 20 }}>
				{questions.map((question, index) => {
					const correctOptions = question.options
						.filter((option) => option.correct)
						.map((option) => option.option);
					const userSelectedOptions =
						JSON.parse(userAnswers)[`question_${index}`] || [];
					console.log(userAnswers);
					return (
						<div key={index}>
							<Typography.Title level={4}>
								Вопрос: {question.question}
							</Typography.Title>
							<Typography.Text>
								Ваши ответы: {userSelectedOptions.join(", ")}
							</Typography.Text>
							<Typography.Text
								style={{ marginLeft: 12 }}
								type="secondary"
							>
								Правильные ответы: {correctOptions.join(", ")}
							</Typography.Text>
							<br />
							{userSelectedOptions.length > 0 &&
							userSelectedOptions.sort().join(", ") ===
								correctOptions.sort().join(", ")
								? "Ответ правильный"
								: "Ответ неправильный"}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SurveyResult;

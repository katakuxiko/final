import { message, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAllSurveyAnswers, getSurveyById } from "../../Utils/appwriter"; // Используйте вашу функцию для получения опроса

// Функция для подсчета статистики
const calculateSurveyStatistics = (survey, allAnswers) => {
	let totalResponses = 0;
	let correctAnswersCount = 0;
	let incorrectAnswersCount = 0;

	const questions = JSON.parse(survey.questions[0]); // Десериализация вопросов

	allAnswers.forEach((userAnswer) => {
		const userAnswers = JSON.parse(userAnswer.answers); // Ответы пользователя
		let userCorrectCount = 0;

		questions.forEach((question, index) => {
			const correctOptions = question.options
				.filter((option) => option.correct)
				.map((option) => option.option);

			const userSelectedOptions = userAnswers[`question_${index}`] || [];

			// Сортируем оба массива перед сравнением
			const sortedCorrectOptions = correctOptions.sort();
			const sortedUserSelectedOptions = userSelectedOptions.sort();

			// Сравниваем массивы
			if (
				JSON.stringify(sortedCorrectOptions) ===
				JSON.stringify(sortedUserSelectedOptions)
			) {
				userCorrectCount++; // Если ответы совпадают
			}
		});

		// Если пользователь правильно ответил на все вопросы
		if (userCorrectCount === questions.length) {
			correctAnswersCount++;
		} else {
			incorrectAnswersCount++;
		}

		totalResponses++;
	});

	return {
		totalResponses,
		correctAnswersCount,
		incorrectAnswersCount,
	};
};

// Компонент для отображения статистики
const SurveyStatistics = () => {
	const [survey, setSurvey] = useState(null);
	const [surveyStatistics, setSurveyStatistics] = useState(null);
	const { surveyId } = useParams();

	// Загружаем данные опроса и ответы пользователей
	useEffect(() => {
		const fetchSurveyAndStatistics = async () => {
			try {
				const surveyData = await getSurveyById(surveyId); // Получаем данные опроса
				const allAnswers = await getAllSurveyAnswers(surveyId); // Получаем все ответы пользователей

				const statistics = calculateSurveyStatistics(
					surveyData,
					allAnswers
				); // Подсчитываем статистику
				setSurvey(surveyData);
				setSurveyStatistics(statistics);
			} catch (error) {
				message.error("Ошибка при загрузке данных");
				console.log(error);
			}
		};

		fetchSurveyAndStatistics();
	}, [surveyId]);

	// Если данные не загружены
	if (!survey || !surveyStatistics) {
		return <Spin size="large" />;
	}

	return (
		<div>
			<Typography.Title level={2}>{survey.survey}</Typography.Title>
			<Typography.Title level={5}>{survey.descr}</Typography.Title>
			<div style={{ marginTop: 20 }}>
				<Typography.Text>
					Общее количество ответов: {surveyStatistics.totalResponses}
				</Typography.Text>
				<br />
				<Typography.Text>
					Правильных ответов: {surveyStatistics.correctAnswersCount}
				</Typography.Text>
				<br />
				<Typography.Text>
					Неправильных ответов:{" "}
					{surveyStatistics.incorrectAnswersCount}
				</Typography.Text>
			</div>
		</div>
	);
};

export default SurveyStatistics;

import { Account, Client, Databases, ID, Query } from "appwrite";

const client = new Client();
client.setProject("6768244a000f47886b59");

const account = new Account(client);
const databases = new Databases(client);

export const appwriteConfig = {
	endpoint: "https://cloud.appwrite.io/v1",
	// platform: "com.jsm.test",
	projectId: "6768244a000f47886b59",
	databaseId: "676ece0d003080855792",
	userCollectionId: "676ece2100107267e88f",
	surveyCollectionId: "676ee3f10007635229d8", // ID вашей коллекции опросов
	answersCollectionId: "676efb8b000cdcf15855",
};

// Функция проверки текущей сессии
export async function ensureSession() {
	try {
		const currentAccount = await account.get();
		return currentAccount; // Если сессия есть, возвращаем текущего пользователя
	} catch (error) {
		if (error.type === "general_unauthorized_scope") {
			console.log("User is not logged in.");
			return null; // Пользователь не авторизован
		}
		throw new Error(error);
	}
}

// Функция входа в систему
export async function signIn(email, password) {
	try {
		// Проверяем текущую сессию
		const session = await ensureSession();
		if (session) {
			console.log("User already signed in:", session);
			return session;
		}

		// Если сессии нет, создаем новую
		const newSession = await account.createEmailPasswordSession(
			email,
			password
		);
		return newSession;
	} catch (error) {
		throw new Error(error);
	}
}

// Функция регистрации нового пользователя
export async function createUser(email, password, username) {
	try {
		// Создаем нового пользователя
		const newAccount = await account.create(
			ID.unique(),
			email,
			password,
			username
		);

		// Убеждаемся, что пользователь авторизован
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let session: any = await ensureSession();
		if (!session) {
			session = await account.createEmailPasswordSession(email, password);
		}

		// Сохраняем данные пользователя в базе данных
		const newUser = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			ID.unique(),
			{
				accountId: newAccount.$id,
				email: email,
				username: username,
			}
		);

		return newUser;
	} catch (error) {
		throw new Error(error);
	}
}

// Получение данных текущего пользователя
export async function getAccount() {
	try {
		const currentAccount = await account.get();
		return currentAccount;
	} catch (error) {
		throw new Error(error);
	}
}

// Получение текущего пользователя из базы данных
export async function getCurrentUser() {
	try {
		const currentAccount = await getAccount();
		if (!currentAccount) throw new Error("No current account found");

		const currentUser = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			[Query.equal("accountId", currentAccount.$id)]
		);

		if (!currentUser || currentUser.documents.length === 0) {
			throw new Error("No user found in the database");
		}

		return currentUser.documents[0];
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function addSurvey(surveyData) {
	try {
		const currentUser = await getCurrentUser(); // Получаем текущего пользователя

		const newSurvey = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.surveyCollectionId,
			ID.unique(), // Уникальный ID для опроса
			{
				survey: surveyData.survey, // Название опроса
				questions: surveyData.questions, // Вопросы с вариантами
				descr: surveyData.descr,
				userId: currentUser.$id, // Добавляем идентификатор пользователя
			}
		);
		return newSurvey;
	} catch (error) {
		throw new Error(error);
	}
}

// Функция для получения всех опросов
export async function getSurveys() {
	try {
		const surveys = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.surveyCollectionId
		);
		return surveys.documents;
	} catch (error) {
		throw new Error(error);
	}
}

// Функция для получения опросов текущего пользователя
export async function getMySurveys() {
	try {
		const currentUser = await getCurrentUser(); // Получаем текущего пользователя
		const surveys = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.surveyCollectionId,
			[
				Query.equal("userId", currentUser.$id), // Фильтруем по userId
			]
		);
		return surveys.documents; // Возвращаем только опросы текущего пользователя
	} catch (error) {
		throw new Error(error);
	}
}

export async function getSurveyById(surveyId) {
	try {
		const survey = await databases.getDocument(
			appwriteConfig.databaseId,
			appwriteConfig.surveyCollectionId,
			surveyId // ID опроса, который мы хотим получить
		);
		return survey; // Возвращаем найденный опрос
	} catch (error) {
		throw new Error(error); // Обрабатываем ошибку, если опрос не найден
	}
}

export async function updateSurvey(surveyId, updatedSurveyData) {
	try {
		const currentUser = await getCurrentUser(); // Получаем текущего пользователя

		const updatedSurvey = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.surveyCollectionId,
			surveyId, // ID опроса, который мы хотим обновить
			{
				survey: updatedSurveyData.survey, // Название опроса
				questions: updatedSurveyData.questions, // Вопросы с вариантами
				descr: updatedSurveyData.descr,
				userId: currentUser.$id, // Добавляем идентификатор пользователя
			} // Новые данные опроса
		);
		return updatedSurvey; // Возвращаем обновленный опрос
	} catch (error) {
		throw new Error(error); // Обрабатываем ошибку, если обновление не удалось
	}
}

// Sign Out
export async function signOut() {
	try {
		const session = await account.deleteSession("current");

		return session;
	} catch (error) {
		throw new Error(error);
	}
}

export async function submitSurveyAnswers(surveyId, answers) {
	try {
		const currentUser = await getCurrentUser(); // Получаем текущего пользователя

		// Создаем документ с ответами на опрос в базе данных
		const newSurveyAnswers = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.answersCollectionId, // ID коллекции для ответов
			ID.unique(), // Уникальный ID документа
			{
				surveyId: surveyId, // ID опроса, к которому относятся ответы
				userId: currentUser.$id, // ID текущего пользователя
				answers: JSON.stringify(answers), // Ответы на вопросы, сериализованные в JSON
			}
		);

		return newSurveyAnswers; // Возвращаем документ с ответами
	} catch (error) {
		throw new Error(error); // Обрабатываем ошибку, если создание документа не удалось
	}
}

// Функция для получения ответов пользователя по текущему опросу
export async function getUserAnswers(surveyId) {
	try {
		const response = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.answersCollectionId,
			[Query.equal("surveyId", surveyId)] // Фильтруем по surveyId
		);
		return response.documents[0]?.answers || {}; // Возвращаем ответы пользователя
	} catch (error) {
		throw new Error(error); // Обрабатываем ошибку
	}
}

export async function getAllSurveyAnswers(surveyId) {
	try {
		const response = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.answersCollectionId,
			[Query.equal("surveyId", surveyId)] // Фильтруем по surveyId
		);
		return response.documents; // Возвращаем все ответы на опрос
	} catch (error) {
		throw new Error(
			"Ошибка при получении всех ответов на опрос: " + error.message
		);
	}
}

export async function deleteSurveyById(surveyId) {
	try {
		await databases.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.surveyCollectionId,
			surveyId
		);
	} catch (error) {
		throw new Error("Ошибка при удалении опроса: " + error.message);
	}
}

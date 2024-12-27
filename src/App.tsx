import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "./Components/LogIn";
import SignUpPage from "./Components/SignUp";
import GlobalProvider from "./Utils/globalProvider";
import MainList from "./Components/MainList";
import Layout from "./Layout";
import AddForm from "./Components/Add";
import Edit from "./Components/Edit";
import SurveyPage from "./Components/Go";
import SurveyResult from "./Components/Answers";
import SurveyStatistics from "./Components/Statictic";

function App() {
	const router = createBrowserRouter([
		{
			path: "/login",
			element: <LoginPage />,
		},
		{
			path: "/sign-up",
			element: <SignUpPage />,
		},
		{
			path: "/",
			element: <Layout />,
			children: [
				{
					path: "/",
					element: <MainList />,
				},
				{
					path: "/add",
					element: <AddForm />,
				},
				{
					path: "/edit/:id",
					element: <Edit />,
				},
				{
					path: "/go/:surveyId",
					element: <SurveyPage />,
				},
				{
					path: "/answers/:surveyId",
					element: <SurveyResult />,
				},
				{
					path: "/stat/:surveyId",
					element: <SurveyStatistics />,
				},
			],
		},
	]);

	return (
		<GlobalProvider>
			<RouterProvider router={router} />
		</GlobalProvider>
	);
}

export default App;

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { getCurrentUser } from "./appwriter";

// Определяем интерфейсы для типов
export interface User {
	id: string;
	name: string;
	email: string;
	// Добавьте другие поля, если они есть в объекте пользователя
}

interface GlobalContextProps {
	isLogged: boolean;
	setIsLogged: (value: boolean) => void;
	user: User | null;
	setUser: (user: User | null) => void;
	loading: boolean;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const useGlobalContext = (): GlobalContextProps => {
	const context = useContext(GlobalContext);
	if (!context) {
		throw new Error(
			"useGlobalContext must be used within a GlobalProvider"
		);
	}
	return context;
};

interface GlobalProviderProps {
	children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
	const [isLogged, setIsLogged] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		getCurrentUser()
			.then((res) => {
				if (res) {
					setIsLogged(true);
					setUser(res as unknown as User);
				} else {
					setIsLogged(false);
					setUser(null);
				}
			})
			.catch((error: unknown) => {
				console.error(error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<GlobalContext.Provider
			value={{
				isLogged,
				setIsLogged,
				user,
				setUser,
				loading,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};

export default GlobalProvider;

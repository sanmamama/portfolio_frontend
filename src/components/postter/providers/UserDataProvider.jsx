import {createContext,useState} from "react";

export const UserDataContext = createContext({});

export const UserDataProvider = (props) =>{
	const {children} = props;
	const [email,setEmail] = useState("");

	
	
	return(
		<UserDataContext.Provider value={{email,setEmail}}>
			{children}
		</UserDataContext.Provider>
	)

}


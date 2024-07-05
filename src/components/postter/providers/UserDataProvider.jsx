import {createContext,useState} from "react";

export const UserDataContext = createContext(null);

export const UserDataProvider = (props) =>{
	const {children} = props;
	const [myUserDataGlobal,setMyUserDataGlobal] = useState(null);

	
	
	return(
		<UserDataContext.Provider value={{myUserDataGlobal,setMyUserDataGlobal}}>
			{children}
		</UserDataContext.Provider>
	)

}


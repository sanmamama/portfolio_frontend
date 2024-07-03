import {createContext,useState} from "react";

export const UserDataContext = createContext({});

export const UserDataProvider = (props) =>{
	const {children} = props;
	const [myUserDataGlobal,setMyUserDataGlobal] = useState({

	});

	
	
	return(
		<UserDataContext.Provider value={{myUserDataGlobal,setMyUserDataGlobal}}>
			{children}
		</UserDataContext.Provider>
	)

}


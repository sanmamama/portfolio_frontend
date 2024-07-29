import {createContext,useState} from "react";

export const NotificationContext = createContext(null);

export const NotificationProvider = (props) =>{
	const {children} = props;
	const [myNotificationGlobal,setMyNotificationGlobal] = useState(null);

	
	
	return(
		<NotificationContext.Provider value={{myNotificationGlobal,setMyNotificationGlobal}}>
			{children}
		</NotificationContext.Provider>
	)

}


import {createContext,useState} from "react";

export const FollowDataContext = createContext(null);

export const FollowDataProvider = (props) =>{
	const {children} = props;
	const [myFollowDataGlobal,setMyFollowDataGlobal] = useState(null);

	
	
	return(
		<FollowDataContext.Provider value={{myFollowDataGlobal,setMyFollowDataGlobal}}>
			{children}
		</FollowDataContext.Provider>
	)

}


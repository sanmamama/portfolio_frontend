import {createContext,useState} from "react";

export const BlogDataContext = createContext(null);

export const BlogDataProvider = (props) =>{
	const {children} = props;
	const [myBlogDataGlobal,setMyBlogDataGlobal] = useState(null);

	
	
	return(
		<BlogDataContext.Provider value={{myBlogDataGlobal,setMyBlogDataGlobal}}>
			{children}
		</BlogDataContext.Provider>
	)

}


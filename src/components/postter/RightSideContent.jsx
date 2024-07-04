import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"

export const RightSideContent = () => {
	const {myUserDataGlobal,setMyUserDataGlobal} = useContext(UserDataContext);


	return (
		<div class="col-sm-3 pl-1 pr-1">
			<div class="card">
				<div class="card-body pt-3 pb-3 pl-3 pr-3">
					<form action="" method="GET">
						<div class="form-group">
							<input type="text" class="form-control" name="q" placeholder="検索" value=""/>
						</div>
						<button type="submit" class="btn btn-primary">検索</button>
					</form>
				</div>
			</div>
		</div>
	  );
}

export default RightSideContent;
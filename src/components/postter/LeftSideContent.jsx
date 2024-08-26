import React, { useContext ,useState} from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {UserDataContext} from "./providers/UserDataProvider"
import {NotificationContext} from "./providers/NotificationProvider"
import { useTranslation } from 'react-i18next';
const baseUrl = process.env.REACT_APP_BASE_URL;

const LeftSideContent = () => {
	const { t } = useTranslation();
	const [query, setQuery] = useState('');
	const navigate = useNavigate();
	const {myUserDataGlobal} = useContext(UserDataContext);
	const {myNotificationGlobal} = useContext(NotificationContext);

	const handleSubmit = (event) => {
		event.preventDefault();
		if (query.trim()) {
			navigate(`/postter/search?q=${query}`);
		}
	};

	if(myUserDataGlobal==null){
		return("loading")
	}

	return (
		<div className="col-sm-3 pl-1 pr-1 d-none d-sm-block">
			<div className="">
				<div className="card mb-1">
					<div className="card-body pt-3 pb-3 pl-3 pr-3 ">
						<h5 className="mb-4"><Link to="/postter/home"><img className="me-3" src={`${baseUrl}/media/icon/home.svg`} width="16" height="16" alt="home"/>{t('home')}</Link></h5>
						<h5 className="mb-4">
							<Link to="/postter/notification/"><img className="me-3"src={`${baseUrl}/media/icon/notify.svg`} width="16" height="16" alt="notify"/>{t('notification')}</Link>
							<span className="ms-3">{myNotificationGlobal > 0 && (myNotificationGlobal)}</span>
						</h5>
						<h5 className="mb-4"><Link to="/postter/message/"><img className="me-3"src={`${baseUrl}/media/icon/message.svg`} width="16" height="16" alt="message"/>{t('message')}</Link></h5>
						<h5 className="mb-4"><Link to="/postter/memberlist/"><img className="me-3"src={`${baseUrl}/media/icon/memberlist.svg`} width="16" height="16" alt="memberlist"/>{t('list')}</Link></h5>
						
					</div>
				</div>

				<div className="mb-1 card">
					<div className="card-body pt-3 pb-3 pl-3 pr-3">
						<form onSubmit={handleSubmit}>
							<div className="form-group">
							<input type="text" className="form-control" name="q" placeholder={t('search')} value={query} onChange={(e) => setQuery(e.target.value)}/>
							</div>
							<button type="submit" className="btn btn-primary">{t('search')}</button>
						</form>
					</div>
				</div>

				<div className="card mb-1">
					<div className="card-body pt-3 pb-3 pl-3 pr-3">
						<h4>{t('profile')}</h4>						
							
						<img className="img-fluid" src={myUserDataGlobal.avatar_imgurl}  alt="avatarimage"/>
						<p className="mt-0 mb-0"><b><Link to={`/postter/${myUserDataGlobal.uid}/`}>{myUserDataGlobal.username}</Link></b></p>
						<p className="mt-0 mb-0 text-secondary">@{myUserDataGlobal.uid}</p>
						<p className="mt-0 mb-3"> {myUserDataGlobal.profile_statement}</p>
						<p className="mt-0 mb-1"><Link to={`/postter/${myUserDataGlobal.uid}/`}><b>{myUserDataGlobal.post_count}</b>{t('post')}</Link></p>
						<p className="mt-0 mb-1"><Link to={`/postter/${myUserDataGlobal.uid}/following/`}><b>{myUserDataGlobal.following_count}</b>{t('follow')}</Link></p>
						<p className="mt-0 mb-1"><Link to={`/postter/${myUserDataGlobal.uid}/follower/`}><b>{myUserDataGlobal.follower_count}</b>{t('follower')}</Link></p>
						
					</div>
				</div>
			</div>
		</div>
	  );
}

export default LeftSideContent;
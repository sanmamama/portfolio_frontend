import React from 'react';
import { Link } from 'react-router-dom';
import PostContent from './PostContent';
import ModalAddUserToList from './ModalAddUserToList';
import ModalCreateReplyButton from './ModalCreateReplyButton';
import { useTranslation } from 'react-i18next';
import {handleRepost} from './HandleRepost';
import {handleLike} from './HandleLike';
import {handleFollow} from './HandleFollow';
import {handlePostDelete} from './HandlePostDelete';

const baseUrl = process.env.REACT_APP_BASE_URL;

const PostContainer = ({ postData,myUserDataGlobal,posts,setPosts,getUserData,setMyUserDataGlobal,setMessages,refreshPost,ix }) => {
  const { t,i18n } = useTranslation();

  if(postData === null){
    return
  }

  return (
      <div className="border-top">
									<div className="row pb-2 pt-1">
										{postData.repost_user && (
											<>
												<div className="col-1 text-end">
													
												</div>
												<div className="col-11 pl-0 pr-0" style={{fontSize:"14px"}}>
													<img className="pl-0 pr-0" src={`${baseUrl}/media/icon/repost_active.svg`} width="16" height="16" alt="repost"/>
													{t('repost')}:<Link to={`/postter/${postData.repost_user.uid}/`}>{postData.repost_user.username}</Link>
												</div>
											</>
										)}
										{postData.parent && (
											<>
												<div className="col-1 text-end">
													
												</div>
												<div className="col-11 pl-0 pr-0" style={{fontSize:"14px"}}>
												<img className="pl-0 pr-0" src={`${baseUrl}/media/icon/reply.svg`} width="16" height="16" alt="reply"/>
                          {t('reply')}:<Link to={`/postter/post/${postData.parent}/`}>{t('post')}ID{postData.parent}</Link>
												</div>
											</>
										)}
									</div>
								<div className="row">
									<div className="col-fix pl-0 pr-0">
										<img className="rounded img-fluid mx-auto d-block" src={postData.owner.avatar_imgurl} id="avatar-image" width="40" height="40" alt="avatarimage"/>
									</div>
									<div className="col">

										<div className="row">
											<div className="col-10 pl-1 pr-0">
												<h6>
												<Link to={`/postter/${postData.owner.uid}/`}><b>{postData.owner.username}</b></Link>
												<span className="ms-1 text-secondary">@{postData.owner.uid}</span>
												<span className="ms-1 text-secondary">{postData.created_at.split('.')[0].replace('T',' ')}</span>
												</h6>
											</div>

											<div className="col-2 dropdown text-end pl-1 pr-0">
                        <button type="button" className="btn btn-link p-0 border-0" style={{ boxShadow: 'none', textDecoration: 'none', color: 'inherit' }} data-bs-toggle="dropdown" aria-expanded="false">
                          <img src={`${baseUrl}/media/icon/3pleader.svg`} width="16" height="16" alt="more"/>
                        </button>
												<div className="dropdown-menu">
												{postData.owner.id === myUserDataGlobal.id && (
													<>
														<ModalAddUserToList t={t} class={"dropdown-item"} id={postData.owner.id}/>
														<button className="dropdown-item" style={{cursor:"pointer"}} onClick={() => handlePostDelete(postData.id,t,refreshPost,setMessages)}>{t('delete_post')}</button>
													</>
												)}
												{postData.owner.id !== myUserDataGlobal.id && (
													<>
														<ModalAddUserToList t={t} class={"dropdown-item"} id={postData.owner.id}/>
														<button className="btn btn-link dropdown-item" style={{cursor:"pointer"}} onClick={() => handleFollow(postData.owner.id,setMessages,t,setMyUserDataGlobal)}>
															{myUserDataGlobal.following.includes(postData.owner.id) ? t('do_unfollow') : t('do_follow')}
														</button>
													</>
												)}

												</div>
											</div>
										</div>

										<div className="row">
											<div className="ms-1">
												<Link className="no-link-style" to={`/postter/post/${postData.id}/`}>
                          {i18n.language === "ja" ? <PostContent content={postData.content_JA}/>:<PostContent content={postData.content_EN}/>}

												</Link>
                        <a className="ms-1" data-bs-toggle="collapse" href={"#collapse"+ix} aria-expanded="false" aria-controls={"collapse"+ix}>
                          <img src={`${baseUrl}/media/icon/translate.svg`} width="32" height="32" alt="translate"/>
                        </a>

                          
                        
                        <div className="collapse mt-2 " id={"collapse"+ix}>
                          <div className="card card-body">
                            <PostContent content={postData.content}/>
                          </div>
                        </div>
												
											</div>
										</div>

										<div className="row">
											<div className="col-3">
												<ModalCreateReplyButton i18n={i18n} t={t} refreshPost={refreshPost} postData={postData}/>
											</div>

											<div className="col-3">
												<button className="btn btn-link" style={{cursor:"pointer"}} onClick={() => handleLike(posts,postData.id,ix,getUserData,setPosts,setMyUserDataGlobal)}>
												{myUserDataGlobal.like.includes(postData.id) ? <img src={`${baseUrl}/media/icon/heart_active.svg`} width="16" height="16" alt="like"/> : <img src={`${baseUrl}/media/icon/heart_no_active.svg`} width="16" height="16" alt="like"/>}{postData.like_count}
												</button>
											</div>

											<div className="col-3">
												<button className="btn btn-link" style={{cursor:"pointer"}} onClick={() => handleRepost(posts,postData.id,ix,getUserData,setPosts,setMyUserDataGlobal)}>
												{myUserDataGlobal.repost.includes(postData.id) ? <img src={`${baseUrl}/media/icon/repost_active.svg`} width="16" height="16"  alt="repost"/> : <img src={`${baseUrl}/media/icon/repost_no_active.svg`} width="16" height="16"  alt="repost"/>}{postData.repost_count}
												</button>
											</div>

											<div className="col-3">
												<div style={{padding : ".375rem .75rem" , fontSize : "16px"}}>
													<img src={`${baseUrl}/media/icon/view_count.svg`} width="16" height="16" alt="view"/>
													{postData.view_count}
												</div>
											</div>
										</div>
									</div>
								</div>	
							</div>
  )
};

export default PostContainer;
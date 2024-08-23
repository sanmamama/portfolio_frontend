import React from 'react';
import { Link } from 'react-router-dom';
import PostContent from './PostContent';
import ModalAddUserToList from './ModalAddUserToList';
import ModalCreateReplyButton from './ModalCreateReplyButton';
const apiUrl = process.env.REACT_APP_API_URL;
const baseUrl = process.env.REACT_APP_BASE_URL;

const PostContainer = ({ postData,myUserDataGlobal,posts,setPosts,getUserData,setMyUserDataGlobal,setMessages,refreshPost,ix }) => {
  
  //リポストハンドル
	const handleRepost = async (postId,post_ix,post_reposted) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        try {
            const response = await fetch(`${apiUrl}/postter/repost/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({ post: postId })
            });

            if (response.ok) {
              const res = await response.json();

              if(posts){
                setPosts((posts)=>{posts[post_ix].repost_count=res.repost_count;return posts;})
              }else{
                setPosts((posts)=>{posts.repost_count=res.repost_count;return posts;})
              }
              
              getUserData(setMyUserDataGlobal)
              //setMessages(res.repost_count);
            }else{
              //setMessages(res.repost_count);
            }
        } catch (error) {

        }
    };

	//いいねハンドル
	const handleLike = async (post_id,post_ix) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        const response = await fetch(`${apiUrl}/postter/like/`, {
            method: 'POST',
			headers: {
                'Content-Type': 'application/json',
				'Authorization': `Token ${token}`,
            },
			body: JSON.stringify({"post":post_id}),
        });
		const res = await response.json();


		if(response.ok){
      if(posts){
        setPosts((posts)=>{posts[post_ix].like_count=res.like_count;return posts;})
      }else{
			  setPosts((posts)=>{posts.like_count=res.like_count;return posts;})
      }

			getUserData(setMyUserDataGlobal)
			//setMessages(`postId:${post_id}   ${res.like_count}`);
			
		}else{
			//setMessages(`postId:${post_id}${res}`);
		}
        
    };

	//フォローハンドル
	const handleFollow = async (user_id) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        const response = await fetch(`${apiUrl}/postter/follow/`, {
            method: 'POST',
			headers: {
                'Content-Type': 'application/json',
				'Authorization': `Token ${token}`,
            },
			body: JSON.stringify({"following":user_id}),
        });
		const res = await response.json();
		if(response.ok){
			setMessages(`userId:${user_id}${res.message}`);
			getUserData(setMyUserDataGlobal)
			
		}else{
			setMessages(`userId:${user_id}${res}`);
		}
        
    };

	//ポスト消すハンドル
	const handlePostDelete = async (postId,post_ix) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        const response = await fetch(`${apiUrl}/postter/post/${postId}/`, {
            method: 'DELETE',
			headers: {
                'Content-Type': 'application/json',
				'Authorization': `Token ${token}`,
            }
        });
		if(response.ok){
			refreshPost()
			setMessages(`id:${postId}ポストを削除しました`);
			
		}else{
			setMessages(`id:${postId}ポストの削除に失敗しました`);
		}
	};

  if(postData === null){
    return
  }

  return (
      <div className="">
									<div className="row pb-2 pt-1">
										{postData.repost_user && (
											<>
												<div className="col-1 text-right">
													
												</div>
												<div className="col-11 pl-0 pr-0" style={{fontSize:"14px"}}>
													<img className="pl-0 pr-0" src={`${baseUrl}/media/icon/repost_active.svg`} width="16" height="16" alt="repost"/>
													<Link to={`/postter/${postData.repost_user.uid}/`}>{postData.repost_user.username}</Link>がリポストしました
												</div>
											</>
										)}
										{postData.parent && (
											<>
												<div className="col-1 text-right">
													
												</div>
												<div className="col-11 pl-0 pr-0" style={{fontSize:"14px"}}>
												<img className="pl-0 pr-0" src={`${baseUrl}/media/icon/reply.svg`} width="16" height="16" alt="reply"/>
													<Link to={`/postter/post/${postData.parent}/`}>ポストID{postData.parent}</Link>へのリプライ
												</div>
											</>
										)}
									</div>
								<div className="row border-bottom">
									<div className="col pl-0 pr-0">
										<img className="rounded img-fluid mx-auto d-block" src={postData.owner.avatar_imgurl} id="avatar-image" width="40" height="40" alt="avatarimage"/>
									</div>
									<div className="col-11">

										<div className="row">
											<div className="col-10 pl-1 pr-0">
												<h6>
												<Link to={`/postter/${postData.owner.uid}/`}><b>{postData.owner.username}</b></Link>
												<span className="ml-1 text-secondary">@{postData.owner.uid}</span>
												<span className="ml-1 text-secondary">{postData.created_at.split('.')[0].replace('T',' ')}</span>
												</h6>
											</div>

											<div className="col-2 dropdown text-right pl-1 pr-0">
												<button type="button" className="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">︙</button>
												<div className="dropdown-menu">
												{postData.owner.id === myUserDataGlobal.id && (
													<>
														<ModalAddUserToList class={"dropdown-item"} id={postData.owner.id}/>
														<button className="dropdown-item" style={{cursor:"pointer"}} onClick={() => handlePostDelete(postData.id)}>ポストを削除する</button>
													</>
												)}
												{postData.owner.id !== myUserDataGlobal.id && (
													<>
														<ModalAddUserToList class={"dropdown-item"} id={postData.owner.id}/>
														<button className="btn btn-link dropdown-item" style={{cursor:"pointer"}} onClick={() => handleFollow(postData.owner.id,ix)}>
															{myUserDataGlobal.following.includes(postData.owner.id) ? "フォローを解除する" : "フォローする"}
														</button>
													</>
												)}

												</div>
											</div>
										</div>

										<div className="row">
											<div className="ml-1">
												<Link className="no-link-style" to={`/postter/post/${postData.id}/`}>
													<PostContent content={postData.content_EN}/>
												</Link>
                        <a className="ml-1" data-toggle="collapse" href={"#collapse"+ix} aria-expanded="false" aria-controls={"collapse"+ix}>
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
												<ModalCreateReplyButton refreshPost={refreshPost} postData={postData}/>
											</div>

											<div className="col-3">
												<button className="btn btn-link" style={{cursor:"pointer"}} onClick={() => handleLike(postData.id,ix,myUserDataGlobal.like.includes(postData.id))}>
												{myUserDataGlobal.like.includes(postData.id) ? <img src={`${baseUrl}/media/icon/heart_active.svg`} width="16" height="16" alt="like"/> : <img src={`${baseUrl}/media/icon/heart_no_active.svg`} width="16" height="16" alt="like"/>}{postData.like_count}
												</button>
											</div>

											<div className="col-3">
												<button className="btn btn-link" style={{cursor:"pointer"}} onClick={() => handleRepost(postData.id,ix,myUserDataGlobal.repost.includes(postData.id))}>
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
import React from 'react';
import Modal from "react-modal";
import PostContent from './PostContent';

Modal.setAppElement("#root");
const apiUrl = process.env.REACT_APP_API_URL;
const baseUrl = process.env.REACT_APP_BASE_URL;


const customStyles = {
  overlay: {
    zIndex: "100",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  content: {
    top: "40%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "40%",
  },
};

class CustomModal extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      newPost: "",
      t:this.props.t,
      i18n:this.props.i18n
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePostSubmit = this.handlePostSubmit.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // モーダルを開いた後の追加機能
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  handleInputChange(event) {
    this.setState({ newPost: event.target.value });
  }

  handlePostSubmit(event) {
    event.preventDefault();
    if (this.state.newPost.trim() === "") return;
    this.setState(state => ({
      newPost: ""
    }));
    const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        fetch(`${apiUrl}/postter/post/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
				        'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({content:this.state.newPost.trim(),parent:this.props.postData.id}),
        })
        .then(response => {
            if(response.ok){
                
            }else{

            }
            return response.json();
        })
        .then(data => {
          this.closeModal()
          this.props.refreshPost()
        })
        .catch(error => {
          this.closeModal()
          this.props.refreshPost()
        });
    
  }

  render() {
    return (
      <>
        <button className="btn btn-link" style={{cursor:"pointer"}} onClick={this.openModal}>
        <img src={`${baseUrl}/media/icon/reply.svg`} width="16" height="16" alt="reply"/>{this.props.postData.reply_count}
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          onAfterOpen={this.afterOpenModal}
          style={customStyles}
        >
          <div>
          <table id='post_list' className="table-sm" style={{width: "100%"}}>
								<tr className="text">
								<td className="text" style={{width: "15%"}}>
									<img className="rounded img-fluid mx-auto d-block" src={this.props.postData.owner.avatar_imgurl} id="avatar-image" width="40" height="40"  alt="avatarimage"/>
								</td>
								<td className="text" style={{width: "80%"}}>
									<h6>
										<b>{this.props.postData.owner.username}</b>
										<span className="ms-1 text-secondary">@{this.props.postData.owner.uid}</span>
										<span className="ms-1 text-secondary">{this.props.postData.created_at.split('.')[0].replace('T',' ')}</span>
									</h6>
									<p>
                  {this.state.i18n.language === "ja" ? <PostContent content={this.props.postData.content_JA}/>:<PostContent content={this.props.postData.content_EN}/>}
                  <a className="ms-1" data-bs-toggle="collapse" href="#collapse" aria-expanded="false" aria-controls="collapse">
                    <img src={`${baseUrl}/media/icon/original_text.svg`} width="16" height="16" alt="original_text"/>
                  </a>
                  </p>
                  
                  <div className="collapse mt-2 " id="collapse">
                      <div className="card card-body">
                          <PostContent content={this.props.postData.content}/>
                      </div>
                  </div>
								</td>
								<td className='text' style={{width: "5%"}}>
								</td>
							</tr>
					</table>

            <form onSubmit={this.handlePostSubmit}>
              <textarea 
                className="form-control"
                value={this.state.newPost}
                onChange={this.handleInputChange}
                rows="4"
                cols="50"
              />
              <br />
              <div className="d-grid gap-2">
                <button　className="mb-2 mt-2 btn btn-outline-primary" type="submit">{this.state.t("reply")}</button>
              </div>
            </form>
            <div className="d-grid gap-2">
              <button className="mb-2 mt-2 btn btn-outline-danger" onClick={this.closeModal}>{this.state.t("close")}</button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default CustomModal;
import React, { useState } from 'react';
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
      newPost: ""
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

        })
        .catch(error => {

        });
    this.closeModal()
    this.props.refreshPost()
  }

  render() {
    return (
      <>
        <a class="mr-4" style={{cursor:"pointer"}} onClick={this.openModal}>
        <img src={`${baseUrl}/icon/reply.svg`} width="16" height="16"/>{this.props.postData.reply_count}
        </a>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          onAfterOpen={this.afterOpenModal}
          style={customStyles}
        >
          <div>
          <table id='post_list' class="table-sm" style={{width: "100%"}}>
								<tr class="text">
								<td class="text" style={{width: "15%"}}>
									<img class="rounded img-fluid mx-auto d-block" src={this.props.postData.owner.avatar_imgurl} id="avatar-image" width="40" height="40"/>
								</td>
								<td class="text" style={{width: "80%"}}>
									<h6>
										<b>{this.props.postData.owner.username}</b>
										<span class="ml-1 text-secondary">@{this.props.postData.owner.uid}</span>
										<span class="ml-1 text-secondary">{this.props.postData.created_at.split('.')[0].replace('T',' ')}</span>
									</h6>
									<p><PostContent content={this.props.postData.content}/></p>
								</td>
								<td class='text' style={{width: "5%"}}>
								</td>
							</tr>
					</table>

            <form onSubmit={this.handlePostSubmit}>
              <textarea 
                class="form-control"
                value={this.state.newPost}
                onChange={this.handleInputChange}
                rows="4"
                cols="50"
              />
              <br />
              <button　class="mb-2 mt-2 btn btn-outline-primary btn-block" type="submit">返信</button>
            </form>
            <button class="mb-2 mt-2 btn btn-outline-danger btn-block" onClick={this.closeModal}>閉じる</button>
          </div>
        </Modal>
      </>
    );
  }
}

export default CustomModal;
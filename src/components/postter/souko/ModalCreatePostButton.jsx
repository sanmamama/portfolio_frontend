import React, { useState } from 'react';
import Modal from "react-modal";

Modal.setAppElement("#root");
const apiUrl = process.env.REACT_APP_API_URL;


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
            body: JSON.stringify({content:this.state.newPost.trim()}),
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
    //this.props.refreshPost()
  }

  render() {
    return (
      <div>
        <button class="btn btn-outline-primary btn-block" onClick={this.openModal}>ポストする</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          onAfterOpen={this.afterOpenModal}
          style={customStyles}
        >
          <div>
            <h2>新しいポストを投稿</h2>
            <form onSubmit={this.handlePostSubmit}>
              <textarea 
                class="form-control"
                value={this.state.newPost}
                onChange={this.handleInputChange}
                placeholder="いまなにしてる？"
                rows="4"
                cols="50"
              />
              <br />
              <button　class="mb-2 mt-2 btn btn-outline-primary btn-block" type="submit">投稿</button>
            </form>
            <button class="mb-2 mt-2 btn btn-outline-danger btn-block" onClick={this.closeModal}>閉じる</button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default CustomModal;
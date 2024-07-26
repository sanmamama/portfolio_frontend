import React, { useState } from 'react';
import Modal from "react-modal";


Modal.setAppElement("#root");
const apiUrl = process.env.REACT_APP_API_URL;
const baseUrl = process.env.REACT_APP_BASE_URL;



const customStyles = {
  overlay: {
    zIndex: "100",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  content: {
    top: "50%",
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
      uid: this.props.uid,
      username:this.props.username,
      profile_statement: this.props.profile_statement,
      avatar:null
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleListSubmit = this.handleListSubmit.bind(this);

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
    const { name, value } = event.target;
    //console.log(name,value)
    this.setState((prevFormData) => ({
      ...prevFormData,
      [name]: value
  }));
  }

  handleFileChange = (e) => {

    this.setState((prevFormData) => ({
      ...prevFormData,
      avatar: e.target.files[0]
    }));
  };


  handleListSubmit(e) {
    e.preventDefault();
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);

		const formDataObj = new FormData();
        formDataObj.append('uid', this.state.uid);
        formDataObj.append('username', this.state.username);
        if(this.state.avatar){
          formDataObj.append('avatar_imgurl', this.state.avatar);
        }
        formDataObj.append('profile_statement', this.state.profile_statement);

    fetch(`${apiUrl}/postter/user/`, {
        method: 'PATCH',
        headers: {
    'Authorization': `Token ${token}`,
        },
        body: formDataObj,
    })
    .then(response => {
        if(response.ok){
            
        }else{

        }
        return response.json();
    })
    .then(data => {
      console.log()
      this.props.setUserData(data)
      //data.avatar_imgurl = baseUrl + data.avatar_imgurl
      this.props.setMyUserDataGlobal(data)
    })
    .catch(error => {

    });
this.closeModal()
    
  }

  render() {
    return (
      <div>
        <button class="btn btn-outline-success btn-sm" onClick={this.openModal}>プロフィール編集</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          onAfterOpen={this.afterOpenModal}
          style={customStyles}
        >
          <div>
            <h2>プロフィール編集</h2>
            <form onSubmit={this.handleListSubmit}>
              <label>ユーザーID</label>
						  <input class="form-control" type="text" name="uid" value={this.state.uid} onChange={this.handleInputChange}/>
              <label>ユーザー名</label>
              <input class="form-control" type="text" name="username" value={this.state.username} onChange={this.handleInputChange}/>
              <label>プロフィール画像</label>
              <div>
                <input type="file" id="avatar" name="avatar" onChange={this.handleFileChange} />
              </div>
              <label>プロフィール</label>
              <textarea class="form-control" name="profile_statement" value={this.state.profile_statement} onChange={this.handleInputChange} rows="3" cols="50"/>
              <button　class="mb-2 mt-2 btn btn-outline-primary btn-block" type="submit">更新する</button>
            </form>
            <button class="mb-2 mt-4 btn btn-outline-danger btn-block" onClick={this.closeModal}>閉じる</button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default CustomModal;
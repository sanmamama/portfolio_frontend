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
      name: "",
      description: "",
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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


  handleListSubmit(event) {
    event.preventDefault();
    if (this.state.name.trim() === "") return;
    this.setState(state => ({
      name: "",
      description: ""
    }));
    const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        fetch(`${apiUrl}/postter/memberlist/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
				'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({"name":this.state.name.trim(),"description":this.state.description.trim()}),
        })
        .then(response => {
            if(response.ok){
              if(this.props.refreshList){
                this.props.refreshList()
              }
            }else{

            }
            return response.json();
        })
        .then(data => {
          if(this.props.setUserList){
          this.props.setUserList([...this.props.userList, data])
          }
        })
        .catch(error => {

        });
    
        
    this.closeModal()
    
  }

  render() {
    return (
      <div>
        <button class="btn btn-outline-primary" onClick={this.openModal}>リストを作成</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          onAfterOpen={this.afterOpenModal}
          style={customStyles}
        >
          <div>
            <h2>新しいリストを作成</h2>
            <form onSubmit={this.handleListSubmit}>
              
              <label>リストの名前</label>
						  <input class="form-control" type="text" name="name" value={this.state.name} onChange={this.handleInputChange}/>
              <label>リストの説明</label>
              <textarea class="form-control" name="description" value={this.state.description} onChange={this.handleInputChange} rows="3" cols="50"/>
              <button　class="mb-2 mt-2 btn btn-outline-primary btn-block" type="submit">作成</button>
            </form>
            <button class="mb-2 mt-2 btn btn-outline-danger btn-block" onClick={this.closeModal}>閉じる</button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default CustomModal;
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
      name: this.props.name,
      id:this.props.id,
      description: this.props.description
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleListSubmit = this.handleListSubmit.bind(this);
    this.handleListDelete = this.handleListDelete.bind(this);
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

    const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        fetch(`${apiUrl}/postter/memberlist/${this.state.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
				'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({"name":this.state.name.trim(),"description":this.state.description.trim()}),
        })
        .then(response => {
            if(response.ok){
                
            }else{

            }
            return response.json();
        })
        .then(data => {
          this.props.setTargetListData(data)
        })
        .catch(error => {

        });
    this.closeModal()
    
  }

  handleListDelete(event) {
    
    event.preventDefault();
    const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        fetch(`${apiUrl}/postter/memberlist/${this.state.id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
				        'Authorization': `Token ${token}`,
            },
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
    this.props.navigateListView()
  }

  render() {
    return (
      <div>
        <button class="btn btn-outline-primary" onClick={this.openModal}>リストを編集</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          onAfterOpen={this.afterOpenModal}
          style={customStyles}
        >
          <div>
            <h2>既存のリストを編集</h2>
            <form onSubmit={this.handleListSubmit}>
              <label>リストの名前</label>
						  <input class="form-control" type="text" name="name" value={this.state.name} onChange={this.handleInputChange}/>
              <label>リストの説明</label>
              <textarea class="form-control" name="description" value={this.state.description} onChange={this.handleInputChange} rows="3" cols="50"/>
              <button　class="mb-2 mt-2 btn btn-outline-primary btn-block" type="submit">送信</button>
            </form>
            <button class="btn btn-danger btn-block" onClick={this.handleListDelete}>リストを削除する</button>
            <button class="mb-2 mt-4 btn btn-outline-danger btn-block" onClick={this.closeModal}>閉じる</button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default CustomModal;
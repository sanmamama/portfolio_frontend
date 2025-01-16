
import React from 'react';
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
      description: this.props.description,
      t:this.props.t,
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
          this.closeModal()
        })
        .catch(error => {
          this.closeModal()
        });
    
    
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
        <button className="btn btn-outline-primary" onClick={this.openModal}>{this.state.t("edit_list")}</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          onAfterOpen={this.afterOpenModal}
          style={customStyles}
        >
          <div>
            <h2>{this.state.t("edit_list")}</h2>
            <form onSubmit={this.handleListSubmit}>
              <label>{this.state.t("list_name")}</label>
						  <input className="form-control" type="text" name="name" value={this.state.name} onChange={this.handleInputChange}/>
              <label>{this.state.t("list_description")}</label>
              <textarea className="form-control" name="description" value={this.state.description} onChange={this.handleInputChange} rows="3" cols="50"/>
              <div className="d-grid gap-2">
                <button className="mb-2 mt-2 btn btn-outline-primary" type="submit">{this.state.t("change")}</button>
              </div>
            </form>
            <div className="d-grid gap-2">
              <button className="btn btn-danger" onClick={this.handleListDelete}>{this.state.t("delete_list")}</button>
              <button className="mb-2 mt-4 btn btn-outline-danger" onClick={this.closeModal}>{this.state.t("close")}</button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default CustomModal;
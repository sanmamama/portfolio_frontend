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
      avatar:null,
      t:this.props.t,
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
      this.closeModal()
    })
    .catch(error => {
      this.closeModal()
    });

    
  }

  render() {
    return (
      <div>
        <button className="btn btn-outline-success btn-sm" onClick={this.openModal}>{this.state.t("edit_profile")}</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          onAfterOpen={this.afterOpenModal}
          style={customStyles}
        >
          <div>
            <h2>{this.state.t("edit_profile")}</h2>
            <form onSubmit={this.handleListSubmit}>
              <label>{this.state.t("user_id")}</label>
						  <input className="form-control" type="text" name="uid" value={this.state.uid} onChange={this.handleInputChange}/>
              <label>{this.state.t("user_name")}</label>
              <input className="form-control" type="text" name="username" value={this.state.username} onChange={this.handleInputChange}/>
              <label>{this.state.t("profile_img")}</label>
              <div>
                <input type="file" id="avatar" name="avatar" onChange={this.handleFileChange} />
              </div>
              <label>{this.state.t("self_introduction")}</label>
              <textarea className="form-control" name="profile_statement" value={this.state.profile_statement} onChange={this.handleInputChange} rows="3" cols="50"/>
              <div class="d-grid gap-2">
                <button　className="mb-2 mt-2 btn btn-outline-primary" type="submit">{this.state.t("change")}</button>
              </div>
            </form>
            <div class="d-grid gap-2">
              <button className="mb-2 mt-4 btn btn-outline-danger" onClick={this.closeModal}>{this.state.t("close")}</button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default CustomModal;
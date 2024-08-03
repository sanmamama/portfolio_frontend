import React, { useState } from 'react';
import Modal from "react-modal";
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import ModalCreateListButton from './ModalCreateListButton';

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
    maxHeight: "80vh", // 追加: 最大高さを設定
    overflowY: "auto"  // 追加: 垂直スクロールを有効にする
  },
};

class CustomModal extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      name: "",
      description: "",
      pageCount: 1,
      userList: [],
      hasMore: true,
      id:this.props.id,
      class:this.props.class,
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleListSubmit = this.handleListSubmit.bind(this);
    this.loadList = this.loadList.bind(this);
    this.handleAddMember = this.handleAddMember.bind(this);
    this.refreshList = this.refreshList.bind(this);
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
                
            }else{

            }
            return response.json();
        })
        .then(data => {
          this.props.setUserList([...this.props.userList, data])
        })
        .catch(error => {

        });
    this.closeModal()
    
  }

  loadList = async() => {
    const token = document.cookie.split('; ').reduce((acc, row) => {
      const [key, value] = row.split('=');
      if (key === 'token') {
      acc = value;
      }
      return acc;
    }, null);
    
  
    const response = await fetch(`${apiUrl}/postter/memberlist/?page=${this.state.pageCount}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
        },
      }
    )
    const data = await response.json()
    
    if(response.ok){
      this.setState({ userList: [...this.state.userList, ...data.results] });
      this.setState({ hasMore: data.next });
      this.setState({ pageCount: this.state.pageCount+1 });
    }
  }


  handleAddMember = async (user_id,list_id) => {
		const token = document.cookie.split('; ').reduce((acc, row) => {
			const [key, value] = row.split('=');
			if (key === 'token') {
			acc = value;
			}
			return acc;
		}, null);
        const response = await fetch(`${apiUrl}/postter/addmember/`, {
            method: 'POST',
			headers: {
                'Content-Type': 'application/json',
				'Authorization': `Token ${token}`,
            },
			body: JSON.stringify({
				"user":user_id,
				"list":list_id,
			}),
        });
		const res = await response.json();
		if(response.ok){
      this.refreshList()
		}else{
		}  
  };
  

  refreshList = () =>{
    this.setState({ userList: [] });
    this.setState({ hasMore: true });
    this.setState({ pageCount: 1 });
  }

  render() {
    return (
      <div>
        <a className={this.state.class} style={{cursor:"pointer"}} onClick={this.openModal}>リストに追加/削除</a>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          onAfterOpen={this.afterOpenModal}
          style={customStyles}
        >
          <div>
            <h2>リストを選択</h2>
            <ModalCreateListButton refreshList={this.refreshList} />
            <InfiniteScroll
              loadMore={this.loadList}
              loader={<div key={0}>Loading ...</div>}
              hasMore={this.state.hasMore}
              threshold={5}
              useWindow={false}
            >
              <div>
              
                  {this.state.userList.map((ListData, ix) => (
                    <a className="no-link-style" style={{ cursor: "pointer" }} onClick={() => this.handleAddMember(this.state.id, ListData.id)}>
                    <div className="row">
                      <div className="col-8">
                        <p>
                          <span><b>{ListData.name}</b></span>
                          <span className="ml-3 text-secondary">{ListData.user_ids.length}人のメンバー</span>
                        </p>
                        <p><span className="ml-1 text-secondary">{ListData.description}</span></p>
                        <p className="mt-2 text-secondary">{}</p>
                      </div>
                      <div className="col-4">
                        
                        {ListData.user_ids.includes(this.state.id) ? "登録を外す" : "登録する"}
                        
                      </div>
                    </div>
                    </a>
                  ))}
              </div>
            </InfiniteScroll>


            <button className="mb-2 mt-2 btn btn-outline-danger btn-block" onClick={this.closeModal}>閉じる</button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default CustomModal;
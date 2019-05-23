import React from 'react'
import { Form, Input, Button, Tabs, Icon, Modal, notification } from 'antd';
import axios from 'axios'

import './style.scss'

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Search = Input.Search;

function callback(key) {
  //console.log(key);
}

@Form.create()
class Contact extends React.Component {
  state = {
    users_list: [],
    expand_id: 0,
    addNewContactDetail: {
      id: null,
      name: '',
      phone: '',
      email: '',
      address: {
        suite: '',
        street: '',
        city: ''
      }
    },
    deleteContact: null,
    filtered_list: [],
  }

  filterData(query)
  {
    const {users_list} = this.state;
    const filteredData = users_list.filter(element => {
      return element.name.toLowerCase().includes(query.toLowerCase());
    })

    this.setState({filtered_list:filteredData});
  }

  async componentDidMount() {
    try {

        const res = await axios.get('https://jsonplaceholder.typicode.com/users')
        if (res.status === 200)
        {
          this.setState({users_list: res.data});
          this.filterData('');
          //console.log(this.state.users_list);
        }
    } catch (e) {
        console.log(e)
    }
  }

  toggle = (id) => {
    const {expand_id} = this.state;
    if (expand_id === id)
      id = 0;
    this.setState({expand_id: id});
  };

  /**
	 * Add New Contact Hanlder
	 */
	addNewContact() {
    const { name, phone, email, address, address_suite, address_street, address_city } = this.state.addNewContactDetail;
    address.suite = address_suite;
    address.street = address_street;
    address.city = address_city;

		if (name !== '' && phone !== '' && email !== '' && address !== '') {
			let newContact = {
				...this.state.addNewContactDetail,
				id: new Date().getTime()
			}
			let users_list = this.state.users_list;
			users_list.push(newContact);
			this.setState({ loading: true });
			let self = this;
			setTimeout(() => {
        self.setState({ loading: false, users_list });
        this.filterData('');
        notification.open({
          type: 'success',
          message: 'Added Successfully!',
        })
			});
		}
  }

  onDeleteContact(contact) {
    this.setState({ deleteContact: contact });
    let users_list = this.state.users_list;
    let indexOfDeleteContact = users_list.indexOf(this.state.deleteContact);
    let self = this;
    confirm({
      title: 'Are you sure delete this contact?',
      content: 'This will delete your contact permanently.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        users_list.splice(indexOfDeleteContact, 1);
        setTimeout(() => {
          self.setState({ users_list });
          self.filterData('');
          notification.open({
            type: 'success',
            message: 'Contact Deleted!',
          })
        });
      },
      onCancel() {
      },
    });
	}
  
  onSearchName(value) {
    this.filterData(value);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { filtered_list, expand_id, addNewContactDetail } = this.state;
    return (
      <div>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Add Contact" key="1">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <FormItem label="Name" labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
                      {getFieldDecorator('name', {
                          initialValue: addNewContactDetail.name,
                          rules: [{ required: true, message: 'Please input your fullname' }],
                      })(<Input 
                          style={{ width: 300 }} 
                          onChange={(e) => this.setState({
                            addNewContactDetail: {
                              ...addNewContactDetail, 
                              name: e.target.value
                            }
                          })} />)}
                  </FormItem>
                  <FormItem label="Phone" labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
                      {getFieldDecorator('phone', {
                          initialValue: addNewContactDetail.phone,
                          rules: [{ required: true, message: 'Please input your phone number' }],
                      })(<Input 
                          style={{ width: 300 }} 
                          onChange={(e) => this.setState({
                            addNewContactDetail: {
                              ...addNewContactDetail, 
                              phone: e.target.value
                            }
                          })}/>)}
                  </FormItem>
                  <FormItem label="Email" labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
                      {getFieldDecorator('email', {
                          initialValue: addNewContactDetail.email,
                          rules: [{ required: true, message: 'Please input your e-mail address' }],
                      })(<Input 
                          style={{ width: 300 }} 
                          onChange={(e) => this.setState({
                            addNewContactDetail: {
                              ...addNewContactDetail, 
                              email: e.target.value
                            }
                          })}/>)}
                  </FormItem>                
                </div>
                <div className="col-md-6">
                  <FormItem label="Address Suite" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator('address_suite', {
                        initialValue: addNewContactDetail.address.suite,
                        rules: [{ required: true, message: 'Please input your address suite' }],
                    })(<Input 
                        style={{ width: 300 }} 
                        onChange={(e) => this.setState({
                          addNewContactDetail: {
                            ...addNewContactDetail, 
                            address_suite: e.target.value
                          }
                        })}/>)}
                  </FormItem>
                  <FormItem label="Address Street" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator('address_street', {
                        initialValue: addNewContactDetail.address.street,
                        rules: [{ message: 'Please input your address street' }],
                    })(<Input 
                        style={{ width: 300 }} 
                        onChange={(e) => this.setState({
                          addNewContactDetail: {
                            ...addNewContactDetail, 
                            address_street: e.target.value
                          }
                        })}/>)}
                  </FormItem>
                  <FormItem label="Address City" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator('address_city', {
                        initialValue: addNewContactDetail.address.city,
                        rules: [{ message: 'Please input your address city' }],
                    })(<Input 
                        style={{ width: 300 }} 
                        onChange={(e) => this.setState({
                          addNewContactDetail: {
                            ...addNewContactDetail, 
                            address_city: e.target.value
                          }
                        })}/>)}
                  </FormItem>                
                </div>
              </div>
              <div className="form-actions">
                <Button type="primary" onClick={() => this.addNewContact()}>Add</Button>
              </div>
            </div>
          </TabPane>
          <TabPane tab="View Contact" key="2">
            <div className="card-body">
              <div className="row row-eq-height">
                <div className="input-group">
                  <Search
                    style={{width:300, marginBottom:32}}
                    placeholder="Search ..."
                    onSearch={(value) => this.onSearchName(value)}
                    enterButton={
                      <span>
                        <Icon type="search" /> Search
                      </span>
                    }
                  />
                </div>
                {filtered_list.map((user, key) => (user.id.toString().length < 10 &&
                  <div className="col-sm-6 col-md-4 col-lg-5" key={key} style={{marginLeft:36, marginRight:36}}>
                    <div className="row card-base">
                      <div className="col-md-3">
                        <img alt="example" src="https://cdn2.iconfinder.com/data/icons/avatar-2/512/Fred_man-512.png" style={{width:100, height:100}} />
                      </div>
                      <div className="col">
                        <address>
                          <span>Name : {user.name}</span><br/>
                          <span>Phone : {user.phone}</span><br/>
                          <span>Address : {user.address.suite !== '' ? `${user.address.suite}, ` : ''}{user.address.street !== '' ? `${user.address.street}, ` : ''} {user.address.city}</span><br/>
                          {
                            expand_id === user.id &&
                            (<div>
                              <span>Email : {user.email}</span><br/>
                             <span>Website : {user.website}</span><br/>
                             </div>)
                          }
                        </address>
                        <div className="form-actions">
                          <Button type="primary pull-right" onClick={() => {this.toggle(user.id)}}>More</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="form-actions row row-eq-height">
                <div className="col-md-12">
                <h1>New Contacts</h1>
                </div>
                <div className="row col-md-12">
                  {filtered_list.map((user, key) => (user.id.toString().length >= 10 &&
                    <div className="col-sm-6 col-md-4 col-lg-5" key={key} style={{marginLeft:36, marginRight:36}}>
                      <div className="row card-base">
                        <div className="col-md-3">
                          <img alt="example" src="https://cdn2.iconfinder.com/data/icons/avatar-2/512/Fred_man-512.png" style={{width:100, height:100}} />
                        </div>
                        <div className="col">
                          {
                            user.id.toString().length > 10 && 
                            <span>
                              <a href="javascript: void(0);" onClick={this.props.onClose} className="mr-6 pull-right">
                                  <i className="icmn-cross" title="Close" width={16} onClick={() => this.onDeleteContact(user)} />
                              </a>
                            </span>
                          }
                          <address>
                            <span>Name : {user.name}</span><br/>
                            <span>Phone : {user.phone}</span><br/>
                            <span>Address : {user.address.suite !== '' ? `${user.address.suite}, ` : ''}{user.address.street !== '' ? `${user.address.street}, ` : ''} {user.address.city}</span><br/>
                            {
                              expand_id === user.id &&
                              (<div>
                                <span>Email : {user.email}</span><br/>
                              <span>Website : {user.website}</span><br/>
                              </div>)
                            }
                          </address>
                          <div className="form-actions">
                            <Button type="primary pull-right" onClick={() => {this.toggle(user.id)}}>More</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}                
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Contact

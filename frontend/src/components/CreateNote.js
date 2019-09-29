import React, { Component } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'

export default class CreateNote extends Component {

    state = {
        title: '',
        content: '',
        date: new Date(),
        userSelected: '',
        users: [],
        editing: false,
        _id: ''
    }

    async componentDidMount() {
        const res = await axios.get('http://localhost:4000/api/users');
        if (res.data.length > 0) {
            this.setState({
                users: res.data.map(user => user.username),
                userSelected: res.data[0].username
            })
        }
        if (this.props.match.params.id) {
            console.log(this.props.match.params.id)
            const res = await axios.get('http://localhost:4000/api/notes/' + this.props.match.params.id);
            console.log(res.data)
            this.setState({
                title: res.data.title,
                content: res.data.content,
                date: new Date(res.data.date),
                userSelected: res.data.author,
                _id: res.data._id,
                editing: true
            });
        }
    }

    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onChangeDate = date => {
        this.setState({ date });
    }

    onSubmit = async (e) => {
        e.preventDefault();
        if (this.state.editing) {
            const updatedNote = {
                title: this.state.title,
                content: this.state.content,
                author: this.state.userSelected,
                date: this.state.date
            };
            await axios.put('http://localhost:4000/api/notes/' + this.state._id, updatedNote);
        } else {
            const newNote = {
                title: this.state.title,
                content: this.state.content,
                author: this.state.userSelected,
                date: this.state.date
            };
            await axios.post('http://localhost:4000/api/notes', newNote);
        }
        window.location.href = '/';
    }

    render() {
        return (
            <div className="col-md-6 offset-md-3">
                <div className="card card-body">
                    {
                        this.state.editing ? <h4>Edit this Note</h4> : <h4>Create a Note</h4>
                    }
                    {/** SELECT USER */}
                    <div className="form-group">
                        <select
                            className="form-control"
                            value={this.state.userSelected}
                            onChange={this.onInputChange}
                            name="userSelected"
                            required>
                            {
                                this.state.users.map(user => (
                                    <option key={user} value={user}>
                                        {user}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    {/* Note Title */}
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Title"
                            onChange={this.onInputChange}
                            name="title"
                            value={this.state.title}
                            required />
                    </div>
                    {/* Note Content */}
                    <div className="form-group">
                        <textarea
                            type="text"
                            className="form-control"
                            placeholder="Content"
                            name="content"
                            onChange={this.onInputChange}
                            value={this.state.content}
                            required>
                        </textarea>
                    </div>
                    {/* Note Date */}
                    <div className="form-group">
                        <DatePicker className="form-control" dateFormat="dd/MM/yyyy" todayButton="Today" selected={this.state.date} onChange={this.onChangeDate} />
                    </div>

                    <form onSubmit={this.onSubmit}>

                        <button type="submit" className="btn btn-primary btn-block">
                            Save <i className="material-icons">
                                assignment
                            </i>
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}

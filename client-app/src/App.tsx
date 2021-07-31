import React, { Component } from 'react';
import { Header, List } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './App.css';
import axios from 'axios';

class App extends Component {
  //state: what is rendered on the page
  state = {
    values: []
  }

  componentDidMount() {
    //connect to the api, values controller using GET method
    //returns a response object
    //set data from response to state (like AJAX)
    axios.get('http://localhost:5000/api/values')
      .then((response) => {
        //set what is rendered on the page, may cause re-rendering
        this.setState({
          values: response.data
        })
      });
  }

  render() {
    return (
      <div>
        <Header as='h2' icon='users' content='Reactivities' />
        <List>
          {this.state.values.map((value: any) => (
            <List.Item key={value.id}>{value.name}</List.Item>
          ))}
        </List>
      </div>
    );
  }
}

export default App;

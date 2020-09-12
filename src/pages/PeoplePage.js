import React from "react"
import { Text, ScrollView } from "react-native"

import peopleJson from '../../people.json'
import PeopleList from '../components/PeopleList'

export default class PeoplePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      people:[]
    }
  }

  componentDidMount() {
    this.setState({
      people: peopleJson
    })
  }

  renderList() {
    const ret = this.state.people.map(person => {
      const { id, nome } = person
      return <Text key={id}>{id} - {nome}</Text>
    });
    return ret
  }

  render() {
    return (
      <ScrollView>
        <Text> Notes Timeline! </Text>
        <PeopleList people={this.state.people} />
      </ScrollView>
    )
  }
}
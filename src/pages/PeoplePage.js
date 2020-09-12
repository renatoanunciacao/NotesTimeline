import React from "react"
import { Text, ScrollView ,SafeAreaView, StyleSheet} from "react-native"

import peopleJson from '../../people.json'
import PeopleList from '../components/PeopleList'
import { FloatingAction } from 'react-native-floating-action';
import * as firebase from 'firebase';

export default class PeoplePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      people: []
    }
  }

  componentDidMount() {
    var db = firebase.database();
    db.ref('/usr/people').on('value', querySnapShot => {
      let data = []
      querySnapShot.forEach((child) => {
        data.push({
          id: child.val().id,
          nome: child.val().desc
        })
      })
      console.log(data)
      this.setState({
        people: data,
      })
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
    const actions = [
      {
        text: "Nova Pessoa",
        icon: require("../img/icons/add.png"),
        name: "btnNovaPessoa",
        position: 2
      }
    ]

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text> Notes Timeline! </Text>
          <PeopleList people={this.state.people} />
        </ScrollView>

        <FloatingAction
          actions={actions} onPressItem={() => {
            this.addPerson();
          }}
        />
      </SafeAreaView>
    )
  }

  addPerson() {
    var db = firebase.database();
    db.ref('/usr/people').push({ desc: "Alguem" })
      .then(() => { console.log('Inserido com sucesso') })
      .catch(() => { console.log('Erro ao inserir novo registro') })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
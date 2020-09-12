import React from 'react';
import { StyleSheet, ScrollView, TextInput, Button, View, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import FormRow from './../components/FormRow';
import firebase from 'firebase';

export default class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            isLoading: false,
            message: ""
        }
    }

    componentDidMount() {
        var firebaseConfig = {
            apiKey: "AIzaSyAqcDmB1CfgYAiUZtcWAI3NNtI7hYNg9F8",
            authDomain: "notetimeline-29586.firebaseapp.com",
            databaseURL: "https://notetimeline-29586.firebaseio.com",
            projectId: "notetimeline-29586",
            storageBucket: "notetimeline-29586.appspot.com",
            messagingSenderId: "970720865771",
            appId: "1:970720865771:web:09e6706c2d2e83e50cbdae",
            measurementId: "G-Z4WWM5JJH5"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
    }

    onChangeHandler(field, value) {
        this.setState({ [field]: value })
    }

    getMsgByErrorCode(errorCode) {
        switch (errorCode) {
            case "auth/wrong-password":
                return "Senha incorreta!";
            case "auth/invalid-email":
                return "E-mail inválido!";
            case "auth/user-not-found":
                return "Usuário não encontrado!";
            case "auth/user-disabled":
                return "Usuário desativado";
            case "auth/email-already-in-use":
                return "Usuário já está em uso!";
            case "auth/operation-not-allowed":
                return "Operação não permitida!";
            case "auth/weak-password":
                return "Senha muito fraca!";
            default:
                return "Erro desconhecido";
        }
    }
    access() {
        this.setState({ isLoading: false });
        this.props.navigation.replace('Pessoas')
    }

    login() {
        this.setState({ isLoading: true, message: '' });
        const { email, password } = this.state;

        return firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(user => {
                this.access()
            })
            .catch(error => {
                this.setState({
                    message: this.getMsgByErrorCode(error.code),
                    isLoading: false
                })
            })
    }

    getRegister() {
        const { email, password } = this.state;
        if(!email || !password){
            Alert.alert(
                "Cadastro!",
                "Para se cadastrar informe em-mail e senha"
            );
            return null;
        }
        Alert.alert(
            "Cadastro!",
            "Deseja cadastrar seu usuário com os dados informados",
            [{
                text: "Cancelar",
                style: "cancel" // IOS
            },{
                text: "Cadastrar",
                onPress: () => {this.register() }
            }],
        );
    }

    register(){
        const { email, password } = this.state;

        return firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(user => {
                this.access();
            })
            .catch(error => {
                this.setState({
                    message: this.getMsgByErrorCode(error.code),
                    isLoading: false
                })
            })
    }

    renderButton() {
        if (this.state.isLoading)
            return <ActivityIndicator size="large" style={styles.loading} />

        return (
            <View>
                <View style={styles.btn}>
                    <Button
                        title="ENTRAR"
                        color="#6542f4"
                        onPress={() => this.login()}
                    />
                </View>

                <View style={styles.btn}>
                    <Button
                        title="CADASTRE-SE"
                        color="#a08af7"
                        onPress={() => this.getRegister()}
                    />
                </View>
            </View>
        )
    }

    renderMessage() {
        const { message } = this.state;
        if(!message)
            return null;

            Alert.alert(
                "Erro!",
                message.toString(),
                [{
                    text: 'OK',
                    onPress: () => { this.setState({ message: '' }); }
                }]
            )
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView style={styles.container}>
                    <View style={styles.logoView}>
                        <Image
                            source={require('../img/logo.png')}
                            style={styles.logo}
                        />
                    </View>

                    <FormRow>
                        <TextInput style={styles.input}
                            placeholder="user@gmail.com"
                            value={this.state.email}
                            onChangeText={(value) => this.onChangeHandler('email', value)} />
                    </FormRow>
                    <FormRow style={styles.container}>
                        <TextInput style={styles.input}
                            placeholder="***********"
                            secureTextEntry
                            value={this.state.password}
                            onChangeText={(value) => this.onChangeHandler('password', value)}
                        />
                    </FormRow>
                { this.renderButton()}
                {this.renderMessage()}
                </ScrollView>
            </KeyboardAvoidingView>
        )
    };
}

const styles = StyleSheet.create({
    container: {
        paddingRight: 10,
        paddingLeft: 10,
    },
    input: {
        paddingLeft: 5,
        paddingRight: 5
    },
    btn: {
        paddingTop: 20,
        fontSize: 11
    },
    logo: {
        aspectRatio: 1,
        resizeMode: 'center',
        width: 300,
        height: 300
    },
    logoView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading: {
        padding: 20
    }
});
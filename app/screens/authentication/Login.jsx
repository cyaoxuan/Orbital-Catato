import { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/useAuth";

export default function LoginScreen() {
    const { loginAnonymously } = useAuth()
    console.log(loginAnonymously);
    // const { user, errMsg } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = () => {
        console.log("in handleLogin")
        // setErrMsg("");
        // if (email == "") {
        //     setErrMsg("Email cannot be empty")
        //     return;
        // } 
        // if (password == "") {
        //     setErrMsg("Password cannot be empty");
        //     return;
        // }

        console.log(loginWithEmail);
        loginWithEmail(email, password)
    };

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>Login</Text>
            <Text>Sign in to continue</Text>
            <Text></Text>

            <Text>Email</Text>
            <TextInput
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail} />

            <Text>Password</Text>
            <TextInput 
                secureTextEntry
                textContentType='password'
                value={password}
                onChangeText={setPassword} />

            <Button onPress={handleLogin}>Log In</Button>
            {/* {errMsg && <Text>{errMsg}</Text>} */}
            <Button>Forgot Password?</Button>
        </View>
    );
}

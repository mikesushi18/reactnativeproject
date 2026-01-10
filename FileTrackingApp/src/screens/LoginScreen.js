import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors, globalStyles } from '../styles/globalStyles';
import { users } from '../data/dummyData';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password!');
      return;
    }

    // Find user in dummy data
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      Alert.alert('Error', 'Invalid email or password!');
      return;
    }

    // Navigate based on role
    if (user.role === 'admin') {
      navigation.replace('AdminDashboard', { user });
    } else if (user.role === 'semi_admin') {
      navigation.replace('SemiAdminDashboard', { user });
    } else {
      navigation.replace('UserDashboard', { user });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>📁 File Tracking System</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={true}
        />

        <TextInput
          style={globalStyles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          editable={true}
        />

        <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
          <Text style={globalStyles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.hint}>
          <Text style={styles.hintTitle}>Test Accounts:</Text>
          <Text style={styles.hintText}>Admin: admin@test.com</Text>
          <Text style={styles.hintText}>Semi-Admin: semiadmin@test.com</Text>
          <Text style={styles.hintText}>User: juan@test.com</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  content: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  hint: {
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.background,
    borderRadius: 10,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
  },
  hintText: {
    fontSize: 12,
    color: colors.gray,
    marginVertical: 3,
  },
});

export default LoginScreen;
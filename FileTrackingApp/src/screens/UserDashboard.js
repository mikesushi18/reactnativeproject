import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { colors, globalStyles } from '../styles/globalStyles';
import { files as initialFiles, users } from '../data/dummyData';
import FileCard from '../components/FileCard';

const UserDashboard = ({ navigation, route }) => {
  const { user } = route.params;
  const [files, setFiles] = useState(initialFiles.filter(f => f.uploadedBy === user.id));
  const [modalVisible, setModalVisible] = useState(false);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const handleSendFile = () => {
    if (!fileName || !description || !recipient) {
      Alert.alert('Error', 'Please fill all fields!');
      return;
    }

    const recipientUser = users.find(u => u.name === recipient);
    
    const newFile = {
      id: Date.now().toString(),
      fileName: fileName,
      fileType: 'pdf',
      uploadedBy: user.id,
      uploadedByName: user.name,
      recipientId: recipientUser?.id || '1',
      recipientName: recipient,
      status: 'pending',
      description: description,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setFiles([newFile, ...files]);
    setModalVisible(false);
    setFileName('');
    setDescription('');
    setRecipient('');
    Alert.alert('Success', 'File sent successfully!');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📤 User Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome, {user.name}!</Text>
      </View>

      <TouchableOpacity style={styles.sendButton} onPress={() => setModalVisible(true)}>
        <Text style={globalStyles.buttonText}>+ Send New File</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>My Sent Files</Text>

      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FileCard file={item} onEdit={() => {}} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No files sent yet</Text>
        }
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={globalStyles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {/* Send File Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Send New File</Text>

            <Text style={styles.label}>File Name:</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter file name"
              value={fileName}
              onChangeText={setFileName}
            />

            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={3}
            />

            <Text style={styles.label}>Send To:</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter recipient name"
              value={recipient}
              onChangeText={setRecipient}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[globalStyles.button, { flex: 1, marginRight: 5 }]} 
                onPress={handleSendFile}
              >
                <Text style={globalStyles.buttonText}>Send</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[globalStyles.button, { flex: 1, marginLeft: 5, backgroundColor: colors.gray }]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={globalStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.warning,
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    marginTop: 5,
  },
  sendButton: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingBottom: 10,
    color: colors.black,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray,
    marginTop: 50,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default UserDashboard;
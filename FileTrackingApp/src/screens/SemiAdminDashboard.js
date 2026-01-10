import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { colors, globalStyles } from '../styles/globalStyles';
import { files as initialFiles } from '../data/dummyData';
import FileCard from '../components/FileCard';

const SemiAdminDashboard = ({ navigation, route }) => {
  const { user } = route.params;
  const [files, setFiles] = useState(initialFiles);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const handleEditFile = (file) => {
    setSelectedFile(file);
    setEditStatus(file.status);
    setModalVisible(true);
  };

  const handleSaveEdit = () => {
    const updatedFiles = files.map(f => 
      f.id === selectedFile.id ? { ...f, status: editStatus } : f
    );
    setFiles(updatedFiles);
    setModalVisible(false);
    Alert.alert('Success', 'File status updated!');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚙️ Semi-Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome, {user.name}!</Text>
      </View>

      <Text style={styles.sectionTitle}>All Files (Editable)</Text>

      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FileCard file={item} onEdit={() => handleEditFile(item)} />
        )}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={globalStyles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit File Status</Text>
            
            {selectedFile && (
              <Text style={styles.fileName}>📄 {selectedFile.fileName}</Text>
            )}

            <Text style={styles.label}>Status:</Text>
            
            <TouchableOpacity
              style={[styles.statusOption, editStatus === 'pending' && styles.statusSelected]}
              onPress={() => setEditStatus('pending')}
            >
              <Text style={styles.statusText}>Pending</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statusOption, editStatus === 'received' && styles.statusSelected]}
              onPress={() => setEditStatus('received')}
            >
              <Text style={styles.statusText}>Received</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statusOption, editStatus === 'completed' && styles.statusSelected]}
              onPress={() => setEditStatus('completed')}
            >
              <Text style={styles.statusText}>Completed</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[globalStyles.button, { flex: 1, marginRight: 5 }]} 
                onPress={handleSaveEdit}
              >
                <Text style={globalStyles.buttonText}>Save</Text>
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
    backgroundColor: colors.secondary,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
    color: colors.black,
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
  fileName: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: colors.gray,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusOption: {
    padding: 15,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    marginVertical: 5,
  },
  statusSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.black,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default SemiAdminDashboard;
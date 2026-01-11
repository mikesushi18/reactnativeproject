import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Alert, TextInput } from 'react-native';
import { colors, globalStyles } from '../styles/globalStyles';
import { files as initialFiles, users, folders as initialFolders } from '../data/dummyData';
import FileCard from '../components/FileCard';

const SemiAdminDashboard = ({ navigation, route }) => {
  const { user } = route.params;
  const [files, setFiles] = useState(() =>
    initialFiles.filter((f) => {
      const uploadedUser = users.find((u) => u.id === f.uploadedBy);
      const recipientUser = users.find((u) => u.id === f.recipientId);
      return (
        uploadedUser?.department === user.department ||
        recipientUser?.department === user.department
      );
    })
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [folders, setFolders] = useState(() =>
    initialFolders.filter((f) => f.department === user.department)
  );
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [folderModalMode, setFolderModalMode] = useState('add');
  const [folderModalName, setFolderModalName] = useState('');
  const [folderEditingId, setFolderEditingId] = useState(null);

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const handleEditFile = (file) => {
    setSelectedFile(file);
    setEditStatus(file.status);
    setModalVisible(true);
  };

  const handleAddFolder = () => {
    setFolderModalMode('add');
    setFolderModalName('');
    setFolderEditingId(null);
    setFolderModalVisible(true);
  };

  const handleOpenEditFolder = (folder) => {
    setFolderModalMode('edit');
    setFolderModalName(folder.name);
    setFolderEditingId(folder.id);
    setFolderModalVisible(true);
  };

  const handleSaveFolder = () => {
    const name = folderModalName?.trim();
    if (!name) {
      Alert.alert('Error', 'Folder name cannot be empty');
      return;
    }

    if (folderModalMode === 'add') {
      let id = `${user.department[0].toLowerCase()}_${name.toLowerCase().replace(/\s+/g, '_')}`;
      if (folders.some((f) => f.id === id)) id = `${id}_${Date.now()}`;
      const newFolder = { id, name, department: user.department };
      setFolders([newFolder, ...folders]);
    } else if (folderModalMode === 'edit') {
      setFolders(folders.map((f) => (f.id === folderEditingId ? { ...f, name } : f)));
    }

    setFolderModalVisible(false);
    setFolderModalName('');
    setFolderEditingId(null);
  };

  const handleDeleteFolder = (folderId) => {
    Alert.alert('Confirm', 'Delete folder and move files to no folder?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: () => {
          setFolders(folders.filter((f) => f.id !== folderId));
          setFiles(files.map((f) => (f.folderId === folderId ? { ...f, folderId: null } : f)));
          if (selectedFolderId === folderId) setSelectedFolderId(null);
        },
      },
    ]);
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

      <View style={styles.folderContainer}>
        <Text style={styles.folderHeader}>Folders</Text>
        <FlatList
          data={folders}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.folderChip,
                selectedFolderId === item.id && styles.folderSelected,
              ]}
              onPress={() => setSelectedFolderId(item.id === selectedFolderId ? null : item.id)}
              onLongPress={() =>
                Alert.alert(item.name, 'Folder options', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Edit', onPress: () => handleOpenEditFolder(item) },
                  { text: 'Delete', style: 'destructive', onPress: () => handleDeleteFolder(item.id) },
                ])
              }
            >
              <Text style={[styles.folderText, selectedFolderId === item.id && styles.folderTextSelected]}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={[globalStyles.button, { marginTop: 10 }]}
          onPress={() => handleAddFolder()}
        >
          <Text style={globalStyles.buttonText}>Add Folder</Text>
        </TouchableOpacity>
      </View>

      {/* Folder Modal */}
      <Modal transparent visible={folderModalVisible} animationType="fade" onRequestClose={() => setFolderModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{folderModalMode === 'add' ? 'Add Folder' : 'Edit Folder'}</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Folder name"
              value={folderModalName}
              onChangeText={setFolderModalName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[globalStyles.button, { flex: 1, marginRight: 5 }]} onPress={handleSaveFolder}>
                <Text style={globalStyles.buttonText}>{folderModalMode === 'add' ? 'Create' : 'Save'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[globalStyles.button, { flex: 1, marginLeft: 5, backgroundColor: colors.gray }]} onPress={() => setFolderModalVisible(false)}>
                <Text style={globalStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={selectedFolderId ? files.filter((f) => f.folderId === selectedFolderId) : files}
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
  folderContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  folderHeader: {
    fontWeight: '700',
    marginBottom: 8,
    color: colors.white,
    fontSize: 16,
  },
  folderChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderSelected: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  folderText: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '600',
  },
  folderTextSelected: {
    color: colors.white,
  },
});

export default SemiAdminDashboard;
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  SectionList,
  StyleSheet,
} from 'react-native';

const contactsData = [
  { id: '1', name: 'Sheraz Ahmed', phone: '03105377372', group: 'Family' },
  { id: '2', name: 'Usman', phone: '03313360030', group: 'Work' },
  { id: '3', name: 'Asnan', phone: '345-678-9012', group: 'Friends' },
  { id: '4', name: 'Zeeshan', phone: '456-789-0123', group: 'Family' },
  { id: '5', name: 'Hassaan', phone: '567-890-1234', group: 'Work' },
  { id: '6', name: 'Taskeen', phone: '678-901-2345', group: 'Friends' },
  { id: '7', name: 'Ashir', phone: '789-012-3456', group: 'Family' },
  { id: '8', name: 'Travis Scott', phone: '890-123-4567', group: 'Work' },
  { id: '9', name: 'Shahzaib', phone: '901-234-5678', group: 'Friends' },
  { id: '10', name: 'Raja Shani', phone: '012-345-6789', group: 'Family' },
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(contactsData);
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filterContacts = (text) => {
    setSearchTerm(text);
    const filtered = contactsData.filter(
      (contact) =>
        contact.name.toLowerCase().includes(text.toLowerCase()) ||
        contact.phone.includes(text)
    );
    setFilteredContacts(filtered);
  };

  const groupedContacts = [
    {
      title: 'Family',
      data: filteredContacts.filter((c) => c.group === 'Family'),
    },
    {
      title: 'Work',
      data: filteredContacts.filter((c) => c.group === 'Work'),
    },
    {
      title: 'Friends',
      data: filteredContacts.filter((c) => c.group === 'Friends'),
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedContact(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text>{item.phone}</Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.header}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by name or phone..."
        value={searchTerm}
        onChangeText={filterContacts}
        style={styles.input}
      />

      <SectionList
        sections={groupedContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            {selectedContact && (
              <>
                <Text style={styles.modalTitle}>Contact Details</Text>
                <Text>Name: {selectedContact.name}</Text>
                <Text>Phone: {selectedContact.phone}</Text>
                <Text>Group: {selectedContact.group}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  card: {
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginVertical: 4,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    fontSize: 18,
    backgroundColor: '#ddd',
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    elevation: 4,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
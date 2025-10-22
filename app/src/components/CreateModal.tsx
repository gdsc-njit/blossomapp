import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Tree } from '../utils/data';
import { LocationPickerModal } from './LocationModal';
import { useTheme } from '../contexts/ThemeContext';

interface CreateModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (tree: Omit<Tree, 'id'>) => void;
}

export function CreateModal({ visible, onClose, onSave }: CreateModalProps) {
  const { colors } = useTheme();
  const today = new Date();
  const formattedDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;

  const [newTree, setNewTree] = useState<Omit<Tree, 'id'>>({
    x: 10,
    y: 10,
    name: '',
    description: '',
    date: formattedDate,
    zone: '',
    diameter: 'small',
    length: 'small',
    image: '',
  });

  const [showLocationPicker, setShowLocationPicker] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera roll permissions are required to select images.');
      }
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert('Permission needed', 'Camera permissions are required to take photos.');
      }
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setNewTree(prev => ({ ...prev, x: location.coords.longitude, y: location.coords.latitude }));
      }
    })();
  }, []);

  const pickImage = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: chooseFromGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewTree({ ...newTree, image: result.assets[0].uri });
    }
  };

  const chooseFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewTree({ ...newTree, image: result.assets[0].uri });
    }
  };

  const sizeOptions = ['small', 'medium', 'large', 'extra large'];

  const cycleDiameter = () => {
    const currentIndex = sizeOptions.indexOf(newTree.diameter);
    const nextIndex = (currentIndex + 1) % sizeOptions.length;
    setNewTree({ ...newTree, diameter: sizeOptions[nextIndex] });
  };

  const cycleLength = () => {
    const currentIndex = sizeOptions.indexOf(newTree.length);
    const nextIndex = (currentIndex + 1) % sizeOptions.length;
    setNewTree({ ...newTree, length: sizeOptions[nextIndex] });
  };

  const handleSave = async () => {
    if (!newTree.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    try {
      await onSave(newTree);
      setNewTree({
        x: 0,
        y: 0,
        name: '',
        description: '',
        date: formattedDate,
        zone: '',
        diameter: 'small',
        length: 'small',
        image: '',
      });
      setShowLocationPicker(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to create tree');
    }
  };

  const handleCancel = () => {
    setNewTree({
      x: 0,
      y: 0,
      name: '',
      description: '',
      date: formattedDate,
      zone: '',
      diameter: 'small',
      length: 'small',
      image: '',
    });
    setShowLocationPicker(false);
    onClose();
  };

  const editField = (label: string, value: string, onChange: (text: string) => void) => (
    <View style={styles.editField}>
      <Text style={styles.label}>{label}:</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        returnKeyType="done"
      />
    </View>
  );

  const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', },
    container: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    title: { fontSize: 18, fontWeight: '600' },
    locationBtn: { padding: 8, backgroundColor: colors.primary, borderRadius: 5 },
    locationBtnText: { color: 'white', fontWeight: '600', fontSize: 12 },
    editField: { marginBottom: 5 },
    input: { borderWidth: 1, borderColor: colors.textSecondary, padding: 5, borderRadius: 5, marginTop: 5 },
    cycleBtn: { borderWidth: 1, borderColor: colors.primary, padding: 5, borderRadius: 5, marginTop: 5 },
    cycleText: { color: colors.primary },
    imageBtn: { backgroundColor: colors.secondary, padding: 10, borderRadius: 5, marginTop: 5 },
    imageBtnText: { color: 'white', fontWeight: '600' },
    imagePreview: { width: 100, height: 75, borderRadius: 5, marginTop: 10, alignSelf: 'center' },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
    saveBtn: { backgroundColor: colors.success, padding: 10, borderRadius: 5 },
    saveText: { color: 'white', fontWeight: '600' },
    cancelBtn: { backgroundColor: colors.error, padding: 10, borderRadius: 5 },
    cancelText: { color: 'white', fontWeight: '600' },
    label: { fontWeight: '600' },
  });

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>Create New Tree</Text>
                <TouchableOpacity onPress={() => setShowLocationPicker(true)} style={styles.locationBtn}>
                  <Text style={styles.locationBtnText}>Pick Location</Text>
                </TouchableOpacity>
              </View>

              {editField('Name', newTree.name, (text) => setNewTree({ ...newTree, name: text }))}
              {editField('Description', newTree.description, (text) => setNewTree({ ...newTree, description: text }))}
              {editField('Zone', newTree.zone, (text) => setNewTree({ ...newTree, zone: text }))}
              {editField('Date', newTree.date, (text) => setNewTree({ ...newTree, date: text }))}

              <View style={styles.editField}>
                <Text style={styles.label}>Diameter:</Text>
                <TouchableOpacity onPress={cycleDiameter} style={styles.cycleBtn}>
                  <Text style={styles.cycleText}>{newTree.diameter}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.editField}>
                <Text style={styles.label}>Length:</Text>
                <TouchableOpacity onPress={cycleLength} style={styles.cycleBtn}>
                  <Text style={styles.cycleText}>{newTree.length}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.editField}>
                <Text style={styles.label}>Image:</Text>
                <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
                  <Text style={styles.imageBtnText}>{newTree.image ? 'Change Image' : 'Select Image'}</Text>
                </TouchableOpacity>
                {newTree.image && (
                  <Image source={{ uri: newTree.image }} style={styles.imagePreview} />
                )}
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                  <Text style={styles.saveText}>Create</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      <LocationPickerModal
        visible={showLocationPicker}
        initialLat={newTree.y}
        initialLng={newTree.x}
        onSelect={(lat, lng) => setNewTree({ ...newTree, y: lat, x: lng })}
        onClose={() => setShowLocationPicker(false)}
      />
    </Modal>
  );
}
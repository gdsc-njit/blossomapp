import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { Tree, updateTree } from '../utils/data';
import { useTheme } from '../contexts/ThemeContext';

export function DetailModal({ tree, onClose, onUpdate }: { tree: Tree | null; onClose: () => void; onUpdate: (tree: Tree) => void }) {
  const { colors } = useTheme();
  const [imageLoading, setImageLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTree, setEditedTree] = useState<Tree | null>(null);

  useEffect(() => {
    if (tree) {
      setEditedTree(tree);
      setIsEditing(false);
      setImageLoading(true);
    }
  }, [tree]);

  useEffect(() => {
    if (tree && !tree.image) {
      setImageLoading(false);
    }
  }, [tree?.image]);

  if (!tree || !editedTree) return null;

  const sizeOptions = ['small', 'medium', 'large', 'extra large'];

  const cycleDiameter = () => {
    const currentIndex = sizeOptions.indexOf(editedTree.diameter);
    const nextIndex = (currentIndex + 1) % sizeOptions.length;
    setEditedTree({ ...editedTree, diameter: sizeOptions[nextIndex] });
  };

  const cycleLength = () => {
    const currentIndex = sizeOptions.indexOf(editedTree.length);
    const nextIndex = (currentIndex + 1) % sizeOptions.length;
    setEditedTree({ ...editedTree, length: sizeOptions[nextIndex] });
  };

  const handleSave = async () => {
    try {
      await updateTree(editedTree.id, editedTree);
      onUpdate(editedTree);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating tree:', error);
    }
  };

  const handleCancel = () => {
    setEditedTree(tree);
    setIsEditing(false);
  };

  const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', },
    container: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', },
    title: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
    imageWrap: { width: '100%', height: 200, marginBottom: 15, borderRadius: 10, overflow: 'hidden' },
    image: { width: '100%', height: '100%' },
    loader: { position: 'absolute', alignSelf: 'center', top: '45%' },
    text: { marginBottom: 4 },
    label: { fontWeight: '600' },
    closeBtn: { padding: 10, borderRadius: 5 },
    closeText: { color: colors.error, fontWeight: '600' },
    noImageText: { textAlign: 'center', fontSize: 16, color: colors.textSecondary },
    editField: { marginBottom: 5 },
    input: { borderWidth: 1, borderColor: colors.textSecondary, padding: 5, borderRadius: 5, marginTop: 5 },
    cycleBtn: { borderWidth: 1, borderColor: colors.primary, padding: 5, borderRadius: 5, marginTop: 5 },
    cycleText: { color: colors.primary },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 },
    saveBtn: { backgroundColor: colors.success, padding: 10, borderRadius: 5 },
    saveText: { color: 'white', fontWeight: '600' },
    cancelBtn: { backgroundColor: colors.error, padding: 10, borderRadius: 5 },
    cancelText: { color: 'white', fontWeight: '600' },
    editBtn: { padding: 10, borderRadius: 5 },
    editText: { color: colors.primary, fontWeight: '600' },
  });

  const field = (label: string, value?: string) => (
    <Text style={styles.text}><Text style={styles.label}>{label}:</Text> {value?.trim() || 'None'}</Text>
  );

  const editField = (label: string, value: string, onChange: (text: string) => void, multiline = false) => (
    <View style={styles.editField}>
      <Text style={styles.label}>{label}:</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        returnKeyType="done"
        blurOnSubmit={!multiline}
      />
    </View>
  );

  let content;
  if (isEditing) {
    content = (
      <>
        {editField('Name', editedTree.name, (text) => setEditedTree({ ...editedTree, name: text }))}
        {editField('Description', editedTree.description, (text) => setEditedTree({ ...editedTree, description: text }), true)}
        {editField('Zone', editedTree.zone, (text) => setEditedTree({ ...editedTree, zone: text }))}
        {editField('Date', editedTree.date, (text) => setEditedTree({ ...editedTree, date: text }))}
        <View style={styles.editField}>
          <Text style={styles.label}>Diameter:</Text>
          <TouchableOpacity onPress={cycleDiameter} style={styles.cycleBtn}>
            <Text style={styles.cycleText}>{editedTree.diameter || 'small'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.editField}>
          <Text style={styles.label}>Length:</Text>
          <TouchableOpacity onPress={cycleLength} style={styles.cycleBtn}>
            <Text style={styles.cycleText}>{editedTree.length || 'small'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  } else {
    content = (
      <>
        <View style={styles.imageWrap}>
          {imageLoading && (
            <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
          )}
          {editedTree.image ? (
            <Image
              source={{ uri: editedTree.image }}
              style={styles.image}
              resizeMode="cover"
              onLoadEnd={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          ) : (
            <Text style={styles.noImageText}>No image available</Text>
          )}
        </View>
        {field('Name', editedTree.name)}
        {field('Description', editedTree.description)}
        {field('Zone', editedTree.zone)}
        {field('Diameter', editedTree.diameter)}
        {field('Length', editedTree.length)}
        {field('Date', editedTree.date)}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editBtn}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <Modal animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={isEditing ? undefined : onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <Text style={styles.title}>Tree Details</Text>
              {content}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

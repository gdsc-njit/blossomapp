import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { Tree, addTree } from '../utils/data';
import { useTreeData } from '../contexts/TreeDataContext';
import { useTheme } from '../contexts/ThemeContext';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { DetailModal } from '../components/DetailModal';
import { CreateModal } from '../components/CreateModal';


export function TestScreen() {
  const { trees, loading, error, refreshTrees } = useTreeData();
  const { colors } = useTheme();
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleMarkerPress = (tree: Tree) => { setSelectedTree(tree); };

  const handleCreate = async (newTree: Omit<Tree, 'id'>) => {
    try {
      await addTree(newTree);
      refreshTrees();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating tree:', error);
    }
  };

  if(loading) {
    return (
      <View>
        <Text>loading...</Text>
      </View>
    );
  }
  if(error) {
    return (
      <View>
        <Text>error...</Text>
      </View>
    );
  }
  const validTrees = trees.filter(tree => typeof tree.y === 'number' && typeof tree.x === 'number' && !isNaN(tree.y) && !isNaN(tree.x));  if (validTrees.length === 0) {
    return (
      <View>
        <Text>No trees!</Text>
      </View>
    );
  }
  const region = {
    latitude: 40.7596,
    longitude: -74.1811,
    latitudeDelta: .025,
    longitudeDelta: .025,
  };

  const styles = StyleSheet.create({
    footer: {
      position: 'absolute',
      alignSelf: 'center',
      width: '90%',
      bottom: -5,
      borderRadius: 10,
      backgroundColor: colors.surface,
      opacity: 0.95,
      padding: 20,
      paddingBottom: 30,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    treeCount: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    footerBtn: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 5,
    },
    footerBtnText: {
      color: colors.text,
      fontWeight: '600',
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        showsUserLocation >
        {validTrees.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.y, longitude: marker.x }}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>
      <View style={styles.footer}>
        <Text style={styles.treeCount}>Trees: {validTrees.length}</Text>
        <TouchableOpacity style={styles.footerBtn} onPress={() => setShowCreateModal(true)}>
          <Text style={styles.footerBtnText}>Create New</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerBtn} onPress={refreshTrees}>
          <Text style={styles.footerBtnText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      <DetailModal 
        tree={selectedTree}
        onClose={() => setSelectedTree(null)}
        onUpdate={(updatedTree) => setSelectedTree(updatedTree)}
      />
      <CreateModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreate}
      />
    </View>
  );
}
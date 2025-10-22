import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTheme } from '../contexts/ThemeContext';
import * as Location from 'expo-location';

interface LocationPickerModalProps {
  visible: boolean;
  initialLat: number;
  initialLng: number;
  onSelect: (lat: number, lng: number) => void;
  onClose: () => void;
}

export function LocationPickerModal({ visible, initialLat, initialLng, onSelect, onClose }: LocationPickerModalProps) {
  const defLat = 40.7596;
  const defLon = -74.1811;

  const { colors } = useTheme();
  const [currentLocation, setCurrentLocation] = useState({ latitude: defLat, longitude: defLon });
  const [selectedLocation, setSelectedLocation] = useState({ latitude: initialLat || defLat, longitude: initialLng || defLon });
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (visible && !hasInitialized) {
      (async () => {
        let initialCoords = { latitude: initialLat || defLat, longitude: initialLng || defLon };
        
        if ((initialLat === 0 && initialLng === 0) || (!initialLat && !initialLng)) {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({});
            initialCoords = { latitude: location.coords.latitude, longitude: location.coords.longitude };
          }
        }
        
        setCurrentLocation(initialCoords);
        setSelectedLocation(initialCoords);
        setHasInitialized(true);
      })();
    }
  }, [visible, hasInitialized, initialLat, initialLng]);

  useEffect(() => {
    if (hasInitialized && initialLat && initialLng && (initialLat !== 0 || initialLng !== 0)) {
      const newCoords = { latitude: initialLat, longitude: initialLng };
      setSelectedLocation(newCoords);
      setCurrentLocation(newCoords);
    }
  }, [initialLat, initialLng, hasInitialized]);

  const handleRegionChangeComplete = (region: any) => {
    setSelectedLocation({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };

  const handleConfirm = () => {
    onSelect(selectedLocation.latitude, selectedLocation.longitude);
    onClose();
  };

  const styles = StyleSheet.create({
    locationModalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
    locationModalContainer: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%', height: '70%' },
    locationModalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, textAlign: 'center' },
    map: { flex: 1, borderRadius: 5, marginBottom: 10 },
    locationButtonRow: { flexDirection: 'row', justifyContent: 'space-around' },
    locationCancelBtn: { backgroundColor: colors.error, padding: 10, borderRadius: 5 },
    locationCancelText: { color: 'white', fontWeight: '600' },
    locationConfirmBtn: { backgroundColor: colors.success, padding: 10, borderRadius: 5 },
    locationConfirmText: { color: 'white', fontWeight: '600' },
  });

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.locationModalOverlay}>
        <View style={styles.locationModalContainer}>
          <Text style={styles.locationModalTitle}>Pick Location</Text>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onRegionChangeComplete={handleRegionChangeComplete}
            showsUserLocation
          >
            <Marker coordinate={selectedLocation} />
          </MapView>
          <View style={styles.locationButtonRow}>
            <TouchableOpacity onPress={onClose} style={styles.locationCancelBtn}>
              <Text style={styles.locationCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={styles.locationConfirmBtn}>
              <Text style={styles.locationConfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

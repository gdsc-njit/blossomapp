import { View, Text, Button } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
// grab all the react native tools we need

// define the named component which can access navigation
export function StatsScreen({ navigation }) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome to the other page of the app!</Text>
      <Button
        title="Test screen"
        onPress={() => navigation.navigate('Test')}
        color={colors.primary}
      />
    </View>
  );
}

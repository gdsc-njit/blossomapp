import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
// import modules we want

import { TreesScreen } from './src/screens/TreesScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { TestScreen } from './src/screens/TestScreen';
// importing the screens we want as named components

import { TreeDataProvider } from './src/contexts/TreeDataContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
// we are using the treedatacontext to only fetch all tree data from firebase once, then we hold onto it until we exit or refresh
// anywhere in the project we can get data with soemthing like:
// const { trees, loading, error, refreshTrees } = useTreeData();
// data is stored in trees, calling refreshTrees() gets us new data

// we are using the themecontext to centralize all our colors
// anywhere in the project we can get colors with:
// const { colors } = useTheme();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
// we define the tab navigators and regular stack navigators with the pages avaliable
// components described in either are naviagble with code like the line below:
// navigation.navigate('some_screen')

// tab navigator component
function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.surface,
        },
      }}
    >
      <Tab.Screen
        name="Trees"
        component={TreesScreen}
        options={{
          tabBarLabel: 'Trees',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Details"
        component={StatsScreen}
        options={{
          tabBarLabel: 'Details',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// navigation wrapper component that uses theme
function NavigationWrapper() {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            color: colors.text,
          },
          
        }}
      >
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Test"
          component={TestScreen}
          options={{
            title: 'Test Screen'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TreeDataProvider>
        <NavigationWrapper />
      </TreeDataProvider>
    </ThemeProvider>
  );
}

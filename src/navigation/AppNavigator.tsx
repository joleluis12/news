import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../context/ThemeContext";
import HomeScreen from "../screens/HomeScreen";
import NewsDetail from "../screens/NewsDetail";
import { Article } from "../api/newsApi";

export type RootStackParamList = {
  Home: undefined;
  NewsDetail: { article: Article };
};

const Stack = createStackNavigator<RootStackParamList>();

function Navigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.accent },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "News" }} />
      <Stack.Screen name="NewsDetail" component={NewsDetail} options={{ title: "Details" }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}

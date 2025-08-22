import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "../useThemeColors";

export default function TabsLayout() {
  const colors = useThemeColors();
  const isDark = colors.text === "#fff";

  // Track screen width to update pill width when rotated
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  // Pill width responsive (max 360px, or 90% of screen width)
  const pillWidth = Math.min(360, screenWidth * 0.9);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#5932EA",
        tabBarInactiveTintColor: isDark ? "rgba(255,255,255,0.7)" : "#464a53ff",
        tabBarStyle: {
          borderTopWidth: 0,
          paddingTop: 8,
          paddingHorizontal: 8,
          paddingBottom: Platform.OS === "ios" ? 14 : 10,
          width: pillWidth,
          height: Platform.OS === "ios" ? 80 : 68,
          elevation: 0,
          shadowOpacity: 0.12,
          overflow: "hidden",
          backgroundColor: "transparent",
          borderRadius: 9999, // pill shape
          alignSelf: "center", // ✅ centers inside SafeAreaView
        },
        tabBarBackground: () => (
          <BlurView
            intensity={isDark ? 80 : 50}
            tint={isDark ? "dark" : "light"}
            style={{
              flex: 1,
              backgroundColor: isDark
                ? "rgba(0,0,0,0.6)"
                : "rgba(255,255,255,1)",
              borderRadius: 9999,
              overflow: "hidden",
            }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
          textAlign: "center",
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        headerStyle: {
          backgroundColor: "transparent",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerBackground: () => (
          <BlurView
            intensity={isDark ? 60 : 40}
            tint={isDark ? "dark" : "light"}
            style={{
              flex: 1,
              backgroundColor: isDark
                ? "rgba(0,0,0,0.25)"
                : "rgba(255,255,255,0.15)",
            }}
          />
        ),
        headerTitleStyle: {
          color: isDark ? "#fff" : colors.text || "#1F2937",
          fontSize: 20,
          fontWeight: "700",
        },
        headerTitleAlign: "center",
        tabBarHideOnKeyboard: true,
        headerTransparent: true,
      }}
      tabBar={(props) => (
        <SafeAreaView
          edges={["bottom"]}
          style={{
            position: "absolute",
            bottom: Platform.OS === "ios" ? 10 : 14,
            left: 0,
            right: 0,
            alignItems: "center", // ✅ center horizontally
          }}
        >
          <View style={{ width: pillWidth }}>
            <BottomTabBar {...props} />
          </View>
        </SafeAreaView>
      )}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={focused ? 26 : 24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="announcements"
        options={{
          title: "News",
          headerTitle: "Announcements",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="campaign"
              color={color}
              size={focused ? 26 : 24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="polls"
        options={{
          title: "Polls",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              name={focused ? ("poll-h" as any) : ("poll-h" as any)}
              color={color}
              size={focused ? 26 : 24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          headerTitle: "Upcoming Events",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "calendar-star" : "calendar-blank-outline"}
              color={color}
              size={focused ? 26 : 24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          headerTitle: "Event Calendar",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "calendar-month" : "calendar-month-outline"}
              color={color}
              size={focused ? 26 : 24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: "Help",
          headerTitle: "Help & Support",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "help-circle" : "help-circle-outline"}
              color={color}
              size={focused ? 26 : 24}
            />
          ),
        }}
      />
    </Tabs>
  );
}

import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { useThemeColors } from "../useThemeColors";

const { width } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();
  const colors = useThemeColors();
  const isDark = colors.text === "#fff";
  const accent = "#5932EA";
  const muted = isDark ? "#d1d5db" : "#6b7280";
  const [username, setUsername] = useState<string | null>(null);
  const [loadingName, setLoadingName] = useState(true);

  useEffect(() => {
    let unsub = () => {};
    const fetchName = async (uid: string | undefined) => {
      if (!uid) {
        setUsername(null);
        setLoadingName(false);
        return;
      }
      try {
        const docRef = doc(db, "users", uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as any;
          // prefer the `username` field in users/{uid}
          setUsername(data.username ?? "User");
        } else {
          // no user doc -> show plain User
          setUsername("User");
        }
      } catch (e) {
        console.warn("Failed to fetch user doc:", e);
        setUsername("User");
      } finally {
        setLoadingName(false);
      }
    };

    // if auth already available
    const current = auth.currentUser;
    if (current) {
      fetchName(current.uid);
    } else {
      // wait for auth state
      const unsubAuth = onAuthStateChanged(auth, (u) => {
        if (u) fetchName(u.uid);
        else {
          setUsername(null);
          setLoadingName(false);
        }
      });
      unsub = unsubAuth;
    }

    return () => unsub();
  }, []);

  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Innovation Summit",
      date: "Mar 15",
      time: "9:00 AM",
      attendees: 120,
    },
    {
      id: 2,
      title: "Community Workshop",
      date: "Mar 18",
      time: "2:00 PM",
      attendees: 45,
    },
    {
      id: 3,
      title: "Networking Mixer",
      date: "Mar 20",
      time: "6:00 PM",
      attendees: 80,
    },
  ];

  const quickStats = [
    { icon: "calendar-outline", count: "12", label: "Events" },
    { icon: "megaphone-outline", count: "8", label: "Announcements" },
    { icon: "bar-chart-outline", count: "5", label: "Active Polls" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: colors.text,
              marginBottom: 16,
              textShadowColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.1)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: isDark ? 6 : 2,
            }}
          >
            {loadingName ? "Hello," : `Hello ${username ?? "User"},`}
          </Text>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Stay Connected{"\n"}with Your{"\n"}
            <Text style={[styles.highlightText, { color: accent }]}>
              Community
            </Text>
          </Text>
          <Text style={[styles.heroSubtitle, { color: muted }]}>
            Discover events, participate in polls, and stay updated with the
            latest announcements
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {quickStats.map((stat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (stat.label === "Events") router.push("/events");
                else if (stat.label === "Announcements")
                  router.push("/announcements");
                else router.push("/polls");
              }}
              style={[
                styles.statCard,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.9)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.08)",
                  shadowColor: isDark ? "#000" : "#000",
                  shadowOffset: {
                    width: 0,
                    height: isDark ? 0 : 2,
                  },
                  shadowOpacity: isDark ? 0 : 0.1,
                  shadowRadius: isDark ? 0 : 4,
                  elevation: isDark ? 0 : 3,
                },
              ]}
            >
              <Ionicons name={stat.icon as any} size={24} color={accent} />
              <Text style={[styles.statCount, { color: colors.text }]}>
                {stat.count}
              </Text>
              <Text style={[styles.statLabel, { color: muted }]}>
                {stat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              onPress={() => router.push("/events")}
              style={[
                styles.actionCard,
                {
                  borderColor: isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.08)",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.9)",
                  shadowColor: isDark ? "#000" : "#000",
                  shadowOffset: {
                    width: 0,
                    height: isDark ? 0 : 2,
                  },
                  shadowOpacity: isDark ? 0 : 0.1,
                  shadowRadius: isDark ? 0 : 4,
                  elevation: isDark ? 0 : 3,
                },
              ]}
            >
              <View
                style={[
                  styles.actionIcon,
                  {
                    backgroundColor: isDark
                      ? "rgba(89,50,234,0.18)"
                      : "rgba(89,50,234,0.08)",
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="calendar-plus"
                  size={28}
                  color={accent}
                />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>
                View Events
              </Text>
              <Text style={[styles.actionSubtitle, { color: muted }]}>
                See upcoming community events
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/announcements")}
              style={[
                styles.actionCard,
                {
                  borderColor: isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.08)",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.9)",
                  shadowColor: isDark ? "#000" : "#000",
                  shadowOffset: {
                    width: 0,
                    height: isDark ? 0 : 2,
                  },
                  shadowOpacity: isDark ? 0 : 0.1,
                  shadowRadius: isDark ? 0 : 4,
                  elevation: isDark ? 0 : 3,
                },
              ]}
            >
              <View
                style={[
                  styles.actionIcon,
                  {
                    backgroundColor: isDark
                      ? "rgba(89,50,234,0.18)"
                      : "rgba(89,50,234,0.08)",
                  },
                ]}
              >
                <MaterialIcons name="campaign" size={28} color={accent} />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>
                View Announcements
              </Text>
              <Text style={[styles.actionSubtitle, { color: muted }]}>
                Read latest community updates
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/polls")}
              style={[
                styles.actionCard,
                {
                  borderColor: isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.08)",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.9)",
                  shadowColor: isDark ? "#000" : "#000",
                  shadowOffset: {
                    width: 0,
                    height: isDark ? 0 : 2,
                  },
                  shadowOpacity: isDark ? 0 : 0.1,
                  shadowRadius: isDark ? 0 : 4,
                  elevation: isDark ? 0 : 3,
                },
              ]}
            >
              <View
                style={[
                  styles.actionIcon,
                  {
                    backgroundColor: isDark
                      ? "rgba(89,50,234,0.18)"
                      : "rgba(89,50,234,0.08)",
                  },
                ]}
              >
                <MaterialIcons name="poll" size={28} color={accent} />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>
                Reply to Poll
              </Text>
              <Text style={[styles.actionSubtitle, { color: muted }]}>
                Respond to ongoing polls
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/help")}
              style={[
                styles.actionCard,
                {
                  borderColor: isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.08)",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.9)",
                  shadowColor: isDark ? "#000" : "#000",
                  shadowOffset: {
                    width: 0,
                    height: isDark ? 0 : 2,
                  },
                  shadowOpacity: isDark ? 0 : 0.1,
                  shadowRadius: isDark ? 0 : 4,
                  elevation: isDark ? 0 : 3,
                },
              ]}
            >
              <View
                style={[
                  styles.actionIcon,
                  {
                    backgroundColor: isDark
                      ? "rgba(89,50,234,0.18)"
                      : "rgba(89,50,234,0.08)",
                  },
                ]}
              >
                <Ionicons name="help-circle" size={28} color={accent} />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>
                Help Center
              </Text>
              <Text style={[styles.actionSubtitle, { color: muted }]}>
                Find answers and support
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Upcoming Events
            </Text>
            <TouchableOpacity onPress={() => router.push("/events")}>
              <Text style={[styles.seeAllText, { color: accent }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {upcomingEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[
                styles.eventCard,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.9)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.08)",
                  shadowColor: isDark ? "#000" : "#000",
                  shadowOffset: {
                    width: 0,
                    height: isDark ? 0 : 2,
                  },
                  shadowOpacity: isDark ? 0 : 0.1,
                  shadowRadius: isDark ? 0 : 4,
                  elevation: isDark ? 0 : 3,
                },
              ]}
            >
              <View style={styles.eventDate}>
                <Text style={styles.eventDateText}>{event.date}</Text>
              </View>
              <View style={styles.eventContent}>
                <Text style={[styles.eventTitle, { color: colors.text }]}>
                  {event.title}
                </Text>
                <View style={styles.eventDetails}>
                  <View style={styles.eventDetail}>
                    <Ionicons name="time-outline" size={16} color={muted} />
                    <Text style={[styles.eventDetailText, { color: muted }]}>
                      {event.time}
                    </Text>
                  </View>
                  <View style={styles.eventDetail}>
                    <Ionicons name="people-outline" size={16} color={muted} />
                    <Text style={[styles.eventDetailText, { color: muted }]}>
                      {event.attendees} attending
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.eventArrow}>
                <Ionicons name="chevron-forward" size={20} color={accent} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Activity
          </Text>
          <View
            style={[
              styles.activityContainer,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.9)",
                borderColor: isDark
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(0,0,0,0.08)",
                shadowColor: isDark ? "#000" : "#000",
                shadowOffset: {
                  width: 0,
                  height: isDark ? 0 : 2,
                },
                shadowOpacity: isDark ? 0 : 0.1,
                shadowRadius: isDark ? 0 : 4,
                elevation: isDark ? 0 : 3,
              },
            ]}
          >
            <View
              style={[
                styles.activityItem,
                {
                  borderBottomColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
            >
              <View
                style={[
                  styles.activityIcon,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,107,53,0.15)"
                      : "rgba(255,107,53,0.1)",
                  },
                ]}
              >
                <MaterialIcons name="announcement" size={20} color="#FF6B35" />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: colors.text }]}>
                  New Announcement Posted
                </Text>
                <Text style={[styles.activityTime, { color: muted }]}>
                  2 hours ago
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.activityItem,
                {
                  borderBottomColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
            >
              <View
                style={[
                  styles.activityIcon,
                  {
                    backgroundColor: isDark
                      ? "rgba(78,205,196,0.15)"
                      : "rgba(78,205,196,0.1)",
                  },
                ]}
              >
                <MaterialIcons name="poll" size={20} color="#4ECDC4" />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: colors.text }]}>
                  Poll Results Available
                </Text>
                <Text style={[styles.activityTime, { color: muted }]}>
                  5 hours ago
                </Text>
              </View>
            </View>

            <View style={[styles.activityItem, { borderBottomWidth: 0 }]}>
              <View
                style={[
                  styles.activityIcon,
                  {
                    backgroundColor: isDark
                      ? "rgba(69,183,209,0.15)"
                      : "rgba(69,183,209,0.1)",
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={20}
                  color="#45B7D1"
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: colors.text }]}>
                  Event Registration Opened
                </Text>
                <Text style={[styles.activityTime, { color: muted }]}>
                  1 day ago
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 30,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "900",
    lineHeight: 42,
    marginBottom: 12,
  },
  highlightText: {
    color: "#5932EA",
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
  },
  statCount: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    borderRadius: 16,
    padding: 20,
    width: (width - 60) / 2,
    marginBottom: 16,
    borderWidth: 1,
  },
  actionIcon: {
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  eventCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  eventDate: {
    backgroundColor: "#5932EA",
    borderRadius: 12,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  eventDateText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  eventDetails: {
    flexDirection: "row",
    gap: 16,
  },
  eventDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  eventDetailText: {
    fontSize: 12,
  },
  eventArrow: {
    marginLeft: 16,
  },
  activityContainer: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
});

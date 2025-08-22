import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../useThemeColors";

const { width } = Dimensions.get("window");

export default function Events() {
  const colors = useThemeColors();
  const isDark = colors.text === "#fff";
  const accent = "#5932EA";
  const accentLight = "#7C3AED";
  const muted = isDark ? "#9CA3AF" : "#6B7280";
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const upcomingEvents = [
    {
      id: 1,
      title: "Robotics Workshop: Sensors & Control",
      date: "08",
      month: "SEP",
      fullDate: "Sep 8, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Engineering Lab B",
      attendees: [
        { id: 1, name: "Aisha", avatar: "A" },
        { id: 2, name: "Ravi", avatar: "R" },
        { id: 3, name: "Sam", avatar: "S" },
      ],
      totalAttendees: 34,
      category: "Workshop",
      description:
        "Hands-on session covering microcontroller sensors, PID basics, and control loops.",
    },
    {
      id: 2,
      title: "Engineering Career Fair",
      date: "14",
      month: "SEP",
      fullDate: "Sep 14, 2025",
      time: "10:00 AM - 3:00 PM",
      location: "Student Union Hall",
      attendees: [
        { id: 1, name: "Maya", avatar: "M" },
        { id: 2, name: "Ethan", avatar: "E" },
      ],
      totalAttendees: 220,
      category: "Career",
      description:
        "Meet recruiters from hardware, software, and consulting firms — bring resumes and portfolios.",
    },
    {
      id: 3,
      title: "Hack the Circuit — 24h Hackathon",
      date: "26",
      month: "SEP",
      fullDate: "Sep 26, 2025",
      time: "6:00 PM - Sep 27, 6:00 PM",
      location: "Innovation Studio",
      attendees: [
        { id: 1, name: "Lina", avatar: "L" },
        { id: 2, name: "Omar", avatar: "O" },
        { id: 3, name: "Noah", avatar: "N" },
      ],
      totalAttendees: 150,
      category: "Hackathon",
      description:
        "24-hour team challenge for embedded, firmware, and full-stack projects — prizes for best prototype.",
    },
    {
      id: 4,
      title: "Senior Design Expo",
      date: "03",
      month: "OCT",
      fullDate: "Oct 3, 2025",
      time: "11:00 AM - 4:00 PM",
      location: "Main Hall",
      attendees: [
        { id: 1, name: "Priya", avatar: "P" },
        { id: 2, name: "Carlos", avatar: "C" },
      ],
      totalAttendees: 420,
      category: "Showcase",
      description:
        "Project demos from final-year teams across mechanical, electrical, and computer engineering.",
    },
    {
      id: 5,
      title: "Lab Safety & Protocol Training",
      date: "11",
      month: "OCT",
      fullDate: "Oct 11, 2025",
      time: "9:00 AM - 11:00 AM",
      location: "Lab A",
      attendees: [{ id: 1, name: "Zoe", avatar: "Z" }],
      totalAttendees: 60,
      category: "Safety",
      description:
        "Mandatory safety walkthrough covering PPE, chemical handling, and lab access procedures.",
    },
  ];

  const filters = [
    { id: "all", label: "All Events", icon: "calendar-outline" },
    { id: "workshops", label: "Workshops", icon: "construct-outline" },
    { id: "career", label: "Career", icon: "briefcase-outline" },
    { id: "hackathons", label: "Hackathons", icon: "code-slash-outline" },
  ];

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Workshop":
        return "#F97316"; // orange
      case "Career":
        return "#10B981"; // green
      case "Hackathon":
        return "#6366F1"; // indigo
      case "Showcase":
        return "#0EA5E9"; // sky
      case "Safety":
        return "#EF4444"; // red
      default:
        return accent;
    }
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case "Workshop":
        return "build";
      case "Career":
        return "work";
      case "Hackathon":
        return "code";
      case "Showcase":
        return "desktop-mac";
      case "Safety":
        return "warning";
      default:
        return "calendar";
    }
  };

  const renderEventCard = (event: any) => (
    <TouchableOpacity
      key={event.id}
      style={[
        styles.eventCard,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.9)",
          borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
        },
      ]}
    >
      {/* Date Badge */}
      <View style={[styles.dateBadge, { backgroundColor: accent }]}>
        <Text style={styles.dateMonth}>{event.month}</Text>
        <Text style={styles.dateNumber}>{event.date}</Text>
      </View>

      {/* Event Content */}
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <View style={styles.categoryBadge}>
            <MaterialIcons
              name={getCategoryIcon(event.category) as any}
              size={12}
              color={getCategoryColor(event.category)}
            />
            <Text
              style={[
                styles.categoryText,
                { color: getCategoryColor(event.category) },
              ]}
            >
              {event.category}
            </Text>
          </View>
          <TouchableOpacity style={styles.bookmarkButton}>
            <Ionicons name="bookmark-outline" size={16} color={muted} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.eventTitle, { color: colors.text }]}>
          {event.title}
        </Text>

        <Text style={[styles.eventDescription, { color: muted }]}>
          {event.description}
        </Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetail}>
            <Ionicons name="time-outline" size={14} color={muted} />
            <Text style={[styles.eventDetailText, { color: muted }]}>
              {event.time}
            </Text>
          </View>
          <View style={styles.eventDetail}>
            <Ionicons name="location-outline" size={14} color={muted} />
            <Text style={[styles.eventDetailText, { color: muted }]}>
              {event.location}
            </Text>
          </View>
        </View>

        {/* Attendees */}
        <View style={styles.attendeesSection}>
          <View style={styles.attendeeAvatars}>
            {event.attendees.slice(0, 3).map((attendee: any, index: number) => (
              <View
                key={attendee.id}
                style={[
                  styles.attendeeAvatar,
                  {
                    backgroundColor: accentLight,
                    marginLeft: index > 0 ? -8 : 0,
                    zIndex: 3 - index,
                    borderColor: colors.background,
                  },
                ]}
              >
                <Text style={styles.attendeeInitial}>{attendee.avatar}</Text>
              </View>
            ))}
            {event.totalAttendees > 3 && (
              <View
                style={[
                  styles.attendeeCount,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)",
                    marginLeft: -8,
                    borderColor: colors.background,
                  },
                ]}
              >
                <Text style={[styles.attendeeCountText, { color: muted }]}>
                  +{event.totalAttendees - 3}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.attendeeText, { color: muted }]}>
            {event.totalAttendees} attending
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Upcoming Events
            </Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchInput,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
                borderColor: isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.1)",
              },
            ]}
          >
            <Ionicons name="search" size={18} color={muted} />
            <TextInput
              style={[styles.searchText, { color: colors.text }]}
              placeholder="Search events..."
              placeholderTextColor={muted}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                {
                  backgroundColor:
                    activeFilter === filter.id
                      ? accent
                      : isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                  borderColor:
                    activeFilter === filter.id
                      ? accent
                      : isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)",
                },
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Ionicons
                name={filter.icon as any}
                size={16}
                color={activeFilter === filter.id ? "#fff" : muted}
              />
              <Text
                style={[
                  styles.filterText,
                  {
                    color: activeFilter === filter.id ? "#fff" : muted,
                  },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {upcomingEvents.map((event) => renderEventCard(event))}

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderWidth: 1,
    gap: 12,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
  },
  filtersContainer: {
    marginBottom: 10,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    gap: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  eventCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  dateBadge: {
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
    height: 60,
  },
  dateMonth: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dateNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 2,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  bookmarkButton: {
    padding: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    lineHeight: 24,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
  },
  eventDetails: {
    gap: 8,
    marginBottom: 16,
  },
  eventDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eventDetailText: {
    fontSize: 13,
    fontWeight: "500",
  },
  attendeesSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  attendeeAvatars: {
    flexDirection: "row",
    alignItems: "center",
  },
  attendeeAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  attendeeInitial: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  attendeeCount: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  attendeeCountText: {
    fontSize: 10,
    fontWeight: "600",
  },
  attendeeText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

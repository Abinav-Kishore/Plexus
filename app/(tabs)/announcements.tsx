import { Ionicons } from "@expo/vector-icons";
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

export default function Announcements() {
  const colors = useThemeColors();
  const isDark = colors.text === "#fff";
  const accent = "#5932EA";
  const accentLight = "#7C3AED";
  const muted = isDark ? "#9CA3AF" : "#6B7280";
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const announcements = [
    {
      id: 1,
      title: "Midterm Exam Schedule Released",
      content:
        "The exam cell has published the midterm timetable for all departments. Check your course page for the exact date/time and venue.",
      author: "Exam Cell",
      timestamp: "3 hours ago",
      priority: "high",
      category: "Exams",
      reactions: { likes: 58, comments: 27 },
      isRead: false,
      tags: ["Exams", "Schedule"],
    },
    {
      id: 2,
      title: "Guest Lecture: Embedded AI",
      content:
        "ECE department hosts Dr. K. Ramesh this Friday to talk about deploying AI on microcontrollers. Seats limited — register via the Events tab.",
      author: "ECE Dept",
      timestamp: "6 hours ago",
      priority: "medium",
      category: "Events",
      reactions: { likes: 34, comments: 9 },
      isRead: true,
      tags: ["Lecture", "AI"],
    },
    {
      id: 3,
      title: "Internship & Placement Fair — Registration Open",
      content:
        "Training & Placement is now accepting registrations for the internship fair. Upload your resume and register before Sep 3.",
      author: "T&P Office",
      timestamp: "1 day ago",
      priority: "high",
      category: "Opportunities",
      reactions: { likes: 112, comments: 41 },
      isRead: false,
      tags: ["Internships", "Careers"],
    },
    {
      id: 4,
      title: "Robotics Lab Maintenance — Weekend Closure",
      content:
        "Robotics Lab will be closed for scheduled maintenance this weekend. Please reschedule your lab bookings accordingly.",
      author: "Lab Coordinator",
      timestamp: "2 days ago",
      priority: "low",
      category: "Maintenance",
      reactions: { likes: 18, comments: 3 },
      isRead: true,
      tags: ["Labs", "Maintenance"],
    },
    {
      id: 5,
      title: "Project Showcase Submissions Open",
      content:
        "CSE department invites final-year project submissions for the annual Project Showcase. Deadline: Oct 10. Best projects get prizes and industry visibility.",
      author: "CSE Dept",
      timestamp: "3 days ago",
      priority: "medium",
      category: "Projects",
      reactions: { likes: 73, comments: 21 },
      isRead: false,
      tags: ["Projects", "Showcase"],
    },
  ];

  const filters = [
    { id: "all", label: "All", icon: "grid-outline" },
    { id: "unread", label: "Unread", icon: "mail-unread-outline" },
    { id: "important", label: "Important", icon: "alert-circle-outline" },
    { id: "recent", label: "Recent", icon: "time-outline" },
  ];

  const getPriorityColor = (priority: any) => {
    switch (priority) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#10B981";
      default:
        return muted;
    }
  };

  const getPriorityIcon = (priority: any) => {
    switch (priority) {
      case "high":
        return "alert-circle";
      case "medium":
        return "information-circle";
      case "low":
        return "checkmark-circle";
      default:
        return "information-circle";
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !announcement.isRead;
    if (activeFilter === "important") return announcement.priority === "high";
    if (activeFilter === "recent") {
      const timeStamp = announcement.timestamp;
      return timeStamp.includes("hour") || timeStamp.includes("1 day");
    }
    return true;
  });

  const renderAnnouncementCard = (announcement: any) => (
    <TouchableOpacity
      key={announcement.id}
      style={[
        styles.announcementCard,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.9)",
          borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
          borderLeftColor: getPriorityColor(announcement.priority),
        },
        !announcement.isRead &&
          (isDark
            ? {
                borderLeftWidth: 4,
                backgroundColor: "rgba(89,50,234,0.08)",
              }
            : { borderLeftWidth: 4 }),
      ]}
    >
      <View style={styles.announcementHeader}>
        <View style={styles.announcementMeta}>
          <View style={styles.authorInfo}>
            <View
              style={[styles.authorAvatar, { backgroundColor: accentLight }]}
            >
              <Text style={styles.authorInitial}>
                {announcement.author.charAt(0)}
              </Text>
            </View>
            <View>
              <Text style={[styles.authorName, { color: colors.text }]}>
                {announcement.author}
              </Text>
              <Text style={[styles.timestamp, { color: muted }]}>
                {announcement.timestamp}
              </Text>
            </View>
          </View>
          <View style={styles.priorityBadge}>
            <Ionicons
              name={getPriorityIcon(announcement.priority) as any}
              size={14}
              color={getPriorityColor(announcement.priority)}
            />
          </View>
        </View>

        {!announcement.isRead && (
          <View style={[styles.unreadDot, { backgroundColor: accent }]} />
        )}
      </View>

      <Text style={[styles.announcementTitle, { color: colors.text }]}>
        {announcement.title}
      </Text>

      <Text style={[styles.announcementContent, { color: muted }]}>
        {announcement.content}
      </Text>

      <View style={styles.tagsContainer}>
        {announcement.tags.map((tag: any, index: number) => (
          <View
            key={index}
            style={[
              styles.tag,
              {
                backgroundColor: isDark
                  ? "rgba(89,50,234,0.15)"
                  : "rgba(89,50,234,0.08)",
              },
            ]}
          >
            <Text style={[styles.tagText, { color: accent }]}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.announcementFooter}>
        <View style={styles.reactions}>
          <TouchableOpacity style={styles.reactionButton}>
            <Ionicons name="heart-outline" size={18} color={muted} />
            <Text style={[styles.reactionText, { color: muted }]}>
              {announcement.reactions.likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reactionButton}>
            <Ionicons name="chatbubble-outline" size={18} color={muted} />
            <Text style={[styles.reactionText, { color: muted }]}>
              {announcement.reactions.comments}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={18} color={muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={18} color={muted} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const unreadCount = announcements.filter((a) => !a.isRead).length;

  const inner = (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Announcements
            </Text>
            <Text style={[styles.headerSubtitle, { color: muted }]}>
              {unreadCount} unread updates
            </Text>
          </View>
          {/* create button removed for students */}
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
              placeholder="Search announcements..."
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
              {filter.id === "unread" && unreadCount > 0 && (
                <View
                  style={[
                    styles.filterBadge,
                    {
                      backgroundColor:
                        activeFilter === filter.id
                          ? "rgba(255,255,255,0.3)"
                          : "#EF4444",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterBadgeText,
                      { color: activeFilter === filter.id ? "#fff" : "#fff" },
                    ]}
                  >
                    {unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) =>
            renderAnnouncementCard(announcement)
          )
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="megaphone-outline" size={64} color={muted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No announcements found
            </Text>
            <Text style={[styles.emptySubtitle, { color: muted }]}>
              Try adjusting your filters or check back later
            </Text>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
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
  filterBadge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  announcementCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderLeftWidth: 1,
  },
  announcementHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  announcementMeta: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  authorInitial: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  priorityBadge: {
    marginLeft: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 24,
  },
  announcementContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  announcementFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reactions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  reactionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reactionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

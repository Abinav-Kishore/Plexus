import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../useThemeColors";

export default function Help() {
  const router = useRouter();
  const colors = useThemeColors();
  const isDark = colors.text === "#fff";
  const accent = "#5932EA";
  const accentLight = "#5932EA";
  const muted = isDark ? "#9CA3AF" : "#6B7280";
  const [searchText, setSearchText] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Handler functions for each topic
  const handleTopicPress = (topicId: string) => {
    switch (topicId) {
      case "getting-started":
        Alert.alert(
          "Getting Started",
          "Welcome to UniFeed! 🎓\n\n• Navigate between tabs using the bottom navigation\n• Check Home for your personalized feed\n• Visit Events for engineering activities\n• Use Calendar to manage your schedule\n• Stay updated with Announcements\n• Participate in student Polls",
          [{ text: "Got it!", style: "default" }]
        );
        break;

      case "polls-voting":
        router.push("/(tabs)/polls");
        break;

      case "schedule-events":
        router.push("/(tabs)/calendar");
        break;

      case "notifications":
        router.push("/(tabs)/announcements");
        break;

      case "events-activities":
        router.push("/(tabs)/events");
        break;

      case "account-settings":
        Alert.alert(
          "Account & Settings",
          "Manage your UniFeed experience:\n\n• Profile settings are managed through your institution\n• App preferences can be customized in device settings\n• For account issues, contact your student IT support\n• Theme automatically follows your device settings",
          [
            { text: "Contact Support", onPress: () => handleContactSupport() },
            { text: "OK", style: "default" },
          ]
        );
        break;

      default:
        Alert.alert(
          "Coming Soon",
          "This feature is being developed and will be available in a future update."
        );
    }
  };

  const handleContactSupport = () => {
    Alert.alert("Contact Support", "How would you like to get help?", [
      {
        text: "Email Support",
        onPress: () =>
          Linking.openURL(
            "mailto:support@unifeed.edu?subject=UniFeed Support Request"
          ),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const popularQuestions = [
    {
      id: 1,
      question: "How do I participate in polls?",
      answer:
        "Go to the Polls tab and select your preferred option from the available choices. Your vote will be recorded and you can see real-time results.",
    },
    {
      id: 2,
      question: "How do I add events to my calendar?",
      answer:
        "In the Calendar tab, select a date and tap the 'Add Event' button. Fill in the event details using the time picker and save.",
    },
    {
      id: 3,
      question: "Can I delete my own events?",
      answer:
        "Yes, you can delete events you created by tapping the red trash icon next to user-added events. Pre-existing academic events cannot be deleted.",
    },
  ];

  const helpTopics = [
    {
      id: "getting-started",
      title: "Getting Started",
      description:
        "Learn how to navigate UniFeed, access your feed, and join engineering activities.",
      icon: "book-outline",
      iconBg: "#3B82F6",
    },
    {
      id: "polls-voting",
      title: "Polls & Voting",
      description:
        "Participate in student polls, view results, and understand voting statistics in real-time.",
      icon: "people-outline",
      iconBg: "#8B5CF6",
    },
    {
      id: "schedule-events",
      title: "Calendar & Events",
      description:
        "Manage your academic calendar, add personal events, and stay updated with engineering activities.",
      icon: "calendar-outline",
      iconBg: "#10B981",
    },
    {
      id: "notifications",
      title: "Announcements",
      description:
        "Stay informed with the latest news, university updates, and important engineering program announcements.",
      icon: "notifications-outline",
      iconBg: "#F59E0B",
    },
    {
      id: "events-activities",
      title: "Engineering Events",
      description:
        "Discover robotics workshops, career fairs, hackathons, and other engineering activities.",
      icon: "build-outline",
      iconBg: "#EF4444",
    },
    {
      id: "account-settings",
      title: "Account & Settings",
      description:
        "Manage your profile, customize your UniFeed experience, and adjust app preferences.",
      icon: "settings-outline",
      iconBg: "#6B7280",
    },
  ];

  const faqs = [
    {
      q: "How do I join engineering study groups?",
      a: "Check the Events tab for study groups and workshops, or post in the Announcements section to find study partners.",
    },
    {
      q: "Where can I find course materials and syllabi?",
      a: "Course materials and syllabi are posted in the Announcements tab by your instructors and department.",
    },
    {
      q: "How do I report technical issues with the app?",
      a: "Contact the UniFeed support team through this Help section or email your student IT support.",
    },
    {
      q: "Can I sync my calendar with other apps?",
      a: "Currently, events are managed within UniFeed. Export functionality may be added in future updates.",
    },
  ];

  const inner = (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Help & Support
          </Text>
        </View>

        {/* Search Bar */}
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
              placeholder="What are you looking for?"
              placeholderTextColor={muted}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Popular Questions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Popular questions
          </Text>
          <View style={styles.questionsList}>
            {popularQuestions.map((question) => (
              <TouchableOpacity
                key={question.id}
                style={[
                  styles.questionCard,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.9)",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)",
                  },
                ]}
                onPress={() =>
                  setExpandedQuestion(
                    expandedQuestion === question.id ? null : question.id
                  )
                }
                activeOpacity={0.7}
              >
                <View style={styles.faqHeader}>
                  <Text
                    style={[
                      styles.questionText,
                      { color: colors.text, flex: 1 },
                    ]}
                  >
                    {question.question}
                  </Text>
                  <Ionicons
                    name={
                      expandedQuestion === question.id
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={20}
                    color={muted}
                  />
                </View>
                {expandedQuestion === question.id && (
                  <Text
                    style={[styles.answerText, { color: muted, marginTop: 12 }]}
                  >
                    {question.answer}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* All Topics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            All topics
          </Text>
          <View style={styles.topicsList}>
            {helpTopics.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.topicCard,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.9)",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)",
                  },
                ]}
                onPress={() => handleTopicPress(topic.id)}
                activeOpacity={0.7}
              >
                <View style={styles.topicContent}>
                  <View
                    style={[
                      styles.topicIcon,
                      { backgroundColor: topic.iconBg },
                    ]}
                  >
                    <Ionicons name={topic.icon as any} size={20} color="#fff" />
                  </View>
                  <View style={styles.topicTextContainer}>
                    <Text style={[styles.topicTitle, { color: colors.text }]}>
                      {topic.title}
                    </Text>
                    <Text style={[styles.topicDescription, { color: muted }]}>
                      {topic.description}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={muted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Frequently Asked Questions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Frequently Asked Questions
          </Text>
          <View style={styles.faqsList}>
            {faqs.map((f, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.faqCard,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.9)",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)",
                  },
                ]}
                onPress={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                activeOpacity={0.7}
              >
                <View style={styles.faqHeader}>
                  <Text
                    style={[
                      styles.faqQuestion,
                      { color: colors.text, flex: 1 },
                    ]}
                  >
                    {f.q}
                  </Text>
                  <Ionicons
                    name={expandedFAQ === i ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={muted}
                  />
                </View>
                {expandedFAQ === i && (
                  <Text
                    style={[styles.faqAnswer, { color: muted, marginTop: 12 }]}
                  >
                    {f.a}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
  backgroundImage: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject },
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 60 },
  titleSection: { marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: "700" },
  searchContainer: { marginBottom: 20 },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchText: { flex: 1, fontSize: 16 },
  content: { flex: 1 },
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  questionsList: { paddingHorizontal: 20, gap: 12 },
  questionCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  questionText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  answerText: {
    fontSize: 12,
    lineHeight: 18,
  },
  topicsList: { paddingHorizontal: 20, gap: 12 },
  topicCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topicContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  topicIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  topicTextContainer: { flex: 1 },
  topicTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  faqsList: { paddingHorizontal: 20, gap: 12 },
  faqCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: "600",
  },
  faqAnswer: {
    fontSize: 12,
    lineHeight: 18,
  },
});

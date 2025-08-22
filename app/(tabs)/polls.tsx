import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../useThemeColors";

const { width } = Dimensions.get("window");

export default function Polls() {
  const colors = useThemeColors();
  const isDark = colors.text === "#fff";
  const accent = "#5932EA";
  // use the same blue tint as Home so Polls matches
  const accentLight = "#5932EA";
  const muted = isDark ? "#9CA3AF" : "#6B7280";
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All", icon: "grid-outline" },
    { id: "answered", label: "Answered", icon: "checkmark-done-outline" },
    { id: "unanswered", label: "Unanswered", icon: "person-add-outline" },
  ];
  // tabs removed per request

  // removed trending/latest sections per request

  // restore polls list (student / engineering college themed)
  const initialPolls = [
    {
      id: 1,
      question: "Which domain are you choosing for your semester project?",
      author: "CSE Dept",
      votes: 74,
      comments: "12",
      unanswered: ["Alice", "Bob", "Charlie"],
      timeLeft: "3d left",
      options: [
        { text: "AI / Machine Learning", percentage: 40, votes: 30 },
        { text: "Embedded Systems", percentage: 20, votes: 15 },
        { text: "Web Development", percentage: 25, votes: 18 },
        { text: "Robotics", percentage: 15, votes: 11 },
      ],
    },
    {
      id: 2,
      question: "Preferred lab slot for Computer Networks practical?",
      author: "Lab Coordinator",
      votes: 58,
      comments: "6",
      unanswered: ["Daniel", "Eve"],
      timeLeft: "1d left",
      options: [
        { text: "Morning", percentage: 30, votes: 18 },
        { text: "Afternoon", percentage: 45, votes: 26 },
        { text: "Evening", percentage: 15, votes: 9 },
        { text: "Weekend", percentage: 10, votes: 5 },
      ],
    },
    {
      id: 3,
      question: "Which elective would you prefer next semester?",
      author: "Academic Office",
      votes: 92,
      comments: "14",
      unanswered: ["Fiona", "George"],
      timeLeft: "5d left",
      options: [
        { text: "Data Science", percentage: 35, votes: 32 },
        { text: "Cybersecurity", percentage: 25, votes: 23 },
        { text: "IoT", percentage: 20, votes: 18 },
        { text: "Advanced Algorithms", percentage: 20, votes: 19 },
      ],
    },
    {
      id: 4,
      question: "Preferred time for the Resume & Interview workshop?",
      author: "T&P Office",
      votes: 46,
      comments: "8",
      unanswered: ["Hannah", "Ishan", "Jay"],
      timeLeft: "2d left",
      options: [
        { text: "Morning", percentage: 40, votes: 18 },
        { text: "Afternoon", percentage: 50, votes: 23 },
        { text: "Evening", percentage: 10, votes: 5 },
      ],
    },
    {
      id: 5,
      question: "Ideal capstone team size?",
      author: "CSE Dept",
      votes: 64,
      comments: "9",
      unanswered: ["Karthik"],
      timeLeft: "4d left",
      options: [
        { text: "2 members", percentage: 20, votes: 13 },
        { text: "3 members", percentage: 50, votes: 32 },
        { text: "4 members", percentage: 20, votes: 13 },
        { text: "5 members", percentage: 10, votes: 6 },
      ],
    },
  ];

  // keep polls in state so votes update UI
  const [polls, setPolls] = useState<any[]>(initialPolls);
  // track which option the user selected per poll (allow change)
  const [votedChoice, setVotedChoice] = useState<Record<number, number | null>>(
    {}
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [activeUnanswered, setActiveUnanswered] = useState<string[] | null>(
    null
  );

  // Animated values per poll/option
  const progressAnims = useRef<Record<number, Animated.Value[]>>({});
  const scaleAnims = useRef<Record<number, Animated.Value[]>>({});
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  // Initialize animated values for polls once
  useEffect(() => {
    polls.forEach((p) => {
      if (!progressAnims.current[p.id]) {
        const total =
          (p.options || []).reduce(
            (s: number, o: any) => s + (o.votes || 0),
            0
          ) || 1;
        progressAnims.current[p.id] = p.options.map(
          (o: any) => new Animated.Value(((o.votes || 0) / total) * 100)
        );
        scaleAnims.current[p.id] = p.options.map(() => new Animated.Value(1));
      }
    });
  }, []);

  // Animate progress and scale whenever polls or votedChoice changes
  useEffect(() => {
    polls.forEach((p) => {
      const total =
        (p.options || []).reduce(
          (s: number, o: any) => s + (o.votes || 0),
          0
        ) || 1;
      p.options.forEach((opt: any, idx: number) => {
        const target = ((opt.votes || 0) / total) * 100;
        const prog = progressAnims.current[p.id]?.[idx];
        if (prog) {
          Animated.timing(prog, {
            toValue: target,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }

        const scale = scaleAnims.current[p.id]?.[idx];
        const selectedIdx = votedChoice[p.id];
        const targetScale = selectedIdx === idx ? 1.02 : 1;
        if (scale) {
          Animated.timing(scale, {
            toValue: targetScale,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      });
    });
  }, [polls, votedChoice]);

  const unansweredPollsCount = polls.filter(
    (p) => (p.unanswered || []).length > 0
  ).length;

  const userUnansweredCount = polls.filter(
    (p) => votedChoice[p.id] == null
  ).length;

  const filteredPolls = polls.filter((p) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "answered") return votedChoice[p.id] != null;
    if (activeFilter === "unanswered") return votedChoice[p.id] == null;
    return true;
  });

  const handleVote = (pollId: number, optionIndex: number) => {
    const prevChoice = votedChoice[pollId];
    // animate progress/scale using Animated (handled in effects)
    setPolls((prev) =>
      prev.map((p) => {
        if (p.id !== pollId) return p;
        const options = p.options.map((o: any) => ({ ...o }));
        let votesDelta = 0;

        if (prevChoice == null) {
          // first-time vote
          options[optionIndex].votes = (options[optionIndex].votes || 0) + 1;
          votesDelta = 1;
        } else if (prevChoice === optionIndex) {
          // user tapped the same option -> un-answer (remove vote)
          options[optionIndex].votes = Math.max(
            0,
            (options[optionIndex].votes || 0) - 1
          );
          votesDelta = -1;
        } else {
          // switching vote: decrement previous, increment new
          if (options[prevChoice]) {
            options[prevChoice].votes = Math.max(
              0,
              (options[prevChoice].votes || 0) - 1
            );
          }
          options[optionIndex].votes = (options[optionIndex].votes || 0) + 1;
          votesDelta = 0;
        }

        const totalVotes =
          options.reduce((s: number, o: any) => s + (o.votes || 0), 0) || 1;
        options.forEach((o: any) => {
          o.percentage = Math.round(((o.votes || 0) / totalVotes) * 100);
        });

        return {
          ...p,
          options,
          votes: Math.max(0, (p.votes || 0) + votesDelta),
        };
      })
    );

    // update votedChoice map: toggle off when same option tapped
    setVotedChoice((m) => ({
      ...m,
      [pollId]: prevChoice === optionIndex ? null : optionIndex,
    }));
  };

  // no-op: using Animated APIs that are Fabric-compatible

  const renderPollOption = (
    option: any,
    poll: any,
    index: number,
    selectedIndex: number | null
  ) => {
    const total =
      (poll.options || []).reduce(
        (s: number, o: any) => s + (o.votes || 0),
        0
      ) || 1;
    const widthPercent = Math.round(((option.votes || 0) / total) * 100);
    const selected = selectedIndex === index;
    const voted = selectedIndex != null;
    const scale = scaleAnims.current[poll.id]?.[index] ?? new Animated.Value(1);
    const progress =
      progressAnims.current[poll.id]?.[index] ??
      new Animated.Value(widthPercent);
    const progressWidth = progress.interpolate
      ? progress.interpolate({
          inputRange: [0, 100],
          outputRange: ["0%", "100%"],
        })
      : `${widthPercent}%`;

    return (
      <AnimatedTouchable
        key={option.text}
        onPress={() => handleVote(poll.id, index)}
        activeOpacity={0.9}
        style={[
          styles.pollOption,
          {
            transform: [{ scale }],
            borderColor: selected
              ? accentLight
              : isDark
              ? "rgba(124, 58, 237, 0.18)"
              : "rgba(124, 58, 237, 0.12)",
            backgroundColor: selected
              ? isDark
                ? "rgba(89,50,234,0.14)"
                : "rgba(89,50,234,0.10)"
              : isDark
              ? "rgba(124, 58, 237, 0.06)"
              : "rgba(124, 58, 237, 0.03)",
          },
        ]}
      >
        <View style={styles.pollOptionContent}>
          <Text
            style={[
              styles.pollOptionText,
              {
                color: selected ? (isDark ? "#fff" : accentLight) : colors.text,
              },
            ]}
          >
            {option.text}
          </Text>
          <Text
            style={[
              styles.pollOptionPercentage,
              {
                color: selected
                  ? isDark
                    ? "rgba(255,255,255,0.9)"
                    : accentLight
                  : muted,
              },
            ]}
          >
            {option.votes}
          </Text>
        </View>
        <View
          style={[
            styles.pollOptionBar,
            {
              backgroundColor: isDark
                ? "rgba(124, 58, 237, 0.12)"
                : "rgba(124, 58, 237, 0.06)",
            },
          ]}
        >
          <Animated.View
            style={[
              styles.pollOptionProgress,
              {
                width: progressWidth as Animated.AnimatedInterpolation<
                  string | number
                >,
                backgroundColor: accentLight,
              },
            ]}
          />
        </View>
      </AnimatedTouchable>
    );
  };

  const renderPollCard = (poll: any) => (
    <View
      key={poll.id}
      style={[
        styles.trendingPollCard,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.9)",
          borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
        },
      ]}
    >
      <View style={styles.pollHeader}>
        <View style={styles.pollAuthor}>
          <View style={[styles.authorAvatar, { backgroundColor: accentLight }]}>
            <Text style={styles.authorInitial}>{poll.author.charAt(0)}</Text>
          </View>
          <Text style={[styles.authorName, { color: colors.text }]}>
            {poll.author}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={muted} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.pollQuestion, { color: colors.text }]}>
        {poll.question}
      </Text>

      <View style={styles.pollOptions}>
        {poll.options?.map((option: any, idx: number) =>
          renderPollOption(option, poll, idx, votedChoice[poll.id] ?? null)
        )}
      </View>

      <View style={styles.pollFooter}>
        <View style={styles.pollStats}>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={16} color={muted} />
            <Text style={[styles.statText, { color: muted }]}>
              {poll.votes}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => {
              setActiveUnanswered(poll.unanswered || []);
              setModalVisible(true);
            }}
          >
            <Ionicons name="person-add-outline" size={16} color={accentLight} />
            <Text style={[styles.statText, { color: accentLight }]}>
              {poll.unanswered?.length ?? 0}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.timeLeft}>
          <Ionicons name="time-outline" size={14} color={muted} />
          <Text style={[styles.timeLeftText, { color: muted }]}>
            {poll.timeLeft}
          </Text>
        </View>
      </View>
    </View>
  );

  // tabs removed

  // removed trending/latest helpers per request

  const inner = (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Polls
            </Text>
            <Text style={[styles.headerSubtitle, { color: muted }]}>
              {unansweredPollsCount} unanswered
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
            <TextInput
              style={[styles.searchText, { color: colors.text }]}
              placeholder="Search polls..."
              placeholderTextColor={muted}
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.searchIcon}>
              <Ionicons name="search" size={18} color={accent} />
            </TouchableOpacity>
          </View>
          {/* add button removed per request */}
        </View>

        {/* Filter Tabs (All / Answered / Unanswered) */}
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
              {filter.id === "unanswered" && userUnansweredCount > 0 && (
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
                  <Text style={[styles.filterBadgeText, { color: "#fff" }]}>
                    {userUnansweredCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Poll list (no title) */}
        <View style={{ paddingTop: 8 }}>
          {filteredPolls.map((p: any) => renderPollCard(p))}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? "#111" : "#fff" },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Not answered yet
            </Text>
            <FlatList
              data={activeUnanswered || []}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.unansweredRow}>
                  <Text style={{ color: colors.text }}>{item}</Text>
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: accentLight }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: "700", marginBottom: 4 },
  headerSubtitle: { fontSize: 14 },
  searchContainer: { marginBottom: 20 },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderWidth: 1,
    gap: 12,
  },
  searchText: { flex: 1, fontSize: 16 },
  searchIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  filtersContainer: { marginBottom: 10 },
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
  filterText: { fontSize: 14, fontWeight: "500" },
  filterBadge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBadgeText: { fontSize: 12, fontWeight: "700" },
  sectionArrow: { padding: 4 },
  content: { flex: 1 },
  trendingPollCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  pollHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pollAuthor: { flexDirection: "row", alignItems: "center", gap: 8 },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  authorInitial: { color: "#fff", fontSize: 14, fontWeight: "600" },
  authorName: { fontSize: 14, fontWeight: "500" },
  moreButton: { padding: 4 },
  pollQuestion: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    lineHeight: 22,
  },
  pollOptions: { gap: 8, marginBottom: 16 },
  pollOption: { borderRadius: 12, padding: 12, borderWidth: 1 },
  pollOptionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  pollOptionText: { fontSize: 14, fontWeight: "500" },
  pollOptionPercentage: { fontSize: 12, fontWeight: "600" },
  pollOptionBar: { height: 4, borderRadius: 2, overflow: "hidden" },
  pollOptionProgress: { height: "100%", borderRadius: 2 },
  pollFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pollStats: { flexDirection: "row", alignItems: "center", gap: 16 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontSize: 12, fontWeight: "500" },
  timeLeft: { flexDirection: "row", alignItems: "center", gap: 4 },
  timeLeftText: { fontSize: 12, fontWeight: "500" },
  latestPollCard: {
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  latestPollContent: { flex: 1 },
  latestPollHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  latestPollQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
  },
  latestPollFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  latestPollAuthor: { flexDirection: "row", alignItems: "center", gap: 6 },
  smallAuthorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  smallAuthorInitial: { color: "#fff", fontSize: 10, fontWeight: "600" },
  smallAuthorName: { fontSize: 12 },
  latestPollStats: { flexDirection: "row", alignItems: "center", gap: 12 },
  smallStatItem: { flexDirection: "row", alignItems: "center", gap: 2 },
  smallStatText: { fontSize: 10 },
  nextArrow: { marginLeft: 12, padding: 4 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxHeight: "80%",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  unansweredRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  modalClose: { marginTop: 12, alignSelf: "flex-end" },
});

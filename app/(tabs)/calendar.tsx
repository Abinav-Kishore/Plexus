import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useThemeColors } from "../useThemeColors";

const { width } = Dimensions.get("window");

type EventItem = {
  id: number;
  time: string;
  title: string;
  location?: string;
  subtitle?: string;
  attendees?: string[];
  color?: string;
  date: number;
  month: number;
  year: number;
  isUserAdded?: boolean; // Track if user added this event
};

export default function Calendar() {
  const colors = useThemeColors();
  const { width: windowWidth } = useWindowDimensions();
  const isWide = windowWidth >= 700;
  const isDark = colors.text === "#fff";

  const [selectedDate, setSelectedDate] = useState<number>(22);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // September (0-indexed)
  const [currentYear, setCurrentYear] = useState<number>(2025);
  const [showAddEventModal, setShowAddEventModal] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventTime, setNewEventTime] = useState<string>("");
  const [newEventLocation, setNewEventLocation] = useState<string>("");
  const [selectedHour, setSelectedHour] = useState<number>(9);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");

  const accent = "#5932EA";
  const accentLight = "#7C3AED";
  const muted = isDark ? "#9CA3AF" : "#6B7280";

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Time picker options
  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
  const minutes = Array.from({ length: 60 }, (_, i) => i); // 0-59
  const periods = ["AM", "PM"];

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days: Array<number | null> = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    // Pad to complete the last week
    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  }, [currentMonth, currentYear]);

  const [events, setEvents] = useState<EventItem[]>([
    {
      id: 3,
      time: "14:00",
      title: "Senior Design Review",
      location: "Conference Room A",
      attendees: ["P", "C", "M"],
      color: "#0EA5E9",
      date: 25,
      month: 8,
      year: 2025,
    },
  ]);

  // Filter events for selected date
  const selectedDateEvents = events.filter(
    (event) =>
      event.date === selectedDate &&
      event.month === currentMonth &&
      event.year === currentYear
  );

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const isToday = (day: number | null): boolean => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const hasEvents = (day: number | null): boolean => {
    if (!day) return false;
    return events.some(
      (event) =>
        event.date === day &&
        event.month === currentMonth &&
        event.year === currentYear
    );
  };

  const daySize = Math.floor((Math.min(windowWidth, 700) - 40) / 7);

  const handleAddEvent = () => {
    setShowAddEventModal(true);
  };

  const saveNewEvent = () => {
    if (!newEventTitle.trim()) {
      Alert.alert("Error", "Please fill in the event title");
      return;
    }

    // Format time from picker selection
    const formattedTime = `${selectedHour}:${selectedMinute
      .toString()
      .padStart(2, "0")} ${selectedPeriod}`;

    const newEvent: EventItem = {
      id: Date.now(), // Simple ID generation
      title: newEventTitle.trim(),
      time: formattedTime,
      location: newEventLocation.trim() || undefined,
      date: selectedDate,
      month: currentMonth,
      year: currentYear,
      color: "#5932EA", // Default color
      attendees: [],
      isUserAdded: true, // Mark as user-added event
    };

    setEvents([...events, newEvent]);

    // Reset form
    setNewEventTitle("");
    setNewEventTime("");
    setNewEventLocation("");
    setSelectedHour(9);
    setSelectedMinute(0);
    setSelectedPeriod("AM");
    setShowAddEventModal(false);

    Alert.alert("Success", "Event added successfully!");
  };

  const deleteEvent = (eventId: number) => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setEvents(events.filter((event) => event.id !== eventId));
          Alert.alert("Success", "Event deleted successfully!");
        },
      },
    ]);
  };

  const cancelAddEvent = () => {
    setNewEventTitle("");
    setNewEventTime("");
    setNewEventLocation("");
    setSelectedHour(9);
    setSelectedMinute(0);
    setSelectedPeriod("AM");
    setShowAddEventModal(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ padding: 20, paddingTop: 60 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 20,
            }}
          >
            <View>
              <Text
                style={{ fontSize: 28, fontWeight: "700", color: colors.text }}
              >
                Academic Calendar
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            { paddingHorizontal: 20 },
            isWide ? { flexDirection: "row", alignItems: "flex-start" } : null,
          ]}
        >
          {/* Main Calendar Card */}
          <View
            style={[
              {
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                marginBottom: 16,
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.9)",
                borderColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.08)",
              },
              isWide ? { flex: 1, marginRight: 20 } : null,
            ]}
          >
            {/* Month header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{ fontSize: 22, fontWeight: "700", color: colors.text }}
              >
                {monthNames[currentMonth]} {currentYear}
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  style={{ padding: 8, borderRadius: 12 }}
                  onPress={() => navigateMonth("prev")}
                >
                  <Ionicons name="chevron-back" size={20} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ padding: 8, borderRadius: 12 }}
                  onPress={() => navigateMonth("next")}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.text}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Days of week */}
            <View style={{ flexDirection: "row", marginBottom: 8 }}>
              {daysOfWeek.map((d) => (
                <View key={d} style={{ alignItems: "center", width: daySize }}>
                  <Text
                    style={{ fontSize: 12, fontWeight: "600", color: muted }}
                  >
                    {d}
                  </Text>
                </View>
              ))}
            </View>

            {/* Calendar grid */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginBottom: 20,
                width: daySize * 7,
              }}
            >
              {calendarDays.map((day, idx) => {
                const isSelected = day === selectedDate;
                const isTodayMarker = isToday(day);
                const hasEventsMarker = hasEvents(day);
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => day && setSelectedDate(day)}
                    disabled={!day}
                    style={[
                      {
                        alignItems: "center",
                        justifyContent: "center",
                        margin: 2,
                        position: "relative",
                        width: daySize,
                        height: daySize,
                      },
                      isSelected
                        ? { backgroundColor: accent, borderRadius: 8 }
                        : null,
                      isTodayMarker && !isSelected
                        ? {
                            backgroundColor: isDark
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(89,50,234,0.1)",
                            borderRadius: 8,
                          }
                        : null,
                      !day ? { opacity: 0 } : null,
                    ]}
                  >
                    <Text
                      style={[
                        { fontSize: 14, fontWeight: "600" },
                        { color: isSelected ? "#fff" : colors.text },
                        isTodayMarker && !isSelected
                          ? { color: accent, fontWeight: "700" }
                          : null,
                      ]}
                    >
                      {day}
                    </Text>
                    {hasEventsMarker && !isSelected && (
                      <View
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: 2,
                          position: "absolute",
                          bottom: 4,
                          backgroundColor: accent,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Events for selected date */}
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "rgba(0,0,0,0.08)",
                paddingTop: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons name="time-outline" size={16} color={muted} />
                  <Text
                    style={{ fontSize: 14, fontWeight: "500", color: muted }}
                  >
                    {monthNames[currentMonth].slice(0, 3)} {selectedDate} -{" "}
                    {selectedDateEvents.length} events
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: accent,
                    elevation: 2,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                  }}
                  onPress={handleAddEvent}
                >
                  <Ionicons name="add" size={16} color="#fff" />
                  <Text
                    style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}
                  >
                    Add Event
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                {selectedDateEvents.map((evt) => (
                  <View
                    key={evt.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    <View
                      style={{
                        minWidth: 60,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 12,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: evt.color ?? "#E5E7EB",
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "700",
                          fontSize: 12,
                        }}
                      >
                        {evt.time}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          marginBottom: 4,
                          color: colors.text,
                        }}
                      >
                        {evt.title}
                      </Text>
                      {evt.location ? (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            marginBottom: 4,
                          }}
                        >
                          <Ionicons
                            name="location-outline"
                            size={12}
                            color={muted}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "500",
                              color: muted,
                            }}
                          >
                            {evt.location}
                          </Text>
                        </View>
                      ) : null}
                      {evt.subtitle ? (
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "500",
                            color: muted,
                          }}
                        >
                          {evt.subtitle}
                        </Text>
                      ) : null}
                      {evt.attendees && evt.attendees.length > 0 ? (
                        <View
                          style={{ flexDirection: "row", gap: 6, marginTop: 8 }}
                        >
                          {evt.attendees.map((a, i) => (
                            <View
                              key={i}
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: accentLight,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 10,
                                  fontWeight: "700",
                                  color: "#fff",
                                }}
                              >
                                {a}
                              </Text>
                            </View>
                          ))}
                        </View>
                      ) : null}
                    </View>
                    {/* Delete button for user-added events */}
                    {evt.isUserAdded && (
                      <TouchableOpacity
                        style={{
                          padding: 8,
                          borderRadius: 8,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() => deleteEvent(evt.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color="#EF4444"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                {selectedDateEvents.length === 0 && (
                  <View style={{ paddingVertical: 20, alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontStyle: "italic",
                        color: muted,
                      }}
                    >
                      No events scheduled
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Right Column: today's schedule (visible on wide screens) */}
          {isWide && (
            <View
              style={{
                width: 320,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                position: "relative",
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.9)",
                borderColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.08)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 20,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: colors.text,
                    }}
                  >
                    {monthNames[currentMonth]}
                  </Text>
                  <Text
                    style={{
                      fontSize: 32,
                      fontWeight: "900",
                      marginTop: 4,
                      color: accent,
                    }}
                  >
                    {selectedDate}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 12, color: muted }}>
                    Today you have
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      marginTop: 2,
                      color: colors.text,
                    }}
                  >
                    {selectedDateEvents.length}{" "}
                    {selectedDateEvents.length === 1 ? "event" : "events"}
                  </Text>
                </View>
              </View>

              <View style={{ gap: 12 }}>
                {selectedDateEvents.map((evt, idx) => (
                  <View
                    key={evt.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        minWidth: 80,
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderRadius: 16,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: evt.color || "#6B7280",
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "700",
                          fontSize: 16,
                        }}
                      >
                        {evt.time}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        padding: 12,
                        borderRadius: 12,
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.03)"
                          : "#F8FAFC",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          marginBottom: 4,
                          color: colors.text,
                        }}
                      >
                        {evt.title}
                      </Text>
                      {(evt.subtitle || evt.location) && (
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "500",
                            color: muted,
                          }}
                        >
                          {evt.subtitle || evt.location}
                        </Text>
                      )}
                      {evt.attendees && evt.attendees.length > 0 && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 6,
                          }}
                        >
                          <Ionicons
                            name="people-outline"
                            size={12}
                            color={muted}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "500",
                              color: muted,
                            }}
                          >
                            {evt.attendees.length} attending
                          </Text>
                        </View>
                      )}
                    </View>
                    {/* Delete button for user-added events in wide view */}
                    {evt.isUserAdded && (
                      <TouchableOpacity
                        style={{
                          padding: 8,
                          borderRadius: 8,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() => deleteEvent(evt.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color="#EF4444"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 16,
                  bottom: 16,
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  alignItems: "center",
                  justifyContent: "center",
                  elevation: 4,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  backgroundColor: accent,
                }}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Event Modal */}
      <Modal
        visible={showAddEventModal}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={false}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ padding: 20, paddingTop: 60 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 30,
              }}
            >
              <TouchableOpacity onPress={cancelAddEvent}>
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: accent }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: colors.text }}
              >
                Add Event - {monthNames[currentMonth]} {selectedDate}
              </Text>
              <TouchableOpacity onPress={saveNewEvent}>
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: accent }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: 20 }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 8,
                    color: colors.text,
                  }}
                >
                  Event Title *
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: isDark
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.1)",
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.9)",
                    color: colors.text,
                  }}
                  placeholder="Enter event title"
                  placeholderTextColor={muted}
                  value={newEventTitle}
                  onChangeText={setNewEventTitle}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 8,
                    color: colors.text,
                  }}
                >
                  Time *
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: isDark
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.1)",
                    borderRadius: 12,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.9)",
                    padding: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  {/* Hour Picker */}
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: muted,
                        marginBottom: 8,
                      }}
                    >
                      Hour
                    </Text>
                    <ScrollView
                      style={{ height: 60, width: 50 }}
                      showsVerticalScrollIndicator={false}
                      snapToInterval={30}
                      snapToAlignment="center"
                      decelerationRate="fast"
                    >
                      {hours.map((hour) => (
                        <TouchableOpacity
                          key={hour}
                          style={{
                            height: 30,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor:
                              selectedHour === hour ? accent : "transparent",
                            borderRadius: 6,
                            marginVertical: 2,
                          }}
                          onPress={() => setSelectedHour(hour)}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: selectedHour === hour ? "700" : "500",
                              color:
                                selectedHour === hour ? "#fff" : colors.text,
                            }}
                          >
                            {hour}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: colors.text,
                    }}
                  >
                    :
                  </Text>

                  {/* Minute Picker */}
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: muted,
                        marginBottom: 8,
                      }}
                    >
                      Minute
                    </Text>
                    <ScrollView
                      style={{ height: 60, width: 50 }}
                      showsVerticalScrollIndicator={false}
                      snapToInterval={30}
                      snapToAlignment="center"
                      decelerationRate="fast"
                    >
                      {minutes
                        .filter((m) => m % 5 === 0)
                        .map((minute) => (
                          <TouchableOpacity
                            key={minute}
                            style={{
                              height: 30,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor:
                                selectedMinute === minute
                                  ? accent
                                  : "transparent",
                              borderRadius: 6,
                              marginVertical: 2,
                            }}
                            onPress={() => setSelectedMinute(minute)}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight:
                                  selectedMinute === minute ? "700" : "500",
                                color:
                                  selectedMinute === minute
                                    ? "#fff"
                                    : colors.text,
                              }}
                            >
                              {minute.toString().padStart(2, "0")}
                            </Text>
                          </TouchableOpacity>
                        ))}
                    </ScrollView>
                  </View>

                  {/* AM/PM Picker */}
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: muted,
                        marginBottom: 8,
                      }}
                    >
                      Period
                    </Text>
                    <View style={{ gap: 8 }}>
                      {periods.map((period) => (
                        <TouchableOpacity
                          key={period}
                          style={{
                            height: 30,
                            width: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor:
                              selectedPeriod === period
                                ? accent
                                : "transparent",
                            borderRadius: 6,
                          }}
                          onPress={() =>
                            setSelectedPeriod(period as "AM" | "PM")
                          }
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight:
                                selectedPeriod === period ? "700" : "500",
                              color:
                                selectedPeriod === period
                                  ? "#fff"
                                  : colors.text,
                            }}
                          >
                            {period}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Selected time display */}
                <View style={{ marginTop: 8, alignItems: "center" }}>
                  <Text
                    style={{ fontSize: 14, fontWeight: "600", color: accent }}
                  >
                    Selected: {selectedHour}:
                    {selectedMinute.toString().padStart(2, "0")}{" "}
                    {selectedPeriod}
                  </Text>
                </View>
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 8,
                    color: colors.text,
                  }}
                >
                  Location (Optional)
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: isDark
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.1)",
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.9)",
                    color: colors.text,
                  }}
                  placeholder="Enter location"
                  placeholderTextColor={muted}
                  value={newEventLocation}
                  onChangeText={setNewEventLocation}
                />
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: accent,
                  padding: 16,
                  borderRadius: 12,
                  alignItems: "center",
                  marginTop: 20,
                }}
                onPress={saveNewEvent}
              >
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}
                >
                  Add Event
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

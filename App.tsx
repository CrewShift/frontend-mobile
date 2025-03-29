import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  FlatList,
  Animated,
  Easing
} from 'react-native';

// Helper functions
const formatDate = (date) => {
  const options = { weekday: 'long', day: '2-digit', month: 'long' };
  return date.toLocaleDateString('en-US', options);
};

const formatDateShort = (date) => {
  const options = { weekday: 'short', day: '2-digit', month: 'short' };
  return date.toLocaleDateString('en-US', options);
};

const formatTime = (timeString) => {
  if (!timeString) return null;
  // Handle time formatting (assuming timeString is in format "HH:MM")
  return timeString;
};

// User name - would come from user profile
const USER_NAME = "Dimitar";

// Country flags mapping
const FLAGS = {
  'SOF': '🇧🇬',
  'WAW': '🇵🇱',
  'AYT': '🇹🇷',
  'FRA': '🇩🇪',
  'LHR': '🇬🇧',
  'CDG': '🇫🇷',
};

// Flight data from JSON (this would be fetched from an API in production)
const FLIGHT_DATA = [
  {
    "IndividualDay": "Mon, 01Apr",
    "Date": "2025-04-01",
    "FT_BLH": "05:55",
    "FDT": "07:55",
    "DT": "08:25",
    "RP": "17:30",
    "Flights": [
      {
        "Duty": "CAI8001",
        "CheckIn": "03:45",
        "CheckOut": null,
        "Departure": "SOF",
        "Arrival": "WAW",
        "DepTime": "04:45",
        "ArrivalTime": "07:45",
        "Aircraft": "A320/BHL",
        "Cockpit": "TRI G.GOSPODINOV; COP US R. BERNARDO",
        "Cabin": "SEN CCM S.ZHEKOVA; INS CCM A.IVANOVA; CCM K.KALOYANOV"
      },
      {
        "Duty": "CAI8002",
        "CheckIn": null,
        "CheckOut": "12:10",
        "Departure": "WAW",
        "Arrival": "AYT",
        "DepTime": "08:30",
        "ArrivalTime": "10:45",
        "Aircraft": "A320/BHL",
        "Cockpit": "TRI G.GOSPODINOV; COP US R. BERNARDO",
        "Cabin": "SEN CCM S.ZHEKOVA; CCM 2 Y.BOEVA; CCM M.ANDREEV"
      }
    ]
  },
  {
    "IndividualDay": "Tue, 02Apr",
    "Date": "2025-04-02",
    "FT_BLH": "06:10",
    "FDT": "08:00",
    "DT": "08:40",
    "RP": "18:00",
    "Flights": [
      {
        "Duty": "CAI8011",
        "CheckIn": "04:00",
        "CheckOut": null,
        "Departure": "SOF",
        "Arrival": "FRA",
        "DepTime": "05:00",
        "ArrivalTime": "07:15",
        "Aircraft": "B737/ATR",
        "Cockpit": "CAPT L.KOSTADINOVA; FO A.PETROV",
        "Cabin": "SEN CCM M.IVANOVA; CCM 2 P.DIMITROV"
      },
      {
        "Duty": "CAI8012",
        "CheckIn": null,
        "CheckOut": "13:00",
        "Departure": "FRA",
        "Arrival": "SOF",
        "DepTime": "08:00",
        "ArrivalTime": "10:10",
        "Aircraft": "B737/ATR",
        "Cockpit": "CAPT L.KOSTADINOVA; FO A.PETROV",
        "Cabin": "SEN CCM M.IVANOVA; CCM 2 P.DIMITROV"
      }
    ]
  },
  {
    "IndividualDay": "Wed, 03Apr",
    "Date": "2025-04-03",
    "Duty": "Day Off"
  },
  {
    "IndividualDay": "Thu, 04Apr",
    "Date": "2025-04-04",
    "FT_BLH": "06:05",
    "FDT": "08:10",
    "DT": "08:40",
    "RP": "16:00",
    "Flights": [
      {
        "Duty": "CAI8031",
        "CheckIn": "04:15",
        "CheckOut": null,
        "Departure": "SOF",
        "Arrival": "LHR",
        "DepTime": "05:15",
        "ArrivalTime": "07:20",
        "Aircraft": "A320/BHL",
        "Cockpit": "TRI G.GOSPODINOV; COP US R. BERNARDO",
        "Cabin": "SEN CCM S.ZHEKOVA; INS CCM A.IVANOVA; CCM UT V.PETROV"
      },
      {
        "Duty": "CAI8032",
        "CheckIn": null,
        "CheckOut": "13:20",
        "Departure": "LHR",
        "Arrival": "SOF",
        "DepTime": "08:30",
        "ArrivalTime": "11:00",
        "Aircraft": "A320/BHL",
        "Cockpit": "TRI G.GOSPODINOV; COP US R. BERNARDO",
        "Cabin": "SEN CCM S.ZHEKOVA; INS CCM A.IVANOVA; CCM UT V.PETROV"
      }
    ]
  },
  {
    "IndividualDay": "Fri, 05Apr",
    "Date": "2025-04-05",
    "FT_BLH": "05:45",
    "FDT": "07:50",
    "DT": "08:20",
    "RP": "14:30",
    "Flights": [
      {
        "Duty": "CAI8041",
        "CheckIn": "02:40",
        "CheckOut": null,
        "Departure": "SOF",
        "Arrival": "CDG",
        "DepTime": "03:40",
        "ArrivalTime": "06:10",
        "Aircraft": "A320/BHL",
        "Cockpit": "CAPT N.STOYANOV; FO R.IVANOV",
        "Cabin": "SEN CCM T.PETROVA; INS CCM K.DIMITROVA"
      },
      {
        "Duty": "CAI8042",
        "CheckIn": null,
        "CheckOut": "11:25",
        "Departure": "CDG",
        "Arrival": "SOF",
        "DepTime": "07:00",
        "ArrivalTime": "09:25",
        "Aircraft": "A320/BHL",
        "Cockpit": "CAPT N.STOYANOV; FO R.IVANOV",
        "Cabin": "SEN CCM T.PETROVA; INS CCM K.DIMITROVA"
      }
    ]
  },
  {
    "IndividualDay": "Sat, 06Apr",
    "Date": "2025-04-06",
    "FT_BLH": "06:00",
    "FDT": "08:05",
    "DT": "08:35",
    "RP": "16:20",
    "Flights": [
      {
        "Duty": "CAI8051",
        "CheckIn": "03:55",
        "CheckOut": null,
        "Departure": "SOF",
        "Arrival": "WAW",
        "DepTime": "04:55",
        "ArrivalTime": "07:50", 
        "Aircraft": "B777/ERJ",
        "Cockpit": "CAPT I.KOLYADIN; FO D.PETROVA",
        "Cabin": "SEN CCM L.GEORGIEVA; INS CCM M.KARPOV; CCM 2 I.NIKOLSKA"
      },
      {
        "Duty": "CAI8052",
        "CheckIn": null,
        "CheckOut": "12:45",
        "Departure": "WAW",
        "Arrival": "SOF",
        "DepTime": "08:50",
        "ArrivalTime": "11:05",
        "Aircraft": "B777/ERJ",
        "Cockpit": "CAPT I.KOLYADIN; FO D.PETROVA",
        "Cabin": "SEN CCM L.GEORGIEVA; INS CCM M.KARPOV; CCM 2 I.NIKOLSKA"
      }
    ]
  },
  {
    "IndividualDay": "Sun, 07Apr",
    "Date": "2025-04-07",
    "FT_BLH": "05:50",
    "FDT": "07:45",
    "DT": "08:15",
    "RP": "15:40",
    "Flights": [
      {
        "Duty": "CAI8061",
        "CheckIn": "02:35",
        "CheckOut": null,
        "Departure": "SOF",
        "Arrival": "LHR",
        "DepTime": "03:35",
        "ArrivalTime": "06:10",
        "Aircraft": "A320/BHL",
        "Cockpit": "CAPT V.DIMOV; FO S.PETROV",
        "Cabin": "SEN CCM R.KOSTADINOVA; CCM 2 T.NIKOLSKA"
      },
      {
        "Duty": "CAI8062",
        "CheckIn": null,
        "CheckOut": "11:40",
        "Departure": "LHR",
        "Arrival": "SOF",
        "DepTime": "07:00",
        "ArrivalTime": "10:00",
        "Aircraft": "A320/BHL",
        "Cockpit": "CAPT V.DIMOV; FO S.PETROV",
        "Cabin": "SEN CCM R.KOSTADINOVA; CCM 2 T.NIKOLSKA"
      }
    ]
  },
  {
    "IndividualDay": "Mon, 08Apr",
    "Date": "2025-04-08",
    "Duty": "Day Off"
  },
  {
    "IndividualDay": "Tue, 09Apr",
    "Date": "2025-04-09",
    "FT_BLH": "05:40",
    "FDT": "07:35",
    "DT": "08:05",
    "RP": "14:50",
    "Flights": [
      {
        "Duty": "CAI8081",
        "CheckIn": "03:30",
        "CheckOut": null,
        "Departure": "SOF",
        "Arrival": "WAW",
        "DepTime": "04:30",
        "ArrivalTime": "07:20",
        "Aircraft": "A320/BHL",
        "Cockpit": "CAPT M.TODOROV; FO E.KOSTADINOVA",
        "Cabin": "SEN CCM P.STOILOV; CCM 2 G.PETROVA"
      },
      {
        "Duty": "CAI8082",
        "CheckIn": null,
        "CheckOut": "12:20",
        "Departure": "WAW",
        "Arrival": "SOF",
        "DepTime": "08:00",
        "ArrivalTime": "10:10",
        "Aircraft": "A320/BHL",
        "Cockpit": "CAPT M.TODOROV; FO E.KOSTADINOVA",
        "Cabin": "SEN CCM P.STOILOV; CCM 2 G.PETROVA"
      }
    ]
  }
];

// Custom Icons with animations
const BellIcon = ({ size = 24 }) => {
  const bellSwing = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(bellSwing, {
        toValue: 1,
        duration: 400,
        easing: Easing.elastic(1.5),
        useNativeDriver: true
      }),
      Animated.timing(bellSwing, {
        toValue: 0,
        duration: 400,
        easing: Easing.elastic(1.5),
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const rotation = bellSwing.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '-15deg', '0deg']
  });

  return (
    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
      <View style={{width: size, height: size}}>
        <View style={{
          width: size*0.7, 
          height: size*0.7, 
          borderWidth: 2, 
          borderColor: '#FFFFFF', 
          borderRadius: size*0.35,
          position: 'absolute',
          top: 0,
          left: size*0.15
        }} />
        <View style={{
          width: size*0.3, 
          height: size*0.1, 
          borderWidth: 2,
          borderColor: '#FFFFFF',
          borderRadius: size*0.1,
          position: 'absolute',
          bottom: 1,
          left: size*0.35
        }} />
        <View style={{
          width: size*0.4, 
          height: size*0.4, 
          borderWidth: 0,
          borderTopLeftRadius: size*0.2,
          borderTopRightRadius: size*0.2,
          position: 'absolute',
          top: size*0.1,
          left: size*0.3
        }} />
      </View>
    </Animated.View>
  );
};

const UserIcon = ({ size = 24 }) => {
  return (
    <View style={{width: size, height: size}}>
      <View style={{
        width: size*0.5, 
        height: size*0.5, 
        borderWidth: 2, 
        borderColor: '#FFFFFF', 
        borderRadius: size*0.25,
        position: 'absolute',
        top: 0,
        left: size*0.25
      }} />
      <View style={{
        width: size*0.7, 
        height: size*0.35, 
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderRadius: size*0.15,
        borderBottomLeftRadius: size*0.25,
        borderBottomRightRadius: size*0.25,
        position: 'absolute',
        bottom: 0,
        left: size*0.15
      }} />
    </View>
  );
};

// Calendar data processing - Fixed to show only necessary days
const generateCalendarData = (selectedMonth) => {
  // Get the first day of the month
  const firstDay = new Date(2025, selectedMonth, 1);
  const lastDay = new Date(2025, selectedMonth + 1, 0);
  
  // Get day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  let firstDayOfWeek = firstDay.getDay();
  // Convert to Monday = 0, Sunday = 6 format
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  
  const daysInMonth = lastDay.getDate();
  const daysInPrevMonth = new Date(2025, selectedMonth, 0).getDate();
  
  // Generate days array
  const days = [];
  
  // Previous month days (only those needed to fill first row)
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: daysInPrevMonth - i,
      month: selectedMonth - 1,
      isCurrentMonth: false
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: i,
      month: selectedMonth,
      isCurrentMonth: true
    });
  }
  
  // Calculate how many days we need from next month to complete the last row
  const lastRowDays = (7 - (days.length % 7)) % 7;
  
  // Next month days (only those needed to complete the last row)
  for (let i = 1; i <= lastRowDays; i++) {
    days.push({
      date: i,
      month: selectedMonth + 1,
      isCurrentMonth: false
    });
  }
  
  return days;
};

// Check if a date has flight data
const hasFlightData = (date, month) => {
  // Convert month index (0-based) to month name abbreviated
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthStr = months[month];
  
  // Format date with leading zero if needed
  const dateStr = date < 10 ? `0${date}` : `${date}`;
  
  // Look for this date in FLIGHT_DATA
  return FLIGHT_DATA.find(day => {
    // Some date formats in your data: "Mon, 01Apr"
    return day.IndividualDay.includes(`${dateStr}${monthStr}`);
  });
};

// Get flight status for a date (multiple flights, single flight, day off, etc.)
const getFlightStatus = (date, month) => {
  const dayData = hasFlightData(date, month);
  
  if (!dayData) return 'none';
  
  if (dayData.Duty === 'Day Off') return 'dayOff';
  
  if (dayData.Flights) {
    return dayData.Flights.length > 1 ? 'multipleFlights' : 'singleFlight';
  }
  
  return 'workNoFlight';
};

// Calculate time between two time strings
const calculateDuration = (depTime, arrTime) => {
  const [depHours, depMinutes] = depTime.split(':').map(Number);
  const [arrHours, arrMinutes] = arrTime.split(':').map(Number);
  
  let hours = arrHours - depHours;
  let minutes = arrMinutes - depMinutes;
  
  if (minutes < 0) {
    hours--;
    minutes += 60;
  }
  
  if (hours < 0) {
    hours += 24; // Assuming flight doesn't span multiple days
  }
  
  return `${hours} Hours ${minutes} minutes`;
};

// Get display date from a date object or string
const getDisplayDate = (dateObj) => {
  if (typeof dateObj === 'string') {
    const [year, month, day] = dateObj.split('-').map(Number);
    dateObj = new Date(year, month - 1, day);
  }
  return formatDate(dateObj);
};

// Calculate first and last flights of a day
const getDayDutyTimes = (dayData) => {
  if (!dayData || !dayData.Flights || dayData.Flights.length === 0) {
    return { start: '', end: '' };
  }
  
  const firstFlight = dayData.Flights[0];
  const lastFlight = dayData.Flights[dayData.Flights.length - 1];
  
  // The check-in time of the first flight
  const startTime = firstFlight.CheckIn || firstFlight.DepTime;
  
  // If check-out time is available use it, otherwise use arrival time
  const endTime = lastFlight.CheckOut || lastFlight.ArrivalTime;
  
  return { start: startTime, end: endTime };
};

// Main App Component
const FlightCrewApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(3); // April (0-indexed)
  const [selectedDate, setSelectedDate] = useState(1); // Default to first day
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [dutyTimes, setDutyTimes] = useState({ start: '', end: '' });
  const [isDateSelected, setIsDateSelected] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Month names for display
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
  // Generate calendar days
  const calendarDays = generateCalendarData(selectedMonth);
  
  // Start animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  // Handle calendar date selection animation
  const dateSelectionAnim = useRef(new Animated.Value(1)).current;
  
  // Update selected day data when date changes
  useEffect(() => {
    // Look for the selected date in flight data
    const findSelectedDayData = () => {
      const dateStr = selectedDate < 10 ? `0${selectedDate}` : `${selectedDate}`;
      const monthStr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][selectedMonth];
      
      const dayData = FLIGHT_DATA.find(day => {
        return day.IndividualDay.includes(`${dateStr}${monthStr}`);
      });
      
      setSelectedDayData(dayData);
      
      // Update duty times based on the selected day data
      if (dayData) {
        const times = getDayDutyTimes(dayData);
        setDutyTimes(times);
        
        // Update display date based on selection
        if (isDateSelected) {
          const newDate = new Date(2025, selectedMonth, selectedDate);
          setDisplayDate(newDate);
        }
      }
    };
    
    findSelectedDayData();
    
    // Animate date selection
    Animated.sequence([
      Animated.timing(dateSelectionAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(dateSelectionAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, [selectedDate, selectedMonth, isDateSelected]);
  
  // Get the current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
      if (!isDateSelected) {
        setDisplayDate(new Date());
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [isDateSelected]);
  
  // Format date for display in header
  const formattedHeaderDate = formatDate(displayDate);
  
  // Handle day selection
  const handleDaySelect = (day) => {
    if (day.isCurrentMonth) {
      setSelectedDate(day.date);
      setIsDateSelected(true);
    }
  };
  
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#080808" />
      <View style={styles.container}>
        {/* Top Dark Section */}
        <View style={styles.topSection}>
          <SafeAreaView style={styles.topContent}>
            {/* Welcome Section now in the black area */}
            <Animated.View 
              style={[
                styles.welcomeSection,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
              <Text style={styles.welcomeTitle}>Hello, {USER_NAME}</Text>
              <Text style={styles.welcomeSubtitle}>What's on today's agenda?</Text>
            </Animated.View>
            
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.iconButton}>
                <BellIcon size={28} />
              </TouchableOpacity>
              <Animated.Text 
                style={[
                  styles.dateText,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: dateSelectionAnim }]
                  }
                ]}
              >
                {formattedHeaderDate}
              </Animated.Text>
              <TouchableOpacity style={styles.iconButton}>
                <UserIcon size={28} />
              </TouchableOpacity>
            </View>
            
            <Animated.View 
              style={[
                styles.timeContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: dateSelectionAnim }]
                }
              ]}
            >
              <Text style={styles.timeText}>{dutyTimes.start || '--:--'}</Text>
              <Text style={styles.timeSeparator}>•</Text>
              <Text style={styles.timeText}>{dutyTimes.end || '--:--'}</Text>
            </Animated.View>
          </SafeAreaView>
          <View style={styles.divider} />
        </View>

        {/* Main Content with Background */}
        <View style={styles.mainContent}>
          {/* Circular Arc Overlay */}
          <View style={styles.circleOverlay} />

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Calendar Section */}
            <Animated.View 
              style={[
                styles.calendarContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
              {/* Month Selector */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.monthsContainer}
              >
                {monthNames.map((month, index) => (
                  <TouchableOpacity 
                    key={month} 
                    style={[
                      styles.monthButton,
                      selectedMonth === index && styles.selectedMonthButton
                    ]}
                    onPress={() => setSelectedMonth(index)}
                  >
                    <Text 
                      style={[
                        styles.monthText,
                        selectedMonth === index && styles.selectedMonthText
                      ]}
                    >
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                {/* Day Headers */}
                <View style={styles.daysHeader}>
                  {dayNames.map((day) => (
                    <Text key={day} style={styles.dayHeaderText}>
                      {day}
                    </Text>
                  ))}
                </View>

                {/* Calendar Dates */}
                <View style={styles.datesGrid}>
                  {calendarDays.map((day, index) => {
                    const isCurrentMonth = day.isCurrentMonth;
                    const isSelected = isCurrentMonth && day.date === selectedDate && day.month === selectedMonth;
                    
                    // Determine flight status for visual indicators
                    const flightStatus = isCurrentMonth ? getFlightStatus(day.date, day.month) : 'none';
                    
                    return (
                      <TouchableOpacity
                        key={`${day.date}-${day.month}-${index}`}
                        style={[
                          styles.dateButton,
                          !isCurrentMonth && styles.otherMonthDate,
                          isSelected && styles.selectedDate,
                          !isSelected && flightStatus === 'multipleFlights' && styles.multipleFlightsDate,
                          !isSelected && flightStatus === 'singleFlight' && styles.singleFlightDate,
                          !isSelected && flightStatus === 'dayOff' && styles.dayOffDate,
                          !isSelected && flightStatus === 'workNoFlight' && styles.workNoFlightDate,
                        ]}
                        onPress={() => handleDaySelect(day)}
                        activeOpacity={isCurrentMonth ? 0.6 : 0.9}
                      >
                        <Text
                          style={[
                            styles.dateText,
                            !isCurrentMonth && styles.otherMonthDateText,
                            (isSelected || flightStatus !== 'none') && styles.specialDateText,
                            flightStatus === 'dayOff' && !isSelected && styles.dayOffDateText,
                          ]}
                        >
                          {day.date}
                        </Text>
                        
                        {/* Indicator dots for different flight statuses */}
                        {isCurrentMonth && flightStatus !== 'none' && !isSelected && (
                          <View style={[
                            styles.statusIndicator,
                            flightStatus === 'multipleFlights' && styles.multipleFlightsIndicator,
                            flightStatus === 'singleFlight' && styles.singleFlightIndicator,
                            flightStatus === 'dayOff' && styles.dayOffIndicator,
                            flightStatus === 'workNoFlight' && styles.workNoFlightIndicator,
                          ]} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                
                {/* Calendar Legend */}
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#4ECCA3' }]} />
                    <Text style={styles.legendText}>Single Flight</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#6A5ACD' }]} />
                    <Text style={styles.legendText}>Multiple</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
                    <Text style={styles.legendText}>Day Off</Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Today's Plan Section */}
            <Animated.View 
              style={[
                styles.todaysPlanSection,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planHeaderTitle}>Today's Plan</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>view all</Text>
                </TouchableOpacity>
              </View>

              {/* No flights message */}
              {(!selectedDayData || selectedDayData.Duty === 'Day Off') && (
                <Animated.View 
                  style={[
                    styles.noFlightsContainer,
                    {
                      transform: [{ scale: dateSelectionAnim }]
                    }
                  ]}
                >
                  <Text style={styles.noFlightsText}>
                    {selectedDayData?.Duty === 'Day Off' 
                      ? 'Day Off - Enjoy your rest!' 
                      : 'No flight information available for this date.'}
                  </Text>
                </Animated.View>
              )}

              {/* Flight Tickets */}
              {selectedDayData && selectedDayData.Flights && (
                <FlatList
                  data={selectedDayData.Flights}
                  keyExtractor={(item, index) => `flight-${item.Duty}-${index}`}
                  renderItem={({ item, index }) => {
                    const isConnectingFlight = index > 0;
                    const duration = calculateDuration(item.DepTime, item.ArrivalTime);
                    
                    return (
                      <Animated.View 
                        style={[
                          styles.flightTicket,
                          {
                            transform: [{ scale: dateSelectionAnim }]
                          }
                        ]}
                      >
                        {/* Origin */}
                        <View style={styles.flightRow}>
                          <View style={styles.flightLocation}>
                            <Text style={styles.locationCode}>
                              {item.Departure} {FLAGS[item.Departure] || '🏳️'}
                            </Text>
                            <Text style={styles.flightNumber}>{item.Duty}</Text>
                          </View>
                          <View style={styles.flightTime}>
                            <Text style={styles.timeValue}>{item.DepTime}</Text>
                          </View>
                        </View>

                        {/* Flight Progress */}
                        <View style={styles.flightProgressContainer}>
                          <View style={styles.flightProgressLine}>
                            <View style={styles.flightProgressDot} />
                            <View style={styles.flightProgressBar} />
                            <View style={styles.flightProgressDot} />
                          </View>
                          <Text style={styles.flightDuration}>{duration}</Text>
                        </View>

                        {/* Destination */}
                        <View style={styles.flightRow}>
                          <View style={styles.flightLocation}>
                            <Text style={styles.locationCode}>
                              {item.Arrival} {FLAGS[item.Arrival] || '🏳️'}
                            </Text>
                            <View style={styles.aircraftInfo}>
                              <Text style={styles.aircraftType}>{item.Aircraft}</Text>
                            </View>
                          </View>
                          <View style={styles.flightTime}>
                            <Text style={styles.timeValue}>{item.ArrivalTime}</Text>
                          </View>
                        </View>
                        
                        {/* Additional Flight Info */}
                        <View style={styles.flightAdditionalInfo}>
                          <Text style={styles.flightCrewInfo}>
                            <Text style={styles.flightCrewLabel}>Cockpit: </Text>
                            {item.Cockpit}
                          </Text>
                          <Text style={styles.flightCrewInfo}>
                            <Text style={styles.flightCrewLabel}>Cabin: </Text>
                            {item.Cabin}
                          </Text>
                        </View>
                      </Animated.View>
                    );
                  }}
                  ItemSeparatorComponent={() => <View style={styles.flightSeparator} />}
                  scrollEnabled={false}
                />
              )}
            </Animated.View>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  topSection: {
    backgroundColor: '#080808',
    paddingBottom: 10,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  topContent: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  welcomeSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dateText: {
    color: '#B6B4B4',
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '600',
  },
  timeSeparator: {
    color: '#FFFFFF',
    fontSize: 42,
    marginHorizontal: 15,
    opacity: 0.7,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 10,
  },
  mainContent: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
    backgroundColor: '#F8F7FA',
    overflow: 'hidden',
  },
  circleOverlay: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    backgroundColor: '#F8F7FA', // Light background color
    borderRadius: width * 1.5 / 2,
    top: -width * 1.3, // Position to create arc at top
    alignSelf: 'center',
  },
  scrollContent: {
    flex: 1,
    paddingTop: 20,
  },
  calendarContainer: {
    marginHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  monthsContainer: {
    paddingVertical: 5,
  },
  monthButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedMonthButton: {
    backgroundColor: '#1a237e',
  },
  monthText: {
    fontSize: 16,
    color: '#666',
  },
  selectedMonthText: {
    color: '#FFF',
    fontWeight: '500',
  },
  calendarGrid: {
    marginTop: 15,
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dayHeaderText: {
    color: '#888',
    fontSize: 14,
    width: 40,
    textAlign: 'center',
    fontWeight: '500',
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 5,
  },
  dateButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 20,
    position: 'relative',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  specialDateText: {
    color: '#FFF',
    fontWeight: '500',
  },
  otherMonthDate: {
    opacity: 0.4,
  },
  otherMonthDateText: {
    color: '#999',
  },
  selectedDate: {
    backgroundColor: '#1a237e',
    shadowColor: '#1a237e',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  multipleFlightsDate: {
    backgroundColor: 'rgba(106, 90, 205, 0.2)',
  },
  singleFlightDate: {
    backgroundColor: 'rgba(78, 204, 163, 0.2)',
  },
  dayOffDate: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  workNoFlightDate: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
  },
  dayOffDateText: {
    color: '#FF6B6B',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  multipleFlightsIndicator: {
    backgroundColor: '#6A5ACD',
  },
  singleFlightIndicator: {
    backgroundColor: '#4ECCA3',
  },
  dayOffIndicator: {
    backgroundColor: '#FF6B6B',
  },
  workNoFlightIndicator: {
    backgroundColor: '#FFC107',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  todaysPlanSection: {
    marginTop: 25,
    paddingHorizontal: 15,
    marginBottom: 40,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  planHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  viewAllText: {
    color: '#999',
    fontSize: 14,
  },
  flightTicket: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flightSeparator: {
    height: 15,
  },
  flightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flightLocation: {
    flex: 1,
  },
  locationCode: {
    fontSize: 22,
    fontWeight: '500',
    color: '#333',
  },
  flightNumber: {
    color: '#999',
    fontSize: 14,
    marginTop: 2,
  },
  flightTime: {
    alignItems: 'flex-end',
  },
  timeValue: {
    fontSize: 30,
    fontWeight: '700',
    color: '#333',
  },
  flightProgressContainer: {
    marginVertical: 15,
  },
  flightProgressLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  flightProgressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
  },
  flightProgressBar: {
    flex: 1,
    height: 2,
    backgroundColor: '#DDD',
    marginHorizontal: 5,
  },
  flightDuration: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
  aircraftInfo: {
    marginTop: 5,
  },
  aircraftType: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
  },
  flightAdditionalInfo: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  flightCrewInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  flightCrewLabel: {
    fontWeight: '500',
    color: '#333',
  },
  noFlightsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noFlightsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default FlightCrewApp;
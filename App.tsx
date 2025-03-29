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
  Easing,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';

// Import StayScreen component
import StayScreen from './StayScreen';

// Helper functions
const formatDate = (date) => {
  const options = { weekday: 'long', day: '2-digit', month: 'long' };
  return date.toLocaleDateString('en-US', options);
};

const formatTime = (timeString) => {
  if (!timeString) return null;
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

// Custom notification icon with proper size matching profile picture
const BellIcon = ({ size = 28 }) => {
  const bellSwing = useRef(new Animated.Value(0)).current;
  const circleSize = 40; // Match profile picture size
  
  useEffect(() => {
    const animateBell = () => {
      Animated.sequence([
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
        }),
        Animated.delay(5000)
      ]).start(animateBell);
    };
    
    animateBell();
  }, []);

  const rotation = bellSwing.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '-15deg', '0deg']
  });

  return (
    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
      <View style={{
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize/2,
        borderWidth: 0.8,
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Smaller bell with proper proportions */}
        <View style={{width: size, height: size, position: 'relative'}}>
          {/* Bell shape */}
          <View style={{
            width: size*0.65,
            height: size*0.65,
            borderWidth: 1.2,
            borderColor: '#FFFFFF',
            borderTopLeftRadius: size*0.325,
            borderTopRightRadius: size*0.325,
            borderBottomLeftRadius: size*0.1,
            borderBottomRightRadius: size*0.1,
            position: 'absolute',
            top: size*0.15,
            left: size*0.175
          }} />
          
          {/* Bell handle */}
          <View style={{
            width: size*0.25,
            height: size*0.15,
            borderWidth: 1.2,
            borderColor: '#FFFFFF',
            borderRadius: size*0.15,
            position: 'absolute',
            top: size*0.05,
            left: size*0.375
          }} />
          
          {/* Bell clapper */}
          <View style={{
            width: size*0.08,
            height: size*0.08,
            backgroundColor: '#FFFFFF',
            borderRadius: size*0.04,
            position: 'absolute',
            bottom: size*0.1,
            left: size*0.46
          }} />
        </View>
      </View>
    </Animated.View>
  );
};

// User profile image with subtle white border
const ProfileImage = ({ size = 40 }) => {
  return (
    <View style={{
      width: size + 4,
      height: size + 4,
      borderRadius: (size + 4) / 2,
      backgroundColor: '#FFFFFF', // Solid white border
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#FFFFFF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    }}>
      <View style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
      }}>
        {/* You need to add ProfilePicture1.jpg to your assets folder */}
        <Image 
          source={require('./assets/ProfilePicture1.jpg')} 
          style={{
            width: size,
            height: size,
            resizeMode: 'cover'
          }}
        />
      </View>
    </View>
  );
};

// Arrow Icon component
const ArrowIcon = ({ expanded, size = 24 }) => {
  return (
    <View style={{ 
      width: size, 
      height: size, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.05)',
      borderRadius: size/2,
      padding: 5,
      transform: [{ rotate: expanded ? '180deg' : '0deg' }]
    }}>
      <View style={{
        width: 0,
        height: 0,
        borderLeftWidth: size/4,
        borderRightWidth: size/4,
        borderTopWidth: size/4,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#666',
      }} />
    </View>
  );
};

// Generate accurate calendar data
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
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({
      date: daysInPrevMonth - firstDayOfWeek + i + 1,
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

// Get current week from calendar data based on the selected date
const getCurrentWeekDays = (calendarDays, selectedDate) => {
  // Find the index of the selected date in the calendar days
  const selectedIndex = calendarDays.findIndex(
    day => day.isCurrentMonth && day.date === selectedDate
  );
  
  if (selectedIndex === -1) return calendarDays.slice(0, 7);
  
  // Find the start of the week containing the selected date
  const startOfWeekIndex = selectedIndex - (selectedIndex % 7);
  
  // Return the week containing the selected date
  return calendarDays.slice(startOfWeekIndex, startOfWeekIndex + 7);
};

// Check if a date has flight data
const hasFlightData = (date, month, flightData) => {
  // Return early if flightData is not valid
  if (!flightData || !Array.isArray(flightData) || flightData.length === 0) {
    return null;
  }
  
  try {
    // Convert month index (0-based) to month name abbreviated
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthStr = months[month];
    
    // Format date with leading zero if needed
    const dateStr = date < 10 ? `0${date}` : `${date}`;
    
    // Look for this date in flightData
    return flightData.find(day => {
      // Some date formats in your data: "Mon, 01Apr"
      return day && day.IndividualDay && day.IndividualDay.includes(`${dateStr}${monthStr}`);
    });
  } catch (err) {
    console.error('Error in hasFlightData:', err);
    return null;
  }
};

// Get flight status for a date (multiple flights, single flight, day off, etc.)
const getFlightStatus = (date, month, flightData) => {
  try {
    // Return safe default if flightData is not valid
    if (!flightData || !Array.isArray(flightData)) {
      return 'none';
    }
    
    const dayData = hasFlightData(date, month, flightData);
    
    if (!dayData) return 'none';
    
    if (dayData.Duty === 'Day Off') return 'dayOff';
    
    if (dayData.Flights && Array.isArray(dayData.Flights)) {
      return dayData.Flights.length > 1 ? 'multipleFlights' : 'singleFlight';
    }
    
    return 'workNoFlight';
  } catch (err) {
    console.error('Error in getFlightStatus:', err);
    return 'none';
  }
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

// Crew member stacked images component
const CrewImages = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.crewImagesContainer} onPress={onPress}>
      <View style={styles.crewStackedImages}>
        {/* Use colored circles instead of images to avoid requiring files */}
        <View style={[styles.crewImage, { right: 0, backgroundColor: '#4285F4' }]} />
        <View style={[styles.crewImage, { right: 20, backgroundColor: '#EA4335' }]} />
        <View style={[styles.crewImage, { right: 40, backgroundColor: '#FBBC05' }]} />
      </View>
      <View style={styles.expandIconContainer}>
        <Text style={styles.expandIcon}>ⓘ</Text>
      </View>
    </TouchableOpacity>
  );
};

// Flight card component
const FlightCard = ({ item, index, dateSelectionAnim }) => {
  const duration = calculateDuration(item.DepTime, item.ArrivalTime);
  const [showCrewDetails, setShowCrewDetails] = useState(false);
  
  // Animation for entry
  const entryAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(entryAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 150, // Stagger animation
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleCrewDetails = () => {
    setShowCrewDetails(!showCrewDetails);
  };
  
  return (
    <Animated.View 
      style={[
        styles.flightTicket,
        {
          opacity: entryAnim,
          transform: [
            { scale: Animated.multiply(dateSelectionAnim, entryAnim) },
            { translateY: entryAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            }) }
          ]
        }
      ]}
    >
      {/* New flight card layout matching the screenshot */}
      <View style={styles.flightCardHeader}>
        <View style={styles.flightOriginDestination}>
          {/* Origin */}
          <View style={styles.flightEndpoint}>
            <Text style={styles.locationName}>
              {item.Departure} {FLAGS[item.Departure] || '🏳️'}
            </Text>
            <Text style={styles.flightTime}>{item.DepTime}</Text>
          </View>
          
          {/* Flight number in center */}
          <View style={styles.flightNumberContainer}>
            <Text style={styles.flightNumberText}>{item.Duty}</Text>
          </View>
          
          {/* Destination */}
          <View style={styles.flightEndpoint}>
            <Text style={styles.locationName}>
              {item.Arrival} {FLAGS[item.Arrival] || '🏳️'}
            </Text>
            <Text style={styles.flightTime}>{item.ArrivalTime}</Text>
          </View>
        </View>
      </View>
      
      {/* Flight Progress */}
      <View style={styles.flightProgressContainer}>
        <View style={styles.flightProgressLine}>
          <View style={styles.flightProgressDot} />
          <View style={styles.flightProgressBar}>
            <Text style={{ fontSize: 20 }}>✈️</Text>
          </View>
          <View style={styles.flightProgressDot} />
        </View>
        <Text style={styles.flightDuration}>{duration}</Text>
      </View>
      
      {/* Bottom section with aircraft and crew */}
      <View style={styles.flightCardFooter}>
        <View style={styles.aircraftContainer}>
          <Text style={styles.aircraftLabel}>A/C</Text>
          <Text style={styles.aircraftType}>{item.Aircraft}</Text>
        </View>
        
        <CrewImages onPress={toggleCrewDetails} />
      </View>
      
      {/* Expandable Crew Details */}
      {showCrewDetails && (
        <View style={styles.crewDetailsContainer}>
          <View style={styles.crewSection}>
            <Text style={styles.crewSectionTitle}>Cockpit:</Text>
            <Text style={styles.crewMembers}>{item.Cockpit}</Text>
          </View>
          <View style={styles.crewDivider} />
          <View style={styles.crewSection}>
            <Text style={styles.crewSectionTitle}>Cabin:</Text>
            <Text style={styles.crewMembers}>{item.Cabin}</Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
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
  const [calendarExpanded, setCalendarExpanded] = useState(true); // State for expanded/collapsed calendar
  
  // New state for API data - initialize with empty array
  const [flightData, setFlightData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  

  
  // Animation values
  const dateSelectionAnim = useRef(new Animated.Value(1)).current;
  const calendarHeightAnim = useRef(new Animated.Value(1)).current;
  
  // ScrollView ref to enable programmatic scrolling
  const scrollViewRef = useRef(null);
  
  // Month names for display
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
  // Calculate dimensions for the screen and components
  const { width, height } = Dimensions.get('window');
  
  // Fetch flight data from the API
  const fetchFlightData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching data from API...');
      const response = await fetch('https://crewshift.virtuslabs.lol/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user123'
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Extract the schedule array from the response object
      if (typeof data === 'object' && data !== null && Array.isArray(data.schedule)) {
        // The API returns an object with a schedule property containing the array we want
        console.log('Found schedule array in API response with', data.schedule.length, 'items');
        setFlightData(data.schedule);
      } else if (Array.isArray(data)) {
        // The API directly returns an array
        console.log('API returned array directly with', data.length, 'items');
        setFlightData(data);
      } else {
        throw new Error('Invalid data format from API');
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch flight data:', err);
      setError(err.message || 'Failed to fetch flight data');
      
      // Alert the user about the error
      Alert.alert(
        'Error',
        'Failed to load schedule data. Please try again later.',
        [{ text: 'OK' }]
      );
      
      // Set empty array on error
      setFlightData([]);
      setIsLoading(false);
    }
  };
  
  // Generate calendar days
  const calendarDays = generateCalendarData(selectedMonth);
  
  // Get current week days for collapsed view
  const currentWeekDays = getCurrentWeekDays(calendarDays, selectedDate);
  
  // Month selector scroll ref
  const monthScrollRef = useRef(null);
  
  // Fetch data when component mounts or when selected month changes
  useEffect(() => {
    try {
      fetchFlightData();
    } catch (err) {
      console.error('Error in fetchFlightData effect:', err);
      setIsLoading(false);
      setError('Failed to initiate data fetch');
      
      // Initialize with empty array
      setFlightData([]);
    }
  }, [selectedMonth]);
  
  // Load the calendar state - default to expanded
  useEffect(() => {
    // Set initial state to expanded
    setCalendarExpanded(true);
    calendarHeightAnim.setValue(1);
    
    // Scroll to selected month with less aggressive scrolling
    setTimeout(() => {
      if (monthScrollRef.current) {
        const monthItemWidth = 100;
        const offset = width / 2 - 50;
        const position = Math.max(0, (selectedMonth * monthItemWidth) - offset);
        monthScrollRef.current.scrollTo({ x: position, animated: true });
      }
    }, 300);
  }, []);
  
  // Handle expand/collapse state changes
  useEffect(() => {
    // Animate the calendar height change with ultra-smooth animation
    Animated.spring(calendarHeightAnim, {
      toValue: calendarExpanded ? 1 : 0,
      friction: 9,
      tension: 38,
      useNativeDriver: false, // Can't use native driver for height animations
    }).start();
  }, [calendarExpanded]);
  
  // Update selected day data when date changes
  useEffect(() => {
    // Look for the selected date in flight data
    const findSelectedDayData = () => {
      // Ensure flightData is an array before trying to use it
      if (isLoading || error || !flightData || !Array.isArray(flightData) || flightData.length === 0) {
        setSelectedDayData(null);
        return;
      }
      
      const dateStr = selectedDate < 10 ? `0${selectedDate}` : `${selectedDate}`;
      const monthStr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][selectedMonth];
      
      try {
        const dayData = flightData.find(day => {
          return day && day.IndividualDay && day.IndividualDay.includes(`${dateStr}${monthStr}`);
        });
        
        setSelectedDayData(dayData || null);
        
        // Update duty times based on the selected day data
        if (dayData) {
          const times = getDayDutyTimes(dayData);
          setDutyTimes(times);
          
          // Update display date based on selection
          if (isDateSelected) {
            const newDate = new Date(2025, selectedMonth, selectedDate);
            setDisplayDate(newDate);
          }
        } else {
          setDutyTimes({ start: '', end: '' });
        }
      } catch (err) {
        console.error('Error processing flight data:', err);
        setSelectedDayData(null);
        setDutyTimes({ start: '', end: '' });
      }
    };
    
    findSelectedDayData();
    
    // Subtle animation for date selection with practical purpose
    Animated.sequence([
      Animated.timing(dateSelectionAnim, {
        toValue: 0.95,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(dateSelectionAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, [selectedDate, selectedMonth, isDateSelected, flightData, isLoading, error]);
  
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
      
      // Subtle scroll to flights section for better UX
      if (scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current.scrollTo({ 
            y: 450, 
            animated: true 
          });
        }, 300);
      }
    }
  };
  
  // Toggle calendar expanded/collapsed state with delay
  const toggleCalendarExpanded = () => {
    // Add a subtle press animation
    Animated.sequence([
      Animated.timing(dateSelectionAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(dateSelectionAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
    
    // Add a slight delay before changing the state
    setTimeout(() => {
      setCalendarExpanded(!calendarExpanded);
    }, 150); // Short delay for better user experience
  };
  
  // Calculate calendar height with even better collapsed height
  const calendarHeight = calendarHeightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [320, 650] // Further increased heights to prevent cutoff
  });
  
  // Calculate padding with significantly increased values for collapsed state
  const calendarPadding = calendarHeightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [250, 180] // Much more padding when collapsed, less when expanded
  });
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080808" />
      
      {/* Everything is in a ScrollView that scrolls entirely */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Top black section */}
        <View style={styles.topSection}>
          <SafeAreaView>
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.iconButton}>
                <BellIcon size={28} />
              </TouchableOpacity>
              <Text style={styles.dateText}>{formattedHeaderDate}</Text>
              <TouchableOpacity style={styles.iconButton}>
                <ProfileImage size={40} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{dutyTimes.start || '--:--'}</Text>
              <Text style={styles.timeSeparator}>•</Text>
              <Text style={styles.timeText}>{dutyTimes.end || '--:--'}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Hello, {USER_NAME}</Text>
              <Text style={styles.welcomeSubtitle}>What's on today's agenda?</Text>
            </View>
          </SafeAreaView>
        </View>
        
        {/* Calendar section with black background - Height animates based on expanded state */}
        <Animated.View style={[
          styles.calendarSection,
          { 
            height: calendarHeight, 
            paddingBottom: calendarPadding,
            marginBottom: calendarExpanded ? 0 : 40, // Extra margin when collapsed
          }
        ]}>
          {/* Light oval positioned in the black background */}
          <View style={[styles.lightOval, {
            width: width * 1.5, 
            height: width * 1.5,
            borderRadius: width * 0.75,
            top: 250, // Fixed position from the top for better placement
          }]} />
          
          {/* Calendar Card positioned on top */}
          <View style={styles.calendarContainer}>
            {/* Month Selector and Expand/Collapse Toggle */}
            <View style={styles.calendarHeader}>
              <ScrollView 
                ref={monthScrollRef}
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.monthsContainer}
              >
                {monthNames.map((month, index) => {
                  const isSelected = selectedMonth === index;
                  
                  return (
                    <TouchableOpacity 
                      key={month} 
                      style={[
                        styles.monthButton,
                        isSelected && styles.selectedMonthButton
                      ]}
                      onPress={() => setSelectedMonth(index)}
                    >
                      <Text 
                        style={[
                          styles.monthText,
                          isSelected && styles.selectedMonthText
                        ]}
                      >
                        {month}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              
              {/* Toggle button for expand/collapse - icon only */}
              <TouchableOpacity 
                style={styles.expandToggleButton}
                onPress={toggleCalendarExpanded}
              >
                <ArrowIcon expanded={calendarExpanded} size={24} />
              </TouchableOpacity>
            </View>

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

              {/* Calendar Dates Grid - Shows either the current week or full month */}
              <View style={styles.datesGrid}>
                {(calendarExpanded ? calendarDays : currentWeekDays).map((day, index) => {
                  try {
                    const isCurrentMonth = day.isCurrentMonth;
                    const isSelected = isCurrentMonth && day.date === selectedDate && day.month === selectedMonth;
                    
                    // Determine flight status for visual indicators with fallback to 'none'
                    let flightStatus = 'none';
                    if (isCurrentMonth && Array.isArray(flightData)) {
                      flightStatus = getFlightStatus(day.date, day.month, flightData);
                    }
                    
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
                        activeOpacity={isCurrentMonth ? 0.7 : 0.9}
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
                  } catch (err) {
                    console.error('Error rendering calendar day:', err);
                    return (
                      <TouchableOpacity
                        key={`error-${index}`}
                        style={[styles.dateButton, styles.otherMonthDate]}
                        onPress={() => {}}
                      >
                        <Text style={[styles.dateText, styles.otherMonthDateText]}>
                          {day?.date || '?'}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                })}
              </View>
              
              {/* Calendar Legend - Only visible in expanded mode */}
              {calendarExpanded && (
                <Animated.View 
                  style={[
                    styles.legendContainer,
                    { opacity: calendarHeightAnim }
                  ]}
                >
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
                </Animated.View>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Light background section for flights */}
        <View style={[
          styles.flightsSection,
          {
            marginTop: calendarExpanded ? -100 : -140, // More overlap when collapsed
          }
        ]}>
          {/* Today's Plan Section */}
          <View style={styles.todaysPlanSection}>
            <View style={styles.planHeader}>
              <Text style={styles.planHeaderTitle}>Today's Plan</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>view all</Text>
              </TouchableOpacity>
            </View>

            {/* Loading indicator */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1a237e" />
                <Text style={styles.loadingText}>Loading flight data...</Text>
              </View>
            )}

            {/* Error message */}
            {error && !isLoading && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load flight data.</Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={fetchFlightData}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* No flights message */}
            {!isLoading && !error && (!selectedDayData || selectedDayData.Duty === 'Day Off') && (
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
            {!isLoading && !error && selectedDayData && selectedDayData.Flights && (
              <FlatList
                data={selectedDayData.Flights}
                keyExtractor={(item, index) => `flight-${item.Duty}-${index}`}
                renderItem={({item, index}) => (
                  <FlightCard 
                    item={item} 
                    index={index} 
                    dateSelectionAnim={dateSelectionAnim}
                  />
                )}
                ItemSeparatorComponent={() => <View style={styles.flightSeparator} />}
                scrollEnabled={false}
              />
            )}
          </View>
          
          {/* Bottom spacer for better scrolling */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  scrollView: {
    flex: 1,
  },
  topSection: {
    backgroundColor: '#080808',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 15, // Added extra top padding
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30, // Increased top margin to shift everything down
    paddingVertical: 10, // Added vertical padding
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginTop: 15,
  },
  welcomeSection: {
    marginTop: 20,
    marginBottom: 30,
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
  // Calendar section with black background
  calendarSection: {
    position: 'relative',
    backgroundColor: '#080808',
    paddingHorizontal: 20,
    overflow: 'visible', // Changed from 'hidden' to prevent cutoff
    zIndex: 1,
  },
  // Light oval that creates the transition
  lightOval: {
    position: 'absolute',
    backgroundColor: '#F8F7FA',
    alignSelf: 'center',
    zIndex: 1,
  },
  // Calendar container positioned on top of background
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 20,
    zIndex: 10,
  },
  // Header row with month selector and expand/collapse toggle
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthsContainer: {
    paddingVertical: 5,
    flexGrow: 1,
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
  // Expand/collapse toggle button
  expandToggleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  calendarGrid: {
    marginTop: 15,
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    marginBottom: 8,
  },
  dayHeaderText: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
    width: (width - 40 - 30) / 7, // Full width minus padding divided by 7 days
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButton: {
    width: (width - 40 - 30) / 7, // Full width minus padding divided by 7 days
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
    justifyContent: 'space-evenly',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
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
  // Light background section for flights
  flightsSection: {
    backgroundColor: '#F8F7FA',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 5, // Ensure it stays on top
  },
  todaysPlanSection: {
    marginBottom: 20,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  planHeaderTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
  },
  viewAllText: {
    color: '#999',
    fontSize: 16,
  },
  flightTicket: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  flightCardHeader: {
    marginBottom: 15,
  },
  flightOriginDestination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  flightEndpoint: {
    alignItems: 'center',
    flex: 2,
  },
  locationName: {
    fontSize: 24,
    color: '#666',
    marginBottom: 5,
  },
  flightTime: {
    fontSize: 42,
    fontWeight: '700',
    color: '#000',
  },
  flightNumberContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 15,
  },
  flightNumberText: {
    fontSize: 18,
    color: '#999',
  },
  flightSeparator: {
    height: 15,
  },
  flightProgressContainer: {
    marginVertical: 20,
  },
  flightProgressLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  flightProgressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
  },
  flightProgressBar: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    marginHorizontal: 5,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  airplaneIcon: {
    width: 24,
    height: 24,
    position: 'absolute',
    top: -12,
    // No image required, rendered as text
  },
  flightDuration: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 10,
  },
  flightCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  aircraftContainer: {
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
  },
  aircraftLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  aircraftType: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  crewImagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crewStackedImages: {
    flexDirection: 'row',
    width: 80,
    height: 40,
    position: 'relative',
  },
  crewImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDD',
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  expandIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1a237e',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  expandIcon: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  crewDetailsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  crewSection: {
    marginBottom: 10,
  },
  crewSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  crewMembers: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  crewDivider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 10,
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
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 30,
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
    minHeight: 150,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
  },
  errorContainer: {
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
    minHeight: 120,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#1a237e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 100, // Increased for bottom tab bar
  },
});

export default FlightCrewApp;
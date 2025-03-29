import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  Platform
} from 'react-native';

const { width } = Dimensions.get('window');

// Hardcoded stay information
const STAY_INFO = {
  hotel: "Grand Sheraton Sofia",
  address: "5 Sveta Nedelya Square, 1000 Sofia, Bulgaria",
  mapUrl: "https://maps.google.com/?q=5+Sveta+Nedelya+Square+Sofia",
  checkIn: "14:00",
  checkOut: "12:00",
  roomNumber: "724",
  confirmationCode: "SH39275",
  amenities: [
    "Free Wi-Fi",
    "Breakfast included",
    "Fitness center",
    "Airport shuttle",
    "24h room service"
  ],
  contact: "+359 2 981 6541",
  distance: "1.2km from Sofia Airport (SOF)"
};

const StayScreen = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  const openMaps = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = '42.6954108,23.3212612'; // Sofia coordinates
    const label = encodeURIComponent(STAY_INFO.hotel);
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    
    Linking.openURL(url);
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hotel Header */}
      <View style={styles.hotelHeader}>
        <Text style={styles.hotelName}>{STAY_INFO.hotel}</Text>
        <Text style={styles.hotelAddress}>{STAY_INFO.address}</Text>
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={openMaps}
        >
          <Text style={styles.mapButtonText}>Open in Maps</Text>
        </TouchableOpacity>
      </View>
      
      {/* Image Gallery - Replace with colored boxes */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.galleryContainer}
      >
        <View style={[styles.galleryImage, {backgroundColor: '#4285F4'}]} />
        <View style={[styles.galleryImage, {backgroundColor: '#EA4335'}]} />
        <View style={[styles.galleryImage, {backgroundColor: '#FBBC05'}]} />
        <View style={[styles.galleryImage, {backgroundColor: '#34A853'}]} />
        <View style={[styles.galleryImage, {backgroundColor: '#8A2BE2'}]} />
      </ScrollView>
      
      {/* Stay Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Your Stay</Text>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Check-in</Text>
            <Text style={styles.detailValue}>{STAY_INFO.checkIn}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Check-out</Text>
            <Text style={styles.detailValue}>{STAY_INFO.checkOut}</Text>
          </View>
        </View>
        
        <View style={styles.roomDetails}>
          <Text style={styles.detailLabel}>Room Number</Text>
          <Text style={styles.roomNumber}>{STAY_INFO.roomNumber}</Text>
          <Text style={styles.confirmationCode}>
            Confirmation: {STAY_INFO.confirmationCode}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => toggleSection('amenities')}
        >
          <Text style={styles.sectionHeaderText}>Amenities</Text>
          <Text style={styles.expandIcon}>
            {expandedSection === 'amenities' ? '−' : '+'}
          </Text>
        </TouchableOpacity>
        
        {expandedSection === 'amenities' && (
          <View style={styles.amenitiesList}>
            {STAY_INFO.amenities.map((amenity, index) => (
              <Text key={index} style={styles.amenityItem}>• {amenity}</Text>
            ))}
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => toggleSection('contact')}
        >
          <Text style={styles.sectionHeaderText}>Contact & Location</Text>
          <Text style={styles.expandIcon}>
            {expandedSection === 'contact' ? '−' : '+'}
          </Text>
        </TouchableOpacity>
        
        {expandedSection === 'contact' && (
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>📞 {STAY_INFO.contact}</Text>
            <Text style={styles.contactItem}>✈️ {STAY_INFO.distance}</Text>
          </View>
        )}
      </View>
      
      {/* Map View Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Map View</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            Use actual MapView component in production
          </Text>
        </View>
      </View>
      
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FA',
  },
  hotelHeader: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  hotelName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  hotelAddress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  mapButton: {
    backgroundColor: '#1a237e',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  galleryContainer: {
    padding: 15,
  },
  galleryImage: {
    width: width * 0.7,
    height: 180,
    borderRadius: 15,
    marginRight: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    margin: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    paddingBottom: 10,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#EFEFEF',
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  roomDetails: {
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    marginBottom: 15,
  },
  roomNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a237e',
    marginVertical: 5,
  },
  confirmationCode: {
    fontSize: 14,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  expandIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
  amenitiesList: {
    paddingVertical: 10,
  },
  amenityItem: {
    fontSize: 15,
    color: '#666',
    paddingVertical: 5,
  },
  contactInfo: {
    paddingVertical: 10,
  },
  contactItem: {
    fontSize: 15,
    color: '#666',
    paddingVertical: 5,
  },
  mapContainer: {
    margin: 15,
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: '100%',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  bottomSpacer: {
    height: 80,
  },
});

export default StayScreen;

export default StayScreen;
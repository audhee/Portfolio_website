import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const DoctorHomeScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [processedReports, setProcessedReports] = useState([]);

  // Mock data for demo
  const mockReports = [
    {
      id: 1,
      patientName: 'John Doe',
      reportType: 'Blood Test',
      date: '2024-03-15',
      status: 'Analyzed',
      priority: 'Normal',
      diagnosis: 'All parameters within normal range',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      reportType: 'X-Ray',
      date: '2024-03-14',
      status: 'Analyzed',
      priority: 'Urgent',
      diagnosis: 'Possible fracture detected',
    },
    {
      id: 3,
      patientName: 'Mike Johnson',
      reportType: 'MRI Scan',
      date: '2024-03-13',
      status: 'Pending',
      priority: 'High',
      diagnosis: 'Analysis in progress',
    },
  ];

  useEffect(() => {
    loadUserData();
    setProcessedReports(mockReports);
  }, []);

  const loadUserData = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      setUserEmail(email || 'Doctor');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(['userToken', 'userRole', 'userName', 'userEmail']);
            // Navigate back to login
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (error) {
            console.error('Error during logout:', error);
          }
        },
      },
    ]
  );
};

  const getStatusColor = (status) => {
    switch (status) {
      case 'Analyzed':
        return '#4CAF50';
      case 'Pending':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return '#f44336';
      case 'High':
        return '#FF9800';
      case 'Normal':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  const stats = [
    {
      id: 1,
      title: 'Total Reports',
      value: '156',
      icon: 'document-text',
      color: '#2196F3',
      change: '+12',
    },
    {
      id: 2,
      title: 'Analyzed Today',
      value: '23',
      icon: 'checkmark-circle',
      color: '#4CAF50',
      change: '+5',
    },
    {
      id: 3,
      title: 'Pending Review',
      value: '8',
      icon: 'time',
      color: '#FF9800',
      change: '-2',
    },
  ];

  const renderReportItem = ({ item }) => (
    <TouchableOpacity style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View>
          <Text style={styles.patientName}>{item.patientName}</Text>
          <Text style={styles.reportType}>{item.reportType}</Text>
        </View>
        <View style={styles.reportMeta}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <Text style={styles.reportDate}>{item.date}</Text>
        </View>
      </View>
      
      <View style={styles.reportBody}>
        <Text style={styles.diagnosisLabel}>Diagnosis:</Text>
        <Text style={styles.diagnosisText}>{item.diagnosis}</Text>
      </View>
      
      <View style={styles.reportFooter}>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
          <Icon name="chevron-forward" size={16} color="#2196F3" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>Dr. {userEmail.split('@')[0]}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {stats.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
              <Icon name={stat.icon} size={20} color="#fff" />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statTitle}>{stat.title}</Text>
            <View style={styles.statChange}>
              <Text style={[
                styles.statChangeText,
                { color: stat.change.startsWith('+') ? '#4CAF50' : '#f44336' }
              ]}>
                {stat.change} today
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Recent Reports */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={processedReports}
          renderItem={renderReportItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionCard}>
            <Icon name="analytics" size={24} color="#2196F3" />
            <Text style={styles.quickActionText}>Analytics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <Icon name="people" size={24} color="#4CAF50" />
            <Text style={styles.quickActionText}>Patients</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <Icon name="settings" size={24} color="#FF9800" />
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <Icon name="help-circle" size={24} color="#9C27B0" />
            <Text style={styles.quickActionText}>Help</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  statChange: {
    marginTop: 2,
  },
  statChangeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  reportCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reportType: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  reportMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 5,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  reportDate: {
    fontSize: 12,
    color: '#666',
  },
  reportBody: {
    marginBottom: 15,
  },
  diagnosisLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  diagnosisText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
    marginRight: 5,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  quickActionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 0.48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontWeight: '600',
  } // <-- Missing closing braces here
}); // <-- And here

export default DoctorHomeScreen;

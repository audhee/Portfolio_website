import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

export default function PatientHomeScreen({ navigation }) {
  const [patientName, setPatientName] = useState('Patient');
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      if (name) {
        setPatientName(name);
      }
      
      // Load recent reports from storage
      const reports = await AsyncStorage.getItem('recentReports');
      if (reports) {
        setRecentReports(JSON.parse(reports));
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
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
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(['userToken', 'userRole', 'userName']);
            // Force app to re-check auth by clearing and restarting
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

  const QuickActionCard = ({ title, subtitle, iconName, onPress, color }) => (
    <TouchableOpacity style={[styles.actionCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.actionCardContent}>
        <View style={styles.actionIcon}>
          <Icon name={iconName} size={28} color={color} />
        </View>
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionSubtitle}>{subtitle}</Text>
        </View>
        <Icon name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  const RecentReportCard = ({ report }) => (
    <TouchableOpacity style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Icon name="document-text" size={20} color="#2196F3" />
        <Text style={styles.reportTitle}>{report.title}</Text>
      </View>
      <Text style={styles.reportDate}>{report.date}</Text>
      <Text style={styles.reportStatus}>{report.status}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.patientName}>{patientName}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="log-out-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Health Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Icon name="heart" size={24} color="#FF6B6B" />
          <Text style={styles.summaryTitle}>Health Summary</Text>
        </View>
        <Text style={styles.summaryText}>
          Your health is our priority. Upload reports and get instant AI-powered insights.
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <QuickActionCard
          title="Upload Report"
          subtitle="Get AI analysis of your medical reports"
          iconName="cloud-upload"
          color="#2196F3"
          onPress={() => navigation.navigate('Upload')}
        />
        
        <QuickActionCard
          title="Health Chatbot"
          subtitle="Ask questions about your health"
          iconName="chatbubble-ellipses"
          color="#4CAF50"
          onPress={() => navigation.navigate('Chat')}
        />
        
        <QuickActionCard
          title="Emergency Info"
          subtitle="Important emergency contacts"
          iconName="medical"
          color="#FF5722"
          onPress={() => Alert.alert('Emergency', 'Call 108 for medical emergency')}
        />
      </View>

      {/* Recent Reports */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Reports</Text>
        {recentReports.length > 0 ? (
          recentReports.map((report, index) => (
            <RecentReportCard key={index} report={report} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="document-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No reports uploaded yet</Text>
            <Text style={styles.emptySubtext}>Upload your first report to get started</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

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
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
  },
  actionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  reportDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  reportStatus: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
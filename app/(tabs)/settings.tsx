import React from 'react';
import {
  View, Text, TouchableOpacity, Alert,
  ScrollView, StatusBar, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  danger?: boolean;
}

function SettingRow({ icon, iconBg, iconColor, label, subtitle, onPress, showChevron = true, danger }: SettingRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 14,
        backgroundColor: 'white',
      }}
    >
      <View style={{
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center', marginRight: 14,
      }}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, color: danger ? '#ef4444' : '#1e293b', fontWeight: '500' }}>{label}</Text>
        {subtitle && <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>{subtitle}</Text>}
      </View>
      {showChevron && <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />}
    </TouchableOpacity>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text style={{
      fontSize: 12, fontWeight: '700', color: '#94a3b8',
      paddingHorizontal: 16, paddingTop: 20, paddingBottom: 6,
      textTransform: 'uppercase', letterSpacing: 0.8,
    }}>
      {title}
    </Text>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: '#f1f5f9', marginLeft: 66 }} />;
}

export default function Settings() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
  const avatarColor = user ? colors[user.name.charCodeAt(0) % colors.length] : '#3b82f6';

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <View style={{
        paddingHorizontal: 16, paddingVertical: 14,
        backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
      }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#1e293b' }}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Summary */}
        <TouchableOpacity
          onPress={() => router.push('/profile' as any)}
          style={{
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: 'white', margin: 12, borderRadius: 16, padding: 16,
            shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 }, elevation: 3,
          }}
        >
          <View style={{
            width: 56, height: 56, borderRadius: 28,
            backgroundColor: avatarColor, alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', marginRight: 14,
          }}>
            {user?.profilePicture
              ? <Image source={{ uri: user.profilePicture }} style={{ width: 56, height: 56 }} />
              : <Text style={{ color: 'white', fontSize: 22, fontWeight: '800' }}>{user?.name[0]?.toUpperCase()}</Text>
            }
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#1e293b' }}>{user?.name}</Text>
            <Text style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{user?.email}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
        </TouchableOpacity>

        {/* Account */}
        <SectionHeader title="Account" />
        <View style={{ backgroundColor: 'white', borderRadius: 16, marginHorizontal: 12, overflow: 'hidden' }}>
          <SettingRow
            icon="person-outline"
            iconBg="#eff6ff"
            iconColor="#3b82f6"
            label="Edit Profile"
            subtitle="Update your name, bio and photo"
            onPress={() => router.push('/profile' as any)}
          />
          <Divider />
          <SettingRow
            icon="lock-closed-outline"
            iconBg="#f0fdf4"
            iconColor="#22c55e"
            label="Change Password"
            subtitle="Update your password"
            onPress={() => router.push('/(auth)/forgot-password')}
          />
        </View>

        {/* App */}
        <SectionHeader title="App" />
        <View style={{ backgroundColor: 'white', borderRadius: 16, marginHorizontal: 12, overflow: 'hidden' }}>
          <SettingRow
            icon="notifications-outline"
            iconBg="#fff7ed"
            iconColor="#f59e0b"
            label="Notifications"
            subtitle="Manage notification preferences"
            onPress={() => Alert.alert('Coming soon', 'Notification settings coming soon.')}
          />
          <Divider />
          <SettingRow
            icon="shield-checkmark-outline"
            iconBg="#fdf4ff"
            iconColor="#a855f7"
            label="Privacy"
            subtitle="Control your privacy settings"
            onPress={() => Alert.alert('Coming soon', 'Privacy settings coming soon.')}
          />
        </View>

        {/* About */}
        <SectionHeader title="About" />
        <View style={{ backgroundColor: 'white', borderRadius: 16, marginHorizontal: 12, overflow: 'hidden' }}>
          <SettingRow
            icon="information-circle-outline"
            iconBg="#f0f9ff"
            iconColor="#0ea5e9"
            label="App Version"
            subtitle="1.0.0"
            onPress={() => {}}
            showChevron={false}
          />
        </View>

        {/* Logout */}
        <View style={{ backgroundColor: 'white', borderRadius: 16, marginHorizontal: 12, marginTop: 20, overflow: 'hidden' }}>
          <SettingRow
            icon="log-out-outline"
            iconBg="#fef2f2"
            iconColor="#ef4444"
            label="Logout"
            onPress={handleLogout}
            showChevron={false}
            danger
          />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

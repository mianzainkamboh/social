import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Image, Alert, ScrollView, ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../contexts/PostContext';

function timeAgo(timestamp: number) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { posts } = usePosts();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [saving, setSaving] = useState(false);

  const userPosts = posts.filter(p => p.userId === user?.id);

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
  const avatarColor = user ? colors[user.name.charCodeAt(0) % colors.length] : '#3b82f6';

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      await updateProfile({ profilePicture: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), bio: bio.trim() });
      setEditing(false);
    } catch {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 14,
        backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
      }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#1e293b' }}>Profile</Text>
        {!editing && (
          <TouchableOpacity
            onPress={() => setEditing(true)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <Ionicons name="pencil-outline" size={16} color="#3b82f6" />
            <Text style={{ color: '#3b82f6', fontWeight: '600', fontSize: 14 }}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={{
          backgroundColor: 'white', margin: 12, borderRadius: 20, padding: 20,
          alignItems: 'center',
          shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
          shadowOffset: { width: 0, height: 3 }, elevation: 3,
        }}>
          {/* Avatar */}
          <TouchableOpacity onPress={pickImage} style={{ marginBottom: 16 }}>
            <View style={{
              width: 90, height: 90, borderRadius: 45,
              backgroundColor: avatarColor, alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
              shadowColor: avatarColor, shadowOpacity: 0.4, shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 }, elevation: 6,
            }}>
              {user?.profilePicture
                ? <Image source={{ uri: user.profilePicture }} style={{ width: 90, height: 90 }} />
                : <Text style={{ color: 'white', fontSize: 36, fontWeight: '800' }}>{user?.name[0]?.toUpperCase()}</Text>
              }
            </View>
            <View style={{
              position: 'absolute', bottom: 0, right: 0,
              backgroundColor: '#3b82f6', borderRadius: 14, padding: 5,
              borderWidth: 2, borderColor: 'white',
            }}>
              <Ionicons name="camera" size={13} color="white" />
            </View>
          </TouchableOpacity>

          {editing ? (
            <View style={{ width: '100%' }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748b', marginBottom: 4 }}>Name</Text>
              <TextInput
                style={{
                  borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12,
                  paddingHorizontal: 14, paddingVertical: 11, fontSize: 15,
                  color: '#1e293b', backgroundColor: '#f8fafc', marginBottom: 12,
                }}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
              />
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748b', marginBottom: 4 }}>Bio</Text>
              <TextInput
                style={{
                  borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12,
                  paddingHorizontal: 14, paddingVertical: 11, fontSize: 15,
                  color: '#1e293b', backgroundColor: '#f8fafc', marginBottom: 16,
                  minHeight: 80, textAlignVertical: 'top',
                }}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell people about yourself..."
                multiline
              />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={{
                    flex: 1, borderWidth: 1.5, borderColor: '#e2e8f0',
                    borderRadius: 12, paddingVertical: 12, alignItems: 'center',
                  }}
                  onPress={() => { setName(user?.name ?? ''); setBio(user?.bio ?? ''); setEditing(false); }}
                >
                  <Text style={{ color: '#64748b', fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1, backgroundColor: '#3b82f6', borderRadius: 12,
                    paddingVertical: 12, alignItems: 'center',
                    shadowColor: '#3b82f6', shadowOpacity: 0.3, shadowRadius: 6,
                    shadowOffset: { width: 0, height: 3 }, elevation: 3,
                  }}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving
                    ? <ActivityIndicator color="white" size="small" />
                    : <Text style={{ color: 'white', fontWeight: '700' }}>Save Changes</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text style={{ fontSize: 22, fontWeight: '800', color: '#1e293b' }}>{user?.name}</Text>
              <Text style={{ fontSize: 13, color: '#94a3b8', marginTop: 3 }}>{user?.email}</Text>
              {user?.bio ? (
                <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 10, lineHeight: 20 }}>
                  {user.bio}
                </Text>
              ) : (
                <TouchableOpacity onPress={() => setEditing(true)} style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 13, color: '#94a3b8' }}>+ Add a bio</Text>
                </TouchableOpacity>
              )}

              {/* Stats */}
              <View style={{
                flexDirection: 'row', marginTop: 20, gap: 32,
                paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9', width: '100%',
                justifyContent: 'center',
              }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, fontWeight: '800', color: '#1e293b' }}>{userPosts.length}</Text>
                  <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Posts</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, fontWeight: '800', color: '#1e293b' }}>
                    {userPosts.reduce((acc, p) => acc + p.likes.length, 0)}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Likes</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, fontWeight: '800', color: '#1e293b' }}>
                    {userPosts.reduce((acc, p) => acc + p.comments.length, 0)}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Comments</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Posts Section */}
        <View style={{ paddingHorizontal: 12, paddingBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12 }}>My Posts</Text>

          {userPosts.length === 0 ? (
            <View style={{
              backgroundColor: 'white', borderRadius: 16, padding: 32,
              alignItems: 'center',
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 }, elevation: 2,
            }}>
              <Ionicons name="newspaper-outline" size={40} color="#cbd5e1" />
              <Text style={{ color: '#94a3b8', marginTop: 10, fontSize: 14 }}>No posts yet</Text>
            </View>
          ) : (
            userPosts.map(post => (
              <View key={post.id} style={{
                backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12,
                shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 }, elevation: 2,
              }}>
                <Text style={{ fontSize: 15, color: '#334155', lineHeight: 22 }}>{post.content}</Text>
                {post.image && (
                  <Image
                    source={{ uri: post.image }}
                    style={{ width: '100%', height: 160, borderRadius: 12, marginTop: 10 }}
                    resizeMode="cover"
                  />
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Ionicons name="heart" size={15} color="#ef4444" />
                    <Text style={{ color: '#94a3b8', fontSize: 13 }}>{post.likes.length}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Ionicons name="chatbubble-outline" size={14} color="#94a3b8" />
                    <Text style={{ color: '#94a3b8', fontSize: 13 }}>{post.comments.length}</Text>
                  </View>
                  <Text style={{ color: '#cbd5e1', fontSize: 12, marginLeft: 'auto' }}>{timeAgo(post.timestamp)}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

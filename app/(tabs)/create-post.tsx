import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Image, Alert, ScrollView, ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../contexts/PostContext';

function Avatar({ name, uri, size = 40 }: { name: string; uri?: string; size?: number }) {
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: color, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    }}>
      {uri
        ? <Image source={{ uri }} style={{ width: size, height: size }} />
        : <Text style={{ color: 'white', fontWeight: '700', fontSize: size * 0.4 }}>{name[0]?.toUpperCase()}</Text>
      }
    </View>
  );
}

export default function CreatePost() {
  const { createPost } = usePosts();
  const { user } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Empty post', 'Write something before posting.');
      return;
    }
    setLoading(true);
    try {
      await createPost(content.trim(), image);
      setContent('');
      setImage(undefined);
      router.replace('/(tabs)/home');
    } catch {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header bar with Cancel + Post buttons */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ paddingVertical: 6, paddingHorizontal: 4 }}
        >
          <Text style={{ color: '#64748b', fontSize: 16 }}>Cancel</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 17, fontWeight: '700', color: '#1e293b' }}>New Post</Text>

        {/* POST BUTTON — always visible, shows alert if empty */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: '#3b82f6',
            borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8,
            minWidth: 64, alignItems: 'center',
            shadowColor: '#3b82f6', shadowOpacity: 0.3,
            shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 3,
          }}
        >
          {loading
            ? <ActivityIndicator color="white" size="small" />
            : <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>Post</Text>
          }
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        {/* User row + text input */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
          {user && <Avatar name={user.name} uri={user.profilePicture} size={46} />}
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontWeight: '700', fontSize: 15, color: '#1e293b', marginBottom: 8 }}>
              {user?.name}
            </Text>
            <TextInput
              style={{
                fontSize: 16, color: '#334155', lineHeight: 24,
                minHeight: 120, textAlignVertical: 'top',
              }}
              placeholder="What's on your mind?"
              placeholderTextColor="#94a3b8"
              value={content}
              onChangeText={setContent}
              multiline
              autoFocus
            />
          </View>
        </View>

        {/* Image preview */}
        {image && (
          <View style={{ marginBottom: 16 }}>
            <Image
              source={{ uri: image }}
              style={{ width: '100%', height: 220, borderRadius: 16 }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setImage(undefined)}
              style={{
                position: 'absolute', top: 10, right: 10,
                backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 20, padding: 6,
              }}
            >
              <Ionicons name="close" size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Add photo toolbar */}
        <View style={{
          backgroundColor: 'white', borderRadius: 14, padding: 14,
          borderWidth: 1, borderColor: '#f1f5f9',
        }}>
          <Text style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Add to your post
          </Text>
          <TouchableOpacity
            onPress={pickImage}
            style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: '#eff6ff', borderRadius: 10,
              paddingHorizontal: 14, paddingVertical: 10,
              alignSelf: 'flex-start',
            }}
          >
            <Ionicons name="image-outline" size={20} color="#3b82f6" />
            <Text style={{ color: '#3b82f6', fontWeight: '600', fontSize: 14, marginLeft: 8 }}>
              {image ? 'Change Photo' : 'Add Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Character count */}
        <Text style={{
          textAlign: 'right',
          color: content.length > 450 ? '#ef4444' : '#94a3b8',
          fontSize: 12, marginTop: 10,
        }}>
          {content.length} / 500
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

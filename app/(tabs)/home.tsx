import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Image, TextInput, Modal, KeyboardAvoidingView,
  Platform, RefreshControl, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts, Post } from '../../contexts/PostContext';

function timeAgo(timestamp: number) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

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

export default function Home() {
  const { user } = useAuth();
  const { posts, likePost, addComment, refreshPosts } = usePosts();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [commentModal, setCommentModal] = useState<{ visible: boolean; postId: string }>({ visible: false, postId: '' });
  const [commentText, setCommentText] = useState('');

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPosts();
    setRefreshing(false);
  };

  const handleLike = (postId: string) => {
    if (!user) return;
    likePost(postId, user.id);
  };

  const handleComment = async () => {
    if (!user || !commentText.trim()) return;
    await addComment(commentModal.postId, user.id, user.name, commentText.trim());
    setCommentText('');
  };

  const closeModal = () => {
    setCommentModal({ visible: false, postId: '' });
    setCommentText('');
  };

  const activePost = posts.find(p => p.id === commentModal.postId);

  const renderPost = ({ item }: { item: Post }) => {
    const liked = user ? item.likes.includes(user.id) : false;
    return (
      <View style={{
        backgroundColor: 'white', marginHorizontal: 12, marginBottom: 12,
        borderRadius: 16, padding: 16,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 }, elevation: 2,
      }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Avatar name={item.userName} uri={item.userProfilePicture} size={44} />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={{ fontWeight: '700', fontSize: 15, color: '#1e293b' }}>{item.userName}</Text>
            <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>{timeAgo(item.timestamp)}</Text>
          </View>
        </View>

        {/* Content */}
        <Text style={{ fontSize: 15, color: '#334155', lineHeight: 22 }}>{item.content}</Text>

        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={{ width: '100%', height: 200, borderRadius: 12, marginTop: 10 }}
            resizeMode="cover"
          />
        )}

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: '#f1f5f9', marginTop: 12, marginBottom: 10 }} />

        {/* Action buttons */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => handleLike(item.id)}
            style={{ flexDirection: 'row', alignItems: 'center', marginRight: 24, paddingVertical: 4 }}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={22}
              color={liked ? '#ef4444' : '#94a3b8'}
            />
            <Text style={{ color: liked ? '#ef4444' : '#94a3b8', fontSize: 14, fontWeight: '600', marginLeft: 6 }}>
              {item.likes.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCommentModal({ visible: true, postId: item.id })}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#94a3b8" />
            <Text style={{ color: '#94a3b8', fontSize: 14, fontWeight: '600', marginLeft: 6 }}>
              {item.comments.length}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
      }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#3b82f6' }}>Social Connect</Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/create-post')}
          style={{
            backgroundColor: '#3b82f6', borderRadius: 20,
            paddingHorizontal: 14, paddingVertical: 7,
            flexDirection: 'row', alignItems: 'center',
          }}
        >
          <Ionicons name="add" size={18} color="white" />
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 13, marginLeft: 4 }}>Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 80 }}>
            <View style={{
              width: 80, height: 80, borderRadius: 40, backgroundColor: '#eff6ff',
              alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <Ionicons name="newspaper-outline" size={36} color="#93c5fd" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1e293b' }}>No posts yet</Text>
            <Text style={{ fontSize: 14, color: '#94a3b8', marginTop: 6, marginBottom: 20 }}>
              Be the first to share something!
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/create-post')}
              style={{
                backgroundColor: '#3b82f6', borderRadius: 12,
                paddingHorizontal: 24, paddingVertical: 12,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>Create First Post</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Comment Modal */}
      <Modal visible={commentModal.visible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }}
            activeOpacity={1}
            onPress={closeModal}
          />
          <View style={{
            backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24,
            padding: 20, maxHeight: '65%',
          }}>
            {/* Modal header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1e293b' }}>
                Comments ({activePost?.comments.length ?? 0})
              </Text>
              <TouchableOpacity onPress={closeModal} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={26} color="#cbd5e1" />
              </TouchableOpacity>
            </View>

            {/* Comments list */}
            <FlatList
              data={activePost?.comments ?? []}
              keyExtractor={c => c.id}
              style={{ maxHeight: 260 }}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', marginBottom: 14 }}>
                  <Avatar name={item.userName} size={34} />
                  <View style={{
                    marginLeft: 10, backgroundColor: '#f8fafc',
                    borderRadius: 12, padding: 10, flex: 1,
                  }}>
                    <Text style={{ fontWeight: '700', fontSize: 13, color: '#1e293b' }}>{item.userName}</Text>
                    <Text style={{ fontSize: 14, color: '#475569', marginTop: 2 }}>{item.content}</Text>
                    <Text style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{timeAgo(item.timestamp)}</Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <Text style={{ color: '#94a3b8', textAlign: 'center', paddingVertical: 24, fontSize: 14 }}>
                  No comments yet. Be the first!
                </Text>
              }
            />

            {/* Comment input */}
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 24,
              paddingLeft: 12, paddingRight: 6, paddingVertical: 6,
              marginTop: 12, backgroundColor: '#f8fafc',
            }}>
              {user && <Avatar name={user.name} uri={user.profilePicture} size={28} />}
              <TextInput
                style={{ flex: 1, fontSize: 14, color: '#1e293b', marginLeft: 10, paddingVertical: 4 }}
                placeholder="Write a comment..."
                placeholderTextColor="#94a3b8"
                value={commentText}
                onChangeText={setCommentText}
                returnKeyType="send"
                onSubmitEditing={handleComment}
              />
              <TouchableOpacity
                onPress={handleComment}
                disabled={!commentText.trim()}
                style={{
                  backgroundColor: commentText.trim() ? '#3b82f6' : '#e2e8f0',
                  borderRadius: 18, width: 36, height: 36,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Ionicons name="send" size={16} color={commentText.trim() ? 'white' : '#94a3b8'} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

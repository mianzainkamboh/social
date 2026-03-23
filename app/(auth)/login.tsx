import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      router.replace('/(tabs)/home');
    } catch {
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#f8fafc' }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        {/* Logo / Header */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{
            width: 72, height: 72, borderRadius: 20,
            backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, shadowColor: '#3b82f6', shadowOpacity: 0.4,
            shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 8,
          }}>
            <Ionicons name="people" size={36} color="white" />
          </View>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#1e293b' }}>Social Connect</Text>
          <Text style={{ fontSize: 15, color: '#64748b', marginTop: 4 }}>Welcome back</Text>
        </View>

        {/* Card */}
        <View style={{
          backgroundColor: 'white', borderRadius: 20, padding: 24,
          shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 16,
          shadowOffset: { width: 0, height: 4 }, elevation: 4,
        }}>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>Email</Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center',
                  borderWidth: 1.5, borderColor: touched.email && errors.email ? '#ef4444' : '#e2e8f0',
                  borderRadius: 12, paddingHorizontal: 14, marginBottom: 4, backgroundColor: '#f8fafc',
                }}>
                  <Ionicons name="mail-outline" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
                  <TextInput
                    style={{ flex: 1, paddingVertical: 13, fontSize: 15, color: '#1e293b' }}
                    placeholder="you@example.com"
                    placeholderTextColor="#94a3b8"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={{ color: '#ef4444', fontSize: 12, marginBottom: 10 }}>{errors.email}</Text>
                )}

                <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 8 }}>Password</Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center',
                  borderWidth: 1.5, borderColor: touched.password && errors.password ? '#ef4444' : '#e2e8f0',
                  borderRadius: 12, paddingHorizontal: 14, marginBottom: 4, backgroundColor: '#f8fafc',
                }}>
                  <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
                  <TextInput
                    style={{ flex: 1, paddingVertical: 13, fontSize: 15, color: '#1e293b' }}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(p => !p)}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#94a3b8" />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={{ color: '#ef4444', fontSize: 12, marginBottom: 4 }}>{errors.password}</Text>
                )}

                <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={{ alignSelf: 'flex-end', marginTop: 6, marginBottom: 20 }}>
                  <Text style={{ color: '#3b82f6', fontSize: 13, fontWeight: '600' }}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: loading ? '#93c5fd' : '#3b82f6',
                    borderRadius: 12, paddingVertical: 15, alignItems: 'center',
                    shadowColor: '#3b82f6', shadowOpacity: 0.35, shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 }, elevation: 4,
                  }}
                  onPress={() => handleSubmit()}
                  disabled={loading}
                >
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/signup')} style={{ marginTop: 24, alignItems: 'center' }}>
          <Text style={{ color: '#64748b', fontSize: 14 }}>
            Don't have an account?{' '}
            <Text style={{ color: '#3b82f6', fontWeight: '700' }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

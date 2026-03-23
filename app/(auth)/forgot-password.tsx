import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Ionicons } from '@expo/vector-icons';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (_values: { email: string }) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <View style={{
          width: 80, height: 80, borderRadius: 40, backgroundColor: '#dcfce7',
          alignItems: 'center', justifyContent: 'center', marginBottom: 20,
        }}>
          <Ionicons name="checkmark-circle" size={44} color="#22c55e" />
        </View>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#1e293b', marginBottom: 8 }}>Check your email</Text>
        <Text style={{ fontSize: 15, color: '#64748b', textAlign: 'center', marginBottom: 32 }}>
          We've sent a password reset link to your email address.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 14,
            paddingHorizontal: 40, shadowColor: '#3b82f6', shadowOpacity: 0.35,
            shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4,
          }}
          onPress={() => router.back()}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#f8fafc' }}
    >
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}
        >
          <Ionicons name="arrow-back" size={22} color="#3b82f6" />
          <Text style={{ color: '#3b82f6', fontSize: 15, marginLeft: 6, fontWeight: '600' }}>Back</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{
            width: 72, height: 72, borderRadius: 20, backgroundColor: '#eff6ff',
            alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <Ionicons name="key-outline" size={34} color="#3b82f6" />
          </View>
          <Text style={{ fontSize: 26, fontWeight: '800', color: '#1e293b' }}>Forgot Password?</Text>
          <Text style={{ fontSize: 14, color: '#64748b', marginTop: 6, textAlign: 'center' }}>
            Enter your email and we'll send you a reset link
          </Text>
        </View>

        <View style={{
          backgroundColor: 'white', borderRadius: 20, padding: 24,
          shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 16,
          shadowOffset: { width: 0, height: 4 }, elevation: 4,
        }}>
          <Formik
            initialValues={{ email: '' }}
            validationSchema={schema}
            onSubmit={handleReset}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>Email Address</Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center',
                  borderWidth: 1.5, borderColor: touched.email && errors.email ? '#ef4444' : '#e2e8f0',
                  borderRadius: 12, paddingHorizontal: 14, backgroundColor: '#f8fafc',
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
                  <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.email}</Text>
                )}

                <TouchableOpacity
                  style={{
                    backgroundColor: loading ? '#93c5fd' : '#3b82f6',
                    borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 20,
                    shadowColor: '#3b82f6', shadowOpacity: 0.35, shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 }, elevation: 4,
                  }}
                  onPress={() => handleSubmit()}
                  disabled={loading}
                >
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

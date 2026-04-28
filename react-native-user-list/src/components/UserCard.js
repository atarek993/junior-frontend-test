import { StyleSheet, Text, View } from 'react-native';

export default function UserCard({ user }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.info}>{user.email}</Text>
      <Text style={styles.address}>{user.address}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  info: {
    color: '#1f2937',
    marginBottom: 4,
  },
  address: {
    color: '#4b5563',
    lineHeight: 20,
  },
});

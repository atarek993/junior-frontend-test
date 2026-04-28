import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import UserCard from './src/components/UserCard';
import { fetchUsersPage, setSearchQuery } from './src/redux/usersSlice';

export default function App() {
  const dispatch = useDispatch();
  const { users, loading, error, hasMore, searchQuery, usingOfflineCache } = useSelector(
    (state) => state.users,
  );

  useEffect(() => {
    dispatch(fetchUsersPage());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) {
      return users;
    }
    return users.filter((user) => user.name.toLowerCase().includes(normalized));
  }, [users, searchQuery]);

  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator size="small" color="#2563eb" style={styles.loader} />;
    }

    if (!hasMore) {
      return <Text style={styles.footerText}>No more users to load.</Text>;
    }

    return (
      <Pressable style={styles.loadMoreButton} onPress={() => dispatch(fetchUsersPage())}>
        <Text style={styles.loadMoreText}>Load More</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>User Directory</Text>

      <TextInput
        placeholder="Search by name..."
        value={searchQuery}
        onChangeText={(text) => dispatch(setSearchQuery(text))}
        style={styles.searchInput}
      />

      {usingOfflineCache && (
        <Text style={styles.offlineText}>Offline mode: showing cached users.</Text>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <UserCard user={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? <Text style={styles.emptyText}>No users match your search.</Text> : null
        }
        ListFooterComponent={renderFooter}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={8}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: 118,
          offset: 118 * index,
          index,
        })}
      />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  offlineText: {
    color: '#92400e',
    marginBottom: 8,
    fontWeight: '600',
  },
  errorText: {
    color: '#b91c1c',
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 24,
  },
  loadMoreButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loadMoreText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  loader: {
    marginTop: 12,
  },
  footerText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 12,
  },
});

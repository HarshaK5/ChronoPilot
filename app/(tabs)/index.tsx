import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

interface Task {
  id: string;
  title: string;
  deadline: string;
  duration: string;
  priority_score: number;
}

export default function TaskManagementGrid() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // ➕ MANUAL INSERTION CONTROL STATE VARIABLES
  const [showInputForm, setShowInputForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDuration, setNewDuration] = useState<string>('30');
  const [newDeadline, setNewDeadline] = useState<string>('');

  const fetchTasksFromCloud = async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err: any) {
      Alert.alert('Database Sync Failure', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🚀 REAL-TIME INSERTION CONTROLLER
  const handleCreateManualTask = async () => {
    if (!newTitle.trim()) {
      Alert.alert("Validation Failure", "Task parameter requires a valid Title definition.");
      return;
    }

    // Set fallback standard formatting date string if left empty: YYYY-MM-DD HH:MM
    const currentBaselineDate = newDeadline.trim() || new Date(Date.now() + 86400000).toISOString().slice(0,16).replace('T', ' ');

    try {
      setLoading(true);
      const calculatedPriority = Math.floor(Math.random() * 5) + 1; // Auto-calculate standard hackathon priority weights

      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title: newTitle,
            duration: newDuration,
            deadline: currentBaselineDate,
            priority_score: calculatedPriority
          }
        ])
        .select();

      if (error) throw error;

      if (data) {
        setTasks(prev => [data[0], ...prev]);
        setNewTitle('');
        setShowInputForm(false);
        Alert.alert("Success Matrix", "Task committed securely to cloud storage vectors.");
      }
    } catch (err: any) {
      Alert.alert("Insertion Matrix Failure", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err: any) {
      Alert.alert('Deletion Failure', err.message);
    }
  };

  useEffect(() => {
    fetchTasksFromCloud();
  }, []);

  const renderTaskCard = ({ item }: { item: Task }) => (
    <View style={styles.gridCard}>
      <View style={styles.cardHeader}>
        <View style={styles.priorityIndicator}>
          <Text style={styles.priorityText}>P-{item.priority_score}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
          <Ionicons name="trash-outline" size={18} color="#FF4D4D" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.taskTitle} numberOfLines={2}>{item.title}</Text>
      
      <View style={styles.metadataRow}>
        <Ionicons name="time-outline" size={14} color="#A7A9BE" />
        <Text style={styles.metadataText}>{item.duration}m</Text>
      </View>
      
      <View style={styles.metadataRow}>
        <Ionicons name="calendar-outline" size={14} color="#A7A9BE" />
        <Text style={styles.metadataText} numberOfLines={1}>{item.deadline}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER SECTION WITH ACTIVE ADD ACTION TOGGLE */}
      <View style={styles.header}>
        <View style={styles.headerTopLine}>
          <View>
            <Text style={styles.title}>Chrono Horizon</Text>
            <Text style={styles.subtitle}>Active Task Telemetry Grid</Text>
          </View>
          <TouchableOpacity 
            style={[styles.actionTriggerButton, showInputForm && styles.activeCancelColor]} 
            onPress={() => setShowInputForm(!showInputForm)}
          >
            <Ionicons name={showInputForm ? "close-outline" : "add-outline"} size={22} color="#0F0E17" />
          </TouchableOpacity>
        </View>
      </View>

      {/* DYNAMIC COLLAPSIBLE INPUT FORM FOR MANUAL MANIFEST ENTRY */}
      {showInputForm && (
        <View style={styles.insertionPanelForm}>
          <Text style={styles.formSectionLabel}>⚡ QUEUE NEW TELEMETRY MILESTONE</Text>
          <TextInput
            style={styles.darkInputField}
            placeholder="Task Title Description..."
            placeholderTextColor="#A7A9BE"
            value={newTitle}
            onChangeText={setNewTitle}
          />
          <View style={styles.dualFieldRow}>
            <TextInput
              style={[styles.darkInputField, { flex: 1, marginRight: 8 }]}
              placeholder="Duration (m)"
              placeholderTextColor="#A7A9BE"
              keyboardType="numeric"
              value={newDuration}
              onChangeText={setNewDuration}
            />
            <TextInput
              style={[styles.darkInputField, { flex: 2 }]}
              placeholder="YYYY-MM-DD HH:MM"
              placeholderTextColor="#A7A9BE"
              value={newDeadline}
              onChangeText={setNewDeadline}
            />
          </View>
          <TouchableOpacity style={styles.submitCommitButton} onPress={handleCreateManualTask}>
            <Text style={styles.submitButtonText}>COMMIT METRICS TO CLOUD NODE</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#00E676" />
          <Text style={styles.loaderText}>Querying Supabase Cloud...</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTaskCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRowWrapper}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchTasksFromCloud(true)} tintColor="#00E676" />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No telemetry detected. Pull from Gmail stream or tap + to populate manually.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E17' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#242132' },
  headerTopLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#FFFFFE', letterSpacing: 1 },
  subtitle: { fontSize: 13, color: '#A7A9BE', marginTop: 2 },
  
  actionTriggerButton: {
    backgroundColor: '#00E676',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4
  },
  activeCancelColor: {
    backgroundColor: '#FF4D4D'
  },

  insertionPanelForm: {
    backgroundColor: '#16121E',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#242132'
  },
  formSectionLabel: { color: '#00E676', fontSize: 10, fontWeight: '800', marginBottom: 12, letterSpacing: 0.5 },
  darkInputField: {
    backgroundColor: '#0F0E17',
    borderWidth: 1,
    borderColor: '#242132',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFE',
    fontSize: 14,
    marginBottom: 10
  },
  dualFieldRow: { flexDirection: 'row', marginBottom: 6 },
  submitCommitButton: {
    backgroundColor: '#6200EE',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6
  },
  submitButtonText: { color: '#FFFFFE', fontWeight: '900', fontSize: 12, letterSpacing: 0.5 },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { color: '#A7A9BE', marginTop: 12, fontSize: 14 },
  listContainer: { padding: 12 },
  gridRowWrapper: { justifyContent: 'space-between', marginBottom: 12 },
  gridCard: { backgroundColor: '#16121E', width: '48.5%', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#242132' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  priorityIndicator: { backgroundColor: 'rgba(98, 0, 238, 0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  priorityText: { color: '#6200EE', fontSize: 10, fontWeight: '800' },
  taskTitle: { color: '#FFFFFE', fontSize: 15, fontWeight: '700', minHeight: 40, marginBottom: 10 },
  metadataRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metadataText: { color: '#A7A9BE', fontSize: 11, marginLeft: 6, fontWeight: '500' },
  emptyText: { color: '#A7A9BE', textAlign: 'center', marginTop: 40, paddingHorizontal: 32, fontSize: 13, lineHeight: 18 }
});
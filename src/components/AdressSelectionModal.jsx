import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Dimensions,
  Platform
} from 'react-native';
import Modal from "react-native-modal";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AddressSelectionModal = ({ 
  visible, 
  onClose, 
  data, 
  onSelect, 
  onAddNew 
}) => {
  
  // 1. Logic to handle and sort the full data you provided
  const sortedData = React.useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => (b.is_default === a.is_default ? 0 : b.is_default ? 1 : -1));
  }, [data]);

  const renderItem = ({ item }) => {
    const isSelected = item.is_default;
    
    // 2. Map labels to specific icons
    const getIconDetails = (label) => {
      const lowerLabel = label?.toLowerCase() || '';
      if (lowerLabel.includes('home')) return { name: 'home', color: '#FF6B00' };
      if (lowerLabel.includes('office') || lowerLabel.includes('work')) return { name: 'briefcase', color: '#FF6B00' };
      if (lowerLabel.includes('gym')) return { name: 'dumbbell', color: '#FF6B00' };
      return { name: 'map-marker', color: '#FF6B00' };
    };

    const icon = getIconDetails(item.label);

    return (
      <TouchableOpacity 
        activeOpacity={0.7}
        style={[styles.card, isSelected && styles.selectedCard]} 
        onPress={() => onSelect(item)}
      >
        {/* Icon Wing */}
        <View style={[styles.iconContainer, isSelected && styles.selectedIconBg]}>
          <MaterialCommunityIcons 
            name={icon.name} 
            size={24} 
            color={isSelected ? "#FFF" : icon.color} 
          />
        </View>

        {/* Text Content */}
        <View style={styles.info}>
          <View style={styles.headerRow}>
            <Text style={styles.label}>{item.label || "Saved Location"}</Text>
            {isSelected && (
              <View style={styles.activeBadge}>
                <Ionicons name="checkmark" size={12} color="#4CAF50" />
                <Text style={styles.activeText}>Active</Text>
              </View>
            )}
          </View>
          <Text style={styles.address} numberOfLines={2}>
            {item.address?.adress}
          </Text>
        </View>

        <Feather name="chevron-right" size={18} color="#DDD" />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      backdropOpacity={0.4}
      style={styles.modal}
      useNativeDriverForBackdrop
    >
      <View style={styles.container}>
        {/* Pull Bar */}
        <View style={styles.pullBar} />
        
        <View style={styles.header}>
          <Text style={styles.title}>Select Delivery Spot</Text>
          <Text style={styles.subtitle}>Where should we send your Tona order?</Text>
        </View>

        {/* Top "Add New" Action */}
        <TouchableOpacity style={styles.addNewAction} onPress={onAddNew}>
          <View style={styles.addIconCircle}>
            <Feather name="plus" size={20} color="#FF6B00" />
          </View>
          <Text style={styles.addNewText}>Pin a new location</Text>
        </TouchableOpacity>

        <FlatList
          data={sortedData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No saved locations found.</Text>
          }
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: '#FFF',
    height: SCREEN_HEIGHT * 0.75,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 20,
  },
  pullBar: {
    width: 45,
    height: 5,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  addNewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F4',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FF6B00',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  addIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFE8D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addNewText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF6B00',
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
    padding: 16,
    borderRadius: 22,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  selectedCard: {
    backgroundColor: '#F0FFF4',
    borderColor: '#C6F6D5',
    borderWidth: 1.5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedIconBg: {
    backgroundColor: '#4CAF50',
  },
  info: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 10,
    gap: 4,
  },
  activeText: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  address: {
    fontSize: 13,
    color: '#777',
    lineHeight: 18,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#BBB',
    fontSize: 16,
  }
});

export default AddressSelectionModal;
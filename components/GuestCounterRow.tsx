import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

const GuestCounterRow = ({ title, subtitle, count, onDecrement, onIncrement, decrementDisabled = false }: any) => {
  return (
    <View style={styles.rowContainer}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.counterContainer}>
        <TouchableOpacity
          onPress={onDecrement}
          disabled={decrementDisabled}
          style={[
            styles.decrementButton,
            decrementDisabled ? styles.decrementDisabled : styles.decrementActive
          ]}
        >
          <Text style={[styles.decrementText, decrementDisabled ? styles.decrementTextDisabled : styles.decrementTextActive]}>−</Text>
        </TouchableOpacity>

        <Text style={styles.countText}>{count}</Text>

        <TouchableOpacity
          onPress={onIncrement}
          style={styles.incrementButton}
        >
          <Text style={styles.incrementText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default GuestCounterRow;

const styles = StyleSheet.create({
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16, // py-4
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6', // gray-100
    },
    title: {
      fontSize: 18, // text-lg
      fontWeight: '500', // font-medium
      color: '#111827', // gray-900
    },
    subtitle: {
      fontSize: 14, // text-sm
      color: '#6b7280', // gray-500
    },
    counterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    decrementButton: {
      width: 32, // w-8
      height: 32, // h-8
      borderRadius: 9999, // rounded-full
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      marginRight: 8,
    },
    decrementActive: {
      borderColor: '#9ca3af', // gray-400
    },
    decrementDisabled: {
      borderColor: '#e5e7eb', // gray-200
    },
    decrementText: {
      fontSize: 20, // text-xl
      fontWeight: '500',
    },
    decrementTextActive: {
      color: '#4b5563', // gray-600
    },
    decrementTextDisabled: {
      color: '#e5e7eb', // gray-200
    },
    countText: {
      fontSize: 16, // text-base
      fontWeight: '500',
      color: '#111827', // gray-900
      width: 40, // w-10
      textAlign: 'center',
    },
    incrementButton: {
      width: 32, // w-8
      height: 32, // h-8
      borderRadius: 9999, // rounded-full
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2563eb', // blue-600
      marginLeft: 8,
    },
    incrementText: {
      fontSize: 20, // text-xl
      color: '#fff',
      fontWeight: '500',
    },
  });
  
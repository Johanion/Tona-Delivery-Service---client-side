import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ConfirmModal = ({
  visible,
  icon = "alert-circle",
  title,
  subtitle,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "Cancel",
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* Icon */}
          <View style={styles.iconBox}>
            <Ionicons name={icon} size={32} color="#FF6B00" />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF3E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },

  cancelBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    alignItems: "center",
  },

  confirmBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: "#FF6B00",
    borderRadius: 12,
    alignItems: "center",
  },

  cancelText: {
    color: "#333",
    fontWeight: "600",
  },

  confirmText: {
    color: "#fff",
    fontWeight: "700",
  },
});
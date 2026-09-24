import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const DeliveryPartnerInfo = ({ navigation }) => {
  const { theme } = useTheme();
  const [agreed, setAgreed] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={[styles.title, { color: theme.text }]}>Delivery Partner व्हा</Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>हे कसं काम करतं?</Text>
        <Text style={[styles.para, { color: theme.text }]}>
          • तुम्हाला जवळपासचे "out for delivery" झालेले orders दिसतील{'\n'}
          • तुम्ही आवडेल तो order स्वतःकडे accept करू शकता{'\n'}
          • customer कडे पोहोचवून "Delivered" mark करायचं{'\n'}
          • अर्ज सादर केल्यावर लगेच login करू शकता
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>अटी व शर्ती</Text>
        <Text style={[styles.para, { color: theme.text }]}>
          1. तुम्ही दिलेली माहिती (नाव, मोबाईल, वाहन क्रमांक) खरी असणं गरजेचं आहे{'\n'}
          2. Order accept केल्यावर तो वेळेत आणि सुरक्षित पद्धतीने पोहोचवण्याची जबाबदारी तुमची असेल{'\n'}
          3. Cash on Delivery order असेल तर रक्कम कंपनीकडे जमा करणं बंधनकारक आहे{'\n'}
          4. गैरवर्तन किंवा वारंवार order न पोहोचवल्यास account बंद केलं जाऊ शकतं{'\n'}
          5. M2 Store कधीही, कुठलंही कारण न देता partner account बंद करण्याचा अधिकार राखून ठेवते
        </Text>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAgreed(!agreed)}
        >
          <View style={[styles.checkbox, { borderColor: theme.primary }, agreed && { backgroundColor: theme.primary }]} />
          <Text style={{ color: theme.text, flex: 1 }}>
            मी वरील अटी व शर्ती वाचल्या आहेत आणि मान्य आहेत
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: agreed ? theme.primary : '#aaa' }]}
          disabled={!agreed}
          onPress={() => navigation.navigate('DeliveryPartnerRegister')}
        >
          <Text style={styles.continueBtnText}>पुढे जा — अर्ज भरा</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 12, marginBottom: 6 },
  para: { fontSize: 13, lineHeight: 20 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 10 },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderRadius: 4 },
  continueBtn: { marginTop: 20, padding: 14, borderRadius: 8, alignItems: 'center' },
  continueBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default DeliveryPartnerInfo;
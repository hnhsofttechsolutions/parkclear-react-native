import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import { AppBar } from '../components/ui/app-bar';
import AppText from '../components/ui/app-text';
import { FlutterStrings } from '../constants/flutterStrings';
import { RootState } from '../store/store';
import { Colors, Gradient } from '../utils/colors';

const MyProfileScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`;

  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.appBarPad}>
        <AppBar
          title={FlutterStrings.myProfile}
          onBack={() => navigation.goBack()}
        />
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/user.png')}
            style={styles.profileImage}
          />
        </View>
        <AppText style={styles.name}>{fullName || 'No Name'}</AppText>
        <AppText style={styles.email}>{user?.email || 'No Email'}</AppText>
        <View style={styles.card}>
          <ProfileRow label="First Name" value={user?.first_name} />
          <ProfileRow label="Last Name" value={user?.last_name} />
          <ProfileRow label="Email" value={user?.email} />
          <ProfileRow
            label="Status"
            value={user?.is_active ? 'Active' : 'Inactive'}
          />
        </View>
        <View style={styles.starRow}>
          <Image
            source={require('../assets/images/star.png')}
            style={{ width: 40, height: 40 }}
          />
          <LinearGradient
            colors={[...Gradient.colors]}
            style={styles.pointsCircle}
          >
            <AppText font="semiBold" size={26} color={Colors.white}>
              0
            </AppText>
          </LinearGradient>
        </View>

        <AppText style={styles.desc}>
          Earn star points by submitting signs to the community.
        </AppText>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const ProfileRow = ({ label, value }: any) => (
  <View style={styles.row}>
    <AppText style={styles.label}>{label}</AppText>
    <AppText style={styles.value}>{value || '-'}</AppText>
  </View>
);

export default MyProfileScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  appBarPad: { paddingHorizontal: 20 },
  body: { padding: 20, paddingBottom: 40, alignItems: 'center' },
  imageContainer: { marginTop: 10, marginBottom: 15 },
  profileImage: { width: 110, height: 110, borderRadius: 60 },
  name: { fontSize: 22, color: Colors.primary },
  email: { fontSize: 14, color: Colors.grey, marginBottom: 20 },
  card: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: { color: Colors.grey, fontSize: 14 },
  value: { fontSize: 14, color: Colors.black },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 10,
  },
  pointsCircle: {
    width: 72,
    height: 72,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: { color: Colors.grey, textAlign: 'center', paddingHorizontal: 20 },
});

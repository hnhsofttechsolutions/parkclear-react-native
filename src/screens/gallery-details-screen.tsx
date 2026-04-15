import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import AppText from '../components/ui/app-text';
import { Colors } from '../utils/colors';
import { AppBar } from '../components/ui/app-bar';

const GalleryDetailsScreen = ({ navigation, route }: any) => {
  const { imageUrl } = route.params;

  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.flex}>
        <View style={styles.padH}>
          <AppBar title=" " onBack={() => navigation.goBack()} />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
          <AppText size={14} color={Colors.grey} style={{ marginTop: 12, fontWeight: '400' }}>
            {imageUrl}
          </AppText>
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

export default GalleryDetailsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  flex: { flex: 1 },
  padH: { paddingHorizontal: 20 },
  content: { padding: 20, paddingBottom: 40 },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: Colors.lightGrey,
  },
});

import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import { AppBar } from '../components/ui/app-bar';
import { FlutterStrings } from '../constants/flutterStrings';
import { baseURL } from '../store/api/baseApi';
import { Colors } from '../utils/colors';
import { FontFamily } from '../utils/fonts';

const GalleryDetailsScreen = ({ navigation, route }: any) => {
  const { item } = route.params;

  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.flex}>
        <View style={styles.padH}>
          <AppBar
            title={FlutterStrings.gallery}
            onBack={() => navigation.goBack()}
          />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Image
            source={{ uri: `${baseURL}${item?.image}` }}
            style={styles.image}
            resizeMode="cover"
          />
          <Markdown style={markdownStyles}>{item?.summarize_message}</Markdown>
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

const markdownStyles = {
  body: {
    marginTop: 12,
    fontSize: 18,
    lineHeight: 26,
  },
  strong: {
    fontWeight: 'bold' as const,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 20,
    fontFamily: FontFamily.regular,
  },
  list_item: {
    marginTop: 4,
    marginBottom: 4,
  },
};

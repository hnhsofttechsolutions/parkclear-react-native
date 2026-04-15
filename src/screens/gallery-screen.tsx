import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import AppText from '../components/ui/app-text';
import { FlutterStrings } from '../constants/flutterStrings';
import { PATHS } from '../navigation/paths';
import { Colors } from '../utils/colors';
import { AppBar } from '../components/ui/app-bar';

const mockUrls = [
  'https://picsum.photos/id/101/400/400',
  'https://picsum.photos/id/102/400/400',
  'https://picsum.photos/id/103/400/400',
  'https://picsum.photos/id/104/400/400',
];

const GalleryScreen = ({ navigation }: any) => {
  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.flex}>
        <View style={styles.padH}>
          <AppBar
            title={FlutterStrings.gallery}
            onBack={() => navigation.goBack()}
          />
        </View>
        <FlatList
          data={mockUrls}
          keyExtractor={item => item}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.cell}
              onPress={() =>
                navigation.navigate(PATHS.GalleryDetails, { imageUrl: item })
              }
              activeOpacity={0.9}
            >
              <Image source={{ uri: item }} style={styles.thumb} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <AppText
              align="center"
              font="semiBold"
              size={22}
              color={Colors.primary}
            >
              No images uploaded
            </AppText>
          }
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default GalleryScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  flex: { flex: 1 },
  padH: { paddingHorizontal: 20 },
  grid: { padding: 20, paddingBottom: 40 },
  row: { gap: 10, marginBottom: 10 },
  cell: { flex: 1, aspectRatio: 1 },
  thumb: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: Colors.lightGrey,
    borderWidth: 1,
    borderColor: Colors.textFieldBorder,
  },
});

import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import { AppBar } from '../components/ui/app-bar';
import AppText from '../components/ui/app-text';
import { GradientButton } from '../components/ui/gradient-button';
import { FlutterStrings } from '../constants/flutterStrings';
import { PATHS } from '../navigation/paths';
import { baseURL } from '../store/api/baseApi';
import { useGetUploadImageQuery } from '../store/api/uploadApi';
import { Colors } from '../utils/colors';
const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 50) / 2;

const GalleryScreen = ({ navigation }: any) => {
  const { data, isLoading } = useGetUploadImageQuery();

  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.flex}>
        <View style={styles.padH}>
          <AppBar
            title={FlutterStrings.gallery}
            onBack={() => navigation.goBack()}
          />
        </View>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <AppText style={{ marginTop: 10 }} color={Colors.grey}>
              Loading Gallery...
            </AppText>
          </View>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={data?.data}
            keyExtractor={item => item?.id?.toString()}
            numColumns={2}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.cell}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate(PATHS.GalleryDetails, {
                    item: item,
                  })
                }
              >
                <FastImage
                  style={styles.thumb}
                  source={{
                    uri: `${baseURL}${item?.image}`,
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <AppText
                  align="center"
                  font="semiBold"
                  size={18}
                  color={Colors.primary}
                >
                  No images uploaded
                </AppText>
              </View>
            }
          />
        )}
        <View style={styles.bottomButtonWrap}>
          <GradientButton
            label="Add New Image"
            onPress={() => navigation.navigate(PATHS.Dashboard)}
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default GalleryScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  flex: { flex: 1 },
  padH: { paddingHorizontal: 20 },
  grid: { paddingHorizontal: 20, paddingVertical: 10, paddingBottom: 20 },
  row: { justifyContent: 'flex-start', gap: 10, marginBottom: 10 },
  cell: { width: COLUMN_WIDTH, height: COLUMN_WIDTH },
  thumb: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: Colors.lightGrey,
    borderWidth: 1,
    borderColor: Colors.textFieldBorder,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  bottomButtonWrap: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: Colors.white,
  },
});

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getDetailRoom } from '@/apis/apiRoom';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');
// Chia thành 3 cột, mỗi cột rộng 1/3 màn hình - 10px khoảng cách
const GRID_ITEM_SIZE = (width / 3) - 10; 

// DỮ LIỆU ẢNH THỰC TẾ 
const REAL_PHOTO_DATA = [
    { id: 1, uri: 'https://i.pinimg.com/1200x/28/af/b1/28afb1f24d9f50182b17d592e25f72bd.jpg' }, 
    { id: 2, uri: 'https://i.pinimg.com/1200x/86/80/67/868067215bbf2ab926c124186057c2e1.jpg' }, 
    { id: 3, uri: 'https://i.pinimg.com/1200x/97/77/2e/97772ec0cfe47dae97efbda44f4d34ca.jpg' }, 
    { id: 4, uri: 'https://i.pinimg.com/736x/0a/a3/92/0aa392aad197c9187dc7ef303766fb7d.jpg' }, 
    { id: 5, uri: 'https://i.pinimg.com/736x/5a/ab/0b/5aab0b67ce1d0fe167babcb58d88c720.jpg' }, 
    { id: 6, uri: 'https://i.pinimg.com/1200x/aa/6c/96/aa6c96b4dfa2b7d398951429d0676fd8.jpg' }, 
    // Thêm các placeholder còn lại để duy trì tổng số lượng
    ...Array.from({ length: 13 }).map((_, i) => ({
        id: i + 7,
        uri: `https://via.placeholder.com/${Math.floor(GRID_ITEM_SIZE)}x${Math.floor(GRID_ITEM_SIZE)}?text=Extra+Photo+${i + 7}`,
    })),
];


export default function PhotosScreen() {
  const { id } = useLocalSearchParams();
  const [detailRoom, setDetailRoom] = useState<any>({});
  const router = useRouter();

  const getDetail = async () => {
    try {
      const response = await getDetailRoom(Number(id));
      setDetailRoom(response);
    } catch (error) {
      console.log(error);
    } 
  };

  useEffect(() => {
    getDetail();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" /> 

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{REAL_PHOTO_DATA.length} Photos</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.galleryContainer}
        data={detailRoom.images}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}: {item: any}) => <TouchableOpacity onPress={()=> router.push({
          pathname: "/client/room/detailPhoto",
          params: {
            roomId: id,
            imageId: item.id
          }
        })}
         style={styles.imageWrapper}>
        <Image 
          source={{ uri: item.imageURL }} 
          style={styles.image} 
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
      </TouchableOpacity>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    paddingRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  // Gallery Grid
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 2, // Padding nhỏ cho mép ngoài
  },
  imageWrapper: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    margin: 4, // Khoảng cách giữa các ảnh
    overflow: 'hidden',
    borderRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
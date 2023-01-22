import * as React from 'react';
import { Image, View } from 'react-native';

interface Props {
  imageUrl: string;
  size: number;
}

function DrawerTopAvatar({ size, imageUrl }: Props) {
  return (
    <View style={{ borderRadius: size / 2, overflow: 'hidden' }}>
      <Image
        style={{ width: size, height: size, borderRadius: size / 2 }}
        source={{ uri: imageUrl }}
      />
    </View>
  );
}

export default DrawerTopAvatar;

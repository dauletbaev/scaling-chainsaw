import { Appearance, ColorSchemeName, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const PROFILE_PLACEHOLDER =
  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=256';

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  isLargeDevice: width >= 768,
  colorScheme: Appearance.getColorScheme() as NonNullable<ColorSchemeName>,
};

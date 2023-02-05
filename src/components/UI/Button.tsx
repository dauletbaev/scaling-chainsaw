import * as React from 'react';
import {
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Text,
  Platform,
  StyleSheet,
} from 'react-native';

interface Props {
  onPress: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  title?: string;
  mode?: 'contained' | 'outlined';
  loading?: boolean;
}

function Button(props: Props) {
  const {
    mode = 'contained',
    onPress,
    disabled = false,
    title,
    children,
    loading = false,
  } = props;
  const renderButtonContents = () => {
    if (loading) {
      return (
        <Text
          style={[styles.buttonText, mode === 'outlined' && styles.buttonColorOutlined]}
        >
          Kutin...
        </Text>
      );
    }

    return (
      children ?? (
        <Text
          style={[styles.buttonText, mode === 'outlined' && styles.buttonColorOutlined]}
        >
          {title}
        </Text>
      )
    );
  };

  const style = React.useMemo(() => {
    const data: any[] = [styles.button];

    if (disabled) {
      data.push(styles.buttonDisabled);
      return data;
    }

    switch (mode) {
      case 'contained':
        data.push(styles.contained);
        break;
      case 'outlined':
        data.push(styles.outlined);
        break;
    }

    return data;
  }, [disabled, mode]);

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    return (
      <TouchableNativeFeedback onPress={onPress} disabled={disabled || loading}>
        <View style={style}>{renderButtonContents()}</View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} style={style}>
      {renderButtonContents()}
    </TouchableOpacity>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    marginTop: 15,
    width: '50%',
    padding: 8,
    borderRadius: 5,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  contained: {
    backgroundColor: '#000',
  },
  outlined: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  buttonColorOutlined: {
    color: '#000',
  },
});

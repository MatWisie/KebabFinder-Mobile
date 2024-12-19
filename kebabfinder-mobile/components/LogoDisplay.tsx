import React, { useState } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const LogoDisplay = ({ logoLink }: { logoLink: string | null }) => {
  const [imageError, setImageError] = useState(false);

  if (!logoLink) {
    return null; 
  }

  return (
    <View style={styles.container}>
      {!imageError ? (
        <Image
          source={{ uri: logoLink }}
          style={styles.logo}
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)} 
        />
      ) : (
        <Fontisto
          name="broken-link" 
          size={350}
          color="red"
          style={styles.logo}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
});

export default LogoDisplay;
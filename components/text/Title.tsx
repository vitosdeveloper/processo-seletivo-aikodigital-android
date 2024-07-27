import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text } from 'react-native';

const Title = ({ children }: PropsWithChildren) => {
  return <Text style={styles.title}>{children}</Text>;
};

export default Title;

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
});

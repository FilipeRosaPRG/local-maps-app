import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { IMarker } from "../Home";

type DetailRoute = RouteProp<{ detail: IMarker }, "detail">;

type Address = {
  address: {
    road: string;
    city: string;
    postcode: string;
    state: string;
  };
};

export default function Detail() {
  const params = useRoute<DetailRoute>();

  const [address, setAddress] = useState<Address>();

  const navigation = useNavigation();

  useEffect(() => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${params.params.latitude}&lon=${params.params.longitude}&format=json`
    ).then(async (request) => {
      const data = await request.json();

      setAddress(data);
      navigation.setOptions({
        title: params.name,
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{params.params.name}</Text>
      <Text style={styles.subTitle}>{params.params.description}</Text>

      <Text style={styles.section}>Endereço</Text>

      {
        !address ? <ActivityIndicator size="large" /> : null
      }

      <Text style={styles.text}>{address?.address.road}</Text>
      <Text style={styles.text}>{address?.address.city}</Text>
      <Text style={styles.text}>{address?.address.postcode}</Text>
      <Text style={styles.text}>{address?.address.state}</Text>

      <Text style={styles.section}>Contato</Text>
      <Text style={styles.text}>{params.params.contact}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F5",
    padding: 20,
  },
  title: {
    color: "#322153",
    fontSize: 28,
    fontWeight: "bold",
  },
  subTitle: {
    color: "#6C6C80",
    fontSize: 18,
    fontWeight: "400",
  },
  section: {
    color: "#322153",
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 20,
  },
  text: {
    color: "#6C6C80",
    fontSize: 16,
  },
});
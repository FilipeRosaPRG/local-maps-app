import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Platform, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { categories } from "./categories";

export interface IMarker {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    category: string;
    contact: string;
}

export interface INavigation {
    navigate: (screen: string, marker: IMarker) => void;
}

export default function HomeScreen() {

    const [markers, setMarkers] = useState<IMarker[]>([]);
    const [filteredMarkers, setFilteredMarkers] = useState('');
    const navigation = useNavigation<INavigation>();

    const filteredMarkersList = markers.filter((marker) => marker.category === filteredMarkers);

    useEffect(() => {
        fetch("http://192.168.15.91:3000/store").then(async (request) => {
            const data = await request.json();
            setMarkers(data);
        }).catch((error) => {
            console.log("Aqui está o erro", error);
        });
    }, []);

    if (!markers || markers.length === 0) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <SafeAreaView style={style.container}>
            <View style={style.headerContainer}>
                <Text style={style.title}>Bem vindo</Text>
                <Text style={style.subTitle}>Encontre no mapa um ponto do comércio local</Text>
            </View>

            <MapView
                initialRegion={{
                    latitude: markers[3]?.latitude,
                    longitude: markers[3]?.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                style={style.map}
            >
                {
                    (
                        filteredMarkers ? filteredMarkersList : markers).map((item) => {
                            return (
                                <Marker
                                    key={item.id}
                                    coordinate={{
                                        latitude: item.latitude,
                                        longitude: item.longitude
                                    }}
                                    title={item.name}
                                    description={item.description}
                                    onPress={() => {
                                        navigation.navigate("Details", item);
                                    }}
                                />
                            )
                        })
                }

            </MapView>

            <View style={style.categoryContainer}>
                <FlatList
                    ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        alignItems: "center",
                    }}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                style={[
                                    style.categoryItem,
                                    filteredMarkers === item.key ?
                                        style.selectedCategory : {}
                                ]}
                                key={item.key}
                                onPress={() => {
                                    setFilteredMarkers(filteredMarkers === item.key ? '' : item.key);
                                }}
                            >
                                <Image
                                    style={style.categoryImage}
                                    source={item.image} />
                                <Text
                                    style={style.categoryText}
                                >{item.label}</Text>
                            </TouchableOpacity>
                        );
                    }}

                />
            </View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headerContainer: {
        padding: 20,
        paddingTop: Platform.OS === "android" ? 50 : 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#322153"
    },
    subTitle: {
        fontSize: 14,
        fontWeight: "400",
        color: "#6c6c80"
    },
    map: {
        flex: 1,
        margin: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    categoryContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    categoryItem: {
        backgroundColor: "#f0f0f5",
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    categoryImage: {
        width: 50,
        height: 50,
    },
    categoryText: {
        fontSize: 14,
        textAlign: "center",
        color: "#6c6c80",
    },
    selectedCategory: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#322153",

    },
});
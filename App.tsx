import * as React from "react";
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Callout, Circle, Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";


type Coords = {
  latitude: number;
  longitude: number;
};

const App: React.FC = () => {
  const [region, setRegion] = useState<Region>({
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 20.022,
    longitudeDelta: 20.0421,
  });

  useEffect(() => {
    const getLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      getCurrentLocation();
    };
    getLocationPermission();
  }, []);

  const getCurrentLocation = async () => {
    let { coords } = await Location.getCurrentPositionAsync();
    if (coords) {
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={{ flex: 1, alignItems: "center" }}>
        <GooglePlacesAutocomplete
          currentLocation={true}
          currentLocationLabel="Current location"
          placeholder="Search for Location"
          textInputProps={{ placeholderTextColor: "black" }}
          fetchDetails={true}
          GooglePlacesSearchQuery={{
            rankby: "distance",
          }}
          onPress={(data, details = null) => {
            console.log(">", data, details);
            setRegion({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.05922,
              longitudeDelta: 0.05421,
            });
          }}
          query={{
            key: "YOUR_API_KEY",
            language: "en",
            components: "country:ind",
          }}
          styles={{
            container: {
              flex: 0,
              marginTop: 50,
              position: "absolute",
              width: "85%",
              zIndex: 1,
            },
            listView: { backgroundColor: "white" },
          }}
        />

        <MapView
          onMarkerDragEnd
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.05922,
            longitudeDelta: 0.05421,
          }}
          region={region}
          provider="google"
        >
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
          />
          <Marker
            coordinate={region}
            pinColor="red"
            draggable={true}
            onDragStart={(e) => {
              console.log("Drag start", e.nativeEvent.coordinates);
            }}
            onDragEnd={(e) => {
              setRegion({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              });
            }}
          >
            <Callout>
              <Text>I'm here</Text>
            </Callout>
          </Marker>
        </MapView>
        <View
          style={{
            position: "absolute",
            top: "80%",
            alignSelf: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={getCurrentLocation}
            style={{
              width: 60,
              height: 60,
              backgroundColor: "#e54e57",
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
              margin: 10,
            }}
          >
            <MaterialIcons name="my-location" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            position: "absolute",
            top: "15%",
            alignSelf: "center",
          }}
        >
        </View>
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#EFF0F5",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import DailyWeather from "./components/DailyWeather";

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [address, setAddress] = useState<Location.LocationGeocodedAddress>();
  const [weatherData, setWeatherData] = useState<any>();
  const [fiveDayWeatherData, setFiveDayWeatherData] = useState<any>();
  const [iconURL, setIconUrl] = useState<any>();

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    };

    const getData = async () => {
      const { latitude, longitude } = location.coords;

      const weatherRes = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}weather?lat=${latitude}&lon=${longitude}&appid=${process.env.EXPO_PUBLIC_API_ID}&units=${process.env.EXPO_PUBLIC_API_UNITS}`
      );

      const fiveDayWeatherRes = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.EXPO_PUBLIC_API_ID}&units=${process.env.EXPO_PUBLIC_API_UNITS}`
      );

      const editedWeatherRes = await weatherRes.json();
      const editedFiveDayWeatherRes = await fiveDayWeatherRes.json();

      setWeatherData(editedWeatherRes);
      setFiveDayWeatherData(editedFiveDayWeatherRes);

      const iconurl = `${process.env.EXPO_PUBLIC_API_IMG_URL}wn/${editedWeatherRes?.weather[0].icon}@4x.png`;
      setIconUrl(iconurl);

      const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
        longitude: location?.coords?.longitude,
        latitude: location?.coords?.latitude,
      });

      setAddress(
        reverseGeocodedAddress?.length > 0 ? reverseGeocodedAddress[0] : null
      );
    };

    if (!location) getPermissions();
    else getData();
  }, [location]);

  return (
    <ScrollView style={{ backgroundColor: "#CCD5F5", paddingVertical: 60 }}>
      <View
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        {address && <Text style={styles.titleText}>{address?.subregion}</Text>}

        {weatherData && (
          <>
            <Image
              source={{
                uri: iconURL,
              }}
              style={{
                width: 100,
                height: 100,
              }}
            />
            <Text style={styles.baseText}>
              {weatherData.weather[0].description}
            </Text>
            <Text style={styles.baseText}>
              {Math.round(weatherData.main.temp)}°
            </Text>
          </>
        )}
        {fiveDayWeatherData && <DailyWeather data={fiveDayWeatherData} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  baseText: {
    fontSize: 25,
  },

  titleText: {
    fontSize: 40,
  },

  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
});

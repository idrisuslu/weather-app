import { Image, StyleSheet, Text, View } from "react-native";

type DailyWeatherItemProps = {
  day?: Date;
  title?: string;
  weatherData: any;
};

const DailyWeatherItem = (props: DailyWeatherItemProps) => {
  const { weatherData, day, title } = props;

  return (
    <>
      {/* <Text style={styles.title}>
        {title
          ? title
          : `${day.getUTCDate()}/${
              day.getUTCMonth() + 1
            }/${day.getUTCFullYear()}`}
      </Text> */}
      <View style={styles.container}>
        {weatherData.length > 0 ? (
          weatherData.map((item, i) => {
            const iconurl = `${process.env.EXPO_PUBLIC_API_IMG_URL}wn/${item.weather[0].icon}@4x.png`;
            const date = new Date(item?.dt_txt + "Z");
            const time = date
              .toLocaleTimeString()
              .split(":")
              .slice(0, 2)
              .join(":");

            return (
              <View style={styles.item} key={i}>
                <Text style={{ ...styles.itemTitle, textAlign: "left" }}>
                  {time}
                </Text>
                <Image
                  source={{ uri: iconurl }}
                  style={{
                    width: 50,
                    height: 50,
                  }}
                />
                <Text style={{ ...styles.itemTitle, textAlign: "right" }}>
                  {Math.round(item.main.temp)}°
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={{ textAlign: "center", fontSize: 20, marginTop: 10 }}>
            There is no data for today.
          </Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    // gap: 5,
  },

  item: {
    // paddingVertical: 10,
    // paddingHorizontal: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // backgroundColor: "#dab2ed",
    // borderWidth: 1,
    // borderRadius: 5,
    // borderColor: "#749DE1",
  },

  itemTitle: {
    fontSize: 18,
    width: 50,
  },

  title: {
    marginVertical: 10,
    backgroundColor: "#749DE1",
    textAlign: "center",
    padding: 10,
    fontSize: 20,
    color: "white",
    fontWeight: "800",
  },
});

export default DailyWeatherItem;

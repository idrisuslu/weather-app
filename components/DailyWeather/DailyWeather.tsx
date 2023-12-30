import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import DailyWeatherItem from "../DailyWeatherItem";
import { useState } from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

type DailyWeatherProps = {
  data: any;
};

const DailyWeather = (props: DailyWeatherProps) => {
  const { data } = props;

  function convertUTCDateToLocalDate(date) {
    var newDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

  const currentDate = new Date();
  const localeCurrentDate = convertUTCDateToLocalDate(currentDate);

  const [selectedDate, setSelectedDate] = useState(localeCurrentDate);

  // const tomorrow = new Date(localeCurrentDate);
  // tomorrow.setDate(localeCurrentDate.getDate() + 1);

  // const fiveDayDates = [localeCurrentDate.getUTCDate()];
  // for (let index = 1; index < 6; index++) {
  //   const nextDay = new Date(localeCurrentDate);
  //   nextDay.setDate(localeCurrentDate.getDate() + index);
  //   fiveDayDates.push(nextDay.getUTCDate());
  // }

  // const todayWeatherData = data?.list.filter((item) => {
  //   const date = new Date(item?.dt_txt + "Z");
  //   const localeDate = convertUTCDateToLocalDate(date);

  //   return localeDate.getUTCDate() === selectedDate.getUTCDate();
  // });

  // const changeDate = (number) => {
  //   const newDate = new Date(selectedDate);
  //   newDate.setDate(newDate.getDate() + number);

  //   if (fiveDayDates.includes(newDate.getUTCDate())) {
  //     setSelectedDate(newDate);
  //   }
  // };

  // const title =
  //   localeCurrentDate.getUTCDate() === selectedDate.getUTCDate()
  //     ? "Today"
  //     : selectedDate.getUTCDate() === tomorrow.getUTCDate()
  //     ? "Tomorrow"
  //     : null;

  /*****************************************************************************************/

  const av = new Animated.Value(0);
  av.addListener(() => {
    return;
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  const dayTitles = [];

  for (let index = 2; index < 6; index++) {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + index);

    const title = `${newDate.getUTCDate()}/${
      newDate.getUTCMonth() + 1
    }/${newDate.getUTCFullYear()}`;

    dayTitles.push(title);
  }

  const [routes] = useState([
    { key: "first", title: "Today" },
    { key: "second", title: "Tomorrow" },
    { key: "third", title: dayTitles[0] },
    { key: "fourth", title: dayTitles[1] },
    { key: "fifth", title: dayTitles[2] },
    { key: "sixth", title: dayTitles[3] },
  ]);

  const newWeatherData = [];

  data?.list.map((item) => {
    const date = new Date(item?.dt_txt + "Z");
    const localeDate = convertUTCDateToLocalDate(date);
    const localeDateString = `${localeDate.getUTCDate()}-${
      localeDate.getUTCMonth() + 1
    }-${localeDate.getUTCFullYear()}`;

    if (newWeatherData.length <= 0) {
      item["locale_date"] = localeDateString;
      if (localeCurrentDate.getUTCDate() != localeDate.getUTCDate()) {
        return newWeatherData.push([], [{ ...item }]);
      }
      return newWeatherData.push([{ ...item }]);
    } else {
      const lastCheckedDay = newWeatherData[newWeatherData.length - 1];

      if (
        lastCheckedDay[lastCheckedDay.length - 1].locale_date ==
        localeDateString
      ) {
        item["locale_date"] = localeDateString;
        return newWeatherData[newWeatherData.length - 1].push({ ...item });
      } else {
        item["locale_date"] = localeDateString;
        return newWeatherData.push([{ ...item }]);
      }
    }
  });

  const renderScene = SceneMap({
    first: () => <DailyWeatherItem weatherData={newWeatherData[0]} />,
    second: () => <DailyWeatherItem weatherData={newWeatherData[1]} />,
    third: () => <DailyWeatherItem weatherData={newWeatherData[2]} />,
    fourth: () => <DailyWeatherItem weatherData={newWeatherData[3]} />,
    fifth: () => <DailyWeatherItem weatherData={newWeatherData[4]} />,
    sixth: () => <DailyWeatherItem weatherData={newWeatherData[5]} />,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      scrollEnabled={true}
      indicatorStyle={{ backgroundColor: "white" }}
      // style={{ backgroundColor: "pink" }}
      tabStyle={{ width: 120 }}
    />
  );

  console.log(newWeatherData[0][0]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={setIndex}
      style={{ width: layout.width, height: 500 }}
    />
  );

  /*****************************************************************************************/

  // return (
  //   <ScrollView style={{ width: "80%" }}>
  //     <View
  //       style={{
  //         display: "flex",
  //         justifyContent: "space-between",
  //         flexDirection: "row",
  //         gap: 20,
  //       }}
  //     >
  //       <Pressable style={styles.button} onPress={() => changeDate(-1)}>
  //         <Text
  //           style={{
  //             ...styles.text,
  //             color:
  //               fiveDayDates[0] === selectedDate.getUTCDate()
  //                 ? "#d1d1d1"
  //                 : "black",
  //           }}
  //         >
  //           ←
  //         </Text>
  //       </Pressable>
  //       <Pressable style={styles.button} onPress={() => changeDate(1)}>
  //         <Text
  //           style={{
  //             ...styles.text,
  //             color:
  //               fiveDayDates[fiveDayDates.length - 1] ===
  //               selectedDate.getUTCDate()
  //                 ? "#d1d1d1"
  //                 : "black",
  //           }}
  //         >
  //           →
  //         </Text>
  //       </Pressable>
  //     </View>
  //     <DailyWeatherItem
  //       day={selectedDate}
  //       weatherData={todayWeatherData}
  //       title={title}
  //     />
  //   </ScrollView>
  // );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "white",
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
  },
});

export default DailyWeather;

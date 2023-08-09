import React, { useState, useEffect, useCallback } from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useDebounce } from "use-debounce";
import credenciales from "../../Constant/credentials";
import { ResquestApis } from "../../utils/Querys";
import { Image } from "expo-image";
import navigationString from "../../Constant/navigationString";

const ForumInRealTime = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // se establece un tiempo de 500ms antes de realizar la búsqueda
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [topGames, setTopGames] = useState([])

  const searchGames = async (searchTerm) => {
    const url = "https://api.igdb.com/v4/games";
    //const url = "https://api.igdb.com/v4/multiquery";
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": credenciales.CLIENTID,
        Authorization: `Bearer ${credenciales.ACCESSTOKEN}`,
      },
      /*body:
        `query games "Juego" {
          fields name, genres.name;
          where name ~ *"Minecraft";
          limit 10;
        };

        `*/
      body: `search "%${searchTerm.toUpperCase()}%"; fields name, rating,genres.name, cover.url; limit 15;`,
    };

    const response = await ResquestApis(url, options);
    const data = response.data
    const sortedData = data.sort((a, b) => {
      const ratingA = a.rating || 0; // Si no hay rating, se asigna 0
      const ratingB = b.rating || 0;

      return ratingB - ratingA; // Orden descendente por rating
    });
    return sortedData;
  };

  const searchGamesMemo = useCallback(async () => {
    if (debouncedSearchTerm) {
      setIsLoading(true);
      setError(null);
      try {
        const dataResponse = await searchGames(debouncedSearchTerm);
        setData(dataResponse);

      } catch (error) {
        setError("Error al buscar juegos");
      }
      setIsLoading(false);
    } else {
      setData([]);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    searchGamesMemo();
  }, [searchGamesMemo]);

  useEffect(() => {
    getTopGames();
  }, []);

  function SelectGame(gameData) {
    navigation.navigate(navigationString.GAMEFORO, gameData)
  }

  const getTopGames = async () => {
    const url = "https://api.igdb.com/v4/games";
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": credenciales.CLIENTID,
        Authorization: `Bearer ${credenciales.ACCESSTOKEN}`,
        "Accept-Language": "es",
      },
      body: `fields name, rating_count,rating, cover.url, first_release_date, genres.name; 
      where rating_count > 80 & cover != null & first_release_date < ${Math.floor(Date.now() / 1000)} ;
      sort first_release_date desc; 
      limit 10;`,
    };
    const response = await ResquestApis(url, options);
    const data = response.data;

    setTopGames(data);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.textSearch}
          placeholder="Buscar juegos"
          value={searchTerm}
          onChangeText={text => {
            setSearchTerm(text)
          }}
        />
      </View>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text>{error}</Text>}
      {data.length > 0 ? (
        <ScrollView>
          {data?.map((game) =>
          (

            <TouchableOpacity
              key={game.id}
              style={styles.containerForum}
              onPress={() => SelectGame({ id: game.id, name: game.name, urlImage: game.cover ? game.cover.url : null, categorias: game.genres ? game.genres.map(index => { return index.name }) : null })}
            >
              <View style={{ flexDirection: "row" }}>
                {game.cover ?
                  <Image
                    style={styles.imageProfile}
                    source={
                      { uri: `https:${game.cover.url}` }
                    }
                  /> :
                  <Image
                    style={styles.imageProfile}
                    source={
                      require("../../Data/Default/No-image.png")
                    }
                  />
                }

                <View style={{ marginLeft: 10, padding: 10 }}>
                  <Text style={{ fontSize: 22, fontWeight: "bold" }}>{game.name}</Text>

                  <View style={{ flexDirection: "row" }}>{
                    game.genres ? (
                      game.genres.map(index => (
                        <Text key={index.id} style={[styles.categoryContent, { marginHorizontal: 2.5 }]}>{index.name}</Text>
                      ))
                    ) : (<Text style={styles.categoryContent}>Sin registro de la categoria</Text>)
                  }</View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View>
          {topGames.length > 0 ? <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10, padding: 5 }}>Top Games</Text> : <ActivityIndicator size="large" color="#0000ff" />}
          <FlatList
            data={topGames}
            renderItem={({ item }) => (
              <ScrollView>
                <TouchableOpacity
                  key={item.id}
                  style={styles.containerForum}
                  onPress={() => SelectGame({ id: item.id, name: item.name, urlImage: item.cover ? item.cover.url : null, categorias: item.genres ? item.genres.map(index => { return index.name }) : null })}
                >
                  <View style={{ flexDirection: "row" }}>
                    {item.cover ?
                      <Image
                        style={styles.imageProfile}
                        source={
                          { uri: `https:${item.cover.url}` }
                        }
                      /> :
                      <Image
                        style={styles.imageProfile}
                        source={
                          require("../../Data/Default/No-image.png")
                        }
                      />
                    }
                    <Text style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      marginLeft: 10,
                      padding: 5
                    }}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            )}
          />
        </View>
      )}
    </View >
  );
};

const styles = StyleSheet.create({
  searchBar: {
    justifyContent: "center",
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  textSearch: {
    padding: 5,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  containerForum: {
    padding: 5,
    margin: 5,
  },
  imageProfile: {
    width: 90,
    height: 90,
  },
  categoryContent: {
    color: 'black',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 14,
    borderRadius: 25,
    ...(Platform.OS === 'ios' && {
      borderRadius: 9,
    }),
  },
});

export default ForumInRealTime;


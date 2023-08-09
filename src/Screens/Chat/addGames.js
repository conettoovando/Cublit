import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import credenciales from '../../Constant/credentials';
import { ResquestApis } from "../../utils/Querys";
import { useDebounce } from "use-debounce";

export default function AddGames(props) {
    const userUid = props.route.params;

    const [searchTerm, setSearchTerm] = useState('Minecraft');
    const [gameData, setgameData] = useState([]);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log(userUid);

    const searchGames = async (searchTerm) => {
        const url = "https://api.igdb.com/v4/games";
        const options = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Client-ID": credenciales.CLIENTID,
                Authorization: `Bearer ${credenciales.ACCESSTOKEN}`,
            },
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
    }

    const searchGamesMemo = useCallback(async () => {
        if (debouncedSearchTerm) {
            setIsLoading(true);
            setError(null);
            try {
                const dataResponse = await searchGames(debouncedSearchTerm);
                setgameData(dataResponse);

            } catch (error) {
                setError("Error al buscar juegos");
            }
            setIsLoading(false);
        } else {
            setgameData([]);
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        searchGamesMemo();
    }, [searchGamesMemo]);

    console.log(gameData)
    return (
        <Text>hola mundo</Text>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        margin: 0,
        backgroundColor: "white"
    },
})
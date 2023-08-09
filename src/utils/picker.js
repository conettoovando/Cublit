import {Picker} from '@react-native-picker/picker';
import React, { useRef, useState} from 'react';

export default function Pickerfunction ({navigation}) {
    const pickerRef = useRef();
    const [selectedLanguage, setSelectedLanguage] = useState();

    function open() {
    pickerRef.current.focus();
    }

    function close() {
    pickerRef.current.blur();
    }

    return <Picker
        ref={pickerRef}
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) =>
            setSelectedLanguage(itemValue)
        }>
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
    </Picker>
}

import { ResquestApis } from "../utils/Querys";
import Constants from "expo-constants";


class CredencialesUser {
    constructor() {
        this.CLIENTID = Constants.manifest.extra.CLIENTID;
        this.CLIENTSECRET = Constants.manifest.extra.CLIENTSECRET;
        this.ACCESSTOKEN = null;
    }

    async obtenerAccessToken() {
        const response = await ResquestApis(`https://id.twitch.tv/oauth2/token?client_id=${this.CLIENTID}&client_secret=${this.CLIENTSECRET}&grant_type=client_credentials`)
        if (response.status) {
            this.ACCESSTOKEN = response.data.access_token
        }
    }
}
const credenciales = new CredencialesUser();
export default credenciales;
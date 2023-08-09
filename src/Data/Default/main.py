import requests

clientId = "x1z79hkw24qgca3ps9p8k8av1524j1"
clientSecret = "201w7w2hx15y5mu86v8gvs0q5vnxnz"

url = "https://id.twitch.tv/oauth2/token?client_id="+clientId + \
    "&client_secret="+clientSecret+"&grant_type=client_credentials"

response = requests.post(url)
response_json = response.json()

accesToken = response_json["access_token"]
print(response_json)
print(accesToken)

header = {
    "Client-ID": clientId,
    "Authorization": "Bearer " + accesToken,
}
data = 'fields *;'
games = requests.post(url="https://api.igdb.com/v4/genres",
                      headers=header, data=data)
games_json = games.json()

print(games_json)

# Advent Of Code Private Leader Board Bot Discord 
This bot is for posting updates from your private leaderboard to discord

## Requriments
Node js 
Discord.js 
dotenv
node-corn
node-fetch
## Example
This will Check the private leader board and post every 15 mins the changes that been made since it last check and the current leaderboard.


![image](https://user-images.githubusercontent.com/72324766/205526423-8393e083-ec87-4825-b8df-9b628b30418e.png)

## Set up
1. Create a bot in discord dev portal
2. invite your bot into your discord
3. put your discord token in the .env
4. Fill in your cookie session .env
5. Put your leader board .JSON url in the .env
6. make sure the above packages are installed
7. Start your node server "$ node index.js"
8. in the discord you want to post the leaderboard type !start

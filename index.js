#! /usr/bin/env node
const request = require('request');
const spawn = require('child_process').spawn;

const API_KEY = process.env.PHISH_API_KEY;
const isWin = process.platform === "win32";
const cmd = isWin ? 'start' : 'open';
const args = isWin ? ['chrome'] : ['-na', 'Google Chrome', '--args', '--new-tab'];
const apiUrl = `https://api.phish.net/v3/setlist/random?apikey=${API_KEY}`;

console.log('Selecting your show...');
console.log();

request(apiUrl, (err, res, body) => {
    if (err) {
        console.error('Issue retieving data...');
        console.error(err);
        return;
    }
    const response = JSON.parse(body);

    if(response.error_message) {
        console.error(response.error_message);
        return;
    }
    const show = response.response.data[0];
    printShow(show);
    const showDate = show.showdate;
    
    spawn(cmd, [...args, `https://phish.net/setlists/?d=${showDate}`]);
    spawn(cmd, [...args, `https://phish.in/${showDate}`]);
})

function printShow(show) {
    console.log('🐟 🐟 🐟 🐟 🐟 🐟 🐟');
    console.log(show.showdate);
    console.log(show.location);
    console.log(`${show.rating} Stars`);
    console.log('🐟 🐟 🐟 🐟 🐟 🐟 🐟');
}
const rp = require('request-promise');
const path = require('path');
const cheerio = require('cheerio');
const express = require('express');
const nodeMailer = require('nodemailer');
const { urlencoded } = require('body-parser');
const CronJob = require("cron").CronJob;
const app = express();


let currentPrice = 0;
const PROD_URL = "https://www.amazon.in/Napa-Hide-Protected-Genuine-Quality/dp/B083TG9VFK/ref=zg-bs_luggage_1/258-8867239-4296335?pd_rd_w=W51mt&pf_rd_p=56cde3ad-3235-46d2-8a20-4773248e8b83&pf_rd_r=S9ACMDNQ7AYZKH8G905X&pd_rd_r=73e9d122-abae-468d-b0c2-ab23829313ac&pd_rd_wg=y8AbD&pd_rd_i=B08TS5X9WM&th=1";


const job = new CronJob('* * * * * * ', function() {
    getPrice().then((newPrice,rej)=>{
        
    })
}, true);

job.start();

function getPrice(){
    return new Promise((resolve , rejects)=>{
        
        rp(PROD_URL).then((res)=>{

            const $ = cheerio.load(res);
            currentPrice =    $('.apexPriceToPay > span:nth-child(1)').text().substring(1) ||  $('#corePrice_feature_div > div:nth-child(1) > span:nth-child(1) > span:nth-child(1)').text().substring(1) || $('#corePrice_feature_div > div:nth-child(1) > span:nth-child(2) > span:nth-child(2) > span:nth-child(2)').text().slice(0,-1);
            currentPrice = parseFloat(currentPrice.replace(/,/g, ''))
            if(currentPrice != undefined){
                resolve(currentPrice);
            }
            rejects("Data unavailable")
            
        })
    }
    )
}

app.listen(3000)

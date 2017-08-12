"use strict";
const fs = require('fs');
const he = require("he");
const asyncs = require("async")
const cheerio = require('cheerio');
const phantom = require('phantom');
//const html = fs.readFileSync('./index.htm')
const Sequelize = require('sequelize')
const config = require('./config')

//const sequelize = new Sequelize(config.db);

let news_list = []

// const News = sequelize.define('news', {
//     title: { type: Sequelize.STRING, allowNull: false},
//     description: { type: Sequelize.STRING(500), allowNull: false},
//     cover: { type: Sequelize.STRING, allowNull: false},
//     content: { type: Sequelize.TEXT, allowNull: false},
//     link: { type: Sequelize.STRING, allowNull: false},
//     host: { type: Sequelize.STRING, allowNull: false},
//     author: { type: Sequelize.STRING, allowNull: false},
// },{
//   timestamps: false,
//   tableName: 'sz_news_gather'
// })

// News.sync();

(async () => {
  const instance = await phantom.create(['--load-images=no']);
  const page = await instance.createPage();
  await page.on("onResourceRequested", function(requestData) {
      console.info('Requesting', requestData.url)
  });
  
  const status = await page.open("http://www.solvay.com/en/asking-more/index.html#/page/6");
  const content = await page.property('content');
  const $ = cheerio.load(content);
  let article = $('article')
  //console.log(article.html())
  for(let i = 0; i < 1; i++) {
    let news = {}
    news['title'] = he.decode(article.eq(i).find('.content-title').find('a').html())
    news['description'] = he.decode(article.eq(i).find('.abstract').html())
    news['link'] = he.decode(article.eq(i).find('.content-title').find('a').attr('href'))
    news['author'] = 'solvay'
    news['cover'] = 'http://www.solvay.com'+he.decode(article.eq(i).find('.main-picture').find('img').attr('src').substr(1))
    news['host'] = 'www.solvay.com'
    news_list.push(news)
  }
  await instance.exit();
})()

let q = asyncs.queue((news,callback) => {
  (async () => {
    const instance = await phantom.create(['--load-images=no']);
    const page = await instance.createPage();
    await page.on("onResourceRequested", function(requestData) {
        console.info('Requesting', requestData.url)
    });
    const status = await page.open(news.link);
    const content = await page.property('content');
    const $ = cheerio.load(content)
    console.log("-->"+ content)
    //console.log("-->"+$(".main-content").html())
    news['content'] = he.decode($(".main-content").html().replace(/\n/g, "").replace(/\\/g, ""))
    //News.create(news)
    await instance.exit();
    callback()
  })()
  
})

q.drain = () => {
    console.log('all urls have been processed');
    fs.writeFile('news.txt', JSON.stringify(news_list), function(err){ if (err) throw err });
    //sequelize.close()
}

news_list.forEach(news => {
  q.push(news, err=>{ if (err) throw err }); 
})







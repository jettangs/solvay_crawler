"use strict";
const fs = require('fs');
const he = require("he");
const asyncs = require("async")
const cheerio = require('cheerio');
const phantom = require('phantom');
//const html = fs.readFileSync('./index.htm')
const Sequelize = require('sequelize')
const config = require('./config')

const sequelize = new Sequelize(config.db);

let news_list = [];

const News = sequelize.define('news', {
    title: { type: Sequelize.STRING, allowNull: false},
    description: { type: Sequelize.STRING(500), allowNull: false},
    cover: { type: Sequelize.STRING, allowNull: false},
    content: { type: Sequelize.TEXT, allowNull: false},
    link: { type: Sequelize.STRING, allowNull: false},
    host: { type: Sequelize.STRING, allowNull: false},
    author: { type: Sequelize.STRING, allowNull: false},
},{
  timestamps: false,
  tableName: 'sz_news_gather'
});

//News.sync();


// let q = asyncs.queue((news,callback) => {
//   (async () => {
//     console.log("--->"+news.link);
//     const instance = await phantom.create(['--load-images=no']);
//     const page = await instance.createPage();
//     await page.on("onResourceRequested", function(requestData) {
//         console.info('Requesting', requestData.url)
//     });
//     console.log("await page.open(news.link)")
//     const status = await page.open(news.link);
//     const content = await page.property('content');
//     console.log(content)
//     console.log("await content")

//     const $ = cheerio.load(content)
//     //console.log("-->"+$(".main-content").html())
//     news['content'] = he.decode($(".main-content").html().replace(/\n/g, "").replace(/\\/g, ""))
//     News.create(news)
//     //await instance.exit();
//     callback()
//   })()
  
// })

// q.saturated = function() { 
//     log('all workers to be used'); 
// }

// q.drain = () => {
//     console.log('all urls have been processed');
//     //fs.writeFile('news.txt', JSON.stringify(news_list), function(err){ if (err) throw err });
    
// }

(async () => {
  try{
    const instance = await phantom.create(['--load-images=no']);
    const page = await instance.createPage();
    await page.property('viewportSize', {width: 1920, height: 1080})
    await page.on("onResourceRequested", function(requestData) {
        console.info('Requesting', requestData.url)
    });    
    const status = await page.open("http://www.solvay.com/en/asking-more/index.html");
    // await page.property('scrollPosition', {
    //   top: 80
    // })

    const content = await page.property('content');
    const $ = cheerio.load(content);
    let article = $('.magarticle-content.central-list')
    page.render('page.jpg')
    for(let i = 0; i < article.length; i++) {
        let news = {}
        console.log(i+'.title->'+article.eq(i).find('.content-title').find('a').html())
        //news['title'] = he.decode(article.eq(i).find('.content-title').find('a').html())
    // console.log('title->'+news.title)
    // news['description'] = he.decode(article.eq(i).find('.abstract').html())
    // console.log('description->'+news.description)
    // news['link'] = 'http://www.solvay.com'+he.decode(article.eq(i).find('.content-title').find('a').attr('href'))
    // console.log('link->'+news.link)

    // news['author'] = 'solvay'
    // console.log('author->'+news.author)

    // news['cover'] = he.decode(article.eq(i).find('.main-picture').find('img').attr('src'))
    // console.log('cover->'+news.cover)

    // news['host'] = 'www.solvay.com'
    // console.log('host->'+news.host)
    // console.log("---------------------")
    // //console.log(JSON.stringify(news))
    // news_list.push(news)
    }
    news_list.forEach(news => {
    //q.push(news, err=>{ if (err) throw err }); 
    })
    await instance.exit();
  }catch(err){
    console.log(err)
  }
  
})()










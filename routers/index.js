const express = require('express')
const DbProduct = require('../model/Product')
const fetch = require('node-fetch')
const DbUser = require('../model/User')
const router = express.Router()
 
router.get('/', (req, res) => {
    let query = {}
    let page = 1
    let pagesize = 2

    if(req.query.page != null){
        page =  req.query.page 
    }
    query.skip = (page - 1)* pagesize
    query.limit= pagesize
  
  
  DbProduct.find({}, {} , query , (err, data) => {
        fetch("http://www.cbu.uz/oz/arkhiv-kursov-valyut/json/")
        .then(data => data.json())
        .then(body => 
            DbProduct.count((err, match) => {
                console.log(match)
                res.render('index', {
                    title: 'Bosh sahifa',
                    datas: data,
                    kurs: body,
                    pages:   Math.ceil( match / pagesize) 
                    }) 

                
                 
        }))
 
    })
     

})



router.get('/search', (req, res) => {
    let {search} = req.query
    search.toLowerCase()

    DbProduct.find({title: {$regex : search}  }, (err, data) => {
        if(data == "" || req.query.search == ""){
            res.redirect('/')
             
        }else{
            res.render('index', {
                title: 'Bosh sahifa',
                datas: data
    
            })
            
        }
       

    })

})

 

  


  



module.exports = router
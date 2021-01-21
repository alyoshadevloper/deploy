const express = require('express')
const DbProduct = require('../model/Product')
const multer = require('../md/multer').single('photo')
const router = express.Router()
const DbUser = require('../model/User')



const def = (req  ,  res , next) => {
    if(req.isAuthenticated()){
        next()
    }else{
        req.flash('danger' , 'iltimos login qling')
        res.redirect('/')
    }

}


router.get('/productd/add' , def ,  (req  ,res) => {
    
    res.render('add' , {
        title: 'Mahsulot qoshish sahifasi',

    })
})

router.post('/productd/add' , multer ,  (req  ,res) => {
    req.checkBody('title' ,  'Maxsulotning nomini kiriting').notEmpty()
    req.checkBody('price' ,  'Maxsulotning narxini kiriting').notEmpty()
    req.checkBody('category','Maxsulotning sinfini kiriting').notEmpty()
    req.checkBody('category','Maxsulotning sinfini kiriting').notEmpty()
    req.checkBody('comments','Maxsulot haqida malumot kiriting').notEmpty()

    const errors  = req.validationErrors()
    
    if(errors){
        res.render('add' , {
            title: 'Xatolik bor',
            errors: errors
        })
    }else{    
    const db  = new DbProduct({
        title : req.body.title.toLowerCase(),
        price : req.body.price,
        author : req.user._id,
        category : req.body.category,
        comments : req.body.comments,
        sale : req.body.sale,
        photo : req.file.path
    })
    db.save((err) => {
        if(err)
            throw err
        else{
            req.flash('success' , 'Mahsulot yuklandi')
            res.redirect('/')
        }
    })

    }
   
})

router.post('/productd/edit/:Userid' , multer , def ,  (req  ,res) => {
    req.checkBody('title' ,  'Maxsulotning nomini kiriting').notEmpty()
    req.checkBody('price' ,  'Maxsulotning narxini kiriting').notEmpty()
    req.checkBody('category','Maxsulotning sinfini kiriting').notEmpty()
    req.checkBody('category','Maxsulotning sinfini kiriting').notEmpty()
    req.checkBody('comments','Maxsulot haqida malumot kiriting').notEmpty()

    const errors  = req.validationErrors()
    
    if(errors){
        res.render('add' , {
            title: 'Xatolik bor',
            errors: errors
        })
    }else{    
    const db  =  {
        title : req.body.title.toLowerCase(),
        price : req.body.price,
 
        category : req.body.category,
        comments : req.body.comments,
        sale : req.body.sale,
        photo : req.file.path
    }
    const ids =  {_id : req.params.Userid}
    DbProduct.updateOne(ids , db , (err) => {
        if(err){
            console.log(err)
        }
        else{
        req.flash('success' , 'Mahsulot yuklandi')
        res.redirect('/')
    }
    })
  

    }
   
})
router.get('/cards/:id',    (req, res) => {

    DbProduct.findById(req.params.id, (err, data) => {
        DbUser.findById(data.author , (err , user) => {
            res.render('cards', {
                title: 'cards sahifa',
                db: data,
                names: user    
            })

        })
   
       
  
  })
})

 
router.get('/productd/edit/:id', def ,  (req, res) => {

    DbProduct.findById(req.params.id, (err, data) => {
        if(data.author != req.user._id){
            req.flash('danger' , 'Yol yoq')
            res.redirect('back')
        }
        res.render('add', {
            title: 'cards sahifa',
            db: data,
                 
        })
       
  
  })
})
router.post('/:id' , (req , res) => {
    DbProduct.findById(req.params.id , (err , data) => {
        if(err){
            console.log(err)
        }else{
            data.like += 1
            data.save()
            res.send(data)
        }


    })


})
module.exports  = router
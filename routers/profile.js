const express = require('express')
// const DbProduct = require('../model/Product')
const DbUser = require('../model/User')
const bcryptjs = require('bcryptjs')
const passport = require('passport')
const router = express.Router()
 
router.get('/reg/regis', (req, res) => {
     res.render('register', {
        title: 'Royhatdatn otish sahifa',
    })

})

// router.post('/reg/regis' , (req , res) => {
//     const db = new DbUser(req.body) 
//     db.save((err) => {
//         console.log(err)
//     }) 
//     res.redirect('/')

// })

router.post('/reg/regis' ,    (req  ,res) => {
    req.checkBody('name' ,  'ismingizni kiriting').notEmpty()
    req.checkBody('username' , 'login kiriting').notEmpty()
    req.checkBody('email','Maxsulotning sinfini kiriting').notEmpty()
    req.checkBody('password','Maxsulotning sinfini kiriting').notEmpty()
    req.checkBody('password2','Maxsulot haqida malumot kiriting').equals(req.body.password)

    const errors  = req.validationErrors()
    
    if(errors){
        res.render('register' , {
            title: 'Xatolik bor',
            errors: errors
        })
    }
    else{    
        
        
    const db  = new DbUser({
        name :  req.body.name ,
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
         
    })
    bcryptjs.genSalt(10 , (err , pass) => {
        bcryptjs.hash(db.password , pass  ,(err , hash) => {
            if(err){
                console.log(err)
            }
            else{
                db.password = hash
                db.save((err) => {
                    if(err)
                        throw err
                    else{
                        req.flash('success' , 'Mahsulot yuklandi')
                        res.redirect('/login/log')
                    }
                })
            
            }

        })

    })
  
    }
   
})

router.get('/login/log', (req, res) => {
    res.render('login', {
       title: 'login sahifa',
   })

})

router.post('/login/log', (req, res , next) => {

    passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/login/log',
    failureFlash:    'xatolik bor login jarayonida'  ,
    successFlash:    'urra ulandik'  
}) (req, res , next)

})


router.get('/logout', (req, res) => {
    req.logout()
    req.flash('successs' , "muvaffaqiyatli chqib ketdingiz")
    res.redirect('/')
})
 


module.exports = router
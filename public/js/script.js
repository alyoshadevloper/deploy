 

window.addEventListener('load' , () => {

    let saleing = document.querySelectorAll('.saleing')
    let sale_price = document.querySelectorAll('.sale_price')

    saleing.forEach((element , index) => {
        if(element.innerHTML == ""){
            element.style.display = 'none'
            sale_price[index].style.display = 'none'
        }
    });

 
    let cardIn = document.querySelectorAll('.product_img')
    cardIn.forEach(element => {
        element.addEventListener('click' , () => {
                let id = $(element).attr('cardId')
                window.location.href = id

          })  
    });
    
    
    let wirteLike = document.querySelectorAll('.wirteLike')
    let clickLike = document.querySelectorAll('.clickLike')
    clickLike.forEach((element , value) => {
        element.addEventListener('click' , () => {
            let id = $(element).attr('likeId')
            console.log(id)
           
            fetch(id , {
                method: "POST"
            })
            .then(data => data.json())
            .then(data => {
                wirteLike.forEach((elem , val) => {
                    if(value == val){
                        elem.innerHTML = data.like
                        console.log(data)
                    }
                });
            })


      } , {once: true})   
        });
     
})
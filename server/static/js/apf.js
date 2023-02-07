function opentab() {
    document.getElementById("myNav").style.height = "90%";
  }
  
  function closetab() {
    document.getElementById("myNav").style.height = "0%";
  }





var swiper = new Swiper('.swiper-container', {
nextButton: '.swiper-button-next',
prevButton: '.swiper-button-prev',
slidesPerView: 5,
spaceBetween: 10,
autoplayDisableOnInteraction: false,
loop: true,
breakpoints: {
1024: {
    slidesPerView: 3,
    spaceBetween: 40
},
768: {
    slidesPerView: 3,
    spaceBetween: 30
},
640: {
    slidesPerView: 2,
    spaceBetween: 20
},
320: {
    slidesPerView: 1,
    spaceBetween: 10
}
}
});


const real=document.querySelector('#real')
const imaginary=document.querySelector('#imaginary')
const list = document.querySelector("#list")

function addItem(a,n){
    let x,y;

    if(n==1){
         x=real.value;
         y=imaginary.value;}
    if(n==0) {
        x=a[0];
        y=a[1];}    


    const myli = document.createElement('li');
    myli.innerHTML =" a = " + x + " + j " + y ;
    list.appendChild(myli);
    const span = document.createElement('span');
    span.innerHTML = '×';
    myli.appendChild(span);
    
    const close = document.querySelectorAll('span');
    const txt = document.querySelectorAll('li');

    for(let i=0; i<close.length;i++){
        close[i].addEventListener('click',()=>{
            close[i].parentElement.style.opacity = 0;
            let s = txt[i+1].innerHTML;
            let string = s.replace(/[a+=<spn>×</spn> ]/g, '');
            string=string.replace(/[j]/g, ',');
            let k ;
            for(let i =0; i<string.length;i++){
                if(string[i]==','){k=i;
                break;}
            } 
            r = parseFloat(string.substring(0,k));
            im=parseFloat(string.substring(k+1,string.length));

            let a = getapfzap(r,im);
            let z = a[0];
            let p = a[1];
            // console.log("z = "+z);
            // console.log("p = "+p);

            // console.log("before");
            // console.log("zeros"+zeros);
            // console.log("poles"+poles);

            for(let i = 0; i<zeros.length;i++){

                if(zeros[i][0] == z[0]  && zeros[i][1] == z[1]){
                    for(let j=0;j<poles.length;j++){
                        if(poles[j][0] == p[0]  && poles[j][1] == p[1] ){
                        

                
                            zeros.splice(i, 1);
                            poles.splice(j,1);
                            updateRespose();
                            break;
                        }
                    
                }break;

                
            }}
            // console.log("after");
            // console.log("zeros"+zeros);
            // console.log("poles"+poles);




            setTimeout(()=>{
                close[i].parentElement.style.display = "none";

            },500)

        })
    }
    real.value="";
    imaginary.value = "";
    applyAPF([x,y]);
}
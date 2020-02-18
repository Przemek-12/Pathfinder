var start = document.getElementById("divStart");
var end = document.getElementById("divEnd");
var cont = document.getElementById("container");
var can = document.getElementById("canvas");
var context = can.getContext("2d");
var mousepressed = false;

start.addEventListener("dragend",sdragEnd,false);
start.addEventListener("drag",sdrag,false);
end.addEventListener("dragend",edragEnd,false);
end.addEventListener("drag",edrag,false);
can.addEventListener("mousedown",candrag,false);
can.addEventListener("mouseup", mouseisup, false);

start.style.display="none";
end.style.display="none";

var xstart;//x div start
var ystart;
var xend;//x div end
var yend;
var xcursor;// pozycja kursora podczas rysowania sciany, 
var ycursor;
var xwall;// pozycja elementu sciany po odjeciu z dzielenia przez 30 od pozycji kursora
var ywall;


var listOfWallDivs=[];//lista divow narysowanej sciany

gridDraw();

function divDisplay(){

    if(start.style.display==="none"){
        xstart = event.offsetX;//pobiera x,y kursora wzgledem parenta
        ystart = event.offsetY;
        start.style.display="block";   
        start.style.top= ystart-(ystart%30)+"px";
        start.style.left= xstart-(xstart%30)+"px";
    }
    else if(start.style.display==="block"&& end.style.display==="none"){
        xend = event.offsetX;
        yend = event.offsetY;
        end.style.display="block";
        end.style.top= yend-(yend%30)+"px";
        end.style.left= xend-(xend%30)+"px";
    }
    
}


function sdrag(){
    if(event.clientX>1570){
        ystart=event.clientY-160;
        start.style.left=1470+"px";     
        start.style.top=ystart-15+"px";
    }
    else if(event.clientY>970){
        xstart=event.clientX-100;
        start.style.top=780+"px";     
        start.style.left=xstart-15+"px";
    }
    else{
    xstart=event.clientX-100;
    ystart=event.clientY-160;
    start.style.top=ystart-15+"px";
    start.style.left=xstart-15+"px"; 
    }
}
function sdragEnd(){
    if(event.clientX>1570){
        ystart=event.clientY-160;
        start.style.left=1470+"px";     
        start.style.top=ystart-15+"px";
    }else{
    xstart=event.clientX-100;
    ystart=event.clientY-160;
    start.style.top=ystart-(ystart%30)+"px";
    start.style.left=xstart-(xstart%30)+"px";  
    } 
}
function edrag(){
    xend=event.clientX-100;
    yend=event.clientY-160;
    end.style.top=yend-15+"px";
    end.style.left=xend-15+"px"; 
}
function edragEnd(){
    xend=event.clientX-100;
    yend=event.clientY-160;
    end.style.top=yend-(yend%30)+"px";
    end.style.left=xend-(xend%30)+"px";
}


function gridDraw(){//rysowanie siatki
   
    for(var i=0;i<50;i++){
        for(var m=0;m<27;m++){
            var x= i*30;
            var y= m*30;                            
            context.rect(x,y,30,30);           
            context.stroke();                            
        }
    }  
}


function candrag(){

    mousepressed=true;
    can.onmousemove = function walldrag(){
        if(mousepressed===true&&start.style.display==="block"&&end.style.display==="block"){
            xcursor=event.offsetX;
            ycursor=event.offsetY;
            xwall=xcursor-(xcursor%30);// wspolrzedne elementu sciany
            ywall=ycursor-(ycursor%30);                   
            context.fillRect(xwall,ywall,30,30);
            context.stroke();
            wallOfDivs(xwall,ywall);
        }
    }
}
function mouseisup(){
    mousepressed=false;
}


function wallOfDivs(xdiv, ydiv){ // tworzy divy nalozone na fillrecty    
    listOfWallDivs.push([xdiv,ydiv]);//stworzenie listy 

    var walldiv = document.createElement("div");
    walldiv.id="walldiv";
    walldiv.className='walldiv';
    var parentElement = document.getElementById("container");
    walldiv.style.top=ydiv+"px";
    walldiv.style.left=xdiv+"px";
    parentElement.appendChild(walldiv);

}


// 1 .zbior wszystkich nodow:
var rectangles=[];
var rectanglesVisited=[]; //zbior wierzcholkow przetworzonych przez algorytm, na wejsciu jest pusty, jest niepotrzebny
var tableDistance=[];//minimalne koszty dojscia do poszczegolnych wierzcholkow
var tablePrevious=[];//numery wierzchołków-poprzedników na sciezce do danego wierzcholka
var rectangles2=[];//zbior nodow ktore musza byc przetworzxone, 
var rectangles3=[];//kopia rectangles 2 stanowiaca mape wspolzednych bo z rectangles 4 sa pozniej usuwane nody
var rectangles4=[];//kopia rectangles2 zeby area zrobilo sie cale
var Highway=[];//zbior nodow - droga do celu

function isDijkstra(){//sprawdza czy jest start i meta, zeby nie rysowal obszaru po czyszczenieu
    if(start.style.display==="block"&& end.style.display==="block"){
        Dijkstra();
    }
}

function Dijkstra(){

for(var i=0;i<50;i++){
    for(var m=0;m<27;m++){
        var x= i*30;
        var y= m*30;   
        rectangles.push([x,y]);                                    
    }}   

// 2. zbior wszystkich pomniejszony o sciane, po przejsciu petli ponizej rectangles jest zbiorem do algorytmu, zawiera start i koniec:
for(var t=0;t<listOfWallDivs.length;t++){
    for(var k=0;k<rectangles.length;k++){
        if(listOfWallDivs[t][0]===rectangles[k][0]&&listOfWallDivs[t][1]===rectangles[k][1]){
            rectangles.splice(k,1);
            k--;//zmniejsza indeks bo split przesuwa 
        }
    }
}

//przypisanie zmiennych do wspolrzednych start i end:
var xstart30=xstart-(xstart%30);//x div start po uwzglednieniu reszty z dzielneia przez 30
var ystart30=ystart-(ystart%30);
var xend30=xend-(xend%30);//x div end po uwzglednieniu reszty z dzielneia przez 30
var yend30=yend-(yend%30);


// 3.   

rectangles2.push([xstart30, ystart30]);//na poczatku jest tylko start, pozniej sa dodawane sasiady

//sprawdzanie sasiadujacy na podstawie wspolrzednych
var isover=0;
var t=0;
while(isover===0){
    
    let x=rectangles2[t][0];
    let y=rectangles2[t][1];  
    t++;
        //sasiady dla noda o numerze t
            for(var d=0;d<rectangles.length;d++){

                if(rectangles[d][0]===(x+30) && rectangles[d][1]===y && !rectangles2.includes(rectangles[d])){
                    
                    if(rectangles[d][0]===xend30 && rectangles[d][1]===yend30){
                        rectangles2.push(rectangles[d]);
                        isover=1;
                        break;
                    }
                    else {
                        rectangles2.push(rectangles[d]);
                    }
                }

                else if(rectangles[d][0]===(x-30) && rectangles[d][1]===y && !rectangles2.includes(rectangles[d]) ){
                    
                    if(rectangles[d][0]===xend30 && rectangles[d][1]===yend30){
                        rectangles2.push(rectangles[d]);
                        isover=1;
                        break;
                    }
                    else {
                        rectangles2.push(rectangles[d]);
                    }
                }

                else if(rectangles[d][0]===x && rectangles[d][1]===(y+30) && !rectangles2.includes(rectangles[d]) ){
                   
                    if(rectangles[d][0]===xend30 && rectangles[d][1]===yend30){
                        rectangles2.push(rectangles[d]);
                        isover=1;
                        break;
                    }
                    else {
                        rectangles2.push(rectangles[d]);
                    }
                }

                else if(rectangles[d][0]===x && rectangles[d][1]===(y-30) && !rectangles2.includes(rectangles[d]) ){

                    if(rectangles[d][0]===xend30 && rectangles[d][1]===yend30){
                        rectangles2.push(rectangles[d]);
                        isover=1;
                        break;
                    }
                    else {
                        rectangles2.push(rectangles[d]);
                    }
                }
            }
}



for(var k=0;k<rectangles2.length;k++){//rysowanie obszaru poszukujacego
    rectangles3.push(rectangles2[k]);
    rectangles4.push(rectangles2[k]);
    let o=k;
   setTimeout(function() {
    var areadiv = document.createElement("div");
    areadiv.id="areadiv";
    areadiv.className="areadiv";
    var parentElement = document.getElementById("container");
    areadiv.style.top=rectangles2[o][1]+"px";
    areadiv.style.left=rectangles2[o][0]+"px";
    parentElement.appendChild(areadiv);
    }, 10*(o+1));
}


// 4. Wstawianie nodow do tablic:

tableDistance.push(0);//koszt dojścia dla startowego, indeksy odpowiadaja numerom nodow
tablePrevious.push(-1);
for(var c=1;c<rectangles3.length;c++){// wsadzanie do tableD, koszty dojścia
    tableDistance.push(99999); 
    tablePrevious.push(-1);//ustawienie elementow zastepczych dla previoustable zeby nie byla pusta
}


for(var h=0;h<rectangles3.length;h++){//petla przeglada sasiady elementow rectangles3

    let x=rectangles3[h][0];
    let y=rectangles3[h][1];  

        //sasiady dla noda o numerze t
            for(let d=0;d<rectangles4.length;d++){

                if(rectangles4[d][0]===(x+30) && rectangles4[d][1]===y ){
                    if(tableDistance[d]>1+tableDistance[h]){//dystans jest rowny 1(waga kazdego polaczenia)+dystans do startu dla poprzednika
                        tableDistance[d]=1+tableDistance[h];
                        tablePrevious[d]=h;// t to numer noda poprzedniego
                    }
                    rectanglesVisited.push(rectangles4[h]);
                    rectangles4[h]=[3,3];//node dla ktorego sa szukane sasiady zosytaje przeniesiony do visited a jego wartosc zminiona zeby nie zepsuc indeksow
                }

                else if(rectangles4[d][0]===(x-30) && rectangles4[d][1]===y ){
                    
                    if(tableDistance[d]>1+tableDistance[h]){
                        tableDistance[d]=1+tableDistance[h];
                        tablePrevious[d]=h;
                    }
                    rectanglesVisited.push(rectangles4[h]);
                    rectangles4[h]=[3,3];
                }

                else if(rectangles4[d][0]===x && rectangles4[d][1]===(y+30) ){
                   
                    if(tableDistance[d]>1+tableDistance[h]){
                        tableDistance[d]=1+tableDistance[h];
                        tablePrevious[d]=h;
                    }
                    rectanglesVisited.push(rectangles4[h]);
                    rectangles4[h]=[3,3];
                }

                else if(rectangles4[d][0]===x && rectangles4[d][1]===(y-30) ){
                   
                    if(tableDistance[d]>1+tableDistance[h]){
                        tableDistance[d]=1+tableDistance[h];
                        tablePrevious[d]=h;
                    }
                    rectanglesVisited.push(rectangles4[h]);
                    rectangles4[h]=[3,3];
                }

            }
}


var ihr=0;
Highway.push(rectangles3[rectangles3.length-1]);

while(ihr===0){
    //poprzedni dla zerowego elementu highway
    var numberOfCurrentNode;//pobranie z rectangles 3 indeksu ktory odpowiada pierwszemu elementowi Highway
        for(var m=0;m<rectangles3.length;m++){
            if(rectangles3[m][0]===Highway[0][0]&&rectangles3[m][1]===Highway[0][1]){
                numberOfCurrentNode=m;
            }
        }
    var numberOfPreviousNode=tablePrevious[numberOfCurrentNode];
    Highway.unshift(rectangles3[numberOfPreviousNode]);
    
    if(Highway[0][0]===xstart30 && Highway[0][1]===ystart30){
        ihr=1;
    }

}

setTimeout(function() {

        for(var k=0;k<Highway.length;k++){//rysowanie drogi
            let o=k;
        setTimeout(function() {
            var drivediv = document.createElement("div");
            drivediv.id="drivediv";
            drivediv.className="drivediv";
            var parentElement = document.getElementById("container");
            drivediv.style.top=Highway[o][1]+"px";
            drivediv.style.left=Highway[o][0]+"px";
            parentElement.appendChild(drivediv);
            }, 100*(o+1));
        }

}, rectangles3.length*10);


}


function clearDisplay(){
    start.style.display="none";      
    end.style.display="none";
    context.clearRect(0, 0, 1500, 810); 
    var list = document.getElementById("walldiv");
    var list2 = document.getElementById("areadiv");
    var list3 = document.getElementById("drivediv"); 

    if(cont.contains(list)===true){
        var listWallDiv = document.querySelectorAll('.walldiv');
        for(var v=0;v<listWallDiv.length;v++){       
            listWallDiv[v].parentNode.removeChild(listWallDiv[v]);  
        }
    }
    if(cont.contains(list2)===true){
        var listAreaDiv = document.querySelectorAll('.areadiv');
        for(var v=0;v<listAreaDiv.length;v++){        
            listAreaDiv[v].parentNode.removeChild(listAreaDiv[v]);
        }
    }
    if(cont.contains(list3)===true){
        var listDriveDiv = document.querySelectorAll('.drivediv');
        for(var v=0;v<listDriveDiv.length;v++){        
            listDriveDiv[v].parentNode.removeChild(listDriveDiv[v]);
        }
    }

    rectangles=[];
    rectangles2=[];
    rectangles3=[];
    rectangles4=[];
    tableDistance=[];
    tablePrevious=[];
    Highway=[];  
    listOfWallDivs=[];
    gridDraw(); 
}




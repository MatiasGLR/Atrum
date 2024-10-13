const apiEndPoint = "./dbjson.json";

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Databases/players.db');

const display = document.querySelector("#display-data");
const input = document.querySelector("#input");
const edicion = document.querySelector("#edicion");
const habilidad = document.querySelector("#habilidad");
const hab_lv = document.querySelector("#hab_lv");
const artista = document.querySelector("#artista");
const filtro_uid = document.querySelector("#uid");
const rareza = document.querySelector("#rareza");
const informacion = document.querySelector("#informacion");

const getData = async () => {
    const res = await fetch(apiEndPoint);
    const data = await res.json();
    return data;
}

async function mostrarEquipo(cartaid, slot) {
    if(cartaid == 0) document.querySelector("#carta_equipo_"+slot+"").innerHTML = "";
    const payload = await getData();
    let datos = payload.filter((carta) => {
        if(carta.uid == cartaid) return carta;
    }).map((object) => {
        const {uid, id, nombre, rareza, coleccion, tienda, linktienda, estado, numero, numerode, artista,
            hab0nombre,hab0desc,hab0color,hab0colort,hab0tipo,hab1nombre,hab1desc,hab1color,hab1colort,hab1tipo,
            hab2nombre,hab2desc,hab2color,hab2colort,hab2tipo,hab3nombre,hab3desc,hab3color,hab3colort,hab3tipo,
            hab4nombre,hab4desc,hab4color,hab4colort,hab4tipo,especialidad,espcolor,locacion,ubicacion
        } = object;
        document.querySelector("#carta_equipo_"+slot+"").innerHTML = `
            <div class="carta_equipo_imagen text-center" id="carta_equipo_imagen_"+slot+"">
                <img style="width:50%; object-fit: cover;" src="./Cartas/`+id+`.webp" alt="">
            </div>
            <div class="carta_equipo_titulo" id="carta_equipo_titulo_"+slot+"">`+ nombre +`</div>
            <div class="bordeado `+hab4color+`">(4) `+hab4nombre+` (`+hab4tipo+`)<br> `+hab4colort+`<br>
            `+hab4desc+`</div>
            <div class="bordeado `+hab3color+`">(3) `+hab3nombre+` (`+hab3tipo+`)<br> `+hab3colort+`<br>
            `+hab3desc+`</div>
            <div class="bordeado `+hab2color+`">(2) `+hab2nombre+` (`+hab2tipo+`)<br> `+hab2colort+`<br>
            `+hab2desc+`</div>
            <div class="bordeado `+hab1color+`">(1) `+hab1nombre+` (`+hab1tipo+`)<br> `+hab1colort+`<br>
            `+hab1desc+`</div>
            <div class="`+hab0color+`">(0) `+hab0nombre+` (`+hab0tipo+`)<br> `+hab0colort+`<br>
            `+hab0desc+`</div><br>
            <button class="btn btn-danger w-100" style="border-radius:0px" onclick="mostrarEquipo(0, `+slot+`)">Eliminar</button>
        `;
    });
    return 1;
}

const mostrarCartas = async () => {
    let query_nombre = input.value;
    let hab = habilidad.value;
    let lvhab = hab_lv.value;
    
    const payload = await getData();

    let dataDisplay = payload.filter((carta) => {
        let yes = 0;
        if(rareza.value != "") {
            if(rareza.value == carta.rareza) yes = 1; else return 0;
        }
        if(filtro_uid.value > 0) {
            if(filtro_uid.value == carta.numero) yes = 1; else return 0;
        }
        if(artista.value != ""){
            if(carta.artista.toLowerCase().includes(artista.value.toLowerCase())) yes = 1; else return 0;
        }
        if(hab === "") yes = 1;
        else {
            if(lvhab == -1 || lvhab == "") { if(tieneHabilidad(carta, hab) == 1) yes = 1; else return 0; }
            else { if(tieneHabilidadEn(carta, hab, lvhab)) yes = 1; else return 0; }
        }
        if(query_nombre === "") yes = 1;
        else if(carta.nombre.toLowerCase().includes(query_nombre.toLowerCase())) yes = 1; else return 0;
        
        if(carta.coleccion == "Personalizadas") if(edicion.value != "Personalizadas") return 0;
        if(edicion.value != "") {
            if(edicion.value == "Inicio") {
                if(cajaInicio(carta.uid)) yes = 1; else return 0;
            }
            else if(edicion.value.toLowerCase().includes(carta.coleccion.toLowerCase())) yes = 1; else return 0;
        } 
        if(yes == 1) return carta;
    }).map((object) => {
        const {uid, id, nombre, rareza, coleccion, tienda, linktienda, estado, numero, numerode, artista,
            hab0nombre,hab0desc,hab0color,hab0colort,hab0tipo,hab1nombre,hab1desc,hab1color,hab1colort,hab1tipo,
            hab2nombre,hab2desc,hab2color,hab2colort,hab2tipo,hab3nombre,hab3desc,hab3color,hab3colort,hab3tipo,
            hab4nombre,hab4desc,hab4color,hab4colort,hab4tipo,especialidad,espcolor,locacion,ubicacion
        } = object;
        let tiendastring = "", infostring = "";
        if(tienda === "") { tiendastring = ""}
        else tiendastring = `<b>Tienda:</b> <a href="`+ linktienda +`">` + tienda +`</a><br><b>Localidad:</b>  <a href="`+ubicacion+`">`+ locacion +`</a><br>`
        if(informacion.checked) {
            infostring = `<b>Rareza:</b> <x class="`+rareza+`">` + rareza +`</x><br>
                <b>Colección:</b> ` + coleccion +` (`+numero+`/`+numerode+`)<br>
                `+ tiendastring +`
                <b>Estado:</b> `+ estado +`<br>
                <b>Artista:</b> `+ artista +`<br>
                <b>Especialidad:</b> <x class="`+espcolor+`">`+ especialidad +`</x><br>
                <br>`;
        }
        return `
        <div class="titulo col-md-3">
            <p>
                <a class="" data-bs-toggle="collapse" href="#`+id+`" role="button" aria-expanded="false" aria-controls="`+id+`">
                    <img style="width:150px; height:150px; object-fit: cover;" src="./Cartas/`+id+`.webp" alt=""><br>
                    `+ nombre +`
                </a>
            </p>
            <div class="collapse" id="`+id+`">
                `+infostring+`
                <b>Habilidades</b>
                <div class="bordeado `+hab4color+`">(4) `+hab4nombre+` (`+hab4tipo+`)<br> `+hab4colort+`<br>
                `+hab4desc+`</div>
                <div class="bordeado `+hab3color+`">(3) `+hab3nombre+` (`+hab3tipo+`)<br> `+hab3colort+`<br>
                `+hab3desc+`</div>
                <div class="bordeado `+hab2color+`">(2) `+hab2nombre+` (`+hab2tipo+`)<br> `+hab2colort+`<br>
                `+hab2desc+`</div>
                <div class="bordeado `+hab1color+`">(1) `+hab1nombre+` (`+hab1tipo+`)<br> `+hab1colort+`<br>
                `+hab1desc+`</div>
                <div class="`+hab0color+`">(0) `+hab0nombre+` (`+hab0tipo+`)<br> `+hab0colort+`<br>
                `+hab0desc+`</div>
                <br>
                <button onclick="mostrarEquipo(`+uid+`, 1)" class="btn btn-primary">1</button>
                <button onclick="mostrarEquipo(`+uid+`, 2)"class="btn btn-primary">2</button>
                <button onclick="mostrarEquipo(`+uid+`, 3)"class="btn btn-primary">3</button>
            </div>
            <hr>
            </p>
        </div>
        `
    }).join("");

    display.innerHTML = dataDisplay;
}

mostrarCartas();

habilidad.addEventListener("input", () => {
    mostrarCartas();
});

input.addEventListener("input", () => {
    mostrarCartas();
});

filtro_uid.addEventListener("input", () => {
    mostrarCartas();
});

function tieneHabilidad(carta, hab) {
    if((carta.hab0nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab0desc.toLowerCase().includes(hab.toLowerCase()))) return 1;
    if((carta.hab1nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab1desc.toLowerCase().includes(hab.toLowerCase()))) return 1;
    if((carta.hab2nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab2desc.toLowerCase().includes(hab.toLowerCase()))) return 1;
    if((carta.hab3nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab3desc.toLowerCase().includes(hab.toLowerCase()))) return 1;
    if((carta.hab4nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab4desc.toLowerCase().includes(hab.toLowerCase()))) return 1;
    return 0;
}

function tieneHabilidadEn(carta, hab, slot){
    if(slot == 0) { if((carta.hab0nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab0desc.toLowerCase().includes(hab.toLowerCase()))) return 1; } 
    else if(slot == 1) { if((carta.hab1nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab1desc.toLowerCase().includes(hab.toLowerCase()))) return 1; }
    else if(slot == 2) { if((carta.hab2nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab2desc.toLowerCase().includes(hab.toLowerCase()))) return 1; }
    else if(slot == 3) { if((carta.hab3nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab3desc.toLowerCase().includes(hab.toLowerCase()))) return 1; }
    else if(slot == 4) { if((carta.hab4nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab4desc.toLowerCase().includes(hab.toLowerCase()))) return 1; }
    return 0;
}

function cajaInicio(uid) {
    switch (uid) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 78:
            return 1;
        default: return 0;
    }
}

const vida_arriba = document.querySelector("#vida_arriba");
const vida_abajo = document.querySelector("#vida_abajo");

let var_vidaArriba = 10;
let var_vidaAbajo = 10;

document.querySelector('#boton_arriba_bajar').addEventListener("click", () => {
    var_vidaArriba = Math.max(var_vidaArriba-1,0);
    vida_arriba.innerHTML = "<div style='font-size:80px'>"+var_vidaArriba+"</div>";
    return 1;10
});
document.querySelector('#boton_arriba_subir').addEventListener("click", () => {
    var_vidaArriba = Math.min(var_vidaArriba+1,20);
    vida_arriba.innerHTML = "<div style='font-size:80px'>"+var_vidaArriba+"</div>";
    return 1;
});
document.querySelector('#boton_abajo_bajar').addEventListener("click", () => {
    var_vidaAbajo = Math.max(var_vidaAbajo-1,0);
    vida_abajo.innerHTML = "<div style='font-size:80px'>"+var_vidaAbajo+"</div>";
    return 1;
});
document.querySelector('#boton_abajo_subir').addEventListener("click", () => {
    var_vidaAbajo = Math.min(var_vidaAbajo+1,20);
    vida_abajo.innerHTML = "<div style='font-size:80px'>"+var_vidaAbajo+"</div>";
    return 1;
});













let hours = `00`,
      minutes = `00`,
      seconds = `00`,
      chronometerDisplay = document.querySelector(`[data-chronometer]`),
      chronometerCall,
      preparationCall,
      preparationSeconds = 30

  function chronometer() {

    seconds ++

    if (seconds < 10) seconds = `0` + seconds

    if (seconds > 59) {
      seconds = `00`
      minutes ++

      if (minutes < 10) minutes = `0` + minutes
    }

    if (minutes > 59) {
      minutes = `00`
      hours ++
      
      if (hours < 10) hours = `0` + hours
    }

    chronometerDisplay.textContent = `${hours}:${minutes}:${seconds}`

    if(minutes == 40 && seconds == 0) {
        pause();
    }
  }

  function chronometerpreparation() {

    if(preparationSeconds == 0) {
        clearInterval(preparationCall)
        play()
    } else {
        preparationSeconds--;

        document.querySelector("#boton_play").textContent = preparationSeconds;
    }
  }

  function preparacion() {
    preparationCall = setInterval(chronometerpreparation, 1000)
    document.querySelector("#boton_play").textContent = 30;
    document.querySelector("#boton_play").style.color = "red";
    document.querySelector("#boton_play").setAttribute("disabled","true");
  }

  function play() {
    chronometerCall = setInterval(chronometer, 1000)
    diezArriba();
    diezAbajo();
    document.querySelector("#boton_play").style.color = "black";
    document.querySelector("#boton_play").textContent="00:00:00";
    document.querySelector("#boton_play").setAttribute("disabled","true");
  }

  function pause() {
    clearInterval(chronometerCall)
    document.querySelector("#boton_play").removeAttribute(`disabled`)
    document.querySelector("#boton_play").style.color = "red";
  }

  function reset() {
    clearInterval(chronometerCall);
    clearInterval(preparationCall);
    preparationSeconds = 30;
    hours = `00`;
    minutes = `00`;
    seconds = `00`;
    document.querySelector("#boton_play").removeAttribute(`disabled`)
    document.querySelector("#boton_play").style.color = "black";
    document.querySelector("#boton_play").textContent ="ATRUM";

    diezArriba();
    diezAbajo();
  }


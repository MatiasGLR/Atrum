const apiEndPoint = "./dbjson.json";
const display = document.querySelector("#display-data");
const input = document.querySelector("#input");
const edicion = document.querySelector("#edicion");
const habilidad = document.querySelector("#habilidad");
const hab_lv = document.querySelector("#hab_lv");

const getData = async () => {
    const res = await fetch(apiEndPoint);
    const data = await res.json();
    return data;
}

const mostrarCartas = async () => {
    let query_nombre = input.value;
    let hab = habilidad.value;
    let lvhab = hab_lv.value;
    
    const payload = await getData();

    let dataDisplay = payload.filter((carta) => {
        let yes = 0;
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
        const {id, nombre, rareza, coleccion, tienda, linktienda, estado, numero, numerode, artista,
            hab0nombre,hab0desc,hab0color,hab0colort,hab0tipo,hab1nombre,hab1desc,hab1color,hab1colort,hab1tipo,
            hab2nombre,hab2desc,hab2color,hab2colort,hab2tipo,hab3nombre,hab3desc,hab3color,hab3colort,hab3tipo,
            hab4nombre,hab4desc,hab4color,hab4colort,hab4tipo,especialidad,espcolor,locacion,ubicacion
        } = object;
        let tiendastring;
        if(tienda === "") { tiendastring = ""}
        else tiendastring = `<b>Tienda:</b> <a href="`+ linktienda +`">` + tienda +`</a><br><b>Localidad:</b>  <a href="`+ubicacion+`">`+ locacion +`</a><br>`
        return `
        <div class="titulo col-md-3">
            <p>
                <a class="" data-bs-toggle="collapse" href="#`+id+`" role="button" aria-expanded="false" aria-controls="`+id+`">
                    <img style="width:150px" src="./Cartas/`+id+`.webp" alt=""><br>
                    `+ nombre +`
                </a>
            </p>
            <div class="collapse" id="`+id+`">
                
                <b>Rareza:</b> <x class="`+rareza+`">` + rareza +`</x><br>
                <b>Colección:</b> ` + coleccion +` (`+numero+`/`+numerode+`)<br>
                `+ tiendastring +`
                <b>Estado:</b> `+ estado +`<br>
                <b>Artista:</b> `+ artista +`<br>
                <b>Especialidad:</b> <x class="`+espcolor+`">`+ especialidad +`</x><br>
                <br>
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
                <button class="btn btn-primary">1</button>
                <button class="btn btn-primary">2</button>
                <button class="btn btn-primary">3</button>
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
    vida_arriba.innerHTML = ""+var_vidaArriba+"";
    return 1;
});
document.querySelector('#boton_arriba_subir').addEventListener("click", () => {
    var_vidaArriba = Math.min(var_vidaArriba+1,20);
    vida_arriba.innerHTML = ""+var_vidaArriba+"";
    return 1;
});
document.querySelector('#boton_abajo_bajar').addEventListener("click", () => {
    var_vidaAbajo = Math.max(var_vidaAbajo-1,0);
    vida_abajo.innerHTML = ""+var_vidaAbajo+"";
    return 1;
});
document.querySelector('#boton_abajo_subir').addEventListener("click", () => {
    var_vidaAbajo = Math.min(var_vidaAbajo+1,20);
    vida_abajo.innerHTML = ""+var_vidaAbajo+"";
    return 1;
});
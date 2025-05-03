const apiEndPoint = "./dbjson.json";

const display = document.querySelector("#display-data");
const input = document.querySelector("#input");
const edicion = document.querySelector("#edicion");
const habilidad = document.querySelector("#habilidad");
const hab_lv = document.querySelector("#hab_lv");
const artista = document.querySelector("#artista");
const filtro_uid = document.querySelector("#uid");
const rareza = document.querySelector("#rareza");
const informacion = document.querySelector("#informacion");
const nofuncionales = document.querySelector("#nofuncionales");

const tablaliga = document.querySelector("#tabla-liga");

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
                <img style="width:50%; object-fit: cover;" src="./Cartas/${id}.webp" alt="">
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

    // Obtener los datos
    const payload = await getData();

    // Mostrar u ocultar elementos según la edición seleccionada
    if (edicion.value == "Deidades") {
        $("#paquete").css("display", "inline-block");
        $("#rareza").css("display", "none");
    } else {
        $("#rareza").css("display", "inline-block");
        $("#paquete").css("display", "none");
    }

    // Filtrar las cartas según los valores seleccionados en los filtros
    let dataDisplay = payload.filter((carta) => {
        let yes = false;

        if (rareza.value !== "") {
            if (rareza.value === carta.rareza) yes = true;
            else return false;
        }
        if (filtro_uid.value != "") {
            if (parseInt(filtro_uid.value) == carta.numero) yes = true;
            else return false;
        }
        if (artista.value != "") {
            if (carta.artista.toLowerCase().includes(artista.value.toLowerCase())) yes = true;
            else return false;
        }
        if (hab === "") yes = true;
        else {
            if (lvhab == -1 || lvhab == "") {
                if (tieneHabilidad(carta, hab) === 1) yes = true;
                else return false;
            } else {
                if (tieneHabilidadEn(carta, hab, lvhab)) yes = true;
                else return false;
            }
        }
        if (query_nombre === "") yes = true;
        else if (carta.nombre.toLowerCase().includes(query_nombre.toLowerCase())) yes = true;
        else return false;

        if (!nofuncionales.checked) {
            if (carta.estado !== "No funcional") yes = true;
            else return false;
        }

        if (carta.coleccion === "Personalizadas" && edicion.value !== "Personalizadas") return false;
        if (carta.coleccion === "Deidades") {
            if (edicion.value !== "Deidades") return false;
            if (document.querySelector("#paquete").value !== "") {
                if (carta.rareza.includes(document.querySelector("#paquete").value)) yes = true;
                else return false;
            }
        }

        if (edicion.value !== "") {
            if (edicion.value === "Inicio") {
                if (cajaInicio(carta.uid)) yes = true;
                else return false;
            } else if (edicion.value === "Inicio2") {
                if (cajaInicio2(carta.uid)) yes = true;
                else return false;
            } else if (
                edicion.value.toLowerCase().includes(carta.coleccion.toLowerCase()) ||
                carta.coleccion.toLowerCase().includes(edicion.value.toLowerCase())
            ) yes = true;
            else return false;
        }

        return yes;
    }).map((carta) => {
        const {
            uid, id, nombre, rareza, coleccion, tienda, linktienda, estado, numero, numerode, artista,
            hab0nombre, hab0desc, hab0color, hab0colort, hab0tipo,
            hab1nombre, hab1desc, hab1color, hab1colort, hab1tipo,
            hab2nombre, hab2desc, hab2color, hab2colort, hab2tipo,
            hab3nombre, hab3desc, hab3color, hab3colort, hab3tipo,
            hab4nombre, hab4desc, hab4color, hab4colort, hab4tipo,
            locacion, ubicacion
        } = carta;

        let tiendastring = "", infostring = "";

        if (tienda !== "") {
            tiendastring = `<b>Tienda:</b> <a href="${linktienda}">${tienda}</a><br><b>Localidad:</b> <a href="${ubicacion}">${locacion}</a><br>`;
        }

        if (!informacion.checked) {
            infostring = `<b>Rareza:</b> <x class="${rareza}">${rareza}</x><br>
                          <b>Colección:</b> ${coleccion} (${numero}/${numerode})<br>
                          ${tiendastring}
                          <b>Estado:</b> ${estado}<br>
                          <b>Artista:</b> ${artista}<br>
                          <b>Especialidad:</b> <x class="${hab0color}">${hab0colort}</x><br><br>`;
        }

        return `
            <div class="titulo col-md-3">
                <p>
                    <a class="" data-bs-toggle="collapse" href="#${id}" role="button" aria-expanded="false" aria-controls="${id}">
                        <img style="width:150px; height:150px; object-fit: cover;" src="./Cartas/${id}.webp" alt=""><br>
                        ${nombre}
                    </a>
                </p>
                <div class="collapse" id="${id}">
                    ${infostring}
                    <b>Habilidades</b>
                    <div onclick="buscarHabilidad('${hab4nombre}')" class="bordeado ${hab4color}">(4) ${hab4nombre} (${hab4tipo})<br> ${hab4colort}<br>${hab4desc}</div>
                    <div onclick="buscarHabilidad('${hab3nombre}')" class="bordeado ${hab3color}">(3) ${hab3nombre} (${hab3tipo})<br> ${hab3colort}<br>${hab3desc}</div>
                    <div onclick="buscarHabilidad('${hab2nombre}')" class="bordeado ${hab2color}">(2) ${hab2nombre} (${hab2tipo})<br> ${hab2colort}<br>${hab2desc}</div>
                    <div onclick="buscarHabilidad('${hab1nombre}')" class="bordeado ${hab1color}">(1) ${hab1nombre} (${hab1tipo})<br> ${hab1colort}<br>${hab1desc}</div>
                    <div onclick="buscarHabilidad('${hab0nombre}')" class="${hab0color}">(0) ${hab0nombre} (${hab0tipo})<br> ${hab0colort}<br>${hab0desc}</div>
                    <br>
                    <button onclick="mostrarEquipo(${uid}, 1)" class="btn btn-primary">1</button>
                    <button onclick="mostrarEquipo(${uid}, 2)" class="btn btn-primary">2</button>
                    <button onclick="mostrarEquipo(${uid}, 3)" class="btn btn-primary">3</button>
                </div>
                <hr>
            </div>
        `;
    });

    // Insertar el HTML generado en el contenedor
    display.innerHTML = dataDisplay.join("");
};

function borrarVelo() {
    document.querySelector("#deidadesmodal_velo").innerHTML = "";
}

async function jugarVelo(norep) {
    var str = "", rand = Math.floor(Math.random() * 9);
    
    while(rand == Math.abs(Number(norep)+100)) {
        rand = Math.floor(Math.random() * 3);
    }

    str = `<div class="d-flex flex-wrap justify-content-around">`

    await $.get("./dbjson.json", function(textString) {
        const index_json = Object.entries(textString);
        for(let i = 0; i < index_json.length ; i++) {
            const json_a = JSON.parse(JSON.stringify(index_json[i][1]));
            if(json_a.uid == -100-rand) {
                str = str.concat(`
                <p class="mt-2">
                    <b class="text-info">`+ json_a.nombre +`</b><br>
                    <img style="width:150px; height:150px; object-fit: cover;" src="./Cartas/`+json_a.id+`.webp" alt="">
                </p>
                <div class="" id="`+json_a.id+`">
                    <b>Habilidades</b>
                    <div class="bordeado `+json_a.hab6color+`"><b>(Costo: `+json_a.hab6coste+`)</b> `+json_a.hab6nombre+` (`+json_a.hab6tipo+`)<br> `+json_a.hab6colort+`<br>
                    `+json_a.hab6desc+`</div>
                    <div class="bordeado `+json_a.hab5color+`"><b>(Costo: `+json_a.hab5coste+`)</b> `+json_a.hab5nombre+` (`+json_a.hab5tipo+`)<br> `+json_a.hab5colort+`<br>
                    `+json_a.hab5desc+`</div>
                    <div class="bordeado `+json_a.hab4color+`"><b>(Costo: `+json_a.hab4coste+`)</b> `+json_a.hab4nombre+` (`+json_a.hab4tipo+`)<br> `+json_a.hab4colort+`<br>
                    `+json_a.hab4desc+`</div>
                    <div class="bordeado `+json_a.hab3color+`"><b>(Costo: `+json_a.hab3coste+`)</b> `+json_a.hab3nombre+` (`+json_a.hab3tipo+`)<br> `+json_a.hab3colort+`<br>
                    `+json_a.hab3desc+`</div>
                    <div class="bordeado `+json_a.hab2color+`"><b>(Costo: `+json_a.hab2coste+`)</b> `+json_a.hab2nombre+` (`+json_a.hab2tipo+`)<br> `+json_a.hab2colort+`<br>
                    `+json_a.hab2desc+`</div>
                    <div class="bordeado `+json_a.hab1color+`"><b>(Costo: `+json_a.hab1coste+`)</b> `+json_a.hab1nombre+` (`+json_a.hab1tipo+`)<br> `+json_a.hab1colort+`<br>
                    `+json_a.hab1desc+`</div>
                    <div class="`+json_a.hab0color+`"><b>(Costo: `+json_a.hab0coste+`)</b> `+json_a.hab0nombre+` (`+json_a.hab0tipo+`)<br> `+json_a.hab0colort+`<br>
                    `+json_a.hab0desc+`</div>
                    <br>
                    <button onclick="borrarVelo()" class="btn btn-danger">Eliminar Velo</button>
                </div>`);
            }
        }
    });

    str = str.concat(`</div>`);

    document.querySelector("#deidadesmodal_velo").innerHTML = str;
}

const cantjug = document.querySelector("#cantidadjugadores");
const vidajug = document.querySelector("#vidajugadores");

function vidaDeidades() {
    const cj = cantjug.value; 
    let str = "";

    document.querySelector("#vida0").value = cj*30;

    if(cj != 0) {
        for(let i=1;i<=cj;i++) {
            str = str.concat(`
                <div class="p-2 align-middle">
                    <input id="nombreJugador" class="btn" style="height:30px; border:1px solid gray" type="text" placeholder="Nombre del jugador">
                    <button class="btn btn-danger" onclick="VidaDeidad(`+i+`, -1)">-</button>
                    <input id="vida`+i+`" class="btn btn-secondary" onclick="VidaDeidad(`+i+`, 10)" style="width:50px; font-size:15px" type="text" value="10">
                    <button class="btn btn-success" onclick="VidaDeidad(`+i+`, 1)">+</button>
                </div> 
            `);
        }
    }

    document.querySelector("#vidajugadores").innerHTML = str;
}

function VidaDeidad(jugador, cantidad) {
    let vidaact = Number(document.querySelector("#vida"+jugador+"").value);
    if(jugador > 0) {
        document.querySelector("#vida"+jugador+"").value = Math.min(20, Math.max(0, vidaact + cantidad));
    } else document.querySelector("#vida"+jugador+"").value = Math.max(0, vidaact + cantidad);
}

async function jugarDeidad(carta) {
    var str = "";

    str = `<div class="d-flex flex-wrap justify-content-around">`

    await $.get("./dbjson.json", function(textString) {
        const index_json = Object.entries(textString);
        for(let i = 0; i < index_json.length ; i++) {
            const json_a = JSON.parse(JSON.stringify(index_json[i][1]));
            if(json_a.uid == carta) {
                document.querySelector("#nombreDeidad").value = json_a.nombrer;
                str = str.concat(`
                <p>
                    <br>
                    <img style="width:150px; height:150px; object-fit: cover;" src="./Cartas/`+json_a.id+`.webp" alt="">
                </p>
                <div class="" id="`+json_a.id+`">
                    <b>Habilidades</b>
                    <div class="bordeado `+json_a.hab6color+`"><b>(Costo: `+json_a.hab6coste+`)</b> `+json_a.hab6nombre+` (`+json_a.hab6tipo+`)<br> `+json_a.hab6colort+`<br>
                    `+json_a.hab6desc+`</div>
                    <div class="bordeado `+json_a.hab5color+`"><b>(Costo: `+json_a.hab5coste+`)</b> `+json_a.hab5nombre+` (`+json_a.hab5tipo+`)<br> `+json_a.hab5colort+`<br>
                    `+json_a.hab5desc+`</div>
                    <div class="bordeado `+json_a.hab4color+`"><b>(Costo: `+json_a.hab4coste+`)</b> `+json_a.hab4nombre+` (`+json_a.hab4tipo+`)<br> `+json_a.hab4colort+`<br>
                    `+json_a.hab4desc+`</div>
                    <div class="bordeado `+json_a.hab3color+`"><b>(Costo: `+json_a.hab3coste+`)</b> `+json_a.hab3nombre+` (`+json_a.hab3tipo+`)<br> `+json_a.hab3colort+`<br>
                    `+json_a.hab3desc+`</div>
                    <div class="bordeado `+json_a.hab2color+`"><b>(Costo: `+json_a.hab2coste+`)</b> `+json_a.hab2nombre+` (`+json_a.hab2tipo+`)<br> `+json_a.hab2colort+`<br>
                    `+json_a.hab2desc+`</div>
                    <div class="bordeado `+json_a.hab1color+`"><b>(Costo: `+json_a.hab1coste+`)</b> `+json_a.hab1nombre+` (`+json_a.hab1tipo+`)<br> `+json_a.hab1colort+`<br>
                    `+json_a.hab1desc+`</div>
                    <div class="`+json_a.hab0color+`"><b>(Costo: `+json_a.hab0coste+`)</b> `+json_a.hab0nombre+` (`+json_a.hab0tipo+`)<br> `+json_a.hab0colort+`<br>
                    `+json_a.hab0desc+`</div>
                    <br>
                    <button onclick="jugarVelo(`+json_a.uid+`)" class="btn btn-primary">Desgarro del Velo</button>
                    <button class="btn btn-warning" onclick="textoDeidades()">Terminar combate</button>
                </div>`);
            }
        }
    });

    str = str.concat(`</div>`);

    $('#deidadesModal').modal('show');

    document.querySelector("#deidadesmodal_data").innerHTML = str;
}

function textoDeidades() {
    document.querySelector("#cantidadjugadores").value = "0";
    vidaDeidades();
    document.querySelector("#nombreDeidad").value = "";
    document.querySelector("#deidadesmodal_data").innerHTML = `
        <p onclick="jugarDeidad(-100)"><a href="#">Untoz'Eleth 'El Arrasador de Mundos'</a></p>
        <p onclick="jugarDeidad(-101)"><a href="#">Nedhir'Ithul 'La Peste de las Nebulosas'</a></p>
        <p onclick="jugarDeidad(-102)"><a href="#">Amend'Thi 'El Devorador de Novas'</a></p>
        <p onclick="jugarDeidad(-103)"><a href="#">Yod'Endox 'El Quiebra Galaxias'</a></p>
        <p onclick="jugarDeidad(-104)"><a href="#">Nigheb'Vhosh 'La Constelación infernal'</a></p>
        <p onclick="jugarDeidad(-105)"><a href="#">Onca'Tholpuz 'El Triturador de Estrellas'</a></p>
        <p onclick="jugarDeidad(-106)"><a href="#">Ghrizt'Exeler 'El Derretidor de Sueños'</a></p>
        <p onclick="jugarDeidad(-107)"><a href="#">Thaiog'Nurka 'La Presencia del Fin'</a></p>
        <p onclick="jugarDeidad(-108)"><a href="#">Yivhe'Urlath 'El Negador de la Existencia'</a></p>
    `;
    borrarVelo();
}

let timeoutId = null, manteniendo = false  // in milliseconds

function moverse(lugar) {
    if(lugar == 0) {
        const ventana = document.querySelector("#d_inicial");
        ventana.style.display = "flex";
        display.innerHTML = "";
        document.querySelector("#contadorvida").style.display = "none";
        cerrarmenuvida();
    }
    if(lugar == 1) {
        const ventana = document.querySelector("#d_inicial");
        ventana.style.display = "none";
        mostrarCartas();
    }
    if(lugar == 2) {
        const ventana = document.querySelector("#d_inicial");
        ventana.style.display = "none";
        const vida = document.querySelector("#contadorvida");
        vida.style.display = "flex";
    }
}

function makeItBlack(btn) {
    $(btn).css("background-color", "rgb(48, 48, 48)");
}

function changeColor(btn) {
    if(timeoutId == null && manteniendo == false) {
        if($(btn).css("background-color") == "rgb(48, 48, 48)") $(btn).css("background-color", "rgb(200, 200, 200)");
        else if($(btn).css("background-color") == "rgb(200, 200, 200)") $(btn).css("background-color", "rgb(76, 189, 19)");
        else if($(btn).css("background-color") == "rgb(76, 189, 19)") $(btn).css("background-color", "rgb(244, 247, 139)");
        else if($(btn).css("background-color") == "rgb(244, 247, 139)") $(btn).css("background-color", "rgb(249, 109, 90)");
        else if($(btn).css("background-color") == "rgb(249, 109, 90)") $(btn).css("background-color", "rgb(115, 200, 251)");
        else if($(btn).css("background-color") == "rgb(115, 200, 251)") $(btn).css("background-color", "rgb(177, 132, 251)");
        else if($(btn).css("background-color") == "rgb(177, 132, 251)") $(btn).css("background-color", "rgb(48, 48, 48)");
    }
    manteniendo = false;
}

function toggleAltar(btn) {
    if($(btn).css("background-color") == "rgb(127, 246, 129)") {
        $(btn).css("background-color", "rgb(249, 114, 114)");
        $(btn).html("BAJÉ ALTAR");
    }
    else if($(btn).css("background-color") == "rgb(249, 114, 114)") {
        $(btn).css("background-color", "rgb(127, 246, 129)");
        $(btn).html("NO BAJÉ ALTAR");
    }
}

function toggleAltarOn(btn) {
    $(btn).css("background-color", "rgb(127, 246, 129)");
    $(btn).html("NO BAJÉ ALTAR");
}

function boton_clickeado(btn) {
    if(timeoutId == null) {
        timeoutId = setTimeout(() => {
            makeItBlack(btn);
            clearTimeout(timeoutId);
            timeoutId = null;
            manteniendo = true;
        }, 500);
    }
}

function boton_soltado(btn) {
    clearTimeout(timeoutId);
    timeoutId = null;
    setTimeout(() => {
        manteniendo = false;
    }, 200);
}

habilidad.addEventListener("input", () => {
    mostrarCartas();
});

input.addEventListener("input", () => {
    mostrarCartas();
});

filtro_uid.addEventListener("input", () => {
    mostrarCartas();
});

function buscarHabilidad(nombre) {
    habilidad.value = nombre;
    mostrarCartas();
}

function tieneHabilidad(carta, hab) {
    if(carta.hab0nombre) if((carta.hab0nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab0desc.toLowerCase().includes(hab.toLowerCase()))) return 1;
    if(carta.hab1nombre) if((carta.hab1nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab1desc.toLowerCase().includes(hab.toLowerCase()))) return 1;
    if(carta.hab2nombre) if((carta.hab2nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab2desc.toLowerCase().includes(hab.toLowerCase()))) return 1;
    if(carta.hab3nombre) if((carta.hab3nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab3desc.toLowerCase().includes(hab.toLowerCase()))) return 1;
    if(carta.hab4nombre) if((carta.hab4nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab4desc.toLowerCase().includes(hab.toLowerCase()))) return 1;
    if(carta.coleccion.toLowerCase().includes("deidades")) {
        if((carta.hab5nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab5desc.toLowerCase().includes(hab.toLowerCase()))) return 1;
        if((carta.hab6nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab6desc.toLowerCase().includes(hab.toLowerCase()))) return 1;
    }
    return 0;
}

function tieneHabilidadEn(carta, hab, slot){
    if(slot == 0 && carta.hab0nombre) { if((carta.hab0nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab0desc.toLowerCase().includes(hab.toLowerCase()))) return 1; } 
    else if(slot == 1 && carta.hab1nombre) { if((carta.hab1nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab1desc.toLowerCase().includes(hab.toLowerCase()))) return 1; }
    else if(slot == 2 && carta.hab2nombre) { if((carta.hab2nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab2desc.toLowerCase().includes(hab.toLowerCase()))) return 1; }
    else if(slot == 3 && carta.hab3nombre) { if((carta.hab3nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab3desc.toLowerCase().includes(hab.toLowerCase()))) return 1; }
    else if(slot == 4 && carta.hab4nombre) { if((carta.hab4nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab4desc.toLowerCase().includes(hab.toLowerCase()))) return 1; }
    else if(slot == 5 && carta.hab5nombre) { if((carta.hab5nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab5desc.toLowerCase().includes(hab.toLowerCase()))) return 1; }
    else if(slot == 6 && carta.hab6nombre) { if((carta.hab6nombre.toLowerCase().includes(hab.toLowerCase())) || (carta.hab6desc.toLowerCase().includes(hab.toLowerCase()))) return 1; }
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

function cajaInicio2(uid) {
    switch (uid) {
        case 82:
        case 83:
        case 84:
        case 85:
            return 1;
        default: return 0;
    }
}
async function generarEquipo() {
    let cartasTotal = [];
    const primeraedicion = document.querySelector("#ea_primeraedicion");
    const exclusivas = document.querySelector("#ea_exclusivas");
    const capitulouno = document.querySelector("#ea_capitulo1");
    const capitulodos = document.querySelector("#ea_capitulo2");
    const aniversario = document.querySelector("#ea_aniversario");
    const personalizadas = document.querySelector("#ea_personalizadas");

    const payload = await getData();

    let dataDisplay = payload.filter((carta) => {
        let yes = 0;
        if(primeraedicion.checked && carta.coleccion.includes("Primera Edición")) yes = 1;
        if(exclusivas.checked && carta.coleccion.includes("Exclusiva")) yes = 1;
        if(capitulouno.checked && carta.coleccion.includes("Capítulo 1")) yes = 1;
        if(capitulodos.checked && carta.coleccion.includes("Capítulo 2")) yes = 1;
        if(aniversario.checked && carta.coleccion.includes("Edición Aniversario")) yes = 1;
        if(personalizadas.checked && carta.coleccion.includes("Personalizadas")) yes = 1;
        if(yes == 1) return carta;
    }).map((object) => {
        const {uid} = object;
        return cartasTotal.push(uid);
    }).join("");

    if(cartasTotal.length >= 3) {

        let carta1 = cartasTotal[Math.floor(Math.random() * cartasTotal.length)];
        const index1 = cartasTotal.indexOf(carta1);
        if (index1 > -1) { 
            cartasTotal.splice(index1, 1); 
        }
        mostrarEquipo(carta1, 1);
        
        let carta2 = cartasTotal[Math.floor(Math.random() * cartasTotal.length)];
        const index2 = cartasTotal.indexOf(carta2);
        if (index2 > -1) { 
            cartasTotal.splice(index2, 1);
        }
        mostrarEquipo(carta2, 2);

        let carta3 = cartasTotal[Math.floor(Math.random() * cartasTotal.length)];
        const index3 = cartasTotal.indexOf(carta3);
        if (index3 > -1) { 
            cartasTotal.splice(index3, 1); 
        }
        mostrarEquipo(carta3, 3);

    }
}

function eliminarFiltros(){
    input.value = "";
    edicion.value = "";
    habilidad.value = "";
    hab_lv.value = "";
    artista.value = "";
    filtro_uid.value = "";
    rareza.value = "";
    mostrarCartas();
}




let   minutes = `30`,
      seconds = `00`,
      chronometerDisplay_arriba = document.querySelector(`.cronometroarriba`),
      chronometerDisplay_abajo = document.querySelector(`.cronometroabajo`),
      chronometerCall,
      preparationCall,
      preparationSeconds = 10

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

    chronometerDisplay_arriba.textContent = `${minutes}:${seconds}`
    chronometerDisplay_abajo.textContent = `${minutes}:${seconds}`

    if(minutes == 30 && seconds == 0) {
        pause();
    }
  }

  function countdown() {
    // Decrementamos los segundos
    seconds--;
  
    // Si los segundos llegan a -1, restamos un minuto y reiniciamos segundos a 59
    if (seconds < 0) {
      seconds = 59;
      minutes--;
  
      // Si los minutos llegan a -1, restamos una hora y reiniciamos minutos a 59
      if (minutes < 0) {
        minutes = 59;
        hours--;
  
        // Si las horas llegan a -1, detenemos el conteo (fin del cronómetro)
        if (hours < 0) {
          hours = 0;
          minutes = 0;
          seconds = 0;
          pause(); // Detener el temporizador
        }
      }
    }
  
    let displaySeconds = seconds < 10 ? '0' + seconds : seconds;
    let displayMinutes = minutes < 10 ? '0' + minutes : minutes;
  
    // Mostrar el tiempo en pantalla
    chronometerDisplay_arriba.textContent = `${displayMinutes}:${displaySeconds}`;
    chronometerDisplay_abajo.textContent = `${displayMinutes}:${displaySeconds}`;
  
    // Si se llega a 00:00, detener el conteo
    if (minutes === 0 && seconds === 0) {
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
    document.querySelector("#boton_play").textContent = 10;
    document.querySelector("#boton_play").style.color = "red";
    document.querySelector("#boton_play").setAttribute("disabled","true");
}

function play() {
    if(document.querySelector("#inicio").innerHTML == "Inicio"){
        chronometerCall = setInterval(countdown, 1000)
        reiniciar_vida_abajo();
        reiniciar_vida_arriba();
        toggleAltarOn(".baje_altar_btn_arriba");
        toggleAltarOn(".baje_altar_btn_abajo");
        document.querySelector("#inicio").innerHTML = "Final";
        chronometerDisplay_arriba.textContent = `30:00`;
        chronometerDisplay_abajo.textContent = `30:00`;
    } else {
        clearInterval(chronometerCall)
        document.querySelector("#inicio").innerHTML = "Inicio";
        chronometerDisplay_arriba.textContent = ``
        chronometerDisplay_abajo.textContent = ``
        minutes = `30`;
        seconds = `00`;
    }
}

function pause() {
    clearInterval(chronometerCall)
    document.querySelector("#inicio").innerHTML = "Inicio";
    chronometerDisplay_arriba.textContent = ``
    chronometerDisplay_abajo.textContent = ``
    minutes = `30`;
    seconds = `00`;
}

function colornegro() {
    const botones = document.querySelectorAll('#btn_transmutacion');

    botones.forEach(boton => {
        boton.style.backgroundColor = 'rgb(48, 48, 48)';
    });

    cerrarmenuvida();
}

function reset() {
    clearInterval(chronometerCall);
    clearInterval(preparationCall);
    preparationSeconds = 10;
    minutes = `30`;
    seconds = `00`;
    document.querySelector("#boton_play").removeAttribute(`disabled`)
    document.querySelector("#boton_play").style.color = "black";
    document.querySelector("#boton_play").textContent ="INICIAR";

    $("#btn_transmutacion").css("background-color", "rgb(48, 48, 48)");

    if(timeoutId != null) {
        clearTimeout(timeoutId);
        timeoutId = null;
        manteniendo = false;
    }

    diezArriba();
    diezAbajo();
}

const vida_arriba_numero = document.querySelector("#vida_arriba_numero");
const vida_abajo_numero = document.querySelector("#vida_abajo_numero");

function bajar_vida_abajo() {
    const numero = Math.max(0,Number(vida_abajo_numero.innerHTML)-1);
    vida_abajo_numero.innerHTML = numero;
}
function subir_vida_abajo() {
    const numero = Math.min(20,Number(vida_abajo_numero.innerHTML)+1);
    vida_abajo_numero.innerHTML = numero;
}
function subir_vida_arriba(){
    const numero = Math.min(20,Number(vida_arriba_numero.innerHTML)+1);
    vida_arriba_numero.innerHTML = numero;
}
function bajar_vida_arriba(){
    const numero = Math.max(0,Number(vida_arriba_numero.innerHTML)-1);
    vida_arriba_numero.innerHTML = numero;
}
function reiniciar_vida_abajo(){
    vida_abajo_numero.innerHTML = 10;
}
function reiniciar_vida_arriba(){
    vida_arriba_numero.innerHTML = 10;
}
function pasaTurno(){
    if(Number(vida_arriba_numero.innerHTML) == 0) vida_arriba_numero.innerHTML = 10;
    if(Number(vida_abajo_numero.innerHTML) == 0) vida_abajo_numero.innerHTML = 10;
    toggleAltarOn(".baje_altar_btn_arriba");
    toggleAltarOn(".baje_altar_btn_abajo");
}
function cerrarmenuvida(){
    const menu = document.querySelector(".submenuvida");
    menu.style.display = "none";
}
function abrirmenuvida(){
    const menu = document.querySelector(".submenuvida");
    menu.style.display = "block";
}
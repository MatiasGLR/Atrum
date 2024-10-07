const apiEndPoint = "./dbjson.json";
const display = document.querySelector("#display-data");
const input = document.querySelector("#input");

const getData = async () => {
    const res = await fetch(apiEndPoint);
    const data = await res.json();
    return data;
}

const mostrarCartas = async () => {
    let query_nombre = input.value;
    
    const payload = await getData();

    let dataDisplay = payload.filter((carta) => {
        if(query_nombre === "") { return carta }
        else {
            if(carta.nombre.toLowerCase().includes(query_nombre.toLowerCase())) {return carta}
        } 
    }).map((object) => {
        const {id, nombre, rareza, coleccion, tienda, linktienda, estado, numero, numerode, artista,
            hab0nombre,hab0desc,hab0color,hab0colort,hab0tipo,hab1nombre,hab1desc,hab1color,hab1colort,hab1tipo,
            hab2nombre,hab2desc,hab2color,hab2colort,hab2tipo,hab3nombre,hab3desc,hab3color,hab3colort,hab3tipo,
            hab4nombre,hab4desc,hab4color,hab4colort,hab4tipo,especialidad,espcolor
        } = object;
        let tiendastring;
        if(tienda === "") { tiendastring = ""}
        else tiendastring = `<b>Tienda:</b> <a href="`+ linktienda +`">` + tienda +`</a><br>`
        return `
        <div class="titulo">
            <p><a class="" data-bs-toggle="collapse" href="#`+id+`" role="button" aria-expanded="false" aria-controls="`+id+`">`+ nombre +`</a></p>
            <div class="collapse" id="`+id+`">
                <img style="width:200px" src="./Cartas/`+id+`.webp" alt=""><br>
                <b>Rareza:</b> <x class="`+rareza+`">` + rareza +`</x><br>
                <b>Colección:</b> ` + coleccion +` (`+numero+`/`+numerode+`)<br>
                `+ tiendastring +`
                <b>Estado:</b> `+ estado +`<br>
                <b>Artista:</b> `+ artista +`<br>
                <b>Especialidad:</b> <x class="`+espcolor+`">`+ especialidad +`</x><br>
                <br>
                <b>Habilidades</b>
                <div class="`+hab4color+`">(4) `+hab4nombre+` (`+hab4tipo+`) `+hab4colort+`<br>
                `+hab4desc+`</div>
                <div class="`+hab3color+`">(3) `+hab3nombre+` (`+hab3tipo+`) `+hab3colort+`<br>
                `+hab3desc+`</div>
                <div class="`+hab2color+`">(2) `+hab2nombre+` (`+hab2tipo+`) `+hab2colort+`<br>
                `+hab2desc+`</div>
                <div class="`+hab1color+`">(1) `+hab1nombre+` (`+hab1tipo+`) `+hab1colort+`<br>
                `+hab1desc+`</div>
                <div class="`+hab0color+`">(0) `+hab0nombre+` (`+hab0tipo+`) `+hab0colort+`<br>
                `+hab0desc+`</div>
            </div>
            <hr>
            </p>
        </div>
        `
    }).join("");

    display.innerHTML = dataDisplay;
}

mostrarCartas();

input.addEventListener("input", () => {
    mostrarCartas();
});
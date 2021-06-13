var retrocederBorrarProvincia = false;
var ordenAscendente = false;

// INSERTAR LOS DATOS PRINCIPALES
function inicio(){
    // UTILIZAMOS AXIOS PARA RECOGER EL JSON CON LOS DATOS PRINCIPALES
    axios.get('https://www.el-tiempo.net/api/json/v2/home')
    // SI TODO VA BIEN INSERTAMOS LOS DATOS EN LA PÁGINA
    .then(response => {
        document.getElementById('titulo').innerHTML = response.data.title;
        document.getElementById('subtitulo').innerHTML = response.data.metadescripcion;
        document.getElementById('textoToday').innerHTML = response.data.today.p;
        document.getElementById('textoTomorrow').innerHTML = response.data.tomorrow.p;
    })
    // SI HAY ALGUN ERROR LO MOSTRAMOS EN LA CONSOLA
    .catch(error => console.error(error));

    // UTILIZAMOS AXIOS PARA RECOGER EL JSON CON LAS PROVINCIAS
    axios.get('https://www.el-tiempo.net/api/json/v2/provincias')
    // SI TODO VA BIEN INSERTAMOS LAS PROVINCIAS EN EL BUSCADOR
    .then(response => {
        var select = document.getElementById('selectProvincia');
        var provincias = response.data.provincias;
        const option = document.createElement('option');
        option.value = 'seleccionar';
        option.text = 'Seleccionar...';
        option.selected = 'true';
        console.log(option);
        console.log(select);
        select.appendChild(option);
        provincias.forEach(provincia => {
            const option2 = document.createElement('option');
            const nombre = provincia.NOMBRE_PROVINCIA;
            const id = provincia.CODPROV;
            option2.value = id;
            option2.text = nombre;
            select.appendChild(option2);
        });
    })
    // SI HAY ALGUN ERROR LO MOSTRAMOS EN LA CONSOLA
    .catch(error => console.error(error));
}

// MOSTRAR DATOS PROVINCIA Y RELLENAR SELECT DE MUNICIPIOS
function provinciaSeleccionada(){
    var select = document.getElementById('selectProvincia');
    var id = select.value;
    // UTILIZAMOS AXIOS PARA RECOGER EL JSON CON LOS MUNICIPIOS DE UNA PROVINCIA
    axios.get('https://www.el-tiempo.net/api/json/v2/provincias/' + id + '/municipios')
    // SI TODO VA BIEN INSERTAMOS LAS PROVINCIAS EN EL BUSCADOR
    .then(response => {
        var select2 = document.getElementById('selectPoblacion');
        for (let i = select2.options.length; i >= 0; i--) {
            select2.remove(i);
        }
        const option = document.createElement('option');
        option.value = 'seleccionar';
        option.text = 'Seleccionar...';
        option.selected = 'true';
        select2.appendChild(option);
        var municipios = response.data.municipios;
        municipios.forEach(municipio => {
            const option = document.createElement('option');
            const nombre = municipio.NOMBRE;
            const id = municipio.CODIGOINE;
            option.value = id;
            option.text = nombre;
            select2.appendChild(option);
        });
    })
    // SI HAY ALGUN ERROR LO MOSTRAMOS EN LA CONSOLA
    .catch(error => console.error(error));

    var select3 = document.getElementById('selectProvincia');
    var id = select3.value;
    // UTILIZAMOS AXIOS PARA RECOGER EL JSON CON LOS MUNICIPIOS DE UNA PROVINCIA
    axios.get('https://www.el-tiempo.net/api/json/v2/provincias/' + id)
    // SI TODO VA BIEN INSERTAMOS LAS PROVINCIAS EN EL BUSCADOR
    .then(response => {
        document.getElementById('today').style.display = "block";
        document.getElementById('tomorrow').style.display = "block";
        document.getElementById('municipio').style.display = "none";
        document.getElementById('descargarPDF').style.display = "none";
        document.getElementById('subtitulo').innerHTML = response.data.title;
        document.getElementById('textoToday').innerHTML = response.data.today.p;
        document.getElementById('textoTomorrow').innerHTML = response.data.tomorrow.p;
        document.getElementById('botonAtras').style.display = "block";
        retrocederBorrarProvincia = true;
    })
    // SI HAY ALGUN ERROR LO MOSTRAMOS EN LA CONSOLA
    .catch(error => console.error(error));
}

// ACTIVAR O DESACTIVAR EL MODO OSCURO
function modoOscuro(){
    var checkBox = document.getElementById('checkBox');
    // ACTIVAR EL MODO OSCURO
    if(checkBox.checked == false){
        var navbar = document.getElementById('navbar');
        var subtitulo = document.getElementById('subtitulo');
        var contenedor = document.getElementById('contenedor');
        navbar.style.backgroundColor = '#000000';
        subtitulo.style.backgroundColor = 'rgb(36, 35, 35)';
        contenedor.style.backgroundImage = "url('./images/fondoBlancoNegro.jpg')";
    }
    // DESACTIVAR EL MODO OSCURO
    else{
        var navbar = document.getElementById('navbar');
        var subtitulo = document.getElementById('subtitulo');
        var contenedor = document.getElementById('contenedor');
        navbar.style.backgroundColor = '#0088ff';
        subtitulo.style.backgroundColor = 'rgb(0, 195, 255)';
        contenedor.style.backgroundImage = "url('./images/fondo.png')";
    }
}

// BUSCAR MUNICIPIO Y MOSTRARLO
function buscarMunicipio(){
    var encontrado = false;
    var nombreMunicipio = document.getElementById('busquedaPoblacion').value;
    // UTILIZAMOS AXIOS PARA RECOGER EL JSON CON LOS MUNICIPIOS
    axios.get('https://www.el-tiempo.net/api/json/v2/municipios')
    // SI TODO VA BIEN BUSCAMOS EL MUNICIPIO
    .then(response => {
        municipios = response.data;
        municipios.forEach(municipio => {
            if(nombreMunicipio == municipio.NOMBRE){
                var codigoINE = municipio.CODIGOINE;
                var codigoProvincia = municipio.CODPROV;
                var id = codigoINE.slice(0, -6);
                // UTILIZAMOS AXIOS PARA RECOGER EL JSON CON LOS DATOS DEL MUNICIPIO
                axios.get('https://www.el-tiempo.net/api/json/v2/provincias/' + codigoProvincia + '/municipios/' + id)
                // SI TODO VA BIEN MOSTRAMOS LOS DATOS DEL MUNICIPIO
                .then(response2 => {
                    document.getElementById('today').style.display = "none";
                    document.getElementById('tomorrow').style.display = "none";
                    document.getElementById('municipio').style.display = "block";
                    document.getElementById('botonAtras').style.display = "block";
                    document.getElementById('descargarPDF').style.display = "block";
                    document.getElementById('subtitulo').innerHTML = response2.data.breadcrumb[3].title;
                    document.getElementById('tituloMunicipio').innerHTML = response2.data.municipio.NOMBRE;
                    document.getElementById('fechaHoy').innerHTML = response2.data.fecha;
                    document.getElementById('stateSky').innerHTML = response2.data.stateSky.description;
                    document.getElementById('temperaturaActual').innerHTML = response2.data.temperatura_actual;
                    document.getElementById('temperaturaMax').innerHTML = response2.data.temperaturas.max;
                    document.getElementById('temperaturaMin').innerHTML = response2.data.temperaturas.min;
                    document.getElementById('humedad').innerHTML = response2.data.humedad;
                    document.getElementById('viento').innerHTML = response2.data.viento;
                    document.getElementById('lluvia').innerHTML = response2.data.lluvia;
                    var selectProvincia = document.getElementById('selectProvincia');
                    var selectPoblacion = document.getElementById('selectPoblacion');
                    selectProvincia.value = 'seleccionar';
                    selectPoblacion.value = 'seleccionar';
                    
                })
                // SI HAY ALGUN ERROR LO MOSTRAMOS EN LA CONSOLA
                .catch(error => console.error(error));
                encontrado = true;
            }
            
        });
        // SI NO ENCUENTRA EL MUNICIPIO MOSTRAMOS UNA ALERTA
        if(encontrado == false){
            swal('Poblaci\u00F3n no encontrada','Introduce el nombre de la poblaci\u00F3n nuevamente.\n\Recuerda que la primera letra del nombre va en may\u00FAsculas.','warning');
        }
    })
    // SI HAY ALGUN ERROR LO MOSTRAMOS EN LA CONSOLA
    .catch(error => console.error(error));
}

// FUNCIÓN PARA MOSTRAR EL MUNICIPIO DESDE EL BUSCADOR SELECT
function selectPoblacion(){
    var selectProvincia = document.getElementById('selectProvincia');
    var idProvincia = selectProvincia.value;
    var selectPoblacion = document.getElementById('selectPoblacion');
    var codigoINE = selectPoblacion.value;
    var idPoblacion = codigoINE.slice(0, -6);
    // UTILIZAMOS AXIOS PARA RECOGER EL JSON CON LOS MUNICIPIOS DE UNA PROVINCIA
    axios.get('https://www.el-tiempo.net/api/json/v2/provincias/' + idProvincia + '/municipios/' + idPoblacion)
    // SI TODO VA BIEN INSERTAMOS LAS PROVINCIAS EN EL BUSCADOR
    .then(response2 => {
        document.getElementById('today').style.display = "none";
        document.getElementById('tomorrow').style.display = "none";
        document.getElementById('municipio').style.display = "block";
        document.getElementById('botonAtras').style.display = "block";
        document.getElementById('descargarPDF').style.display = "block";
        document.getElementById('subtitulo').innerHTML = response2.data.breadcrumb[3].title;
        document.getElementById('tituloMunicipio').innerHTML = response2.data.municipio.NOMBRE;
        document.getElementById('fechaHoy').innerHTML = response2.data.fecha;
        document.getElementById('stateSky').innerHTML = response2.data.stateSky.description;
        document.getElementById('temperaturaActual').innerHTML = response2.data.temperatura_actual;
        document.getElementById('temperaturaMax').innerHTML = response2.data.temperaturas.max;
        document.getElementById('temperaturaMin').innerHTML = response2.data.temperaturas.min;
        document.getElementById('humedad').innerHTML = response2.data.humedad;
        document.getElementById('viento').innerHTML = response2.data.viento;
        document.getElementById('lluvia').innerHTML = response2.data.lluvia;
        retrocederBorrarProvincia = true;
    })
    // SI HAY ALGUN ERROR LO MOSTRAMOS EN LA CONSOLA
    .catch(error => console.error(error));
}

// CAMBIAR ORDEN BUSCADORES
function ordenSeleccionado(){
    if(ordenAscendente == false){
        var options = document.getElementById('selectProvincia').options;
        var optionsSelectProvincia = [];
        for (var i = 0; i < options.length; i++) {
            optionsSelectProvincia.push(options[i]);
        }
        optionsSelectProvincia = optionsSelectProvincia.sort(function (a, b) {           
            return a.innerHTML.toLowerCase().charCodeAt(0) - b.innerHTML.toLowerCase().charCodeAt(0);    
        });
    
        for (var i = 0; i <= options.length; i++) {            
            options[i] = optionsSelectProvincia[i];
        }
    
        var options = document.getElementById('selectPoblacion').options;
        var optionsSelectPoblacion = [];
        for (var i = 0; i < options.length; i++) {
            optionsSelectPoblacion.push(options[i]);
        }
        optionsSelectPoblacion = optionsSelectPoblacion.sort(function (a, b) {           
            return a.innerHTML.toLowerCase().charCodeAt(0) - b.innerHTML.toLowerCase().charCodeAt(0);    
        });
    
        for (var i = 0; i <= options.length; i++) {            
            options[i] = optionsSelectPoblacion[i];
        }
        ordenAscendente = true;
    }else{
        var select = document.getElementById('selectProvincia');
        for (let i = select.options.length; i >= 0; i--) {
            select.remove(i);
        }
        var select2 = document.getElementById('selectPoblacion');
        for (let i = select2.options.length; i >= 0; i--) {
            select2.remove(i);
        }
        const option = document.createElement('option');
        option.value = 'seleccionar';
        option.text = 'Seleccionar...';
        option.selected = 'true';
        select2.appendChild(option);
        inicio();
        ordenAscendente = false;
    }
}

// MOSTRAR LOS DATOS PRINCIPALES
function retroceder(){
    document.getElementById('today').style.display = "block";
    document.getElementById('tomorrow').style.display = "block";
    document.getElementById('municipio').style.display = "none";
    document.getElementById('botonAtras').style.display = "none";
    document.getElementById('descargarPDF').style.display = "none";
    document.getElementById('seleccionarProvincia').style.display = "block";
    document.getElementById('seleccionarPoblacion').style.display = "block";
    if(retrocederBorrarProvincia == true){
        var selectProvincia = document.getElementById('selectProvincia');
        var selectPoblacion = document.getElementById('selectPoblacion');
        selectProvincia.value = 'seleccionar';
        selectPoblacion.value = 'seleccionar';
        inicio();
    }
}

function descargarPDF() {
    // Choose the element that our invoice is rendered in.
    const element = document.getElementById("municipio");
    element.style.position = "initial";
    // Choose the element and save the PDF for our user.
    html2pdf()
        .from(element)
        .save();
    setInterval(function(){ element.style.position = "absolute"; }, 1);
    
  }

// UTILIZAMOS WINDOW.ONLOAD PARA ESPERAR A QUE CARGUE TODO EL CONTENIDO Y ENTONCES EJECUTAMOS LA FUNCIÓN INICIO() PARA MOSTRAR LOS DATOS PRINCIPALES
window.onload = function() {
    inicio();
  };
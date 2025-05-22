
// app.js
  window.navigate = navigate;
// Importa los módulos de Firebase desde el CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, getDocs, collection, doc, updateDoc,
  addDoc,
  deleteDoc, query, where, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
  // Configura Firebase con tus credenciales
const firebaseConfig = {
  apiKey: "AIzaSyAvZiluDnZ-f52nYDqMc_MrrT0tbN5gnmI",
  authDomain: "veterinaria-43647.firebaseapp.com",
  projectId: "veterinaria-43647",
  storageBucket: "veterinaria-43647.firebasestorage.app",
  messagingSenderId: "253312669456",
  appId: "1:253312669456:web:079bf605df09836ef2b795",
  measurementId: "G-HK0KFYPK1M"
};



// Inicializa la app y la autenticación
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // app es tu instancia de Firebase


const obtenerUsuarios = async () => {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} =>`, doc.data());
        });
      };

      obtenerUsuarios();



// Manejo del formulario
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      document.getElementById("login-screen").style.display = "none";
      document.getElementById("loading-screen").style.display = "flex";

      setTimeout(() => {
        document.getElementById("loading-screen").style.display = "none";
        document.getElementById("app").style.display = "flex";
      }, 100);
    })
    .catch((error) => {
      document.getElementById("error-message").innerText = "Credenciales incorrectas";
      console.error(error);
    });
});


window.logout = function () {
  firebase.auth().signOut()
    .then(() => {
      document.getElementById("app").style.display = "none";
      document.getElementById("login-screen").style.display = "flex";
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
};

//funcion para inciar sesion
function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(error => {
      const errorMessage = document.getElementById('error-message');
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage.textContent = 'Correo electrónico no registrado.';
          break;
        case 'auth/wrong-password':
          errorMessage.textContent = 'Contraseña incorrecta.';
          break;
        case 'auth/invalid-email':
          errorMessage.textContent = 'Correo electrónico inválido.';
          break;
        default:
          errorMessage.textContent = 'Error al iniciar sesión: ' + error.message;
      }
    });
}

function logout() {
  auth.signOut();
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('loading-screen').style.display = 'none';
}
  
// NAVEGACIONES DENTRO DEL SITIO
function navigate(view) {
  const content = document.getElementById('content');
  content.innerHTML = '';

  // INICIO (DASHBOARD)
  switch (view) {
    case 'inicio':
      
      break;


    // PROPIETARIOS Y MASCOTAS
    case 'propietarios':
     
    content.innerHTML = `
      <h2>Propietarios y Mascotas</h2>
      <form id="form-propietario" class="form-stdb">
        <input type="text" id="nombre" placeholder="Nombres y Apellidos" required />
        <input type="text" id="rut" placeholder="RUT (ej: 12.345.678-9)" required />
        <input type="email" id="correo" placeholder="Correo electrónico" required />
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 1rem; color: #6c788aaf;">🇨🇱 +56</span>
          <input type="tel" id="telefono" placeholder="912345678" required pattern="[0-9]{9}" inputmode="numeric" />
        </div>
        <button type="submit" id="btn-agregar">Agregar</button>
        <input type="hidden" id="edit-id" />
      </form>

      <input type="text" id="busqueda" placeholder="Buscar por nombre o mascota..." class="form-stdb" style="margin:10px 0;padding:5px;width:100%;max-width:400px;" />

      <table id="tabla-propietarios">
        <thead>
          <tr>
            <th>Propietario</th>
            <th>Teléfono</th>
            <th>Mascotas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>

      <button id="btn-exportar" style="margin: 10px 0; padding: 8px 16px; border-radius: 6px; background: #4caf50; color: white; border: none; cursor: pointer;">
              📥 Descargar Excel
            </button>
      
    `;


    const form = document.getElementById('form-propietario');
    const tabla = document.querySelector('#tabla-propietarios tbody');
    const btnAgregar = document.getElementById('btn-agregar');
    const editId = document.getElementById('edit-id');

    async function obtenerMascotas(propietarioId) {
      const q = query(collection(db, 'mascotas'), where('propietarioId', '==', propietarioId));
      const querySnapshot = await getDocs(q);
      const mascotas = [];
      querySnapshot.forEach(doc => mascotas.push(doc.data()));
      return mascotas;
    }

    async function mostrarPropietarios() {
      tabla.innerHTML = '';
      const snapshot = await getDocs(collection(db, 'propietarios'));
      for (const docSnap of snapshot.docs) {
        const p = docSnap.data();
        const propietarioId = docSnap.id;
        const mascotas = await obtenerMascotas(propietarioId);
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>
            ${p.nombre}<br>
            <small>RUT: ${p.rut || '-'}</small><br>
            <small>Email: ${p.correo || '-'}</small>
          </td>
          <td>${p.telefono}</td>
          <td>
            ${mascotas.length > 0 ? mascotas.map(m => `🐾 ${m.nombre} (${m.especie || ''})`).join('<br>') : '<span style="color:#999;">Sin mascotas</span>'}
            <br><button onclick="agregarMascotaPrompt('${propietarioId}')" style="margin-top:4px; background:#81c784; color:white; border:none; padding:4px 8px; border-radius:6px;">➕ Mascota</button>
          </td>
          <td>
            <button onclick="editarPropietario('${propietarioId}', '${p.nombre}', '${p.rut}', '${p.correo}', '${p.telefono}')" style="background:#64b5f6; color:white; border:none; padding:5px 10px; border-radius:8px; cursor:pointer; margin-right:5px;">✏️</button>
            <button onclick="eliminarPropietario('${propietarioId}')" style="background:#e57373; color:white; border:none; padding:5px 10px; border-radius:8px; cursor:pointer;">🗑️</button>
          </td>
        `;
        tabla.appendChild(fila);
      }
    }

    window.eliminarPropietario = async (id) => {
      if (confirm('¿Estás seguro que deseas eliminar este propietario? Esta acción eliminará también sus mascotas.')) {
        try {
          const mascotasQuery = query(collection(db, 'mascotas'), where('propietarioId', '==', id));
          const snapshotMascotas = await getDocs(mascotasQuery);
          const deletePromises = snapshotMascotas.docs.map(docSnap => deleteDoc(docSnap.ref));
          await Promise.all(deletePromises);
          await deleteDoc(doc(db, 'propietarios', id));
          mostrarPropietarios();
        } catch (err) {
          alert('Error al eliminar: ' + err);
        }
      }
    };

    window.editarPropietario = (id, nombre, rut, correo, telefono) => {
      document.getElementById('nombre').value = nombre;
      document.getElementById('rut').value = rut;
      document.getElementById('correo').value = correo;
      document.getElementById('telefono').value = telefono;
      editId.value = id;
      btnAgregar.textContent = 'Guardar cambios';
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value.trim();
      const rut = document.getElementById('rut').value.trim();
      const correo = document.getElementById('correo').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const id = editId.value;

      if (!nombre || !rut || !correo || !telefono) return alert('Por favor completa todos los campos.');

      try {
        if (id) {
          await updateDoc(doc(db, 'propietarios', id), { nombre, rut, correo, telefono });
          editId.value = '';
          btnAgregar.textContent = 'Agregar';
        } else {
          await addDoc(collection(db, 'propietarios'), { nombre, rut, correo, telefono });
        }
        form.reset();
        mostrarPropietarios();
      } catch (err) {
        alert('Error al guardar: ' + err);
      }
    });

    window.agregarMascotaPrompt = async (propietarioId) => {
      const nombre = prompt('Nombre de la mascota:');
      const especie = prompt('Especie (ej: perro, gato):');
      const raza = prompt('Raza:');
      const fechaNacimiento = prompt('Fecha de nacimiento (yyyy-mm-dd):');
      const edad = prompt('Edad (en años):');
      const sexo = prompt('Sexo (macho / hembra):');
      const color = prompt('Color:');
      const numeroIdentificacion = prompt('Número de identificación:');
      const estadoReproductivo = prompt('Estado reproductivo (castrado, entero, etc.):');

      if (!nombre || nombre.trim().length < 3) return alert('Nombre inválido.');

      try {
        await addDoc(collection(db, 'mascotas'), {
          nombre: nombre.trim(),
          especie: especie.trim(),
          raza: raza.trim(),
          fechaNacimiento: fechaNacimiento.trim(),
          edad: edad.trim(),
          sexo: sexo.trim(),
          color: color.trim(),
          numeroIdentificacion: numeroIdentificacion.trim(),
          estadoReproductivo: estadoReproductivo.trim(),
          propietarioId
        });
        mostrarPropietarios();
      } catch (error) {
        alert('Error al agregar mascota: ' + error);
      }
    };

    document.getElementById('busqueda').addEventListener('input', e => {
      const filtro = e.target.value.toLowerCase();
      const filas = tabla.querySelectorAll('tr');
      filas.forEach(fila => {
        const columnas = fila.querySelectorAll('td');
        const texto = Array.from(columnas).map(td => td.textContent.toLowerCase()).join(' ');
        fila.style.display = texto.includes(filtro) ? '' : 'none';
      });
    });

    mostrarPropietarios();
    document.getElementById('btn-exportar').addEventListener('click', async () => {
  const propietariosSnap = await getDocs(collection(db, 'propietarios'));
  const mascotasSnap = await getDocs(collection(db, 'mascotas'));

  const mascotas = mascotasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const rows = [];

  for (const doc of propietariosSnap.docs) {
    const p = doc.data();
    const id = doc.id;
    const mascotasDePropietario = mascotas.filter(m => m.propietarioId === id);

    if (mascotasDePropietario.length > 0) {
      mascotasDePropietario.forEach(m => {
        rows.push({
          'Propietario': p.nombre,
          'RUT': p.rut || '',
          'Correo': p.correo || '',
          'Teléfono': p.telefono || '',
          'Mascota': m.nombre,
          'Especie': m.especie || '',
          'Raza': m.raza || '',
          'Fecha Nacimiento': m.fechaNacimiento || '',
          'Edad': m.edad || '',
          'Sexo': m.sexo || '',
          'Color': m.color || '',
          'N° Identificación': m.numeroIdentificacion || '',
          'Estado Reproductivo': m.estadoReproductivo || ''
        });
      });
    } else {
      rows.push({
        'Propietario': p.nombre,
        'RUT': p.rut || '',
        'Correo': p.correo || '',
        'Teléfono': p.telefono || '',
        'Mascota': '',
        'Especie': '',
        'Raza': '',
        'Fecha Nacimiento': '',
        'Edad': '',
        'Sexo': '',
        'Color': '',
        'N° Identificación': '',
        'Estado Reproductivo': ''
      });
    }
  }

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Propietarios y Mascotas');
  XLSX.writeFile(workbook, 'propietarios_mascotas.xlsx');
});
    break;

    // ORDENES MEDICAS
      case 'ordenes':
        content.innerHTML = `
          <h2>Órdenes Médicas</h2>
          <form id="form-orden" class="form-stdb" enctype="multipart/form-data">
            <select id="mascota-orden" required style="padding: 6px; border-radius: 6px;">
              <option value="">Selecciona mascota...</option>
            </select>
            <select id="tipo" required style="padding: 6px; border-radius: 6px;">
              <option value="">Tipo de orden...</option>
              <option value="Examen">Examen</option>
              <option value="Vacunación">Vacunación</option>
              <option value="Desparasitación">Desparasitación</option>
              <option value="Otro">Otro</option>
            </select>
            <input type="text" id="diagnostico" placeholder="Diagnóstico" required />
            <input type="text" id="tratamiento" placeholder="Tratamiento" required />
            <input type="date" id="fecha" required />
            <button type="submit">Agregar</button>
          </form>
          <table id="tabla-ordenes">
            <thead>
              <tr>
                <th>Mascota</th>
                <th>Tipo</th>
                <th>Diagnóstico</th>
                <th>Tratamiento</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        `;

        const formOrden = document.getElementById('form-orden');
        const tablaOrdenes = document.querySelector('#tabla-ordenes tbody');
        const mascotaSelect = document.getElementById('mascota-orden');

        // Cargar nombres de mascotas
        async function cargarMascotasEnSelect() {
          const snapshot = await getDocs(collection(db, 'mascotas'));
          snapshot.forEach(doc => {
            const mascota = doc.data();
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = mascota.nombre;
            mascotaSelect.appendChild(option);
          });
        }

        // Mostrar órdenes guardadas
        async function mostrarOrdenes() {
          tablaOrdenes.innerHTML = '';
          const snapshot = await getDocs(collection(db, 'ordenes'));
          for (const docSnap of snapshot.docs) {
            const orden = docSnap.data();
            const mascotaSnap = await getDoc(doc(db, 'mascotas', orden.mascotaId));
            const nombreMascota = mascotaSnap.exists() ? mascotaSnap.data().nombre : 'Mascota eliminada';

            const fila = document.createElement('tr');
            fila.innerHTML = `
              <td>${nombreMascota}</td>
              <td>${orden.tipo}</td>
              <td>${orden.diagnostico}</td>
              <td>${orden.tratamiento}</td>
              <td>${orden.fecha}</td>
            `;
            tablaOrdenes.appendChild(fila);
          }
        }

        formOrden.addEventListener('submit', async function (e) {
          e.preventDefault();

          const mascotaId = document.getElementById('mascota-orden').value;
          const tipo = document.getElementById('tipo').value;
          const diagnostico = document.getElementById('diagnostico').value.trim();
          const tratamiento = document.getElementById('tratamiento').value.trim();
          const fecha = document.getElementById('fecha').value;

          if (!mascotaId || !tipo || !diagnostico || !tratamiento || !fecha) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
          }

          try {
          

            await addDoc(collection(db, 'ordenes'), {
              mascotaId,
              tipo,
              diagnostico,
              tratamiento,
              fecha,
              archivoUrl
            });

            formOrden.reset();
            mostrarOrdenes();
          } catch (error) {
            alert('Error al guardar orden médica: ' + error.message);
          }
        });

        cargarMascotasEnSelect();
        mostrarOrdenes();
        break;


      //Calendario
      // Calendario (agenda)
case 'calendario':
  content.innerHTML = `
    <h2>Calendario de Citas</h2>
    <form id="form-cita" class="form-stdb">
      <select id="mascota-cita" required style="padding: 6px; border-radius: 6px;">
        <option value="">Selecciona mascota...</option>
      </select>
      <input type="date" id="fecha-cita" required />
      <input type="time" id="hora-cita" required />
      <input type="text" id="motivo" placeholder="Motivo" required />
      <button type="submit">Agendar</button>
    </form>
    <table id="tabla-citas">
      <thead>
        <tr>
          <th>Mascota</th>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Motivo</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <div id="agenda-calendario" style="margin-top: 40px;"></div>
  `;

  const formCita = document.getElementById('form-cita');
  const tablaCitas = document.querySelector('#tabla-citas tbody');
  const mascotaCitaSelect = document.getElementById('mascota-cita');

  async function cargarMascotasCalendario() {
    const snapshot = await getDocs(collection(db, 'mascotas'));
    snapshot.forEach(doc => {
      const mascota = doc.data();
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = mascota.nombre;
      mascotaCitaSelect.appendChild(option);
    });
  }

  async function mostrarCitas() {
    tablaCitas.innerHTML = '';
    const snapshot = await getDocs(collection(db, 'citas'));
    for (const docSnap of snapshot.docs) {
      const cita = docSnap.data();
      const mascotaSnap = await getDoc(doc(db, 'mascotas', cita.mascotaId));
      const nombreMascota = mascotaSnap.exists() ? mascotaSnap.data().nombre : 'Mascota eliminada';

      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${nombreMascota}</td>
        <td>${cita.fecha}</td>
        <td>${cita.hora}</td>
        <td>${cita.motivo}</td>
      `;
      tablaCitas.appendChild(fila);
    }
  }
  // Agregar evento al formulario de citas
  async function mostrarAgendaFullCalendar() {
  const calendarEl = document.getElementById('agenda-calendario');
  calendarEl.innerHTML = ''; // Limpia si recarga

  const snapshot = await getDocs(collection(db, 'citas'));
  const events = [];

  for (const docSnap of snapshot.docs) {
    const cita = docSnap.data();
    const mascotaSnap = await getDoc(doc(db, 'mascotas', cita.mascotaId));
    const nombreMascota = mascotaSnap.exists() ? mascotaSnap.data().nombre : 'Mascota eliminada';

    events.push({
      title: `${nombreMascota} - ${cita.motivo}`,
      start: `${cita.fecha}T${cita.hora}`,
      allDay: false
    });
  }

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    locale: 'es',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay,listWeek'
    },
    events: events
  });

  calendar.render();
}
mostrarCitas();
mostrarAgendaFullCalendar();

  formCita.addEventListener('submit', async function (e) {
    e.preventDefault();

    const mascotaId = mascotaCitaSelect.value;
    const fecha = document.getElementById('fecha-cita').value;
    const hora = document.getElementById('hora-cita').value;
    const motivo = document.getElementById('motivo').value.trim();

    if (!mascotaId || !fecha || !hora || !motivo) {
      alert('Por favor completa todos los campos.');
      return;
    }

    try {
      await addDoc(collection(db, 'citas'), {
        mascotaId,
        fecha,
        hora,
        motivo
      });

      formCita.reset();
      mostrarCitas();
    } catch (error) {
      alert('Error al agendar cita: ' + error);
    }
  });

  cargarMascotasCalendario();
  mostrarCitas();
  break;

      // PERFIL
    case 'perfil':
      content.innerHTML = `
    <h2>Perfil de la Clínica</h2>
  `;
      break;
    // CONFIGURACION
    case 'Cerrar sesión':
    break;
          

    default:
      content.innerHTML = '<p>Sección no HABILITDA en esta version.</p>';
  }
}

// Cargar vista inicial por defecto
document.addEventListener('DOMContentLoaded', () => navigate('inicio'));

// propietarios (actualizado con SDK modular)
case 'propietarios':
content.innerHTML = `<h2>Propietarios y Mascotas</h2> <form id="form-propietario" class="form-stdb"> <input type="text" id="nombre" placeholder="Nombre del propietario" required /> <div style="display: flex; align-items: center; gap: 0.5rem;"> <span style="font-size: 1rem; color: #6c788aaf;">🇨🇱 +56</span> <input type="tel" id="telefono" placeholder="912345678" required pattern="[0-9]{9}" inputmode="numeric" /> </div> <input type="text" id="mascota" placeholder="Nombre de la mascota" required /> <button type="submit" id="btn-agregar">Agregar</button> <input type="hidden" id="edit-id" /> </form> <table id="tabla-propietarios"> <thead> <tr> <th>Propietario</th> <th>Teléfono</th> <th>Mascota</th> <th>Acciones</th> </tr> </thead> <tbody></tbody> </table>` ;

const form = document.getElementById('form-propietario');
const tabla = document.querySelector('#tabla-propietarios tbody');
const btnAgregar = document.getElementById('btn-agregar');
const editId = document.getElementById('edit-id');

async function mostrarPropietarios() {
tabla.innerHTML = '';
try {
const snapshot = await getDocs(collection(db, 'propietarios'));
snapshot.forEach(docSnap => {
const p = docSnap.data();
const fila = document.createElement('tr');
fila.innerHTML = `<td>${p.nombre}</td> <td>${p.telefono}</td> <td>${p.mascota}</td> <td> <button onclick="editarPropietario('${docSnap.id}', '${p.nombre}', '${p.telefono}', '${p.mascota}')" style="background:#64b5f6;color:white;border:none;padding:5px 10px;border-radius:8px;cursor:pointer;margin-right:5px;"> ✏️ </button> <button onclick="eliminarPropietario('${docSnap.id}')" style="background:#e57373;color:white;border:none;padding:5px 10px;border-radius:8px;cursor:pointer;"> 🗑️ </button> </td>` ;
tabla.appendChild(fila);
});
} catch (err) {
console.error('Error al obtener propietarios:', err);
}
}

window.eliminarPropietario = async (id) => {
if (confirm('¿Estás seguro que deseas eliminar este propietario? Esta acción no se puede deshacer.')) {
try {
await deleteDoc(doc(db, 'propietarios', id));
mostrarPropietarios();
} catch (err) {
alert('Error al eliminar: ' + err);
}
}
};

window.editarPropietario = (id, nombre, telefono, mascota) => {
document.getElementById('nombre').value = nombre;
document.getElementById('telefono').value = telefono;
document.getElementById('mascota').value = mascota;
editId.value = id;
btnAgregar.textContent = 'Guardar cambios';
};

form.addEventListener('submit', async (e) => {
e.preventDefault();
const nombre = document.getElementById('nombre').value.trim();
const telefono = document.getElementById('telefono').value.trim();
const mascota = document.getElementById('mascota').value.trim();
const id = editId.value;

javascript
Copiar
Editar
if (!/^[0-9]{9}$/.test(telefono)) {
  alert('El número debe tener 9 dígitos, sin +56. Ej: 912345678');
  return;
}

try {
  if (id) {
    await updateDoc(doc(db, 'propietarios', id), { nombre, telefono, mascota });
    form.reset();
    editId.value = '';
    btnAgregar.textContent = 'Agregar';
    mostrarPropietarios();
  } else {
    await addDoc(collection(db, 'propietarios'), { nombre, telefono, mascota });
    form.reset();
    mostrarPropietarios();
  }
} catch (err) {
  alert('Error al guardar: ' + err);
}
});

mostrarPropietarios();
break;
//  1. LOGIKA NAVIGASI HALAMAN 
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById(`page-${pageId}`).style.display = 'block';

    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    document.getElementById(`link-${pageId}`).classList.add('active');
}

//  2. LOGIKA DATA MAHASISWA 
const form = document.getElementById('student-form');
const tableBody = document.getElementById('table-body');
let students = JSON.parse(localStorage.getItem('studentsData')) || [];

function renderTable(filter = '') {
    tableBody.innerHTML = '';
    const filtered = students.filter(s => s.nama.toLowerCase().includes(filter.toLowerCase()) || s.nrp.includes(filter));

    if (filtered.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Data tidak ditemukan.</td></tr>';
    } else {
        filtered.forEach((s, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${s.nrp}</td>
                    <td><b>${s.nama}</b></td>
                    <td><span>${s.jurusan}</span></td>
                    <td>${s.email}</td>
                    <td class="action-btns">
                        <button class="btn-edit" onclick="editData(${s.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-delete" onclick="hapusData(${s.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    document.getElementById('total-mhs').innerText = students.length;
    document.getElementById('home-total').innerText = students.length;
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('edit-id').value;
    const nrpInput = document.getElementById('nrp').value.trim();
    const nama = document.getElementById('nama').value;
    const jurusan = document.getElementById('jurusan').value;
    const email = document.getElementById('email').value;

    // Validasi NRP Duplikat
    const isDuplicate = students.some(student => {
        if (id && student.id === Number(id)) return false; 
        return student.nrp === nrpInput;
    });

    if (isDuplicate) {
        alert('Gagal! NRP tersebut sudah terdaftar. Silakan gunakan NRP lain.');
        return; 
    }

    const data = {
        id: id ? Number(id) : Date.now(),
        nrp: nrpInput,
        nama: nama,
        jurusan: jurusan,
        email: email
    };

    if (id) {
        const index = students.findIndex(s => s.id === Number(id));
        students[index] = data;
    } else {
        students.push(data);
    }

    localStorage.setItem('studentsData', JSON.stringify(students));
    renderTable();
    resetForm();
});

function hapusData(id) {
    if (confirm('Yakin ingin menghapus data ini?')) {
        students = students.filter(s => s.id !== id);
        localStorage.setItem('studentsData', JSON.stringify(students));
        renderTable();
    }
}

function editData(id) {
    const s = students.find(s => s.id === id);
    if (s) {
        document.getElementById('edit-id').value = s.id;
        document.getElementById('nrp').value = s.nrp;
        document.getElementById('nama').value = s.nama;
        document.getElementById('jurusan').value = s.jurusan;
        document.getElementById('email').value = s.email;

        document.getElementById('btn-submit').innerText = 'Update';
        document.getElementById('btn-cancel').style.display = 'block';
    }
}

function resetForm() {
    form.reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('btn-submit').innerText = 'Simpan';
    document.getElementById('btn-cancel').style.display = 'none';
}

document.getElementById('search-input').addEventListener('input', (e) => {
    renderTable(e.target.value);
});

renderTable();
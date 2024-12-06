// Inisialisasi peta
const map = L.map('map').setView([0, 0], 2);

// Layer control untuk basemap
const baseLayers = {
    "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }),
    "Esri World Imagery": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }),
    "Google Street Map": L.tileLayer('https://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 19 })
};
baseLayers["OpenStreetMap"].addTo(map);
L.control.layers(baseLayers).addTo(map);

// URL API EONET NASA
const eonetURL = 'https://eonet.gsfc.nasa.gov/api/v3/events';

// Ambil data dari API EONET
fetch(eonetURL)
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#data-table tbody');
        let rowNumber = 1;

        data.events.forEach(event => {
            // Periksa apakah event memiliki koordinat
            if (event.geometry && event.geometry[0].coordinates) {
                const coords = event.geometry[0].coordinates;
                const marker = L.marker([coords[1], coords[0]]).addTo(map);

                marker.bindPopup(`
                    <b>${event.title}</b><br>
                    ${event.description || 'Deskripsi tidak tersedia.'}
                `);

                // Tambahkan data ke tabel
                const row = `
                    <tr>
                        <td>${rowNumber++}</td>
                        <td>${event.title}</td>
                        <td>${event.description || 'Deskripsi tidak tersedia.'}</td>
                        <td>${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            }
        });
    })
    .catch(error => console.error('Gagal memuat data:', error));

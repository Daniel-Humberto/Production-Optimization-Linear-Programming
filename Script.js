document.addEventListener('DOMContentLoaded', function() {


    // Funcionalidad de las pestañas
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });


    // Gráfico de tendencia de ventas
    const salesTrendCtx = document.getElementById('salesTrendChart').getContext('2d');
    const salesTrendChart = new Chart(salesTrendCtx, {
        type: 'bar',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [
                {
                    label: 'Resueltos',
                    data: [124, 145, 162, 139, 152, 137, 148, 156, 165, 159, 142, 132],
                    backgroundColor: 'rgb(0, 170, 0, 0.6)',
                    borderColor: 'rgb(0, 170, 0, 0.75)',
                    borderWidth: 1
                },
                {
                    label: 'Pendientes',
                    data: [12, 15, 8, 10, 14, 18, 16, 12, 9, 11, 13, 42],
                    backgroundColor: 'rgb(252, 187, 47, 0.6)',
                    borderColor: 'rgb(252, 187, 47, 0.75)',
                    borderWidth: 1
                },
                {
                    label: 'Cancelados',
                    data: [4, 6, 5, 3, 7, 4, 5, 6, 4, 5, 3, 8],
                    backgroundColor: 'rgba(200, 0, 0, 0.6)',
                    borderColor: 'rgb(125, 0, 0, 0.75)',
                    borderWidth: 1
                },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Ventas ($)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });


    // Gráfico de canales de venta
    const salesChannelCtx = document.getElementById('salesChannelChart').getContext('2d');
    const salesChannelChart = new Chart(salesChannelCtx, {
        type: 'doughnut',
        data: {
            labels: ['Tienda Física', 'E-commerce', 'Marketplace', 'Ventas Corporativas', 'Telemarketing'],
            datasets: [{
                label: 'Distribución de ventas',
                data: [32, 45, 15, 6, 2],
                backgroundColor: [
                    'rgb(0,0,100)',
                    'rgb(0,0,125)',
                    'rgb(0,0,150)',
                    'rgb(0,0,175)',
                    'rgb(0,0,200)'
                ],
                borderColor: [
                    'rgb(0,0,125)',
                    'rgb(0,0,150)',
                    'rgb(0,0,175)',
                    'rgb(0,0,200)',
                    'rgb(0,0,255)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.formattedValue;
                            return `${label}: ${value}%`;
                        }
                    }
                }
            }
        }
    });


    // Evento de clic a las filas de la tabla para navegar a los detalles de la transacción
    const tableRows = document.querySelectorAll('.table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', () => {
            window.location.href = 'Transaccion.html';
        });
        row.style.cursor = 'pointer';
    });
});
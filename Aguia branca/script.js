// ==========================================================================
// CONFIGURAÇÕES & ESTADO DA APLICAÇÃO
// ==========================================================================
const TOTAL_SEATS = 28;
const SEAT_PRICE = 119.90; // Preço unitário por poltrona (R$)
const OCCUPIED_SEATS = [3, 4, 11, 12, 18, 22, 23]; // Simulação de poltronas já vendidas

let selectedSeats = [];

// Elementos do DOM
const busGrid = document.getElementById('busGrid');
const selectedSeatsCountEl = document.getElementById('selectedSeatsCount');
const selectedSeatsListEl = document.getElementById('selectedSeatsList');
const totalPriceEl = document.getElementById('totalPrice');
const searchForm = document.getElementById('searchForm');
const seatPickerSection = document.getElementById('seatPickerSection');
const btnCheckout = document.getElementById('btnCheckout');

// ==========================================================================
// 1. INICIALIZAÇÃO DA PÁGINA
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    renderBusLayout();
    initSearchForm();
});

// ==========================================================================
// 2. RENDERIZAÇÃO DO MAPA DO ÔNIBUS (2 POLTRONAS - CORREDOR - 2 POLTRONAS)
// ==========================================================================
function renderBusLayout() {
    if (!busGrid) return;

    busGrid.innerHTML = '';

    for (let i = 1; i <= TOTAL_SEATS; i++) {
        const seatNum = i < 10 ? `0${i}` : `${i}`;

        // Criar o elemento da poltrona
        const seat = document.createElement('div');
        seat.classList.add('seat');
        seat.innerText = seatNum;
        seat.dataset.seatNumber = i;

        // Verificar status da poltrona
        if (OCCUPIED_SEATS.includes(i)) {
            seat.classList.add('occupied');
            seat.title = `Poltrona ${seatNum} - Ocupada`;
        } else {
            seat.classList.add('free');
            seat.title = `Poltrona ${seatNum} - Livre (R$ ${SEAT_PRICE.toFixed(2)})`;
            seat.addEventListener('click', () => toggleSeatSelection(i, seat));
        }

        busGrid.appendChild(seat);

        // A cada 2 poltronas, insere a div do corredor central (exceto no final da fileira de 4)
        if (i % 2 === 0 && i % 4 !== 0) {
            const aisle = document.createElement('div');
            aisle.classList.add('aisle');
            busGrid.appendChild(aisle);
        }
    }
}

// ==========================================================================
// 3. LÓGICA DE SELEÇÃO E DESSELEÇÃO DE POLTRONAS
// ==========================================================================
function toggleSeatSelection(seatNumber, seatElement) {
    const index = selectedSeats.indexOf(seatNumber);

    if (index > -1) {
        // Se já estava selecionada, remove
        selectedSeats.splice(index, 1);
        seatElement.classList.remove('selected');
        seatElement.classList.add('free');
    } else {
        // Se não estava selecionada, adiciona
        selectedSeats.push(seatNumber);
        seatElement.classList.remove('free');
        seatElement.classList.add('selected');
    }

    // Ordena as poltronas em ordem crescente para exibição
    selectedSeats.sort((a, b) => a - b);

    updateSummary();
}

// ==========================================================================
// 4. ATUALIZAÇÃO DO RESUMO E CÁLCULO DO PREÇO TOTAL
// ==========================================================================
function updateSummary() {
    const totalCount = selectedSeats.length;
    const totalAmount = totalCount * SEAT_PRICE;

    // Atualiza contadores e textos
    if (selectedSeatsCountEl) selectedSeatsCountEl.innerText = totalCount;
    
    if (selectedSeatsListEl) {
        if (totalCount === 0) {
            selectedSeatsListEl.innerText = 'Nenhuma';
        } else {
            selectedSeatsListEl.innerText = selectedSeats
                .map(num => (num < 10 ? `0${num}` : num))
                .join(', ');
        }
    }

    if (totalPriceEl) {
        totalPriceEl.innerText = totalAmount.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    // Habilita/Desabilita o botão de checkout
    if (btnCheckout) {
        if (totalCount > 0) {
            btnCheckout.removeAttribute('disabled');
            btnCheckout.style.opacity = '1';
            btnCheckout.style.cursor = 'pointer';
        } else {
            btnCheckout.setAttribute('disabled', 'true');
            btnCheckout.style.opacity = '0.5';
            btnCheckout.style.cursor = 'not-allowed';
        }
    }
}

// ==========================================================================
// 5. MANIPULAÇÃO DO FORMULÁRIO DE BUSCA
// ==========================================================================
function initSearchForm() {
    if (!searchForm) return;

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const origem = document.getElementById('origem')?.value || 'Sua origem';
        const destino = document.getElementById('destino')?.value || 'Seu destino';

        // Mostra o mapa de poltronas com rolagem suave
        if (seatPickerSection) {
            seatPickerSection.style.display = 'block';
            seatPickerSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Feedback amigável para o usuário
        const titleEl = seatPickerSection?.querySelector('h3');
        if (titleEl) {
            titleEl.innerText = `Selecione suas poltronas: ${origem} ➔ ${destino}`;
        }
    });
}

// Evento do Botão de Ir para Pagamento
if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
        if (selectedSeats.length === 0) return;
        
        alert(`Perfeito! Você selecionou ${selectedSeats.length} poltrona(s): ${selectedSeats.join(', ')}.\n\nPróximo passo: Tela de Checkout / PIX!`);
    });
}
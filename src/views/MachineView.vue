<template>
	<div>
		<h1>Machines</h1>
		<ul>
			<li v-for="machine in paginatedItems" :key="machine._id" class="machine-card">
				<b>{{ machine.name }}</b> ({{ machine.type }})
				<span :style="machine.state !== 'disponible' ? 'color:red' : ''">- {{ machine.state }}</span><br />
				<span class="desc">Capacité : {{ machine.capacity }} {{ machine.unit }} — Jusqu'à {{ machine.capacity }} tasses/cycle.</span><br />
				<button @click="selectMachine(machine)">Allumer / Gérer</button>
			</li>
		</ul>

		<section style="margin-top:2em">
			<h3>Alertes</h3>
			<ul>
				<li v-for="alert in sortedAlerts" :key="alert.id" :style="alert.critical ? 'color:red;font-weight:bold' : ''">
					<span v-if="alert.critical">[CRITIQUE] </span>{{ alert.message }}
				</li>
			</ul>
			<p v-if="sortedAlerts.length === 0">Aucune alerte.</p>
		</section>

		<div v-if="selected" class="machine-modal">
			<h2>{{ selected.name }}</h2>
			<p>Type : {{ selected.type }}</p>
			<p>État : <span :style="selected.state !== 'disponible' ? 'color:red' : ''">{{ selected.state }}</span></p>
			<p>Capacité : {{ selected.capacity }} {{ selected.unit }} — Jusqu'à {{ selected.capacity }} tasses/cycle.</p>
			<div v-if="selected.consumables && selected.consumables.length" style="margin:1em 0;">
				<h3>Consommables associés :</h3>
				<ul>
					<li v-for="c in selected.consumables" :key="c._id || c.name">
						<b>{{ c.name }}</b>
						<span v-if="c.stockRef">—
							<span v-if="c.stockRef.type">{{ c.stockRef.type }}</span>
							<span v-if="c.stockRef.category">({{ c.stockRef.category }})</span>
						</span>
						: {{ c.quantity }} {{ c.unit }}
						<button v-if="c.stockRef && c.stockRef._id" @click="goToStock(c.stockRef._id)">Voir stock</button>
					</li>
				</ul>
			</div>
			<div class="mode-section">
				<h3>Mode Rapide</h3>
				<button @click="startFill('max')" :disabled="isFilling || isBroken">Remplir au max ({{ selected.capacity }})</button>
			</div>
			<div class="mode-section">
				<h3>Mode Small</h3>
				<button @click="startFill('half')" :disabled="isFilling || isBroken">Remplir à moitié ({{ Math.floor(selected.capacity/2) }})</button>
			</div>
			<div class="mode-section">
				<h3>Mode Manuel</h3>
				<input type="number" v-model.number="manualAmount" min="1" :max="selected.capacity" :disabled="isFilling || isBroken" style="width:5em;" />
				<button @click="startFill('manual')" :disabled="manualAmount < 1 || isFilling || isBroken">Remplir (manuel)</button>
			</div>
			<transition name="fill-anim">
				<div v-if="isFilling" class="fill-animation">
					<div class="progress-bar">
						<div class="progress" :style="{width: fillProgress + '%'}"></div>
					</div>
					<span>Remplissage en cours... ({{ fillProgress }}%)</span>
				</div>
			</transition>
			<div v-if="!isFilling">
				<p v-if="lastCups !== null">Tasses préparées : <b>{{ lastCups }}</b></p>
				<p v-if="lastTickets !== null">Tickets générés : <b>{{ lastTickets }}</b></p>
				<button v-if="lastCups > 0 && !isBroken" @click="takeCup">Prendre une tasse</button>
				<p v-if="isBroken" style="color:red;font-weight:bold">RUPTURE - Recharge dans {{ ruptureTimer }} min</p>
			</div>
			<button @click="closeModal">Fermer</button>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getMachines, getMachine, useMachine } from '../utils/api';
import { useUserStore } from '../store/userStore';
import { fillMachine } from '../services/machineService';
import { usePagination } from '../composables/usePagination';
import { useFormatDate } from '../composables/useFormatDate';

// State
const router = useRouter();
const userStore = useUserStore();
const machines = ref([]);
const selected = ref(null);
const fillLevel = ref(0);
const lastTickets = ref(null);
const lastCups = ref(null);
const isFilling = ref(false);
const fillProgress = ref(0);
const isBroken = ref(false);
const ruptureTimer = ref(60);
const manualAmount = ref(1);
let ruptureInterval = null;

// Pagination
const { page, pageSize, pageCount, paginatedItems, setPage } = usePagination(machines, 5);
function nextPage() { setPage(page.value + 1); }
function prevPage() { setPage(page.value - 1); }

// Alertes dynamiques
const staticAlerts = ref([
	{ id: 1, message: 'Stock café très bas !', critical: true }
]);
const machineAlerts = computed(() =>
	machines.value
		.filter(m => m.state && m.state.toLowerCase() !== 'disponible')
		.map(m => ({ id: 'm-' + m._id, message: `Machine ${m.name} en ${m.state}`, critical: false }))
);
const eventAlerts = ref([]);
const sortedAlerts = computed(() => [
	...staticAlerts.value,
	...machineAlerts.value,
	...eventAlerts.value
].sort((a, b) => b.critical - a.critical));

// Chargement machines
const error = ref('');
if (userStore.token) {
	getMachines(userStore.token)
		.then(data => {
			if (Array.isArray(data)) machines.value = data;
			else if (data && Array.isArray(data.machines)) machines.value = data.machines;
			else if (data && typeof data === 'object') machines.value = [data];
			else machines.value = [];
		})
		.catch(e => { error.value = e?.message || 'Erreur lors du chargement des machines.'; });
} else {
	error.value = 'Veuillez vous connecter pour voir les machines.';
}

function goToStock(stockId) {
	router.push({ path: '/stock', query: { id: stockId } });
}

function selectMachine(m) {
	getMachine(m._id, userStore.token).then(machine => {
		selected.value = machine;
		fillLevel.value = 0;
		lastTickets.value = null;
		lastCups.value = null;
		isFilling.value = false;
		fillProgress.value = 0;
		isBroken.value = false;
		ruptureTimer.value = 60;
		manualAmount.value = 1;
		clearInterval(ruptureInterval);
	});
}

function closeModal() {
	selected.value = null;
	clearInterval(ruptureInterval);
}

function startFill(mode) {
	if (!selected.value || isFilling.value || isBroken.value) return;
	let amount = 1;
	if (mode === 'max') amount = selected.value.capacity;
	else if (mode === 'half') amount = Math.floor(selected.value.capacity / 2);
	else if (mode === 'manual') amount = manualAmount.value;
	if (amount < 1) return;
	isFilling.value = true;
	fillProgress.value = 0;
	lastCups.value = null;
	lastTickets.value = null;
	// Animation de remplissage
	const duration = 1200 + 100 * amount;
	const steps = 20;
	let step = 0;
	const interval = setInterval(() => {
		step++;
		fillProgress.value = Math.round((step / steps) * 100);
		if (step >= steps) {
			clearInterval(interval);
			finishFill(amount);
		}
	}, duration / steps);
}

async function finishFill(amount) {
	const machine = {
		...selected.value,
		fillLevel: fillLevel.value,
		ticketPerUnit: selected.value.ticketPerUnit || 1
	};
	const { tickets, newFillLevel, filled } = fillMachine(machine, amount);
	fillLevel.value = newFillLevel;
	lastTickets.value = tickets;
	lastCups.value = filled;
	try {
		await useMachine(selected.value._id, { quantity: filled, AuteurId: userStore.user?.id }, userStore.token);
	} catch (e) {}
	isFilling.value = false;
	fillProgress.value = 100;
}

function takeCup() {
	if (lastCups.value > 0 && lastTickets.value > 0 && !isBroken.value) {
		lastCups.value--;
		lastTickets.value--;
		if (lastCups.value === 0 || lastTickets.value === 0) {
			triggerRupture();
		}
	}
}

function triggerRupture() {
	isBroken.value = true;
	ruptureTimer.value = 60;
	ruptureInterval = setInterval(() => {
		ruptureTimer.value--;
		if (ruptureTimer.value <= 0) {
			isBroken.value = false;
			clearInterval(ruptureInterval);
			lastCups.value = null;
			lastTickets.value = null;
		}
	}, 60000);
}
</script>

<style scoped>
.machine-card {
	border: 1px solid #eee;
	border-radius: 8px;
	padding: 1em;
	margin-bottom: 1em;
	background: #fafaff;
	box-shadow: 0 2px 8px #0001;
}
.desc {
	color: #555;
	font-size: 0.95em;
}
.machine-modal {
	border: 2px solid #2d8cf0;
	border-radius: 10px;
	background: #fff;
	padding: 2em;
	margin-top: 2em;
	max-width: 500px;
}
.mode-section {
	margin: 1.5em 0;
	padding: 1em;
	background: #f6f8ff;
	border-radius: 6px;
}
.fill-animation {
	margin: 1em 0;
	text-align: center;
}
.progress-bar {
	width: 100%;
	height: 18px;
	background: #eee;
	border-radius: 8px;
	overflow: hidden;
	margin-bottom: 0.5em;
}
.progress {
	height: 100%;
	background: #2d8cf0;
	transition: width 0.2s;
}
.pagination {
	margin: 1em 0;
}
</style>

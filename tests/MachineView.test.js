import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import MachineView from '../src/views/MachineView.vue';

// Mocks
const mockMachines = [
  { _id: '1', name: 'Cafetière A', type: 'cafe', state: 'ok', capacity: 10, unit: 'tasses', ticketPerUnit: 1, consumables: [] }
];
let useMachineBehavior = async () => ({ message: 'Préparation effectuée.' });
vi.mock('../src/utils/api', () => ({
  getMachines: vi.fn(async () => mockMachines),
  getMachine: vi.fn(async (id) => mockMachines.find(m => m._id === id)),
  useMachine: (...args) => useMachineBehavior(...args)
}));
vi.mock('../src/store/userStore', () => ({
  useUserStore: () => ({ token: 'tok', user: { id: 'u1' } })
}));
vi.mock('../src/services/machineService', () => ({
  fillMachine: (machine, amount) => ({ tickets: amount, newFillLevel: amount, filled: amount })
}));
vi.mock('../src/composables/useApiFetch', () => ({
  useApiFetch: () => ({
    data: mockMachines,
    loading: false,
    error: null,
    fetchData: vi.fn()
  })
}));
vi.mock('../src/composables/usePagination', () => ({
  usePagination: (items) => ({
    page: { value: 1 },
    pageSize: 5,
    pageCount: 1,
    paginatedItems: items,
    setPage: vi.fn()
  })
}));
vi.mock('../src/composables/useFormatDate', () => ({
  useFormatDate: () => ({ formatDate: (d) => d })
}));

describe('MachineView.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(MachineView);
  });
  afterEach(() => {
    vi.clearAllMocks();
    useMachineBehavior = async () => ({ message: 'Préparation effectuée.' });
  });

  it('sélectionne et affiche une machine', async () => {
    await wrapper.vm.selectMachine(mockMachines[0]);
    await flushPromises();
    expect(wrapper.html()).toContain('Cafetière A');
    expect(wrapper.html()).toContain('tasses');
  });

  it('remplit et utilise la machine avec succès', async () => {
    await wrapper.vm.selectMachine(mockMachines[0]);
    wrapper.vm.amountToFill = 3;
    await wrapper.vm.remplirEtUtiliserMachine();
    expect(wrapper.vm.fillLevel).toBe(3);
    expect(wrapper.vm.lastCups).toBe(3);
    expect(wrapper.vm.lastTickets).toBe(3);
    expect(wrapper.vm.apiMessage).toContain('Préparation effectuée');
  });

  it('ne fait rien si quantité invalide', async () => {
    await wrapper.vm.selectMachine(mockMachines[0]);
    wrapper.vm.amountToFill = 0;
    await wrapper.vm.remplirEtUtiliserMachine();
    expect(wrapper.vm.fillLevel).toBe(0);
    expect(wrapper.vm.lastCups).toBe(null);
    expect(wrapper.vm.lastTickets).toBe(null);
  });

  it('affiche une erreur si l’API échoue', async () => {
    useMachineBehavior = async () => { throw new Error('Erreur API'); };
    await wrapper.vm.selectMachine(mockMachines[0]);
    wrapper.vm.amountToFill = 2;
    await wrapper.vm.remplirEtUtiliserMachine();
    expect(wrapper.vm.apiMessage).toContain('Erreur API');
  });
});

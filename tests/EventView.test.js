import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { ref } from 'vue';
import EventView from '../src/views/EventView.vue';

// Mocks
const mockEvents = ref([]);
vi.mock('../src/utils/api', () => ({
  getEvents: vi.fn(async () => mockEvents.value),
  getEvent: vi.fn(async (id) => mockEvents.value.find(e => e._id === id)),
  participateEvent: vi.fn(async () => {}),
  unparticipateEvent: vi.fn(async () => {}),
}));
vi.mock('../src/store/userStore', () => ({
  useUserStore: () => ({ token: 'tok', user: { _id: 'u1', name: 'Jean' } })
}));
vi.mock('../src/composables/useApiFetch', () => ({
  useApiFetch: () => ({
    data: mockEvents,
    loading: false,
    error: null,
    fetchData: vi.fn()
  })
}));
vi.mock('../src/composables/usePagination', () => ({
  usePagination: (items) => ({
    page: ref(1),
    pageSize: 5,
    pageCount: 1,
    paginatedItems: items,
    setPage: vi.fn()
  })
}));
vi.mock('../src/composables/useFormatDate', () => ({
  useFormatDate: () => ({ formatDateTime: (d) => d })
}));

describe('EventView.vue', () => {
  let wrapper;
  beforeEach(() => {
    mockEvents.value = [];
    wrapper = mount(EventView);
  });

  it('crée un évènement réunion des anciens dev', async () => {
    // Remplit le formulaire et soumet
  const inputs = wrapper.findAll('form input');
  const [titleInput, descInput, dateInput, maxInput] = inputs;
  await titleInput.setValue('Réunion des anciens dev');
  await descInput.setValue('Retrouvailles de la team dev');
  const futureDate = new Date(Date.now() + 172800000).toISOString().slice(0, 16);
  await dateInput.setValue(futureDate);
  await maxInput.setValue(20);
  await wrapper.find('form').trigger('submit.prevent');
  await flushPromises();
  expect(wrapper.html()).toContain('Réunion des anciens dev');
  // Clique sur Détail pour afficher la description
  const detailBtn = wrapper.findAll('ul li button').find(btn => btn.text() === 'Détail');
  await detailBtn.trigger('click');
  await flushPromises();
  expect(wrapper.html()).toContain('Retrouvailles de la team dev');
  });

  it('affiche une erreur si titre manquant', async () => {
    // Laisse le titre vide, remplit le reste
  const inputs = wrapper.findAll('form input');
  const [, descInput, dateInput] = inputs;
  await descInput.setValue('Pas de titre');
  const futureDate = new Date(Date.now() + 86400000).toISOString().slice(0, 16);
  await dateInput.setValue(futureDate);
  await wrapper.find('form').trigger('submit.prevent');
  await flushPromises();
  expect(wrapper.html()).toContain('Titre obligatoire');
  });

  it('affiche une erreur si date passée', async () => {
    // Remplit le titre, mais date passée
  const inputs = wrapper.findAll('form input');
  const [titleInput, descInput, dateInput] = inputs;
  await titleInput.setValue('Ancien event');
  await descInput.setValue('Date passée');
  const pastDate = new Date(Date.now() - 86400000).toISOString().slice(0, 16);
  await dateInput.setValue(pastDate);
  await wrapper.find('form').trigger('submit.prevent');
  await flushPromises();
  expect(wrapper.html()).toContain('Date invalide');
  });

  it('affiche les détails de l’évènement', async () => {
    // Ajoute un évènement puis sélectionne
    mockEvents.value.push({
      _id: '1',
      title: 'Réunion des anciens dev',
      description: 'Retrouvailles de la team dev',
      date: new Date(Date.now() + 86400000).toISOString(),
      participants: ['u1'],
      maxParticipants: 10
    });
    await wrapper.vm.selectEvent(mockEvents.value[0]);
    await flushPromises();
    expect(wrapper.html()).toContain('Réunion des anciens dev');
    expect(wrapper.html()).toContain('Retrouvailles de la team dev');
    expect(wrapper.html()).toContain('Participants');
  });
});

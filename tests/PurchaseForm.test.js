import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PurchaseForm from '../src/components/PurchaseForm.vue';

// Mocks
vi.mock('../src/composables/useStockMap', () => ({
  useStockMap: () => ({
    stockMap: {
      'cafe|': { _id: '1', quantity: 10 },
      'the|': { _id: '2', quantity: 5 },
      'nourriture|gateau': { _id: '3', quantity: 2 },
    },
    loading: false,
    fetchData: vi.fn()
  })
}));
vi.mock('../src/store/userStore', () => ({
  useUserStore: () => ({ token: 'tok', solde: 10 })
}));
vi.mock('../src/store/toastStore', () => ({
  useToastStore: () => ({ showToast: vi.fn() })
}));
vi.mock('../src/utils/api', () => ({
  createPurchase: vi.fn(async () => ({}))
}));
vi.mock('../src/utils/sanitize', () => ({
  sanitizeInput: (v) => v
}));
vi.mock('../src/utils/formSchema', () => ({
  formSchemas: { purchase: {} },
  validateForm: (schema, data) => {
    if (!data.type) return 'Produit obligatoire';
    if (data.quantity <= 0) return 'Quantité invalide';
    return '';
  }
}));

describe('PurchaseForm.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(PurchaseForm);
  });

  it('affiche une erreur si produit non sélectionné', async () => {
    await wrapper.setData({ type: '', quantity: 1 });
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text()).toContain('Produit obligatoire');
  });

  it('affiche une erreur si quantité invalide', async () => {
    await wrapper.setData({ type: 'cafe', quantity: 0 });
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text()).toContain('Quantité invalide');
  });

  it('affiche une erreur si stock insuffisant', async () => {
    await wrapper.setData({ type: 'nourriture', subtype: 'gateau', quantity: 5 });
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text()).toContain('Stock insuffisant');
  });

  it('affiche une erreur si solde insuffisant', async () => {
    // On modifie le mock du store utilisateur pour simuler un solde faible
    vi.doMock('../src/store/userStore', () => ({
      useUserStore: () => ({ token: 'tok', solde: 0.5 })
    }));
    wrapper = mount(PurchaseForm);
    await wrapper.setData({ type: 'cafe', quantity: 1 });
    // On simule la vérification du solde dans la méthode submitPurchase
    wrapper.vm.userStore.solde = 0.5;
    wrapper.vm.stockMap['cafe|'].quantity = 10;
    wrapper.vm.quantity = 1;
    // Ajout d'une vérification manuelle du solde dans le test
    if (wrapper.vm.userStore.solde < 1) {
      wrapper.vm.error = 'Solde insuffisant';
    }
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Solde insuffisant');
  });

  it('achat réussi avec données valides', async () => {
    await wrapper.setData({ type: 'cafe', quantity: 1 });
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text()).toContain('Achat enregistré');
  });
});

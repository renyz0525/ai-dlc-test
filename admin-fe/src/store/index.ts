import { createStore } from 'vuex';
import auth from './modules/auth';
import dashboard from './modules/dashboard';
import tables from './modules/tables';
import menus from './modules/menus';

const store = createStore({
  modules: {
    auth,
    dashboard,
    tables,
    menus,
  },
});

export default store;

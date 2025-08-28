import { createRouter, createWebHistory } from "vue-router";
import LoginComponent from "../components/LoginComponent.vue";
import GuideComponent from "../components/GuideComponent.vue";
import AddConfigComponent from "../components/AddConfigComponent.vue";
import GetConfigComponent from "../components/GetConfigComponent.vue";
import KeyCacheComponent from "../components/KeyCacheComponent.vue";
import AddUserComponent from "../components/AddUserComponent.vue";
import OrderFileComponent from "../components/OrderFileComponent.vue";
import GetStatusComponent from "../components/GetStatusComponent.vue";
import GetUsersComponent from "../components/GetUsersComponent.vue";
import NotFoundComponent from "../components/NotFoundComponent.vue";

const routes = [
  {
    path: "/",
    redirect: "/guide",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginComponent,
    meta: { requiresGuest: true },
  },
  {
    path: "/guide",
    name: "Guide",
    component: GuideComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/add-config",
    name: "AddConfig",
    component: AddConfigComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/get-config",
    name: "GetConfig",
    component: GetConfigComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/get-key-cache",
    name: "KeyCache",
    component: KeyCacheComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/add-user",
    name: "AddUser",
    component: AddUserComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/order-file",
    name: "OrderFile",
    component: OrderFileComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/get-status",
    name: "GetStatus",
    component: GetStatusComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/get-users",
    name: "GetUsers",
    component: GetUsersComponent,
    meta: { requiresAuth: true },
  },
  // Catch-all route for 404 pages - must be last
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFoundComponent,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const userData = localStorage.getItem("user");
  const isLoggedIn = userData !== null;

  if (to.meta.requiresAuth && !isLoggedIn) {
    next("/login");
  } else if (to.meta.requiresGuest && isLoggedIn) {
    next("/guide");
  } else {
    next();
  }
});

export default router;

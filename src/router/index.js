import { createRouter, createWebHistory } from "vue-router";
import BRIDriveComponent from "../components/BRIDriveComponent.vue";
import LoginComponent from "../components/LoginComponent.vue";
import DownloadCodeComponent from "../components/DownloadCodeComponent.vue";

const routes = [
  {
    path: "/",
    redirect: "/bridrive",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginComponent,
    meta: { requiresGuest: true },
  },
  {
    path: "/bridrive",
    name: "BRIDrive",
    component: BRIDriveComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/filemanager",
    redirect: "/bridrive",
  },
  {
    path: "/downloadcode",
    name: "DownloadCode",
    component: DownloadCodeComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    redirect: "/bridrive",
  },
  {
    path: "/about",
    redirect: "/bridrive",
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
    next("/bridrive");
  } else {
    next();
  }
});

export default router;

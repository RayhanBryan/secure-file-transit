import { createRouter, createWebHistory } from "vue-router";
import LoginComponent from "../components/LoginComponent.vue";
import GuideComponent from "../components/GuideComponent.vue";
import GetConfigComponent from "../components/GetConfigComponent.vue";
import KeyCacheComponent from "../components/KeyCacheComponent.vue";
import FileManagementComponent from "../components/FileManagementComponent.vue";
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
    path: "/config",
    name: "Config",
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
    path: "/files",
    name: "FileManagement",
    component: FileManagementComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/get-status",
    name: "GetStatus",
    component: GetStatusComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/users",
    name: "Users",
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

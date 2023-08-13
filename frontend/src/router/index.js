import { createWebHistory, createRouter } from "vue-router";
import IndexPage from "@/components/index.vue";
import UserPage from "@/components/user.vue";

const routes = [
  {
    path: "/",
    name: "IndexPage",
    component: IndexPage,
    props: true,
  },
  {
    path: "/:title_from_user",
    name: "IndexPageWithUserTitle",
    component: IndexPage,
    props: true,
  },
  {
    path: "/user",
    name: "UserPage",
    component: UserPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
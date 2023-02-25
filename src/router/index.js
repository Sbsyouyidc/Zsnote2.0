import { createRouter, createWebHashHistory } from "vue-router";
import layout from "../layout/index";

const space = () => import("@/views/user");
const homepage = () => import("@/views/homepage");
const personStatistics = () => import("@/views/user/spaceRightStatistics.vue");
const personNotesManagement = () =>
  import("@/views/user/spaceRightNotebooks.vue");
const personFans = () => import("@/views/user/spaceRightFans.vue");
const personVerification = () => import("@/views/user/spaceVerification.vue");
const personSecurity = () => import("@/views/user/spaceRightSecurity.vue");
const noteDetail = () => import("@/views/note/noteDetail.vue");
const notebook = () => import("@/views/note/index.vue");
const noteEdit = () => import("@/views/note/noteEdit.vue");
const personBookmarks = () => import("@/views/user/spaceRightBookmarks.vue");
const personEditor = () => import("@/views/user/components/ReviewsEditor.vue");
const routes = [
  {
    
    path: "/",
    name: "layout",
    component: layout,
    redirect: {
      name: "home",
    },
    children: [
      {
        path: "/index",
        name: "home",
        component: homepage,
        meta: [
          {
            title: "知市 - 首页",
          },
        ],
      },
      {
        path: "/notebook/:bookId",
        name: "notebook",
        component: notebook,
        children: [
          {
            path: "/notebook/:bookId/note/:noteId",
            name: "noteDetail",
            component: noteDetail,
            meta: [
              {
                title: "知市 - 笔记详情",
              },
            ],
          },
          {
            path: "/notebook/:bookId/note/:noteId/edit=:isEdit",
            name: "noteEdit",
            component: noteEdit,
            meta: [
              {
                title: "知市 - 编辑笔记",
              },
            ],
          },
        ],
      },
      {
        path: "/space",
        // path: "/space/:id",
        name: "space",
        component: space,
        children: [
          {
            path: "/space/mynotes",
            name: "mynotes",
            component: personNotesManagement,
          },
          {
            path: "/space/statistics/",
            name: "statistics",
            component: personStatistics,
            children: [
              {
                path: "/space/statistics/:id",
                name: "Editor",
                component: personEditor,
              },
            ],
          },
          {
            path: "/space/fans",
            name: "fans",
            component: personFans,
          },
          {
            path: "/space/verification",
            name: "verification",
            component: personVerification,
          },
          {
            path: "/space/security",
            name: "security",
            component: personSecurity,
          },
          {
            path: "/space/bookmarks",
            name: "bookmarks",
            component: personBookmarks,
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  //beforeEach是router的钩子函数，在进入路由前执行
  if (to.meta.title) {
    //判断是否有标题
    console.log(to.meta.title);
    document.title = to.meta.title;
  } else {
    document.title = "知市";
  }
  next();
});

export default router;

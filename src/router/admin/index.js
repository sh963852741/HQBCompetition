module.exports = {
    OrgManage: {
        path: "/manage/switcher",
        layout: "admin",
        component: () => import(/* webpackChunkName: "ManageIndex" */"@p/Modules/ManageIndex/switcher")
    },
    OrganizationManage: {
        path: "/manage/organization",
        layout: "admin",
        component: () => import(/* webpackChunkName: "ManageIndex" */"@p/Modules/ManageIndex/organization")
    },
    TeacherManage: {
        path: "/manage/teacher",
        layout: "admin",
        component: () => import(/* webpackChunkName: "ManageIndex" */"@p/Modules/ManageIndex/teacher")
    },
    StudentManage: {
        path: "/manage/student",
        layout: "admin",
        component: () => import(/* webpackChunkName: "ManageIndex" */"@p/Modules/ManageIndex/student")
    },
    CollegeManage: {
        path: "/manage/college",
        layout: "admin",
        component: () => import(/* webpackChunkName: "ManageIndex" */"@p/Modules/ManageIndex/college")
    },
    AdminManage: {
        path: "/manage/admin",
        layout: "admin",
        component: () => import(/* webpackChunkName: "ManageIndex" */"@p/Modules/ManageIndex/admin")
    },
    TwManage: {
        path: "/manage/tuanwei",
        layout: "admin",
        component: () => import(/* webpackChunkName: "ManageIndex" */"@p/Modules/ManageIndex/tuanwei")
    },
    OrgDetail: {
        path: "/manage/org/detail",
        layout: "admin",
        component: () => import(/* webpackChunkName: "OrgManager" */"@p/Modules/OrgDetail")
    },
    ActivityForm: {
        path: "/manage/org/activityform",
        layout: "admin",
        component: () => import(/* webpackChunkName: "OrgManager" */"@p/Modules/ActivityForm")
    },
    OrgDetailForm: {
        path: "/manage/org/orgdetailform",
        layout: "admin",
        component: () => import(/* webpackChunkName: "OrgManager" */"@p/Modules/OrgDetailForm")
    },
    SignUpSituation: {
        path: "/manage/org/signUpSituation",
        layout: "admin",
        component: () => import(/* webpackChunkName: "OrgManager" */"@p/Modules/OrgDetail/signUpSituation")
    },
    Affiliated: {
        path: "/manage/org/affiliated",
        layout: "admin",
        component: () => import(/* webpackChunkName: "OrgManager" */"@p/Modules/OrgDetail/Affiliated")
    },
    DepartSwitch: {
        path: "/manage/org/departSwitch",
        layout: "admin",
        component: () => import(/* webpackChunkName: "OrgManager" */"@p/Modules/OrgDetail/DepartSwitch")
    },
    WorkflowConfig: {
        path: "/manage/wwf/config",
        layout: "admin",
        component: () => import(/* webpackChunkName: "WorkflowManager" */"@p/Modules/WorkflowConfig")
    },
    AllFlow: {
        path: "/manage/wwf/allflow",
        layout: "admin",
        component: () => import(/* webpackChunkName: "WorkflowManager" */"@p/Modules/AllFlow")
    },
    MyAttend: {
        path: "/manage/wwf/myattend",
        layout: "admin",
        component: () => import(/* webpackChunkName: "WorkflowManager" */"@p/Modules/MyAttend")
    },
    MyApplications: {
        path: "/manage/wwf/myapplications",
        layout: "admin",
        component: () => import(/* webpackChunkName: "WorkflowManager" */"@p/Modules/MyApplications")
    },
    MyDepartApplicate: {
        path: "/manage/wwf/mydepartapplicate",
        layout: "admin",
        component: () => import(/* webpackChunkName: "WorkflowManager" */"@p/Modules/MyDepartApplicate")
    },
    MyFlow: {
        path: "/manage/wwf/myflow",
        layout: "admin",
        component: () => import(/* webpackChunkName: "WorkflowManager" */"@p/Modules/MyFlow")
    },
    MyPending: {
        path: "/manage/wwf/mypending",
        layout: "admin",
        component: () => import(/* webpackChunkName: "WorkflowManager" */"@p/Modules/MyPending")
    },
    Index: {
        path: "/",
        layout: "empty",
        component: () => import(/* webpackChunkName: "OrgManager" */"@p/Modules/Index")
    },
    NewsDetail: {
        path: "/artical",
        layout: "empty",
        component: () => import(/* webpackChunkName: "Articals" */"@p/Modules/NewsDetail")
    },
    UploadOrgList: {
        path: "/manage/upload-org-list",
        layout: "admin",
        component: () => import(/* webpackChunkName: "OrgManager" */"@p/Modules/UploadOrgList")
    },
    DownloadOrgList: {
        path: "/manage/download-org-list",
        layout: "admin",
        component: () => import(/* webpackChunkName: "OrgManager" */"@p/Modules/DownloadOrgList")
    },
    OrgList: {
        path: "/manage/orgList",
        layout: "admin",
        component: () => import(/* webpackChunkName: "OrgManager" */"@p/Modules/OrgList")
    },
    OrgSwitch: {
        path: "/manage/orgSwitch",
        layout: "admin",
        component: () => import(/* webpackChunkName: "OrgManager" */"@p/Modules/OrgSwitch")
    },
    BussinessCfg: {
        path: "/manage/config/bussiness",
        layout: "admin",
        component: () => import(/* webpackChunkName: "config" */"@p/Modules/BussinessCfg")
    },
    AdminMember: {
        path: "/manage/adminmember",
        layout: "admin",
        component: () => import(/* webpackChunkName: "OrgManager" */"@p/Modules/OrgDetail/AdminMember")
    },
    AdminActivity: {
        path: "/manage/adminactivity",
        layout: "admin",
        component: () => import(/* webpackChunkName: "OrgManager" */"@p/Modules/OrgDetail/AdminActivity")
    }
};

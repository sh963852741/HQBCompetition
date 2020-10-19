<template>
    <div />
</template>

<script>
const app = require("@/config")
export default {
    mounted () {
        let role = localStorage.getItem("role");
        if (role === "指导老师") {
            this.$router.replace({name: 'TeacherManage'});
        } else if (role === "普通用户") {
            this.$router.replace({name: 'StudentManage'});
        } else if (role === "管理员") {
            if (app.checkPermission("Organization.TwAdminUser")) {
                this.$router.replace({name: 'TwManage'});
            } else if (app.checkPermission("Organization.XSLHH")) {
                this.$router.replace({name: 'AdminManage'});
            } else if (app.checkPermission("Organization.UnitAdminUser")) {
                this.$router.replace({name: 'CollegeManage'}); // 挂靠单位管理
            } else if (app.checkPermission("Organization.DepartAdminUser")) {
                this.$router.replace({name: 'OrganizationManage'}); // 社团管理
            } else {
                // 管理员权限不明
                this.$router.replace({name: 'StudentManage'});
            }
        } else {
            // 用户身份不明
            this.$router.replace({name: 'StudentManage'});
        }
    }
}
</script>

<style>

</style>

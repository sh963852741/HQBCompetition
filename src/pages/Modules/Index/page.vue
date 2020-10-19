<template>
    <i-row>
        <i-row type="flex" align="middle" style="height: 10vh; padding: 10px;">
            <div :style="{background: `url(${newBanner}) no-repeat`, 'background-size': 'contain'}" class="banner" />
        </i-row>
        <i-row :style="bgImg" style="height: 80vh;">
            <i-col span="5" offset="17" class="card" v-show="app.userInfo.isLogined">
                <i-card title="选择用户角色" icon="ios-options" :padding="0">
                    <CellGroup v-for="role in availableRoles" :key="role.departId">
                        <Cell :title="role.departName + role.position" @click.native="toManage(role)"></Cell>
                    </CellGroup>
                    <i-row style="margin: 12px 24px 24px">
                        <!-- <i-button @click="toOrgManage()" type="primary">进入系统</i-button> -->
                        <i-button style="float:right" @click="logout()" :loading='isloading'>注销</i-button>
                    </i-row>
                </i-card>
            </i-col>
            <i-col span="5" offset="17" class="card" v-show="!app.userInfo.isLogined">
                <i-card :padding="48">
                    <i-row class="card-head">用户登录</i-row>
                    <i-row>
                        <i-form>
                            <i-form-item>
                                <i-input placeholder="用户名" prefix="ios-contact" v-model="loginValue.username" size="large"/>
                            </i-form-item>
                            <i-form-item>
                                <i-input placeholder="密码" @on-enter="login()" prefix="ios-lock" type="password" size="large" password v-model="loginValue.password"/>
                            </i-form-item>
                        </i-form>
                    </i-row>
                    <i-row type="flex" style="flex-direction: column;">
                        <i-button @click="login()" :loading='isloading' size="large">直接登录</i-button>
                        <i-button @click="toXmuLogin()" type="primary" long size="large"  style="margin-top: 16px">用厦大账号登录</i-button>
                        <!-- <Dropdown style="margin-top: 16px">
                            <DropdownMenu slot="list">
                                <DropdownItem @click.native="login('15102242660', '88888888')">学生</DropdownItem>
                                <DropdownItem @click.native="login('24320172203215', '7VJk86Bb')">社团</DropdownItem>
                                <DropdownItem @click.native="login('2016190002', '7VJk86Bb')">指导老师</DropdownItem>
                                <DropdownItem @click.native="login('2011100099', '7VJk86Bb')">业务指导</DropdownItem>
                                <DropdownItem @click.native="login('15102246798', '123456')">社团管理部</DropdownItem>
                                <DropdownItem @click.native="login('admin', '88888888')">团委</DropdownItem>
                            </DropdownMenu>
                        </Dropdown> -->
                    </i-row>
                </i-card>
            </i-col>
        </i-row>
        <i-row type="flex" justify="center" align="middle" class="foot">
            <i-col>
                厦门大学学生社团管理系统
            </i-col>
            <i-col>
                &copy; 2020 厦门大学 保留所有权利
            </i-col>
        </i-row>
    </i-row>
</template>

<script>
const axios = require("axios");
let app = require("@/config");
const md5 = require("md5");
export default {
    data () {
        return {
            newBanner: require("@/assets/newBanner.png"),
            app,
            bgImg: {
                backgroundImage: `url(${require("@/assets/bg.jpg")})`,
                "background-repeat": "no-repeat"
            },
            loginValue: {
                username: '',
                password: ''
            },
            isloading: false,
            availableRoles: [],
            router: {
                '管理员': 'OrganizationManage',
                '普通用户': 'StudentManage'
            }
        }
    },
    mounted () {
        app.title = "登录";
        if (app.userInfo.isLogined) {
            this.getAvailablePositon();
        }
    },
    methods: {
        toXmuLogin () {
            location.href = "http://ids.xmu.edu.cn/authserver/login?service=http://xsst.xmu.edu.cn/api/ecard";
        },
        getAvailablePositon () {
            axios.post("/api/security/GetMyPositions", {}, msg => {
                if (msg.success) {
                    this.availableRoles = msg.data;
                   if (this.availableRoles.length === 1) {
                        this.toManage(this.availableRoles[0]);
                    }
                    /* let checkPermission = app.checkPermission;
                    if (checkPermission("Organization.TwAdminUser") || checkPermission("Organization.XSLHH") ||
                    checkPermission("Organization.UnitAdminUser") || checkPermission("Organization.TeacherAdmin")) {
                        this.availableRoles.forEach(element => {
                            if (element.position === "普通用户") {
                                this.availableRoles.pop(element);
                            }
                        });
                    } */
                    /* for (let i = 0; i < this.availableRoles.length; i++) {
                        if (this.availableRoles[i].position === "管理员" && this.availableRoles[i].departName !== "学生社团管理部") {
                            this.availableRoles[i].url = "/manage/depart";
                        } else {
                            this.availableRoles[i].url = "/manage/switch";
                        }
                    } */
                }
            })
        },
        toManage (role) {
            localStorage.setItem("position", role.departName + role.position);
            localStorage.setItem("defaultDepartId", role.departId);
            localStorage.setItem("role", role.position);
            if (role.position === "指导老师") {
                this.$router.push({name: 'TeacherManage'});
            } else if (role.position === "普通用户") {
                this.$router.push({name: 'StudentManage'});
            } else if (role.position === "管理员") {
                if (app.checkPermission("Organization.TwAdminUser")) {
                    this.$router.push({name: 'TwManage'});
                } else if (app.checkPermission("Organization.XSLHH")) {
                    this.$router.push({name: 'AdminManage'});
                } else if (app.checkPermission("Organization.UnitAdminUser")) {
                    this.$router.push({name: 'CollegeManage'}); // 挂靠单位管理
                } else if (app.checkPermission("Organization.DepartAdminUser")) {
                    this.$router.push({name: 'OrganizationManage'}); // 社团管理
                } else {
                    // 管理员权限不明
                    this.$router.push({name: 'StudentManage'});
                }
            } else {
                // 用户身份不明
                this.$router.push({name: 'StudentManage'});
            }
        },
        toXMUIds () {
            this.$Notice.warning({title: '功能正在开发', desc: '将会跳转至厦大统一身份验证'});
        },
        logout () {
            this.isloading = true;
            axios.post("/api/security/logout", {currentUserGuid: app.currentUserGuid}, msg => {
                this.isloading = false;
                if (msg.success === true) {
                    app.userInfo.isLogined = false;
                } else {
                    this.$Message.warning("注销失败");
                }
            })
        },
        login (un, pwd) {
            this.isloading = true;
            let userName = (un || this.loginValue.username);
            let password = (pwd || this.loginValue.password);
            axios.post("/api/security/Login", { method: 'password', username: userName, pwd: md5(password), isRemember: false, isPwd: true }, msg => {
                this.isloading = false;
                if (msg.success) {
                    app.userInfo = msg.userInfo;
                    app.currentUserGuid = msg.currentUserGuid;
                    let ps = app.userInfo.permissons;
                    app.checkPermission = (p) => {
                        return ps && ps.indexOf(p) >= 0;
                    }
                    this.getAvailablePositon();
                } else {
                    this.$Message.warning(msg.msg);
                }
            })
        }
    }
}
</script>

<style scoped>
.card{
    margin-top: 100px;
}
.card-head{
    font-size: 24px;
    margin-bottom: 24px;
    font-weight: bold;
    text-align: center;
}
.foot{
    flex-direction: column;
    height: 10vh;
    background-color: white;
}
.banner {
    width: 100%;
    height: 100%;
}
</style>

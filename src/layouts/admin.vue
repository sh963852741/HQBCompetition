<template>
    <Layout class="main-layer">
        <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
            <i-row type="flex" justify="center"><Avatar class="logo" :src="app.webInfo.avatar" size="64" /></i-row>
            <Menu ref="menu" theme="dark" id="main-menu" width="auto" :class="menuitemClasses" :open-names="openMenus.map(e => e.ActionName || e.Text)" :active-name="activeMenu">
                <template v-for="(item, index) in menus">
                    <i-menu-item v-if="item.Items && !item.Items.length" :key="index" :to="{ name: item.ActionName }" :name="item.ActionName || item.Text">
                        <i :class="{fa: true, [item.Icons]: true}" :key="'i' + index"/>
                        <span :key="'span' + index">{{ item.Text }}</span>
                    </i-menu-item>
                    <Submenu v-if="item.Items && item.Items.length" :key="index" :name="item.Text">
                        <template slot="title">
                            <i :class="{fa: true, [item.Icons]: true}"/>
                            <span>{{ item.Text }}</span>
                        </template>
                        <i-menu-item v-for="(v, k) in item.Items" :key="k" :to="{ name: v.ActionName }" :name="v.ActionName || v.Text">
                            <!-- <i :class="{fa: true, [v.Icons]: true}"/> -->
                            <span>{{ v.Text }}</span>
                        </i-menu-item>
                    </Submenu>
                </template>
            </Menu>
        </Sider>
        <Layout>
            <Affix>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <i-row type="flex" align="middle">
                        <i-col span="19">
                            <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon>
                        </i-col>
                        <!-- <i-col span="1">
                            <Dropdown trigger="click">
                                <div style="cursor:pointer">
                                    <Icon type="md-add" size="24"></Icon>
                                    <Icon type="md-arrow-dropdown" />
                                </div>
                                <DropdownMenu slot="list"></DropdownMenu>
                            </Dropdown>
                        </i-col> -->
                        <i-col span="1">
                            <Icon :style="[{margin: '0 5px'},{cursor: 'pointer'}, {display: 'none'}]" @click="$Notice.info({title: '您当前没有通知'});" type="md-notifications-outline" size="24"></Icon>
                        </i-col>
                        <i-col span="4">
                            <Dropdown trigger="click">
                                <div style="cursor:pointer">
                                    <i-row type="flex" :gutter="16">
                                        <i-col>
                                            <Avatar :src="app.userInfo.avatar" />
                                        </i-col>
                                        <i-col style="margin-top: 15px; max-width: 60%;">
                                            <p style="line-height: 20px; overflow:hidden; text-overflow:ellipsis; white-space: nowrap;">{{userInfo.realName}}</p>
                                            <p style="line-height: 20px; font-size: 12px; overflow:hidden; text-overflow:ellipsis; white-space: nowrap;">{{position}}</p>
                                        </i-col>
                                        <i-col>
                                            <Icon type="md-arrow-dropdown" />
                                        </i-col>
                                    </i-row>
                                </div>
                                <DropdownMenu slot="list">
                                    <DropdownItem>
                                        <router-link :to="{name: 'Profile'}" tag="div">个人中心</router-link>
                                    </DropdownItem>
                                    <DropdownItem @click.native="logout()">
                                        <router-link :to="{name: 'Index'}" tag="div">退出</router-link>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </i-col>
                        <!-- <i-col span="2" /> -->
                    </i-row>
                </Header>
            </Affix>
            <Content :style="{margin: '20px'}" class="content">
                <slot></slot>
            </Content>
            <Footer class="layout-footer-center">&copy;&nbsp;2020&nbsp;<a href="https://www.xmu.edu.cn/">厦门大学</a>&nbsp;保留所有权利</Footer>
        </Layout>
    </Layout>
</template>

<script>
import { Layout, Sider, Menu, MenuItem, Header, Icon, Content, Affix, Submenu } from 'view-design'
import Axios from 'axios';
let signalR = require("@/api/signalR").default;
const app = require('@/config')
export default {
    name: "admin-layout",
    components: { Layout, Sider, Menu, MenuItem, Header, Icon, Content, Affix, Submenu },
    created () {
        signalR.ready(msg => {
            signalR.resetUserId(app.userInfo.token);
            window._console.log(`登录成功！已向服务器更新登录信息`);
        })
    },
    mounted () {
        this.position = localStorage.getItem("position");
        if (!app.checkPermission("Security.LoginAdmin")) {
            this.$Message.warning("你没有权限登录后台");
            this.$router.push({ name: "Index" });
        }
        app.getMenus(menus => {
            this.$set(app, "menus", menus);
            this.menus = app.menus;
            this.collapseMenu(this.$route.meta.showAs)
        })
    },
    methods: {
        collapseMenu (name) {
            let menuContext = this.$refs.menu;
            for (let m of app.menus) {
                let menus = [];
                // 1. 没有子菜单的情况
                if (m.Items && !m.Items.length) {
                    if (m.ActionName === name) {
                        this.openMenus = menus;
                        this.activeMenu = name;
                        return;
                    } else {
                        continue;
                    }
                } else {
                    // 有子菜单的情况
                    menus.push(m)
                    for (let cm of m.Items) {
                        if (cm.ActionName === name) {
                            this.openMenus = menus;
                            this.activeMenu = name;
                            this.$nextTick(() => {
                                menuContext.updateOpened();
                                menuContext.updateActiveName();
                            })
                            return;
                        }
                    }
                }
            }
        },
        collapsedSider () {
            this.$refs.side1.toggleCollapse();
        },
        toProfile () {
            this.$router.push({ name: "Profile" });
        },
        logout () {
            Axios.post("/api/security/logout", {currentUserGuid: app.currentUserGuid}, msg => {
                if (msg.success === true) {
                    app.userInfo.isLogined = false;
                } else {
                    this.$Message.warning("登出失败");
                }
                this.$router.push({ name: "Index" });
            })
        }
    },
    data () {
        if (!app.toMenu) app.toMenu = this.collapseMenu;
        return {
            position: "",
            app,
            userInfo: app.userInfo,
            isCollapsed: false,
            menus: app.menus,
            openMenus: [],
            activeMenu: ""
        }
    },
    watch: {
        $route (v) {
            this.collapseMenu(this.$route.meta.showAs)
        }
    },
    computed: {
        rotateIcon () {
            return [
                'menu-icon',
                this.isCollapsed ? 'rotate-icon' : ''
            ];
        },
        menuitemClasses () {
            return [
                'menu-item',
                'i-scrollbar-hide',
                this.isCollapsed ? 'collapsed-menu' : ''
            ]
        }
    }
}
</script>

<style scoped lang="less">
.logo {
    margin: 8px;
}
.layout-footer-center{
    text-align: center;
}
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-header-bar{
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
}
.layout-logo-left{
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
}
.menu-icon{
    transition: all .3s;
}
.rotate-icon{
    transform: rotate(-90deg);
}
.menu-item span{
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
}
.menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
}
.collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
}
.collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
}
.main-layer {
    min-height: fill-available;
}
#main-menu {
    height: calc(~'100vh - 64px');
    overflow-y: auto;
}
</style>

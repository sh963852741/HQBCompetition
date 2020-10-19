<template>
    <!--学生社团管理部管理-->
    <i-row>
        <i-card title="学生社团管理部成员">
            <i-row type="flex" :gutter="16">
                <i-col>
                    <i-button type="primary" @click="addUser">新建成员</i-button>
                </i-col>
                <i-col>
                    <i-input v-model="userName" @on-enter="getUsers()" search placeholder="搜索成员"/>
                </i-col>
            </i-row>
            <i-divider />
            <i-row>
                <i-table :columns="columns" :data="users" :loading="tableLoading">
                    <template v-slot:Action="data">
                        <i-button @click="modifyUser(data.row)">修改</i-button>
                        <i-button type="error" @click="deleteUser(data.row)">取消权限</i-button>
                    </template>
                </i-table>
                <i-page style="margin-top: 16px;" :page-size="pager.pageSize" :total="pager.totalRow" show-sizer show-total @on-change="getUsers($event)" @on-page-size-change="getUsers(null, $event)" />
            </i-row>
        </i-card>
        <i-modal :title="modalData.title" v-model="modalData.show">
            <Form ref="form" :model="modalData" :rules="rules" label-position="right" :label-width="100">
                <FormItem label="姓名" prop="RealName">
                    <Input v-model="modalData.RealName" placeholder="请输入姓名" />
                </FormItem>
                <FormItem label="学/工号" prop="Code">
                    <Input v-model="modalData.Code" placeholder="请输入学/工号" />
                </FormItem>
                <FormItem label="手机" prop="Mobile">
                    <Input v-model="modalData.Mobile" placeholder="请输入手机" />
                </FormItem>
                <FormItem label="邮箱" prop="Email">
                    <Input v-model="modalData.Email" placeholder="请输入邮箱" />
                </FormItem>
            </Form>
            <template v-slot:footer>
                <Button :loading="modalData.isSaving" type="primary" @click="saveUser">保存</Button>
            </template>
        </i-modal>
        <i-modal v-model="showModal">
            <p slot="header" style="text-align:center">
                <Icon type="ios-checkmark-circle" style="color:#19be6b;" />
                <span>社团成员新建成功</span>
            </p>
            <div style="text-align:center">
                <p>用户初始密码已经设置，本页面关闭后，本系统不再显示该密码，请妥善保存。</p>
                <br>
                <div>
                    <p>{{'学号：' + code}}</p>
                    <p>{{'密码：' + pwd}}</p>
                </div>
                <br>
                <i-checkbox v-model="canClose">我已复制并保存好该密码</i-checkbox>
            </div>
            <div slot="footer">
                <Button type="primary" :disabled="!canClose" long @click="showModal = false">确认</Button>
            </div>
        </i-modal>
    </i-row>
</template>

<script>
import axios from 'axios';
const regex = require("@/regex.js");
// var _ = require("lodash");
const md5 = require("md5");
export default {
    data () {
        // let THIS = this;
        return {
            showModal: false,
            tableLoading: false,
            canClose: false,
            userName: '',
            pwd: '',
            code: '',
            columns: [
                {
                    title: '姓名',
                    key: 'RealName'
                },
                {
                    title: '学/工号',
                    key: 'Code'
                },
                {
                    title: '手机',
                    key: 'Mobile'
                },
                {
                    title: '邮箱',
                    key: 'Email'
                },
                {
                    title: '操作',
                    slot: 'Action'
                }
            ],
            users: [],
            pager: {
                page: 1,
                pageSize: 10,
                totalRow: 0
            },
            modalData: {
                title: '',
                show: false,
                isSaving: false
            },
            rules: {
               "Mobile": [
                   {required: true, message: "必须输入手机号", trigger: "blur"},
                   {type: "string", pattern: regex.mobile, message: "手机格式不正确", trigger: "blur"}
               ],
               "Email": [
                   {required: true, message: "必须输入电子邮箱", trigger: "blur"},
                   {type: "string", pattern: regex.email, message: "电子邮箱格式不正确", trigger: "blur"}
               ],
               "Code": [
                   {required: true, message: "必须输入学/工号", trigger: "blur"}
               ],
               "RealName": {required: true, message: "必须输入姓名", trigger: "blur"}
            }
        }
    },
    methods: {
        randomPassword () {
            return Math.round(Math.random() * 1000000).toString();
        },
        getUsers (page, pageSize) {
            this.tableLoading = true;
            axios.post("/api/security/GetUsers", {
                departId: "5dde2413-02d1-4ffd-9030-835afad93888",
                name: this.userName,
                page: page || this.pager.page,
                pageSize: pageSize || this.pager.pageSize
            }, msg => {
                if (msg.success) {
                    this.pager.totalRow = msg.totalRow;
                    this.pager.pageSize = msg.pageSize;
                    this.users = msg.data;
                } else {
                    this.$Message.warning(msg.msg);
                }
                this.tableLoading = false;
            })
        },
        modifyUser (user) {
            this.modalData = {
                ...this.modalData,
                ...user
            }
            this.showUserModal('修改社团管理部成员');
        },
        showUserModal (title) {
            this.modalData.title = title;
            this.modalData.show = true;
        },
        addUser () {
            this.modalData.ID = '00000000-0000-0000-0000-000000000000';
            this.showUserModal('新建社团管理部成员');
        },
        saveUser () {
            this.modalData.isSaving = true;
            let form = this.$refs["form"];
            form.validate(err => {
                if (!err) {
                    this.modalData.isSaving = false;
                    return;
                }

                this.pwd = this.randomPassword();
                axios.post("/api/security/SaveUser", {
                    ...this.modalData,
                    userId: this.modalData.ID,
                    roles: ["d362ee66-d8d0-4723-807e-267fd7314d9e"],
                    departs: ["5dde2413-02d1-4ffd-9030-835afad93888"],
                    UserName: this.modalData.Code,
                    UserPassword: this.modalData.ID === '00000000-0000-0000-0000-000000000000' ? undefined : md5(this.pwd)
                }, msg => {
                    if (msg.success) {
                        this.$Message.success("保存成功");
                        this.modalData.show = false;
                        if (!this.modalData.ID) {
                            this.code = this.modalData.Code;
                            this.showModal = true;
                        }
                        this.getUsers();
                        form.resetFields();
                    } else {
                        this.$Message.error(msg.msg);
                    }
                    this.modalData.isSaving = false;
                })
            })
        },
        deleteUser (row) {
            axios.post("/api/security/RemoveUser", { userId: row.ID }, msg => {
                if (msg.success) {
                    this.$Message.success("删除成功");
                    this.getUsers();
                } else {
                    this.$Message.error(msg.msg);
                }
            })
        }
    },
    mounted () {
        this.getUsers();
    }
}
</script>

<style>

</style>

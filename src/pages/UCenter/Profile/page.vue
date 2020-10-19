<template>
    <card title="个人信息">
        <i-row>
            <i-col span="12">
                <i-form ref="user-form" label-position="top" :model="model" :rules="ruleForMem">
                    <i-row type="flex" justify="space-between">
                        <i-col span="11">
                            <i-form-item label="姓名" prop="RealName">
                                <i-input v-model="model.RealName" />
                            </i-form-item>
                        </i-col>
                        <i-col span="11">
                            <i-form-item label="学/工号" prop="Code">
                                <template slot="label">
                                    <Tooltip placement="right" content="无法修改学/工号">
                                        学/工号
                                        <i-icon type="md-information-circle" color="#2db7f5" />
                                    </Tooltip>
                                </template>
                                <i-input :value="model.Code" readonly />
                            </i-form-item>
                        </i-col>
                    </i-row>
                    <i-row type="flex" justify="space-between">
                        <i-col span="11">
                            <i-form-item label="学历" prop="Educational">
                                <dic-select dic="学历" v-model="model.Educational"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="11">
                            <i-form-item label="学院" prop="BelongDepart">
                                <dic-select dic="学院" v-model="model.BelongDepart" />
                            </i-form-item>
                        </i-col>
                    </i-row>
                    <i-row type="flex" justify="space-between">
                        <i-col span="11">
                            <i-form-item label="入团时间" prop="JoinCCYLTime">
                                <template v-slot:label>
                                    入团时间&nbsp;<i-switch v-model="haveJoinCCYL"></i-switch>
                                </template>
                                <i-date-picker style="width: 100%;" :disabled="!haveJoinCCYL" v-model="model.JoinCCYLTime" />
                            </i-form-item>
                        </i-col>
                        <i-col span="11">
                            <i-form-item label="入党时间" prop="JoinCPCTime">
                                <template v-slot:label>
                                    入党时间&nbsp;<i-switch v-model="haveJoinCPC"></i-switch>
                                </template>
                                <i-date-picker style="width: 100%;" :disabled="!haveJoinCPC" v-model="model.JoinCPCTime" />
                            </i-form-item>
                        </i-col>
                    </i-row>
                    <i-row type="flex" justify="space-between">
                        <i-col span="11">
                            <i-form-item label="政治面貌" prop="PoliticalStatus">
                                <dic-select dic="政治面貌" v-model="model.PoliticalStatus"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="11">
                            <i-form-item label="QQ" prop="QQ">
                                <i-input v-model="model.QQ" />
                            </i-form-item>
                        </i-col>
                    </i-row>
                    <i-row type="flex" justify="space-between">
                        <i-col span="11">
                            <i-form-item label="手机" prop="Mobile">
                                <i-input v-model="model.Mobile" />
                            </i-form-item>
                        </i-col>
                        <i-col span="11">
                            <i-form-item label="邮箱" prop="Email">
                                <i-input v-model="model.Email" />
                            </i-form-item>
                        </i-col>
                    </i-row>
                    <i-row type="flex" justify="space-between">
                        <i-col span="11">
                            <i-form-item label="民族" prop="BirthPlace">
                                <i-input v-model="model.BirthPlace" />
                            </i-form-item>
                        </i-col>
                        <i-col span="11">
                            <i-form-item label="籍贯" prop="Source">
                                <i-input v-model="model.Source" />
                            </i-form-item>
                        </i-col>
                    </i-row>
                    <i-row type="flex" justify="space-between">
                        <i-col span="11">
                            <i-form-item label="所属校区" prop="Campus">
                                <dic-select dic="校区" v-model="model.Campus" />
                            </i-form-item>
                        </i-col>
                        <i-col span="11">
                            <i-form-item label="性别" prop="Gender">
                                <i-select v-model="model.Gender">
                                    <i-option value="男" key="男">男</i-option>
                                    <i-option value="女" key="女">女</i-option>
                                    <!--i-option value="未知" key="未知">未知</i-option-->
                                </i-select>
                            </i-form-item>
                        </i-col>
                    </i-row>
                    <i-row type="flex" justify="space-between">
                        <i-form-item label="头像" prop="avatar">
                            <i-row>
                            <i-col span="6">
                                <avatar-uploader
                                :width="128"
                                :height="128"
                                usage="imgAvatar"
                                single
                                relate-table="Users"
                                v-model="model.avatar"
                                action="/api/security/uploadAvatar"
                                />
                            </i-col>
                            </i-row>
                            <i-button type="success" style="margin-top:10px" @click="save" :loading="isloading">确认更新</i-button>
                        </i-form-item>
                    </i-row>
                </i-form>
            </i-col>
        </i-row>
    </card>
</template>
<script>
const regex = require("@/regex.js");
const app = require("@/config");
var _ = require("lodash");
const axios = require("axios");
let badDate = new Date("Mon Jan 01 1900 00:00:00 GMT+0805 (中国标准时间)");
export default {
  methods: {
        save () {
            this.isloading = true;
            let form = this.$refs["user-form"];
            let model = this.model;
            form.validate((err) => {
                if (!err) {
                return;
                }
                axios.post("/api/security/SaveUserV2", {
                    ...model,
                    JoinCPCTime: this.haveJoinCPC ? this.model.JoinCPCTime : "1900-01-01",
                    JoinCCYLTime: this.haveJoinCCYL ? this.model.JoinCCYLTime : "1900-01-01"
                }, (msg) => {
                this.isloading = false;
                if (!msg.success) {
                    this.$Message.error(msg.msg);
                } else {
                    this.$Message.success("修改成功");
                }
                });
            });
        },
        getUser () {
            axios.post("/api/security/GetUserById", {}, (msg) => {
                if (msg.success) {
                this.model = msg.user;
                this.model.avatar = app.userInfo.avatar;
                } else {
                this.$Message.error(msg.msg);
                }
            });
        }
    },
    data () {
        return {
            isloading: false,
            haveJoinCPC: false,
            haveJoinCCYL: false,
            model: {
                avatar: ""
            },
            orgInfo: {},
            ruleForMem: {
                    RealName: [
                        {
                            required: true,
                            message: "必须填写姓名",
                            trigger: "blur"
                        }
                    ],
                    Code: [
                        {
                            required: true,
                            message: "必须填写学号",
                            trigger: "blur"
                        }
                    ],
                    BelongDepart: [
                        {
                            required: true,
                            message: "必须填写学院",
                            trigger: "blur"
                        }
                    ],
                    PoliticalStatus: [
                        {
                            required: true,
                            message: "必须填写政治面貌",
                            trigger: "blur"
                        }
                    ],
                    Educational: [
                        {
                            required: true,
                            message: "必须填写学历",
                            trigger: "blur"
                        }
                    ],
                    Specialty: [
                        {
                            required: true,
                            message: "必须填写专业",
                            trigger: "blur"
                        }
                    ],
                    BirthPlace: [
                        {
                            required: true,
                            message: "必须填写民族",
                            trigger: "blur"
                        }
                    ],
                    Campus: [
                        {
                            required: true,
                            message: "必须填写校区",
                            trigger: "blur"
                        }
                    ],
                    Gender: [
                        {
                            required: true,
                            message: "必须填写性别",
                            trigger: "blur"
                        }
                    ],
                    Source: [
                        {
                            required: true,
                            message: "必须填写籍贯",
                            trigger: "blur"
                        }
                    ],
                    Mobile: [
                        {
                            required: true,
                            message: "必须输入手机号",
                            trigger: "blur"
                        },
                        {
                            type: "string",
                            pattern: regex.mobile,
                            message: "手机格式不正确",
                            trigger: "blur"
                        },
                        _.debounce(function (rule, value, cb, source, options) {
                            axios.post(
                            "/api/security/MobileValidate",
                            { mobile: value },
                            (msg) => {
                                if (msg.success) {
                                cb();
                                } else {
                                cb(msg.remote);
                                }
                            }
                            );
                        }, 500)
                    ],
                    Email: [
                        {
                            required: true,
                            message: "必须输入电子邮箱",
                            trigger: "blur"
                        },
                        {
                            type: "string",
                            pattern: regex.email,
                            message: "电子邮箱格式不正确",
                            trigger: "blur"
                        },
                        _.debounce((rule, value, cb, source, options) => {
                            axios.post("/api/security/EmailValidate", { email: value }, msg => {
                                if (msg.success) {
                                    cb();
                                } else {
                                    cb(msg.remote);
                                }
                            });
                        }, 500)
                    ]
                }
            // rules: {
            //     Mobile: [
            //         {
            //             required: true,
            //             message: "必须输入手机号",
            //             trigger: "blur"
            //         },
            //         {
            //             type: "string",
            //             pattern: regex.mobile,
            //             message: "手机格式不正确",
            //             trigger: "blur"
            //         },
            //         _.debounce(function (rule, value, cb, source, options) {
            //             axios.post(
            //             "/api/security/MobileValidate",
            //             { mobile: value },
            //             (msg) => {
            //                 if (msg.success) {
            //                 cb();
            //                 } else {
            //                 cb(msg.remote);
            //                 }
            //             }
            //             );
            //         }, 500)
            //     ],
            //     Email: [
            //         {
            //             required: true,
            //             message: "必须输入电子邮箱",
            //             trigger: "blur"
            //         },
            //         {
            //             type: "string",
            //             pattern: regex.email,
            //             message: "电子邮箱格式不正确",
            //             trigger: "blur"
            //         },
            //         _.debounce((rule, value, cb, source, options) => {
            //             axios.post("/api/security/EmailValidate", { email: value }, msg => {
            //                 if (msg.success) {
            //                     cb();
            //                 } else {
            //                     cb(msg.remote);
            //                 }
            //             });
            //         }, 500)
            //     ],
            //     RealName: { required: true, message: "必须输入姓名", trigger: "blur" },
            //     avatar: { required: true, message: "必须上传图片", trigger: "blur" }
            // }
        };
    },
    mounted () {
        app.title = "个人中心";
        this.getUser();
    },
    watch: {
        "model.JoinCPCTime" (value) {
            this.haveJoinCPC = !!value.toLocaleDateString && value.toLocaleDateString() !== badDate.toLocaleDateString();
        },
        "model.JoinCCYLTime" (value) {
            this.haveJoinCPC = !!value.toLocaleDateString && value.toLocaleDateString() !== badDate.toLocaleDateString();
        }
    }
};
</script>
<style lang="less">
</style>

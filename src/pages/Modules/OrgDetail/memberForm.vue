<template>
    <i-row>
        <i-col>
            <i-form :model="modalData.user" :rules="ruleForMem" ref="Form">
                <i-row type="flex" justify="space-between">
                    <i-col span="11">
                        <i-form-item label="姓名" prop="RealName">
                            <i-input v-model="modalData.user.RealName" />
                        </i-form-item>
                    </i-col>
                    <i-col span="11">
                        <i-form-item label="学号" prop="Code">
                            <i-input v-model="modalData.user.Code" />
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex" justify="space-between">
                    <i-col span="11">
                        <i-form-item label="电话" prop="Mobile">
                            <i-input v-model="modalData.user.Mobile" />
                        </i-form-item>
                    </i-col>
                    <i-col span="11">
                        <i-form-item label="邮箱" prop="Email">
                            <i-input v-model="modalData.user.Email" />
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex" justify="space-between">
                    <i-col span="11">
                        <i-form-item label="学院" prop="BelongDepart">
                            <i-input v-model="modalData.user.BelongDepart" />
                        </i-form-item>
                    </i-col>
                    <i-col span="11">
                        <i-form-item label="专业" prop="Specialty">
                            <i-input v-model="modalData.user.Specialty" />
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex" justify="space-between">
                    <i-col span="11">
                        <i-form-item label="学历" prop="Educational">
                            <dic-select dic="学历" v-model="modalData.user.Educational"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11">
                        <i-form-item label="政治面貌" prop="PoliticalStatus">
                            <dic-select dic="政治面貌" v-model="modalData.user.PoliticalStatus"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex" justify="space-between">
                    <i-col span="11">
                        <i-form-item label="民族" prop="BirthPlace">
                            <i-input v-model="modalData.user.BirthPlace" />
                        </i-form-item>
                    </i-col>
                    <i-col span="11">
                        <i-form-item label="生源地" prop="Source">
                            <i-input v-model="modalData.user.Source" />
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex" justify="space-between">
                    <i-col span="11">
                        <i-form-item label="入团时间" prop="JoinCCYLTime">
                            <i-checkbox v-model="haveJoinCCYL"></i-checkbox>
                            <i-date-picker :disabled="!haveJoinCCYL" v-model="modalData.user.JoinCCYLTime" />
                        </i-form-item>
                    </i-col>
                    <i-col span="11">
                        <i-form-item label="入党时间" prop="JoinCPCTime">
                            <i-checkbox v-model="haveJoinCPC"></i-checkbox>
                            <i-date-picker :disabled="!haveJoinCPC" v-model="modalData.user.JoinCPCTime" />
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex" justify="space-between">
                    <i-col span="11">
                        <i-form-item label="QQ" prop="QQ">
                            <i-input v-model="modalData.user.QQ" />
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-button @click="showLog = true" type="text" style="float:right; padding: 0;">查看修改记录</i-button>
            </i-form>
        </i-col>
        <i-drawer title="修改记录" v-model="showLog" scrollable width="20">
            <i-timeline class="timeline">
                <TimelineItem v-for="(item,index) in modalData.changeLogs.data" :key="index">
                    <i-row>
                        <i-col>
                            <p class="time">{{item.OperateOn}}</p>
                            <p class="content">{{item.Operator}}{{item.Abstract}}</p>
                        </i-col>
                    </i-row>
                    <i-row>
                        <i-col class="detail">
                            <p v-for="(d,index) in item.Details" :key="index">
                                {{d}}
                            </p>
                        </i-col>
                    </i-row>
                </TimelineItem>
            </i-timeline>
        </i-drawer>
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
    let _ = require("lodash");
    let badDate = new Date("Mon Jan 01 1900 00:00:00 GMT+0805 (中国标准时间)");
    const axios = require("axios");
    const regex = require("@/regex.js");
    const md5 = require("md5");
    export default {
        props: {
            modalData: {
                type: Object,
                required: true
            }
        },
        watch: {
            "modalData.user.JoinCPCTime" (value) {
                this.haveJoinCPC = !!value.toLocaleDateString && value.toLocaleDateString() !== badDate.toLocaleDateString();
            },
            "modalData.user.JoinCCYLTime" (value) {
                this.haveJoinCPC = !!value.toLocaleDateString && value.toLocaleDateString() !== badDate.toLocaleDateString();
            }
        },
        data () {
            let THIS = this;
            return {
                showLog: false,
                showModal: false,
                canClose: false,
                haveJoinCPC: false,
                haveJoinCCYL: false,
                pwd: '',
                code: '',
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
                            message: "必须选择政治面貌",
                            trigger: "blur"
                        }
                    ],
                    Educational: [
                        {
                            required: true,
                            message: "必须选择学历",
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
                    Email: [
                        {
                            required: true,
                            type: "email",
                            message: "邮箱格式不正确",
                            trigger: "blur"
                        },
                        _.debounce((rule, value, cb, source, options) => {
                            let userId = THIS.modalData.user.ID;
                            axios.post("/api/security/EmailValidate", { userId, email: value }, msg => {
                                if (msg.success) {
                                    cb();
                                } else {
                                    cb(msg.remote);
                                }
                            })
                        }, 500)
                    ],
                    BirthPlace: [
                        {
                            required: true,
                            message: "必须填写民族",
                            trigger: "blur"
                        }
                    ],
                    Source: [
                        {
                            required: true,
                            message: "必须填写生源地",
                            trigger: "blur"
                        }
                    ],
                    "Mobile": [
                        {type: "string", required: true, pattern: regex.mobile, message: "手机格式不正确", trigger: "blur"},
                        _.debounce(function (rule, value, cb) {
                            let userId = THIS.modalData.user.ID;
                            axios.post("/api/security/MobileValidate", { userId, mobile: value }, msg => {
                                if (msg.success) {
                                    cb();
                                } else {
                                    cb(msg.remote);
                                }
                            })
                        }, 500)
                    ]
                }
            }
        },
        methods: {
            resetFields () {
                this.$refs["Form"].resetFields();
            },
            randomPassword () {
                return Math.round(Math.random() * 1000000).toString();
            },
            submit (departId, callback) {
                let form = this.$refs["Form"];
                // 注：在ES6的严格模式中，不允许回调函数直接返回bool类型的true和false，以免程序被误导。所以这里使用常量，也可以使用字符串返回。
                const TRUE = true;
                const FALSE = false;
                form.validate(res => {
                    if (!res) {
                        callback(FALSE);
                        return;
                    }
                    this.pwd = this.randomPassword();
                    axios.post("/api/security/SaveUserV2", {
                        ...this.modalData.user,
                        JoinCPCTime: this.haveJoinCPC ? this.modalData.user.JoinCPCTime : "1900-01-01",
                        JoinCCYLTime: this.haveJoinCCYL ? this.modalData.user.JoinCCYLTime : "1900-01-01",
                        departId,
                        position: this.modalData.position,
                        UserName: this.modalData.user.Code,
                        UserPassword: this.modalData.user.ID ? undefined : md5(this.pwd)
                    }, msg => {
                        if (msg.success) {
                            if (!this.modalData.user.ID) {
                                this.code = this.modalData.user.Code;
                                this.showModal = true;
                            }
                            this.resetFields();
                            callback(TRUE, msg);
                        } else {
                            callback(FALSE);
                            this.$Message.warning(msg.msg);
                        }
                    });
                })
            },
            async validate (callback) {
                let form = this.$refs["Form"];
                let res = await form.validate();
                callback(res);
            }
        }
    }
</script>

<style lang="less">
.timeline{
    padding:0.8em 0px 0px 5px;
    .time{
        font-size: 14px;
        font-weight: bold;
    }
    .content{
        padding: 2px 0px 2px 5px;
    }
    .detail{
        padding-left: 5px;
        font-size: 0.8em;
        color: #808080;
        line-height: 1.5em;
    }
}
</style>

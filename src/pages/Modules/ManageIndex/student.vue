<template>
    <i-row type="flex" :gutter="24">
        <i-col span="15">
            <i-card title="报名社团" v-if="myOrgs.length < 2 && canSignUpOrg">
                <template v-slot:extra>
                    <i-input search placeholder="搜索社团名称" @on-search="searchOrg" />
                </template>
                <Scroll v-if="allOrgs.length">
                    <List style="margin-right:10px">
                        <ListItem v-for="(item,index) in allOrgsSearched" :key="index">
                            <i-row type="flex" align="middle" style="width:100%">
                                <i-col span="20">
                                    <div>
                                        <Icon type="ios-people" color="limegreen"/>
                                        {{item.Name}}
                                    </div>
                                    <div style="color: #aaaaaa;font-size:14px" v-if="item.Description===''">
                                        <Icon type="md-information-circle" />
                                        暂无简介
                                    </div>
                                    <div style="color: #aaaaaa;font-size:14px" v-else>
                                        <Icon type="md-information-circle" />
                                        {{item.Description}}
                                    </div>
                                </i-col>
                            </i-row>
                            <template v-slot:action>
                                <Button type="success" disabled v-if="item.myDepart">已加入</Button>
                                <div v-else>
                                    <Button type="warning" v-if="item.app && item.app.State === 3" @click="withdraw(item)">撤销</Button>
                                    <Button type="success" v-else @click="applicate(item)">申请</Button>
                                </div>
                            </template>
                        </ListItem>
                    </List>
                </Scroll>
                <template v-else>
                    <i-row class="picture">暂无社团</i-row>
                </template>
            </i-card>
            <i-card style="margin-top:10px" title="社团活动" :padding="24">
                <template v-slot:extra>
                    <i-input search placeholder="搜索活动名称" @on-search="searchActivity" />
                </template>
                <i-row>
                    <i-table stripe :columns="activity" :data="activitySearched" :loading="tableLoading">
                        <template slot="Action" slot-scope="{row}">
                            <i-button @click="getActivityDetail(row)">详情</i-button>
                        </template>
                        <template slot="signState" slot-scope="{row}">
                            <div v-if="row.isSignUp">我已报名</div>
                            <div v-else-if="row.isSignIn">我已签到</div>
                            <div v-else>未报名</div>
                        </template>
                    </i-table>
                    <Page :styles="{'margin-top': '16px'}" :total="pager.totalRow" show-sizer show-total :page-size="5"
                     @on-change="getActivities($event)" @on-page-size-change="getActivities(null ,$event)" />
                </i-row>
            </i-card>
        </i-col>
        <i-col span="8">
            <i-card :padding="0" style="margin-bottom:10px">
                <div style="background-color:#ffffff">
                    <i-row type="flex" align="middle" style="padding:16px;margin: 16px 0px">
                        <i-col span="4">
                            <Avatar :size="48" :src="userInfo.avatar"/>
                        </i-col>
                        <i-col span="19">
                            <div>{{time}}好! {{userInfo.realName}}</div>
                            <div>学号：{{userInfo.userCode}}</div>
                        </i-col>
                    </i-row>
                    <i-row type="flex" class="background-purple" v-if="myOrgs.length">
                        <i-col :span="24/(myOrgs.length)" v-for="(item,index) in myOrgs" :key="index">
                            <div style="padding-top:20px;text-align:center">
                                <i-row type="flex">
                                    <i-col span="22">
                                        <Avatar :size="48" :src="userInfo.avatar"/>
                                        <div style="margin-top:10px;margin-bottom:10px;font-size:12px;text-align:center;">{{item.Name}}</div>
                                    </i-col>
                                    <i-col span="1" v-if="index!=myOrgs.length-1">
                                        <div style="border-right: 1px solid #fff;height: 36px;margin-top: 10px;opacity: .2;"/>
                                    </i-col>
                                </i-row>
                            </div>
                        </i-col>
                    </i-row>
                    <i-row type="flex" class="background-purple" v-else>
                        <i-col span="24">
                            <div style="padding-top:20px;text-align:center">
                                <i-row type="flex">
                                    <i-col span="22">
                                        <img style="width:48px;height:48px" src="../../../assets/none.png"/>
                                        <div style="margin-bottom:10px;font-size:12px;text-align:center;">未加入社团</div>
                                    </i-col>
                                </i-row>
                            </div>
                        </i-col>
                    </i-row>
                </div>
            </i-card>
            <i-row  v-for="(item,index) in entryForStudent" :key="index">
                <i-card class="layout-con" :to="item.routerTo">
                    <i-row type="flex" align="middle">
                        <i-col span="3" offset="1">
                            <div>
                                <i-avatar :icon="item.icon"/>
                            </div>
                        </i-col>
                        <i-col span="19">
                            <div style="padding-top:5px">{{item.title}}</div>
                            <div style="color: #808695;font-size:14px">{{item.descrip}}</div>
                        </i-col>
                    </i-row>
                </i-card>
            </i-row>
        </i-col>
        <i-modal v-model="modelShow" title="活动详情" :z-index="10" :scrollable="true">
            <div style="max-height: 60vh; overflow: auto">
                <i-row>
                    <div style="font-size:25px">{{activityDetail.ActivityName}}</div>
                </i-row>
                <i-row type="flex" align="middle" style="padding:16px;margin: 16px 0px">
                    <i-col span="4">
                        <Avatar :size="48" :src="userInfo.avatar"/>
                    </i-col>
                    <i-col span="19">
                        <div>{{activityDetail.DepartName}}</div>
                        <div>{{activityDetail.StartDate}}</div>
                    </i-col>
                </i-row>
                <i-row>
                    <img src="../../../assets/xmuScene1.jpg" style="width:100%">
                </i-row>
                <i-row style="margin-top:10px;">
                    <div>{{activityDetail.Description}}</div>
                </i-row>
            </div>
            <div slot="footer">
                <i-button type="primary" :loading="modalLoading" @click="signUp(0)" v-if="signUpState.State!=0">立即报名</i-button>
                <i-button @click="signUp(99)" v-else>取消报名</i-button>
            </div>
        </i-modal>
    </i-row>
</template>

<script>
import axios from 'axios';
// const echarts = require("echarts");
const app = require("@/config");
let pic = require("@/assets/icon.png");
export default {
    data () {
        return {
            app,
            level: -1,
            pic: pic,
            data: [],
            modelShow: false,
            modalLoading: false,
            activity: [
                {
                    title: '活动名称',
                    key: 'ActivityName'
                },
                {
                    title: '活动类型',
                    key: 'ActivityType',
                    render: (h, params) => {
                        return h('p', params.row.ActivityType.replace(/[[\]"]/g, "").replace(/,/g, "，"));
                    }
                },
                {
                    title: '举办社团',
                    key: 'DepartName'
                },
                {
                    title: '活动地点',
                    key: 'Address'
                },
                {
                    title: '报名状态',
                    slot: 'signState'
                },
                {
                    title: '活动开始时间',
                    key: 'StartDate'
                },
                {
                    title: '操作',
                    slot: 'Action'
                }
            ],
            activityData: [],
            activitySearched: [],
            time: "早上",
            dic: {
                "修改社团基本信息申请": "/manage/org/orgdetailform",
                "社团活动申请": "/manage/org/activityform"
            },
            dashBoard: {
                users: 0,
                teachers: [],
                children: 0,
                StrType: 0,
                DepartType: 0,
                BirthTime: "",
                Name: ""
            },
            userInfo: app.userInfo,
            entryForStudent: {
                member: {
                    title: "修改个人资料",
                    descrip: "修改我的个人信息，包括姓名，入团时间，入党时间等",
                    icon: "md-person-add",
                    routerTo: {
                        name: "Profile",
                        query: {}
                    }
                },
                addAct: {
                    title: "我参加过的活动",
                    descrip: "查看我参加过的活动的记录",
                    icon: "logo-buffer",
                    routerTo: {
                        name: "MyApplications"
                    }
                },
                activity: {
                    title: "我的申请记录",
                    descrip: "查看我报名加入社团的审核情况",
                    icon: "md-information",
                     routerTo: {
                        name: "MyDepartApplicate"
                    }
                }
            },
            tableLoading: false,
            pager: {
                page: 1,
                pageSize: 5,
                totalRow: 0
            },
            myOrgs: [],
            allOrgs: [],
            allOrgsSearched: [],
            activityDetail: {},
            signUpState: {},
            canSignUpOrg: false
        };
    },
    mounted () {
        app.title = "主页";
        this.getDashBoard();
        this.judgeTime();
        this.getAllDeparts();
        this.getSignUpState();
    },
    methods: {
        getSignUpState () {
            axios.post("/api/config/GetSignUpState", {}, msg => {
                this.canSignUpOrg = msg.value;
            })
        },
        getDashBoard () {
            axios.post("/api/org/StudentDashboard", {}, msg => {
                this.myOrgs = msg.departs;
                this.getActivities();
            });
        },
        judgeTime () {
            let day2 = new Date();
            day2.setTime(day2.getTime());
            let s2 = day2.getHours();
            if (s2 < 6) this.time = "午夜";
            else if (s2 < 12) this.time = "上午";
            else if (s2 < 14) this.time = "中午";
            else if (s2 < 18) this.time = "下午";
            else if (s2 < 24) this.time = "晚上";
        },
        getAllDeparts () {
            axios.post("/api/security/GetAllDeparts", {}, msg => {
                this.allOrgsSearched = msg.data.filter(e => e.Type === 1).sort((a, b) => {
                    if (a.app.State === 3 && b.app.State === 3) {
                        return 0;
                    } else if (a.app.State === 3) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
                this.allOrgs = this.allOrgsSearched;
            })
        },
        getActivities () {
            axios.post("/api/org/GetStartedApplications", {}, msg => {
                if (msg.success) {
                    this.activityData = msg.data;
                    this.activitySearched = this.activityData;
                    this.pager.totalRow = msg.totalRow;
                }
            });
        },
        getActivityDetail (row) {
            axios.post("/api/org/GetApplicationDetail", {id: row.ID}, msg => {
                if (msg.success) {
                    this.activityDetail = msg.data;
                    this.modelShow = !this.modelShow;
                    this.signUpState = msg.signUpState;
                }
            });
        },
        dealWorkflow (instanceId, stepId, WorkflowName) {
            window.open(`${this.dic[WorkflowName]}?instanceId=${instanceId}&stepId=${stepId}&detail=false`);
        },
        navTo (url) {
            this.$router.push({name: 'OrgDetail'});
        },
        checkWorkflow (instanceId, stepId, actId) {
            window.open(`/manage/org/signUpSituation?instanceId=${instanceId}&stepId=${stepId}&detail=true&actId=${actId}`);
        },
        searchActivity (value) {
            this.activitySearched = this.activityData.filter(e => e.ActivityName.indexOf(value) > -1);
        },
        searchOrg (value) {
            this.allOrgsSearched = this.allOrgs.filter(e => e.Name.indexOf(value) > -1);
        },
        signUp (state) {
            axios.post("/api/org/ChangeSignUpState", {actId: this.activityDetail.ID, state}, msg => {
                if (msg.success) {
                    this.modelShow = !this.modelShow;
                    this.$Message.success({
                        content: state === 0 ? "报名成功" : "取消报名成功"
                    });
                    this.getActivities();
                } else {
                    this.$Message.warning({
                        content: msg.msg
                    })
                }
            })
        },
        applicate (item) {
            let departId = item.ID;
            axios.post("/api/security/ApplicateDepart", {departId}, msg => {
                if (msg.success) {
                    this.$Message.success({
                        content: "申请成功"
                    })
                    item.app = {
                        ID: msg.appID,
                        State: 3
                    }
                } else {
                    this.$Message.error(msg.msg);
                }
            })
        },
        withdraw (item) {
            let appId = item.app.ID;
            axios.post("/api/security/WithDraw", {appId}, msg => {
                if (msg.success) {
                    this.$Message.success({
                        content: "撤回成功"
                    })
                    item.app = {}
                } else {
                    this.$Message.error(msg.msg);
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .ivu-divider, .ivu-divider-vertical {
        margin: 0 8px;
        display: inline-block;
        height: 100%;
        width: 1px;
        vertical-align: middle;
        position: relative;
        top: -0.06em;
    }
    .background-grey
    {
        background-color: lightgrey;
    }
    .background-white
    {
        background-color: white;
    }
    .background-purple{
        color: #ffffff;
        background: #6882da;
    }
    .layout-con {
        margin-bottom: 12px;
        color: #515a6e;
    }
    .picture {
        margin: 0px 0px 24px 0px;
        text-align: center;
        color: #808695;
        letter-spacing: 5px;
        font-size: 32px;
        border: #dcdee2 solid 3px;
        border-radius: 20px;
        height:300px;
        line-height: 300px;
    }
</style>

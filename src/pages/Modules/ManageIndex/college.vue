<template>
    <i-row type="flex" :gutter="24" id="college-index">
        <i-col span="15">
            <i-card :padding="24">
                <template v-slot:title>
                    <i-row type="flex" align="middle">
                        <span style="font-size: 18px;">我的待办&nbsp;</span>
                        <Badge :count="pendingData.length" v-if="pendingData.length > 0"></Badge>
                    </i-row>
                </template>
                <template v-slot:extra>
                    <router-link :to="{name: 'MyPending'}">查看所有待办</router-link>
                </template>
                <List v-if="pendingData.length > 0 ">
                    <ListItem v-for="(item, index) in pendingData.slice(0,5)" :key="index">
                        <i-row type="flex" align="middle" style="width: 100%">
                            <i-col span="20">
                                <p>
                                    <Icon type="ios-checkmark-circle-outline" color="limegreen"/>
                                    {{item.WorkflowName}}
                                </p>
                                <p style="color: #808695; font-size:14px">
                                    <Icon type="md-information-circle" />
                                    {{item.Owner}}提交的流程
                                </p>
                                <p style="color: #808695; font-size:14px">
                                    <Icon type="md-shuffle" />
                                    工作流到达时间{{item.ArriveOn}}
                                </p>
                            </i-col>
                            <i-col span="4">
                                <Button type="success" @click="dealWorkflow(item.InstanceId, item.StepId, item.WorkflowType)">审核</Button>
                            </i-col>
                        </i-row>
                    </ListItem>
                </List>
                <template v-else>
                    <i-row class="picture">暂无待办事项</i-row>
                </template>
            </i-card>
            <i-card style="margin-top:10px" title="社团列表" :padding="24">
                <template v-slot:extra>
                    <i-input search placeholder="搜索社团名" @on-search="searchOrganization" />
                </template>
                <i-row>
                    <i-table :max-height="contentHeight" border stripe :columns="organizationCol" :data="organizationSearched" :loading="tableLoading">
                        <template slot="Action" slot-scope="{row}">
                            <i-button @click="viewOrg(row.id)">查看</i-button>
                        </template>
                    </i-table>
                </i-row>
            </i-card>
        </i-col>
        <i-col span="8">
            <i-card :padding="0" style="margin-bottom:10px">
                <div :to="dashBoard.DepartType === 0 ? routers[1]:routers[0]" v-if="true" style="background-color:#ffffff">
                    <i-row type="flex" align="middle" style="padding:16px;margin: 16px 0px">
                        <i-col span="4">
                            <Avatar :size="48" :src="userInfo.avatar"/>
                        </i-col>
                        <i-col span="19">
                            <div style="font-size: 18px; color: #17233d;">{{time}}好! {{userInfo.realName}}</div>
                            <a @click="navTo">{{orgInfo.Name}}的管理员</a>
                        </i-col>
                    </i-row>
                    <i-row type="flex" class="background-purple">
                        <i-col span="8">
                            <div style="padding-top:20px;">
                                <i-row type="flex">
                                    <i-col span="22">
                                        <div style="font-size: 33px;text-align:center;">{{membersData.length}}</div>
                                        <div style="margin-bottom:10px;font-size:12px;text-align:center;">成员数</div>
                                    </i-col>
                                    <i-col span="1">
                                        <div style="border-right: 1px solid #fff;height: 36px;margin-top: 10px;opacity: .2;"/>
                                    </i-col>
                                </i-row>
                            </div>
                        </i-col>
                        <i-col span="8">
                            <div style="padding-top:20px;">
                                <i-row type="flex">
                                    <i-col span="22">
                                        <div style="font-size: 33px;text-align:center;">{{organizationData.length}}</div>
                                        <div style="margin-bottom:10px;font-size:12px;text-align:center;">社团数</div>
                                    </i-col>
                                    <i-col span="1">
                                        <div style="border-right: 1px solid #fff;height: 36px;margin-top: 10px;opacity: .2;"/>
                                    </i-col>
                                </i-row>
                            </div>
                        </i-col>
                        <i-col span="8">
                            <div style="padding-top:20px;">
                                <i-row type="flex">
                                    <i-col span="22">
                                        <div style="font-size: 33px;text-align:center;">{{activityCount}}</div>
                                        <div style="margin-bottom:10px;font-size:12px;text-align:center;">活动数</div>
                                    </i-col>
                                </i-row>
                            </div>
                        </i-col>
                    </i-row>
                </div>
            </i-card>
            <i-row v-for="(item,index) in entryForManager" :key="index">
                <i-card class="layout-con" :to="item.routerTo">
                    <i-row type="flex" align="middle">
                        <i-col span="3" offset="1">
                            <div>
                                <Badge :count="item.badge">
                                    <i-avatar :icon="item.icon" size="large" />
                                </Badge>
                            </div>
                        </i-col>
                        <i-col span="19">
                            <p style="">{{item.title}}</p>
                            <p style="color: #808695; font-size:14px">{{item.description}}</p>
                        </i-col>
                    </i-row>
                </i-card>
            </i-row>
        </i-col>
    </i-row>
</template>

<script>
import axios from 'axios';
import tableColumns from './tableColumns';
// const echarts = require("echarts");
const app = require("@/config");
export default {
    data () {
        return {
            app,
            organizationSearched: [],
            organizationCol: tableColumns.organization,
            organizationData: [],
            orgInfo: {},
            time: "早上",
            dic: {
                "修改社团基本信息申请": "/manage/org/orgdetailform",
                "社团活动申请": "/manage/org/activityform"
            },
            dashBoard: {},
            pendingData: [],
            userInfo: app.userInfo,
            routers: [
                {
                    name: "OrgDetail",
                    query: {
                        tabSelect: "basicInfo"
                    }
                },
                {
                    name: "Affiliated",
                    query: {
                        tabSelect: "member"
                    }
                }, {
                    name: "OrgDetail",
                    query: {
                        tabSelect: "member"
                    }
                }, {
                    name: "OrgDetail",
                    query: {
                        tabSelect: "subDept"
                    }
                }, {
                    name: "OrgDetail",
                    query: {
                        tabSelect: "tutor"
                    }
                }, {
                    name: "OrgDetail",
                    query: {
                        tabSelect: "manager"
                    }
                }, {
                    name: "OrgDetail",
                    query: {
                        tabSelect: "activity"
                    }
                }
            ],
            entryForManager: {
                pending: {
                    title: "我的待办",
                    badge: 0,
                    count: "pendingData",
                    description: "等待我处理的工作",
                    routerTo: {
                        name: "MyPending",
                        query: {}
                    },
                    icon: "md-list"
                },
                organization: {
                    title: "社团列表",
                    count: "membersData",
                    badge: 0,
                    description: "管理本单位所指导的社团，管理他们的基本信息。",
                    routerTo: {
                        name: "OrgList",
                        query: {}
                    },
                    icon: "md-person-add"
                },
                activity: {
                    title: "活动管理",
                    count: "organizationData",
                    badge: 0,
                    description: "管理本单位所属所有社团的所有活动。查看他们的报名记录和签到记录。",
                    routerTo: {
                        name: "Affiliated",
                        query: {
                            tabSelect: "activity"
                        }
                    },
                    icon: "md-flag"
                }
            },
            tableLoading: false,
            membersData: [],
            activityCount: 0,
            contentHeight: 0
        };
    },
    mounted () {
        this.judgeTime();
        app.title = "主页";
        this.getDashBoard(this.$route.query.overrideDptId || localStorage.getItem("defaultDepartId"));
        this.getPending();
    },
    methods: {
        getDashBoard (id) {
            axios.post("/api/org/GetDashboard", {}, msg => {
                this.dashBoard = msg;
                this.tableLoading = true;
                axios.post("/api/security/GetOrgDetail", {id}, msg => {
                    this.orgInfo = msg.data;

                    this.getActivities();
                    axios.post("/api/security/GetAllAssociationsByDepartId", {departId: this.orgInfo.ID}, msg => {
                        if (msg.success) {
                            this.organizationData = msg.data;
                            this.organizationSearched = this.organizationData;
                            this.entryForManager.organization.badge = this.organizationData.length;

                            this.$nextTick(() => {
                                this.contentHeight = document.getElementById("college-index").offsetWidth;
                            })
                        }
                        this.tableLoading = false;
                    });
                    axios.post("/api/security/GetUsersByDepartId", {departId: this.orgInfo.ID}, msg => {
                        if (msg.success) {
                            this.membersData = msg.data;
                        }
                    });
                    /* axios.post("/api/security/GetApplicationsByDeparts", {departId: this.orgInfo.ID}, msg => {
                        if (msg.success) this.applicationsData = msg.data;
                    }) */
                })
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
        getActivities () {
            axios.post("/api/org/GetActByDepartId", {Id: this.orgInfo.ID, applicationState: 3}, msg => {
                if (msg.success) {
                    this.entryForManager.activity.badge = msg.data.length;
                }
            });
            axios.post("/api/org/GetActByDepartId", {Id: this.orgInfo.ID}, msg => {
                if (msg.success) {
                    this.activityCount = msg.totalRow;
                }
            });
        },
        getPending () {
            axios.post("/api/workflow/Pending", {}, msg => {
                this.pendingData = msg.data;
                this.entryForManager.pending.badge = this.pendingData.length;
            })
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
        searchOrganization (value) {
            this.organizationSearched = this.organizationData.filter(e => e.name.indexOf(value) > -1);
        },
        viewOrg (overrideDptId) {
            this.$router.push({
                name: 'TeacherManage',
                query: {
                    overrideDptId
                }
            });
        }
    }
}
</script>

<style scoped>
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

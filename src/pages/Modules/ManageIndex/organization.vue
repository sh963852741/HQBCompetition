<template>
    <i-row type="flex" :gutter="24">
        <i-col span="15">
            <i-card :padding="24">
                <template v-slot:title>
                    <i-row style="flex" align="middle">
                        <span style="font-size:18px">我的待办</span>
                        <Badge :count="message.length" v-if="message.length >0"></Badge>
                    </i-row>
                </template>
                <template v-slot:extra>
                   <router-link :to="{name: 'MyPending'}">查看所有待办</router-link>
                </template>
                <List v-if="messageNum>0">
                    <ListItem v-for="(item,index) in message.slice(0,3)" :key="index">
                        <i-row type="flex" align="middle" style="width:100%">
                            <i-col span="20">
                                <div>
                                    <Icon type="ios-checkmark-circle-outline" color="limegreen"/>
                                    {{item.WorkflowName}}
                                </div>
                                <div style="color: #aaaaaa;font-size:14px">
                                    <Icon type="md-information-circle" />
                                    {{item.Owner}}提交的流程
                                </div>
                                <div style="color: #808695;font-size:14px">
                                    <Icon type="md-shuffle" />
                                    工作流到达时间{{item.ArriveOn}}
                                </div>
                            </i-col>
                        </i-row>
                        <template v-slot:action>
                            <Button type="success" @click="dealWorkflow(item.InstanceId, item.StepId, item.WorkflowType)">审核</Button>=
                        </template>
                    </ListItem>
                </List>
                <template v-else>
                    <i-row class="picture">所有工作已完成</i-row>
                </template>
            </i-card>
            <activityList />
        </i-col>
        <i-col span="8">
            <i-card :padding="0" style="margin-bottom:10px">
                <div :to="dashBoard.DepartType === 0 ? routers[1]:routers[0]" v-if="true" style="background-color:#ffffff">
                    <i-row type="flex" align="middle" style="padding:16px;margin: 16px 0px">
                        <i-col span="4">
                            <Avatar :size="48" :src="userInfo.avatar"/>
                        </i-col>
                        <i-col span="19">
                            <div>{{time}}好! {{userInfo.realName}}</div>
                            <a @click="navTo">{{data.Name}}的社团管理员</a>
                        </i-col>
                    </i-row>
                    <i-row type="flex" class="background-purple">
                        <i-col span="8">
                            <div style="padding-top:20px;">
                                <i-row type="flex">
                                    <i-col span="22">
                                        <div style="font-size: 33px;text-align:center;" v-if="membersData.length>0">{{membersData.length}}</div>
                                        <div style="font-size: 33px;text-align:center;" v-else>0</div>
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
                                        <div style="font-size: 33px;text-align:center;" v-if="activityData.length>0">{{activityData.length}}</div>
                                        <div style="font-size: 33px;text-align:center;" v-else>0</div>
                                        <div style="margin-bottom:10px;font-size:12px;text-align:center;">活动数</div>
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
                                        <div style="font-size: 33px;text-align:center;" v-if="applicationsData.length>0">{{applicationsData.length}}</div>
                                        <div style="font-size: 33px;text-align:center;" v-else>0</div>
                                        <div style="margin-bottom:10px;font-size:12px;text-align:center;">申请数</div>
                                    </i-col>
                                </i-row>
                            </div>
                        </i-col>
                    </i-row>
                </div>
            </i-card>
            <i-row  v-for="(item,index) in entryForManager" :key="index">
                <i-card class="layout-con" :to="item.routerTo">
                    <i-row type="flex" align="middle">
                        <i-col span="3" offset="1">
                            <div>
                                <Badge :count="item.badge" v-if="item.title!='添加活动'">
                                    <i-avatar :icon="item.icon" />
                                </Badge>
                                <i-avatar :icon="item.icon" v-else/>
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
    </i-row>
</template>

<script>
import axios from 'axios';
import tableColumns from './tableColumns';
// const echarts = require("echarts");
const app = require("@/config");
let pic = require("@/assets/icon.png");
export default {
    data () {
        return {
            app,
            level: -1,
            pic: pic,
            messageNum: 0,
            tableColumns,
            data: {
                ID: ""
            },
            activityData: [],
            message: [
                {
                    WorkflowName: "软件竞赛报名流程申请",
                    StepName: "指导老师审核[强制执行]",
                    Owner: "宋润涵",
                    ArriveOn: "2020年7月1日"
                }
            ],
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
                member: {
                    title: "成员管理",
                    badge: 0,
                    descrip: "管理本社团的所有成员，处理成员加入申请以及踢除成员",
                    routerTo: {
                        name: "OrgDetail",
                        query: {
                            tabSelect: "member"
                        }
                    },
                    icon: "md-person-add"
                },
                addAct: {
                    title: "添加活动",
                    descrip: "添加一个活动的申请，需要指导老师，业务指导单位，学生社团管理部及团委审核",
                    routerTo: {
                        name: "OrgDetail",
                        query: {
                            tabSelect: "activity"
                        }
                    },
                    icon: "logo-buffer"
                },
                activity: {
                    title: "活动管理",
                    badge: 0,
                    descrip: "管理本社团的所有活动，对已经通过审核的活动可以选择开始活动。也可以在本页面下载活动签到二维码",
                    routerTo: {
                        name: "OrgDetail",
                        query: {
                            tabSelect: "activity"
                        }
                    },
                    icon: "md-information"
                },
                pending: {
                    title: "我的待办",
                    badge: 0,
                    descrip: "等待我处理的工作",
                    routerTo: {
                        name: "MyPending",
                        query: {}
                    },
                    icon: "ios-add-circle"
                }
            },
            membersData: [],
            applicationsData: [],
            pager: {
                page: 1,
                pageSize: 5,
                totalRow: 0
            }
        };
    },
    mounted () {
        app.title = "主页";
        this.getDashBoard();
        this.judgeTime();
        this.getPending();
    },
    methods: {
        getDashBoard () {
            axios.post("/api/org/GetDashboard", {}, msg => {
                this.dashBoard = msg;
                axios.post("/api/security/GetOrgDetail", {}, msg => {
                    this.level = msg.level;
                    this.data = msg.data;
                    this.getActivities();
                    axios.post("/api/security/GetUsersByDepartId", {departId: msg.data.ID}, msg => {
                        this.membersData = msg.data;
                    });
                    axios.post("/api/security/GetApplicationsByDeparts", {departId: msg.data.ID}, msg => {
                        this.applicationsData = msg.data;
                        this.entryForManager.member.badge = this.applicationsData.filter(e => e.State === 3).length;
                    })
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
        getPending () {
            axios.post("/api/workflow/Pending", {}, msg => {
                this.messageNum = msg.totalRow;
                this.message = msg.data;
                this.entryForManager.pending.badge = this.messageNum;
            })
        },
        getActivities (targetPage, targetPageSize) {
            let page = targetPage || this.pager.page;
            let pageSize = targetPageSize || this.pager.pageSize;
            axios.post("/api/org/GetActByDepartId", {Id: this.data.ID, page, pageSize}, msg => {
                if (msg.success) {
                    this.entryForManager.activity.badge = msg.data.filter(e => e.ApplicateState === 3).length;
                }
            });
        },
        dealWorkflow (instanceId, stepId, WorkflowName) {
            window.open(`${this.dic[WorkflowName]}?instanceId=${instanceId}&stepId=${stepId}&detail=false`);
        },
        navTo (url) {
            this.$router.push({name: 'OrgDetail'});
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
    .welcome {
        font-size: 40px;
        color: #17233d;
        padding: 15px 0;
        font-weight: bold;
    }
    .tip {
        font-size: 18px;
        color: #808695;
    }
    .title {
        font-size: 28px;
        color: #17233d;
        padding: 15px 0px;
        margin-top: 10px;
        //text-align: center;
    }
    .padding {
        padding: 10px;
    }
    .margin {
        margin: 5px;
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

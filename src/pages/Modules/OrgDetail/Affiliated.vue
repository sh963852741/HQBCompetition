<template>
    <i-row id="affiliated">
        <i-card :padding="75">
            <i-row>
                <i-col span="5" class="tree">
                    <i-spin fix size="large" v-show="treeLoading"></i-spin>
                    <i-row style="text-align:center;font-size:20px;padding-top:10px">部门管理</i-row>
                    <Tree :data="subDeptTree" class="org-tree" @on-select-change="selectCategory"></Tree>
                </i-col>
                <i-col span="18" offset="1">
                        <i-spin fix size="large" v-show="tableLoading"></i-spin>
                        <i-row style="font-size:30px;margin-bottom:10px">
                            {{orgInfo.Name}}
                            <i-button @click="modifyBasicInfo" type="text">修改基本信息</i-button>
                            <i-button @click="showLog = !showLog" type="text" style="float:right; padding-top: 12px;">查看修改记录</i-button>
                        </i-row>
                        <i-row type="flex" justify="space-between" id="chart" v-if="!orgInfo.Type" style="display: none">
                            <i-col span="8" id="organization">
                                <i-row class="difference">较去年<span class="number">+{{chart.organization.allChildrenIncrease}}</span></i-row>
                                <i-row class="number">{{chart.organization.allChildrenCount}}</i-row>
                                <i-row class="item-name">社团数</i-row>
                            </i-col>
                            <i-divider type="vertical" />
                            <i-col span="7" id="member">
                                <i-row class="difference">较去年<span class="number">+{{chart.member.allMemberIncrease}}</span></i-row>
                                <i-row class="number">{{chart.member.allMemberCount}}</i-row>
                                <i-row class="item-name">成员数</i-row>
                            </i-col>
                            <i-divider type="vertical" />
                            <i-col span="8" id="activity">
                                <i-row class="difference">较去年<span class="number">+{{chart.activity.increase}}</span></i-row>
                                <i-row class="number">{{chart.activity.total}}</i-row>
                                <i-row class="item-name">活动数</i-row>
                            </i-col>
                        </i-row>
                        <i-form :model="orgInfo" :rules="ruleForBasic" ref="form">
                                <i-row v-if="showMore">
                                    <i-col>
                                        <i-form-item label="单位名称" span="8" prop="Name">
                                            <i-input v-model="orgInfo.Name"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row v-if="showMore">
                                    <i-col span="11">
                                        <i-form-item label="单位电话">
                                            <i-input v-model="orgInfo.Phone"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" v-if="level === 3" offset="2">
                                        <i-form-item label="排序号">
                                            <i-input v-model="orgInfo.Sort"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                            </i-form>
                        <i-button type="primary" @click="saveOrgDetail()" :loading="isSaving" v-if="showMore">保存</i-button>
                        <i-tabs v-model="tabSelect" style="padding-top:10px;">
                            <i-tab-pane label="成员与社团管理" name="member">
                                <i-card dis-hover>
                                    <i-row type="flex" justify="space-between" align="middle" slot="title">
                                        <i-col>
                                            <i-row type="flex" align="middle" :gutter="16">
                                                <i-col>社团成员</i-col>
                                            </i-row>
                                        </i-col>
                                        <i-col>
                                            <i-row type="flex" :gutter="16">
                                                <i-col>
                                                    <i-input prefix="ios-search" placeholder="搜索成员" v-model="memberkeyword" @on-enter="getMemberTable()"/>
                                                </i-col>
                                                <i-col>
                                                    <i-button type="primary" @click="addMember('member', '成员')">添加成员</i-button>
                                                </i-col>
                                            </i-row>
                                        </i-col>
                                    </i-row>
                                    <i-table stripe :columns="tableCol.member" :data="tableData.member" :loading="tableLoading">
                                        <template slot="RealName" slot-scope="{row}">
                                                {{row.RealName}}
                                                <i-tag v-if="row.isAdmin">管理员</i-tag>
                                        </template>
                                        <template slot="Action" slot-scope="{row}">
                                            <i-button @click="modifyMember(row)" v-if="(level+orgInfo.Type>1)">修改</i-button>
                                            <i-tooltip :disabled="!row.isAdmin" content="不能删除管理员" placement="top">
                                                <i-button :disabled="row.isAdmin" @click="delMember(row)" v-if="(2*orgInfo.Type+level>=3)">删除</i-button>
                                            </i-tooltip>
                                            <i-button v-if="(level === 3)&&(!row.isAdmin)" @click="setPositon(row.ID,'管理员')">设置管理员</i-button>
                                            <i-poptip transfer v-model="visible" v-if="row.isAdmin">
                                                <i-button v-if="(level === 3)&&row.isAdmin">设置密码</i-button>
                                                <i-row slot="title">您正在更改社团管理员密码</i-row>
                                                <i-form  :model="password" slot="content" label-position="top" :rules="pwdRule">
                                                    <i-form-item label="新密码" prop="password">
                                                        <i-input v-model="password.password" size="small" type="password"/>
                                                    </i-form-item>
                                                    <i-form-item label="确认密码" prop="confirmPassword">
                                                        <i-input v-model="password.confirmPassword" size="small" type="password"/>
                                                    </i-form-item>
                                                    <i-button type="primary" size="small" @click="setPassword(row)">确认</i-button>
                                                    <i-button size="small" @click="cancelSet()">取消</i-button>
                                                </i-form>
                                            </i-poptip>
                                        </template>
                                    </i-table>
                                    <br/>
                                    <i-page show-sizer show-total :total="pager.member.total" @on-change="getMemberTable($event, null)" @on-page-size-change="getMemberTable(null, $event)" />
                                </i-card>
                                <i-card v-if="!orgInfo.Type" dis-hover style="margin-top:16px;">
                                    <i-row type="flex" justify="space-between" align="middle" slot="title">
                                        <i-col>
                                            <i-row type="flex" align="middle" :gutter="16">
                                                <i-col>子部门</i-col>
                                            </i-row>
                                        </i-col>
                                        <i-col>
                                            <i-row type="flex" :gutter="16">
                                                <i-col>
                                                    <i-input prefix="ios-search" placeholder="搜索部门" v-model="deptkeyword" @on-enter="searchSubDepart()"/>
                                                </i-col>
                                                <i-col>
                                                    <i-button type="primary" @click="addSubDepart">
                                                        新建部门
                                                    </i-button>
                                                </i-col>
                                            </i-row>
                                        </i-col>
                                    </i-row>
                                    <i-row>
                                        <i-table row-key="id" stripe :columns="tableCol.subDept" :data="tableData.subDept" :loading="tableLoading">
                                            <template slot="Action" slot-scope="{row}">
                                                <i-button @click="modifySubDepart(row)">管理</i-button>
                                                <i-button @click="delSubDepart(row)">删除</i-button>
                                            </template>
                                            <template slot="admin" slot-scope="{row}">
                                                {{row.admin}}
                                                <i-button shape="circle" v-if="row.admin === ''" @click="addMember('member', '管理员', row.id)">添加管理员</i-button>
                                            </template>
                                            <template slot="Type" slot-scope="{row}">
                                                {{row.Type === 0 ? "业务指导单位" : "社团"}}
                                            </template>
                                        </i-table>
                                        <br/>
                                        <i-page show-total :total="tableData.subDept.length" :page-size="10000"/>
                                    </i-row>
                                </i-card>
                            </i-tab-pane>
                            <i-tab-pane label="成员审核" name="checkin">
                                <i-card dis-hover title="待加入成员">
                                    <i-table stripe :columns="tableCol.applicate" :data="tableData.applicate" :loading="tableLoading">
                                        <template slot="State" slot-scope="{row}">
                                            {{enumDic[row.State]}}
                                        </template>
                                        <template slot="Action" slot-scope="{row}" v-if="row.State === 3">
                                            <i-button @click="acceptApplication(row.ID)">同意</i-button>
                                            <i-button @click="rejectApplication(row.ID)">拒绝</i-button>
                                        </template>
                                    </i-table>
                                    <br/>
                                    <i-page show-sizer show-total :total="pager.applicate.total" @on-change="getApplicateTable($event, null)" @on-page-size-change="getApplicateTable(null, $event)" />
                                </i-card>
                            </i-tab-pane>
                            <i-tab-pane label="社团活动" name="activity">
                                <i-card dis-hover>
                                    <i-row type="flex" justify="space-between" align="middle" slot="title">
                                        <i-col>
                                            <i-row type="flex" align="middle" :gutter="16">
                                                <i-col>社团活动</i-col>
                                                <i-col><i-badge :count="tableData.length"></i-badge></i-col>
                                            </i-row>
                                        </i-col>
                                        <i-col>
                                            <i-row type="flex" :gutter="16">
                                                <i-col>
                                                    <i-input search placeholder="搜索活动名称" @on-search="searchActivity" />
                                                </i-col>
                                                <i-col>
                                                    <i-button type="primary" @click="addActivity">添加活动</i-button>
                                                </i-col>
                                            </i-row>
                                        </i-col>
                                    </i-row>
                                    <i-row>
                                        <i-table stripe :columns="tableCol.activity" :data="tableData.activity" :loading="tableLoading">
                                            <template slot="Action" slot-scope="{row}">
                                                <i-button @click="checkWorkflow(row.InstanceId, row.StepId, row.ID)">查看</i-button>
                                            </template>
                                        </i-table>
                                        <br/>
                                        <i-page show-sizer show-total :total="pager.activity.total" @on-change="getActivityTable($event, null)" @on-page-size-change="getActivityTable(null, $event)" />
                                    </i-row>
                                </i-card>
                            </i-tab-pane>
                            <i-tab-pane label="操作记录" name="operation">
                                <i-table stripe :columns="tableCol.operation" :data="tableData.operation" :loading="tableLoading">
                                </i-table>
                                <br/>
                                <i-page show-sizer show-total :total="pager.operation.total" @on-change="getOptTable($event, null)" @on-page-size-change="getOptTable(null, $event)" />
                            </i-tab-pane>
                        </i-tabs>
                </i-col>
            </i-row>
        </i-card>
        <i-modal :z-index="10" v-model="modalShow" :title="component.title || '暂无'" @on-ok="submit()" @on-cancel="cancel()">
            <component :is="component.name" ref="Form" :modalData="recordData"></component>
        </i-modal>
        <i-drawer title="修改记录" v-model="showLog" scrollable width="20">
            <i-timeline class="timeline">
                <TimelineItem v-for="(item,index) in logs" :key="index">
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
    </i-row>
</template>

<script>
import memberForm from "./memberForm"
import subDeptForm from "./subDeptForm"
const app = require("@/config");
const tableCol = require("./tableCol");
const md5 = require("md5");
let _ = require("lodash");
const axios = require("axios");
export default {
    components: {
        "member-form": memberForm,
        "subDept-form": subDeptForm
    },
    methods: {
        submit () {
            let form = this.$refs["Form"];
            form.submit(this.newDptId || this.orgInfo.ID, this.callbackFunc);
        },
        cancel () {
        },
        modifyBasicInfo () {
            if (this.orgInfo.CategoryName === '社团') {
                window.open("/manage/org/detail?id=" + this.orgInfo.ID);
            } else {
                window.open("/manage/org/detail?id=" + this.orgInfo.ID);
                this.showMore = !this.showMore;
            }
        },
        selectCategory (node, n) {
                this.orgInfo.ID = n.id;
                if (n.isParent && (!this.filters.length || n.id !== this.filters[0].id)) {
                    this.filters.push(n);
                }
                this.$set(n, 'expand', true);
                if (this.filters.length === 2) {
                    let x = this.filters.shift();
                    this.$set(x, 'expand', false);
                }
                this.getOrgDetail();
                this.getMemberTable();
                if (n.isParent) {
                    this.getDeptTable();
                }
                this.getActivityTable();
                this.getOptTable();
                this.getApplicateTable();
                this.select = true;
        },
        saveOrgDetail () {
            this.isSaving = true;
            let form = this.$refs["form"];
            form.validate(res => {
                if (!res) return;
                axios.post("/api/security/SaveDepartV2", this.orgInfo, msg => {
                    if (msg.success) {
                        this.$Message.success("部门信息保存成功");
                    } else {
                        this.$Message.warning(msg.msg);
                    }
                    form.resetFields();
                    this.isSaving = false;
                    this.getOrgDetail();
                });
            })
        },
        getOrgDetail () {
            this.tableLoading = true;
            axios.post("/api/security/GetOrgDetail", {id: this.orgInfo.ID}, msg => {
                if (msg.success) {
                    this.orgInfo = msg.data;
                    this.teachers = msg.teachers;
                    this.users = msg.users;

                    this.chart.organization = msg.charts.allChildren;
                    this.chart.member = msg.charts.allMember;
                    // 弥补接口错误
                    this.orgInfo.HaveLeagueBranch = this.orgInfo.HaveLeagueBranch === "true";
                    this.orgInfo.HaveCPCBranch = this.orgInfo.HaveCPCBranch === "true";
                    this.orgInfo.HaveDepartRule = Boolean(this.orgInfo.HaveDepartRule);
                    // 至此结束
                    this.level = msg.level;
                    this.logs = msg.changeLogs.data;
                } else {
                    this.$Message.warning(msg.msg);
                }
                this.tableLoading = false;
            })
        },
        getMemberTable (page, pageSize) {
            this.tableLoading = true;
            let name = this.memberkeyword ? this.memberkeyword : undefined;
            this.pager.member.page = page || this.pager.member.page;
            this.pager.member.pageSize = pageSize || this.pager.member.pageSize;
            axios.post("/api/security/GetUsersByDepartId", {departId: this.orgInfo.ID, name, page: this.pager.member.page, pageSize: this.pager.member.pageSize}, msg => {
                this.tableData.member = msg.data;
                this.pager.member.total = msg.totalRow;
                this.tableLoading = false;
            });
        },
        getApplicateTable (page, pageSize) {
            this.tableLoading = true;
            this.pager.applicate.page = page || this.pager.applicate.page;
            this.pager.applicate.pageSize = pageSize || this.pager.applicate.pageSize;
            axios.post("/api/security/GetApplicationsByDeparts", {departId: this.orgInfo.ID, page: this.pager.applicate.page, pageSize: this.pager.applicate.pageSize}, msg => {
                this.tableData.applicate = msg.data;
                this.pager.applicate.total = msg.totalRow;
                this.tableLoading = false;
            });
        },
        getDeptTable (reflashTree, page, pageSize) {
            if (this.orgInfo.Type !== 0) return;
            this.treeLoading = true;
            this.tableLoading = true;
            axios.post("/api/security/GetDepartsByDepartId", {id: this.orgInfo.ID}, msg => {
                this.tableData.subDept = msg.data.children || [];
                if (reflashTree) {
                    this.subDeptTree = [msg.data];
                    this.$set(this.subDeptTree[0], 'expand', true);
                }
                this.treeLoading = false;
                this.searchSubDep = this.tableData.subDept;
                this.tableLoading = false;
            });
        },
        getOptTable (page, pageSize) {
            this.tableLoading = true;
            this.pager.operation.page = page || this.pager.operation.page;
            this.pager.operation.pageSize = pageSize || this.pager.operation.pageSize;
            axios.post("/api/logs/GetLogsByDepartId", {departId: this.orgInfo.ID, page: this.pager.operation.page, pageSize: this.pager.operation.pageSize}, msg => {
                this.tableData.operation = msg.data;
                this.pager.operation.total = msg.totalRow;
                this.tableLoading = false;
            });
        },
        getActivityTable (page, pageSize) {
            // this.tableLoading = true;
            this.pager.activity.page = page || this.pager.activity.page;
            this.pager.activity.pageSize = pageSize || this.pager.activity.pageSize;
            axios.post("/api/org/GetActByDepartId", {Id: this.orgInfo.ID, page: this.pager.activity.page, pageSize: this.pager.activity.pageSize, name: this.activitySearchValue}, msg => {
                for (let i = 0; i < msg.data.length; i++) {
                    if (msg.data[i].ActivityType) {
                        msg.data[i].ActivityType = msg.data[i].ActivityType.replace(/[[\]"]/g, "").replace(/,/g, "，");
                        let reg1 = new RegExp('[r|n| ]', "g");
                        msg.data[i].ActivityType = msg.data[i].ActivityType.replace(reg1, '');
                        let reg2 = new RegExp(/\\/g, "g");
                        msg.data[i].ActivityType = msg.data[i].ActivityType.replace(reg2, '');
                    } else {
                        msg.data[i].ActivityType = "";
                    }
                }
                this.tableData.activity = msg.data;
                this.pager.activity.total = msg.totalRow;
                // this.tableLoading = false;
                this.chart.activity = msg.charts;
            });
        },
        addSubDepart () {
            this.recordData = {};
            this.component.name = "subDept-form";
            this.component.title = "新建部门";
            this.callbackFunc = this.modifySubDepart;
            this.modalShow = true;
        },
        acceptApplication (appId) {
            axios.post("/api/security/AcceptApplicate", {appId}, msg => {
                if (msg.success) {
                    this.$Message.success("接受成功");
                } else {
                    this.$Message.warning(msg.msg);
                }
                this.getApplicateTable();
            });
        },
        addMember (who, position, departId) {
            this.component.name = who + "-form";
            let dic = {
                "member": "新建成员",
                "admin": "新建管理员"
            }
            this.component.title = dic[who];
            this.newDptId = departId;
            this.recordData = {
                position,
                user: {},
                changeLogs: []
            };
            this.callbackFunc = who === "tutor" ? this.getTutorTable : this.getMemberTable;
            this.modalShow = true;
        },
        addActivity () {
            axios.post("/api/org/Applicate", {id: this.orgInfo.ID}, msg => {
                if (msg.success) {
                    window.open("/manage/org/activityform?instanceId=" + msg.instanceId + '&stepId=' + msg.stepId);
                } else {
                    this.$Message.warning(msg.msg);
                }
            })
        },
        delMember (row) {
            this.$Modal.confirm({
                title: "确认删除该成员？",
                onOk: () => {
                    axios.post("/api/security/RemoveUserV2", { userId: row.ID, departId: row.departId }, msg => {
                        if (msg.success) {
                            this.$Message.success("删除成功");
                        } else {
                            this.$Message.warning(msg.msg);
                        }
                        this.getMemberTable();
                    });
                }
            });
        },
        delSubDepart (row) {
            this.$Modal.confirm({
                title: "确认删除该部门？",
                onOk: () => {
                    axios.post("/api/security/RemoveDepartV2", {id: row.id}, msg => {
                        if (msg.success) {
                            this.$Message.success("删除成功");
                        } else {
                            this.$Message.warning(msg.msg);
                        }
                        this.getDeptTable();
                    });
                }
            });
        },
        modifyMember (row) {
            axios.post("/api/security/GetUserById", {id: row.ID, departId: this.orgInfo.ID}, msg => {
                this.recordData.user = msg.user;
                this.recordData.changeLogs = msg.changeLogs;
                this.component.name = "member-form";
                this.component.title = "修改成员"
                this.modalShow = true;
                this.callbackFunc = this.getMemberTable;
            });
        },
        rejectApplication (appId) {
            axios.post("/api/security/DenyApplicate", {appId}, msg => {
                if (msg.success) {
                    this.$Message.success("拒绝成功");
                } else {
                    this.$Message.warning(msg.msg);
                }
                this.getApplicateTable();
            });
        },
        modifySubDepart (row) {
            if (row.Type) window.open("/manage/org/detail?id=" + row.id);
            else window.open("/manage/org/affiliated?id=" + row.id);
        },
        checkWorkflow (instanceId, stepId, actId) {
            window.open(`/manage/org/signUpSituation?instanceId=${instanceId}&stepId=${stepId}&detail=true&actId=${actId}`);
        },
        setPositon (userId, position) {
            axios.post("/api/security/SetPositionV2", {userId, departId: this.orgInfo.ID, position}, msg => {
                if (msg.success) {
                    this.$Message.success("设置成功")
                } else {
                    this.$Message.warning(msg.msg);
                }
                this.getMemberTable();
            })
        },
        setPassword (row) {
            axios.post("/api/security/SetPassword", {userId: row.ID, departId: this.orgInfo.ID, password: md5(this.password.password)}, msg => {
                this.getMemberTable();
                this.$Message.info('修改成功');
            })
            this.visible = false;
        },
        cancelSet () {
            this.visible = false;
        },
        searchSubDepart () {
            if (!this.deptkeyword) {
                this.tableData.subDept = this.searchSubDep;
            } else {
                this.tableData.subDept = this.searchSubDep.filter(item => {
                    return item.name.includes(this.deptkeyword) ||
                        item.children.filter(item => item.name.includes(this.deptkeyword)).length > 0;
                })
            }
        },
        searchActivity (value) {
            this.activitySearchValue = value;
            this.getActivityTable();
        },
        searchMember: _.debounce(function () {
            if (this.tabSelect === "member") {
                this.getMemberTable();
            }
        }, 500)
    },
    watch: {
        memberkeyword (v) {
            this.searchMember();
        },
        deptkeyword (v) {
            this.searchSubDepart();
        },
        "orgInfo.Type" (value, oldValue) {
            if (value === oldValue || oldValue === undefined || this.select) {
                this.select = false;
                return;
            }
            this.$Modal.confirm({
                title: "确实要更改部门类型吗？",
                content: `将部门类型由<strong>${oldValue === 0 ? "业务指导单位" : "社团"}</strong>更改为
                    <strong>${value === 0 ? "业务指导单位" : "社团"}</strong>`,
                onOk: () => {
                    axios.post("/api/security/SwitchDepartType", {
                        id: this.orgInfo.ID,
                        cate: this.orgInfo.Type === 0 ? "业务指导单位" : "社团",
                        type: value
                    }, msg => {
                        this.getOrgDetail();
                    });
                },
                onCancel: () => {
                    this.orgInfo.Type = oldValue;
                }
            })
        }
    },
    mounted () {
        app.title = "社团管理";
        this.$Spin.show({
            render: (h) => {
                return h('div', [
                    h('Icon', {
                        'class': 'spin-icon-load',
                        props: {
                            type: 'ios-loading',
                            size: 18
                        }
                    }),
                    h('div', '正在获取部门详细信息，请稍候……')
                ])
            }
        });
        axios.post("/api/security/GetOrgDetail", {id: this.$route.query.id ? this.$route.query.id : null}, msg => {
            if (msg.success) {
                this.orgInfo = msg.data;
                this.teachers = msg.teachers;
                this.users = msg.users;

                this.chart.organization = msg.charts.allChildren;
                this.chart.member = msg.charts.allMember;
                // 弥补接口错误
                this.orgInfo.HaveLeagueBranch = this.orgInfo.HaveLeagueBranch === "true";
                this.orgInfo.HaveCPCBranch = this.orgInfo.HaveCPCBranch === "true";
                this.orgInfo.HaveDepartRule = Boolean(this.orgInfo.HaveDepartRule);
                // 至此结束
                this.level = msg.level;
                this.logs = msg.changeLogs.data;
                // 获取其他Tab页信息
                this.getMemberTable();
                this.getDeptTable(true);
                this.getOptTable();
                this.getActivityTable();
            }
            this.$Spin.hide();
            this.tabSelect = this.$route.query.tabSelect || "member";
        });
    },
    data () {
        let THIS = this;
        return {
            app,
            tableCol,
            visible: false,
            showLog: false,
            treeLoading: false,
            select: true,
            filters: [],
            logs: [],
            memberkeyword: "",
            deptkeyword: "",
            activitySearchValue: "",
            teachers: [],
            enumDic: {
                0: "已通过",
                1: "被拒绝",
                2: "自行撤回",
                3: "申请中"
            },
            subDeptTree: [
                {expand: true}
            ],
            subdept: {},
            users: 0,
            tabSelect: "",
            isSaving: false,
            tableLoading: false,
            newDptId: "",
            showMore: false,
            component: {
                name: "",
                title: ""
            },
            searchSubDep: {},
            recordData: {
                user: {},
                changeLogs: []
            },
            level: 0,
            orgInfo: {},
            tableData: {
                member: [],
                subDept: [],
                tutor: [],
                operation: []
            },
            ruleForBasic: {
                Name: [
                        {
                            required: true,
                            message: "必须填写单位名称",
                            trigger: "blur"
                        }
                    ],
                BirthTime: [
                    {
                            required: true,
                            type: "date",
                            message: "必须填写成立时间",
                            trigger: "change"
                    }
                ]
            },
            pager: {
                member: {
                    total: 0,
                    page: 1,
                    pageSize: 10
                },
                tutor: {
                    total: 0,
                    page: 1,
                    pageSize: 10
                },
                activity: {
                    total: 0,
                    page: 1,
                    pageSize: 10
                },
                operation: {
                    total: 0,
                    page: 1,
                    pageSize: 10
                },
                applicate: {
                    total: 0,
                    page: 1,
                    pageSize: 10
                }
            },
            modalShow: false,
            password: {},
            pwdRule: {
                password: {
                    trigger: 'blur',
                    validator (rule, value, callback, source, options) {
                        (value && value.length >= 6 && value.length <= 16) ? callback() : callback(new Error('密码必须在6至16位之间'));
                    }
                },
                confirmPassword: {
                    trigger: 'blur',
                    validator (rule, value, callback, source, options) {
                        value === THIS.password.password ? callback() : callback(new Error('两次输入的密码不一致'));
                    }
                }
            },
            chart: {
                member: {},
                activity: {},
                organization: {}
            },
            callbackFunc: () => {}
        };
    }
}
</script>

<style lang="less">
#affiliated{
.tree {
    background: #808695;
    color: #fff;
    min-height: fill-available;
    @import "../../../assets/less/orgTree.less";
}
.ivu-form-item .ivu-date-picker{
    width: 100%;
}
.timeline{
    height: 100vh;
    padding-top: 10px;
    overflow: auto;
    .time{
        font-size: 14px;
        font-weight: bold;
    }
    .content{
        padding-left: 5px;
    }
}
.spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
.ivu-poptip-body-content {
    overflow: hidden;
}
#chart {
        margin: 24px 0px;
        text-align: center;
        .difference {
            font-size: 16px;
            color: #808695;
            .number {
                font-size: 16px;
            }
        }
        .item-name {
            font-size: 20px;
            color: #17233d;
        }
        .number {
            font-size: 36px;
            font-weight: bold;
        }
        #organization {
            .number
            {
                color: orangered;
            }
        }
        #member {
            .number
            {
                color: orange;
            }
        }
        #activity {
            .number
            {
                color: teal;
            }
        }
    }
    .ivu-divider-vertical {
        height: 130px;
    }
}

</style>

<template>
    <i-row>
        <i-card :padding="100">
            <i-row type="flex" style="margin: -50px 0px 40px 0px" align="middle">
                <i-col span="3">
                    <img v-if="orgInfo.avatar"
                        :width="128"
                        :height="128"
                        :src="orgInfo.avatar"
                        alt="暂无头像"
                    />
                    <img v-else
                        :width="128"
                        :height="128"
                        :src="app.webInfo.avatar"
                    />
                </i-col>
                <i-col span="21">
                    <i-row style="font-size:30px; margin-bottom:10px">{{orgInfo.Name ? orgInfo.Name : "正在加载中"}}</i-row>
                    <i-row>
                        <i-col span="3">成员人数：{{users}}</i-col>
                        <i-col span="3">指导老师：{{teachers.length}}</i-col>
                    </i-row>
                </i-col>
            </i-row>
            <i-tabs v-model="tabSelect">
                <i-tab-pane label="基本信息" name="basicInfo">
                    <i-row>
                        <i-spin fix size="large" v-show="tableLoading"></i-spin>
                        <i-col span="14">
                            <i-button @click="changeOrgDetail">修改社团信息</i-button>
                            <i-button @click="delThisDepart($route.query.id)" type="error" v-if="app.checkPermission('Organization.TwAdminUser')">删除社团</i-button>
                            <i-form :disabled="level !== 3" :model="orgInfo" :rules="ruleForBasic" ref="form">
                                <Divider orientation="left">基本信息</Divider>
                                <i-row type="flex" justify="space-between">
                                    <i-col span="24">
                                        <i-form-item label="社团名称" span="8" prop="Name">
                                            <i-input v-model="orgInfo.Name"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="社团类型" prop="DepartType">
                                            <dic-select dic="社团类型" v-model="orgInfo.DepartType" />
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="成立时间" prop="BirthTime">
                                            <i-date-picker type="date" v-model="orgInfo.BirthTime" format="yyyy年MM月dd日" />
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="部门电话">
                                            <i-input v-model="orgInfo.Phone"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="业务指导单位">
                                            <org-selector v-model="orgInfo.ParentId"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="排序号">
                                            <i-input v-model="orgInfo.Sort"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="部门类型">
                                            <i-select v-model="orgInfo.Type">
                                                <i-option :value="0" key="业务指导单位">业务指导单位</i-option>
                                                <i-option :value="1" key="社团">社团</i-option>
                                            </i-select>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="24">
                                        <i-form-item label="社团简介" prop="Description">
                                            <i-input type="textarea" maxlength="300" show-word-limit :autosize="{minRows: 3}" v-model="orgInfo.Description"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="章程制定时间">
                                            <i-switch v-model="orgInfo.HaveDepartRule" />
                                            <!--i-upload :disabled="!orgInfo.HaveDepartRule" action="/api/cms/UploadFile" :before-upload="handleUpload"
                                            :data="{'usage': 'DepartRule', 'single': true, 'relateTable': 'DepartInfo', 'id': this.orgInfo.ID, 'fileName': 'my-file'}">
                                                <i-button shape="circle"
                                                :disabled="!orgInfo.HaveDepartRule" icon="ios-cloud-upload-outline" type="primary" ></i-button>
                                            </i-upload>
                                            <div style="margin-bottom: 10px" v-if="formData !== null">
                                                <i-row>
                                                    <div class="fileInfo">
                                                    <Button type="text" style="text-align: left;width: 200px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{formData.name}}</Button>
                                                    <Button type="text" @click="uploadFile" :loading="loadingStatus">上传</Button>
                                                    <Button type="text" @click="removeFormData"><Icon type="ios-close" /></Button>
                                                    </div>
                                                </i-row>
                                            </div>
                                            <div v-if="files.length > 0">
                                                <Divider v-if="formData !== null"/>
                                                <template v-for="(item, index) in files">
                                                    <i-row :key="index">
                                                        <div class="fileInfo">
                                                            <i-col span="18">
                                                                <a style="display: inline-block;text-align: left;width: 200px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :href="'/api/cms/Download?id=' + item.ID" target="_blank">{{item.DisplayName}}</a>
                                                            </i-col>
                                                            <i-col span="5">
                                                                <Button @click="removeFile(item)" type="text"><Icon type="ios-close" /></Button>
                                                            </i-col>
                                                        </div>
                                                    </i-row>
                                                </template>
                                            </div-->
                                            <i-date-picker :disabled="!orgInfo.HaveDepartRule" v-model="orgInfo.RuleCreatedOn"></i-date-picker>
                                            <a v-if="orgInfo.rule" :href="orgInfo.rule" target="_blank">下载章程</a>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="团支部成立时间">
                                            <i-switch v-model="orgInfo.HaveLeagueBranch" />
                                            <i-date-picker :disabled="!orgInfo.HaveLeagueBranch" v-model="orgInfo.LeagueBrachCreatedOn"></i-date-picker>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="党支部成立时间">
                                            <i-switch v-model="orgInfo.HaveCPCBranch" />
                                            <i-date-picker :disabled="!orgInfo.HaveCPCBranch" v-model="orgInfo.CPCBranchCreatedOn"></i-date-picker>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="党支部类型">
                                            <dic-select dic="党支部类型" :disabled="!orgInfo.HaveCPCBranch" v-model="orgInfo.CPCBranchType"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                            <div style="display: none">
                                <Divider orientation="left">指导老师情况</Divider>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="指导老师姓名">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="指导老师工号">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="指导教师类别">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="指导教师政治面貌">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="指导教师单位">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="指导教师手机">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="指导教师邮箱">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="占位">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="指导老师产生方式">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="指导老师有无激励">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <Divider orientation="left">社团负责人情况</Divider>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="社团负责人姓名">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="何时确定为社团负责人">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="社团负责人学号">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="社团负责人政治面貌">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="社团负责人学院">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="社团负责人年级专业">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="社团负责人手机">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="社团负责人邮箱">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <Divider orientation="left">社团团支部情况</Divider>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="社团团支部书记姓名">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="何时被确定为社团团支部书记">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="社团团支部书记学号">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="社团团支部书记所在学院">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="社团团支部书记年级专业">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="社团团支部书记手机">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="社团团支部书记邮箱">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="占位">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <Divider orientation="left">社团党支部情况</Divider>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="社团党支部书记姓名">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="何时被确定为社团党支部书记">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="社团党支部书记学号">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="社团党支部书记所在学院">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="社团党支部书记年级专业">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="社团党支部书记手机">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="社团党支部书记邮箱">
                                            <i-input v-model="orgInfo.GuideElectionBy"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="占位">
                                            <i-input v-model="orgInfo.GuideBonus"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <Divider orientation="left">宣传平台信息</Divider>
                                <i-row type="flex">
                                    <i-col span="11">
                                        <i-form-item label="宣传平台信息">
                                            <i-input v-model="orgInfo.SocialMedia" placeholder="媒体平台：账号名称，粉丝数；"/>
                                        </i-form-item>
                                    </i-col>
                                    <i-col span="11" offset="2">
                                        <i-form-item label="经费来源">
                                            <i-input v-model="orgInfo.ChannelForFunds"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                <i-row type="flex">
                                    <i-col span="24">
                                        <i-form-item label="备注1">
                                            <i-input type="textarea" v-model="orgInfo.Memo"/>
                                        </i-form-item>
                                        <i-form-item label="备注2">
                                            <i-input type="textarea" v-model="orgInfo.Remark"/>
                                        </i-form-item>
                                    </i-col>
                                </i-row>
                                </div>
                            </i-form>
                            <i-button type="primary" v-if="app.checkPermission('Security.SaveDepartDirectly')" @click="saveOrgDetail()" :loading="isSaving">保存</i-button>
                        </i-col>
                        <i-col span="9" offset="1">
                            <!--i-timeline class="timeline i-scrollbar-hide">
                                <TimelineItem v-for="(item,index) in logs" :key="index">
                                    <i-row>
                                        <p class="time">{{item.OperateOn}} {{item.Operator}}</p>
                                        <p class="content">
                                            <i-row v-for="(d,index) in item.Details" :key="index">
                                                {{d}}
                                            </i-row>
                                        </p>
                                    </i-row>
                                </TimelineItem>
                            </i-timeline-->
                            <i-table stripe :columns="tableCol.organization" :data="tableData.organization">
                                <template slot="Action" slot-scope="{row}">
                                    <i-button @click="checkOrg(row)">查看</i-button>
                                    <i-button v-if="row.VersionState !== 200" @click="abortOrg(row)">撤回</i-button>
                                </template>
                            </i-table>
                        </i-col>
                    </i-row>
                </i-tab-pane>
                <i-tab-pane :label="memberManage" name="member">
                    <i-card dis-hover>
                        <i-row type="flex" justify="space-between" align="middle" slot="title">
                            <i-col>
                                <i-row type="flex" align="middle" :gutter="16">
                                    <i-col style="font-size: 18px">现有成员</i-col>
                                </i-row>
                            </i-col>
                            <i-col>
                                <i-row type="flex" :gutter="16">
                                    <i-col>
                                        <i-input prefix="ios-search" placeholder="搜索成员" v-model="keyword" @keyup.enter.native="getMemberTable()"/>
                                    </i-col>
                                    <i-col>
                                        <i-button v-if="app.checkPermission('Security.AddDepartUser')" type="primary" @click="addMember('member', '成员')">添加成员</i-button>
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
                                <i-button @click="modifyMember(row)" v-if="app.checkPermission('Security.CheckDepartUser')">{{app.checkPermission('Security.EditDepartUser') ? '修改' : '查看'}}</i-button>
                                <i-tooltip :disabled="!row.isAdmin" content="不能删除管理员" placement="top">
                                    <i-button :disabled="!app.checkPermission('Security.RemoveDepartUser') || row.isAdmin" @click="delMember(row)" v-if="(2*orgInfo.Type+level>=3)">删除</i-button>
                                </i-tooltip>
                                <i-button v-if="app.checkPermission('Security.SetDepartAdmin') && !row.isAdmin" @click="setPositon(row.ID,'管理员')">设置管理员</i-button>
                                <i-poptip transfer v-model="visible" v-if="row.isAdmin">
                                    <i-button v-if="app.checkPermission('Security.EditDepartUser')">设置密码</i-button>
                                    <i-row slot="title">您正在更改社团成员密码</i-row>
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
                </i-tab-pane>
                <i-tab-pane label="成员审核" name="checkin" :disabled="!app.checkPermission('Security.AcceptJoinApplicate')">
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
                <i-tab-pane label="指导老师" name="tutor">
                    <i-card dis-hover>
                        <i-row type="flex" justify="space-between" align="middle" slot="title">
                            <i-col>
                                <i-row type="flex" align="middle" :gutter="16">
                                    <i-col>指导老师</i-col>
                                </i-row>
                            </i-col>
                            <i-col>
                                <i-row type="flex" :gutter="16">
                                    <i-col>
                                        <i-input prefix="ios-search" placeholder="搜索老师" v-model="keyword" @keyup.enter.native="getTutorTable()"/>
                                    </i-col>
                                    <i-col>
                                        <i-button type="primary" v-if="app.checkPermission('Security.AddDepartTeacher')" @click="addMember('tutor')">添加老师</i-button>
                                    </i-col>
                                </i-row>
                            </i-col>
                        </i-row>
                        <i-row>
                            <i-table stripe :columns="tableCol.tutor" :data="tableData.tutor" :loading="tableLoading">
                                <template slot="Action" slot-scope="{row}">
                                    <i-button @click="modifyTutor(row)"  v-if="app.checkPermission('Security.CheckDepartTeacher')">{{app.checkPermission('Security.EditDepartTeacher') ? '修改' : '查看'}}</i-button>
                                    <i-button @click="delTutor(row)" v-if="app.checkPermission('Security.RemoveDepartTeacher')">删除</i-button>
                                </template>
                            </i-table>
                            <br/>
                            <i-page show-sizer show-total :total="pager.tutor.total" @on-change="getTutorTable($event, null)" @on-page-size-change="getTutorTable(null, $event)" />
                        </i-row>
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
                                        <i-button type="primary" @click="addActivity">添加活动</i-button>
                                    </i-col>
                                    <i-col>
                                        <i-input type="text" search v-model="activityName" @on-enter="getActivityTable(null)" placeholder="搜索活动名" />
                                    </i-col>
                                </i-row>
                            </i-col>
                        </i-row>
                        <i-row>
                            <i-table stripe :columns="tableCol.activity" :data="tableData.activity" :loading="tableLoading">
                                <template slot="Action" slot-scope="{row}">
                                    <i-button @click="checkWorkflow(row.InstanceId, row.StepId, row.ID)">查看</i-button>
                                    <i-button type="primary" @click="iniateAct(row.ID, 1)" v-if="row.StartState === 0 && row.ApplicateState === 3">发起活动</i-button>
                                    <i-button @click="iniateAct(row.ID, 0)" v-if="row.StartState === 1 && row.ApplicateState === 3">取消活动</i-button>
                                </template>
                                <template slot="ShortCode" slot-scope="{row}">
                                    <img :src="getImg(row.ShortCode)" v-if="row.StartState === 1"/>
                                    <p v-else-if="row.ApplicateState === 4 || row.StartState === 2">活动已结束</p>
                                    <p v-else>活动未开始</p>
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
                <i-tab-pane label="年终总结" name="summary">
                    功能开发中，敬请期待
                </i-tab-pane>
            </i-tabs>
        </i-card>
        <i-modal :z-index="10" v-model="modalShow" :loading="true" :title="component.title || '暂无'">
            <component :is="component.name" ref="Form" :loading.sync="modalLoading" :modalData="recordData"></component>
            <div slot="footer" >
                <div v-if="component.name === 'member-form'">
                    <i-button type="primary" :loading="modalLoading" @click="submit" v-if="app.checkPermission('Security.EditDepartUser')">修改</i-button>
                    <i-button @click="cancel">{{app.checkPermission('Security.EditDepartUser') ? '取消' : '确定'}}</i-button>
                </div>
                <div v-else-if="component.name === 'tutor-form'">
                    <i-button type="primary" :loading="modalLoading" @click="submit" v-if="app.checkPermission('Security.EditDepartTeacher')">修改</i-button>
                    <i-button @click="cancel">{{app.checkPermission('Security.EditDepartTeacher') ? '取消' : '确定'}}</i-button>
                </div>
            </div>
        </i-modal>
    </i-row>
</template>

<script>
import memberForm from "./memberForm"
import tutorForm from "./tutorForm"
import subDeptForm from "./subDeptForm"
const app = require("@/config");
const tableCol = require("./tableCol");
const md5 = require("md5");
let _ = require("lodash");
const axios = require("axios");
const table = "AssociationCharter";
const usage = "附件";
export default {
    components: {
        "member-form": memberForm,
        "tutor-form": tutorForm,
        "subDept-form": subDeptForm
    },
    methods: {
        async submit () {
            let form = this.$refs["Form"];
            this.modalLoading = true;
            this.$refs['Form'].validate((valid) => {
                if (!valid) {
                    this.$Message.error('请完整填写表单!');
                } else {
                    form.submit(this.newDptId || this.orgInfo.ID, (res, msg) => {
                        this.modalLoading = false;
                        if (res) {
                            this.callbackFunc();
                            this.modalShow = false;
                        }
                    });
                }
            })
        },
        cancel () {
            this.modalShow = false;
        },
        removeFile (file) {
            axios.post("/api/cms/RemoveAttachment", {id: file.ID}, msg => {
                if (msg.success) {
                    this.$Message.success('删除文件成功');
                    this.getFiles();
                }
            })
        },
        getFiles () {
            axios.post("/api/cms/GetAttachments", {id: this.orgInfo.ID, relateTable: table, usage: usage}, msg => {
                if (msg.success) {
                    this.files = msg.data;
                }
            })
        },
        handleUpload (file) {
            this.formData = file;
            return true;
        },
        uploadFile () {
            let param = new FormData();
            param.append("file", this.formData);
            param.append("id", this.orgInfo.ID);
            param.append("relateTable", table);
            param.append("usage", usage);
            param.append("single", true);
            param.append("fileName", this.formData.name);
            this.loadingStatus = true;
            axios._post("/api/cms/UploadFile", param).then((res) => {
                this.loadingStatus = false;
                if (res.data.success) {
                    this.$Message.success('success');
                    this.formData = null;
                    this.getFiles();
                } else {
                    this.$Message.error(res.data.msg);
                }
            })
        },
        removeFormData () {
            this.formData = null;
        },
        getImg (ShortCode) {
            return "/qr/" + ShortCode;
        },
        iniateAct (ID, state, index) {
            axios.post("/api/org/ChangeActivityState", {actId: ID, state: state}, msg => {
                if (msg.success) {
                    if (state === 1) {
                        this.$Message.success("活动发起成功");
                    } else if (state === 0) {
                        this.$Message.success("活动已取消");
                    }
                    this.getActivityTable();
                } else {
                    this.$Message.warning(msg.msg);
                }
            })
        },
        changeOrgDetail () {
            axios.post("/api/org/ModifyApplicate", {id: this.orgInfo.ID}, msg => {
                if (msg.success) {
                    const { href } = this.$router.resolve({
                        path: "/manage/org/orgdetailform",
                        query: {
                            instanceId: msg.instanceId,
                            stepId: msg.stepId,
                            detail: false
                        }
                    });
                    window.open(href);
                } else {
                    this.$Message.warning(msg.msg);
                }
            });
        },
        checkOrg (row) {
            const { href } = this.$router.resolve({
                path: "/manage/org/orgdetailform",
                query: {
                    instanceId: row.InstanceId,
                    stepId: row.StepId,
                    detail: true
                }
            });
            window.open(href);
        },
        getAllOrgDetail () {
            axios.post("/api/org/GetAllVersion", {departId: this.orgInfo.ID}, msg => {
                this.tableData.organization = msg.data;
            });
        },
        abortOrg (row) {
            axios.post("/api/org/AbortVersion", {departId: this.orgInfo.ID, id: row.InstanceId}, msg => {
                if (msg.success) {
                    this.getAllOrgDetail();
                } else {
                    this.$Message.warning(msg.msg);
                }
            });
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
            let name = this.keyword ? this.keyword : undefined;
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
        getTutorTable (page, pageSize) {
            this.tableLoading = true;
            let name = this.keyword ? this.keyword : undefined;
            this.pager.tutor.page = page || this.pager.tutor.page;
            this.pager.tutor.pageSize = pageSize || this.pager.tutor.pageSize;
            axios.post("/api/security/GetUsersByDepartId", {
                departId: this.orgInfo.ID,
                name,
                position: "指导老师",
                page: this.pager.tutor.page,
                pageSize: this.pager.tutor.pageSize
            }, msg => {
                this.tableData.tutor = msg.data;
                this.pager.tutor.total = msg.totalRow;
                this.tableLoading = false;
            });
        },
        getDeptTable (page, pageSize) {
            if (this.orgInfo.Type !== 0) return;
            this.tableLoading = true;
            axios.post("/api/security/GetDepartsByDepartId", {id: this.orgInfo.ID}, msg => {
                this.tableData.subDept = msg.data.children || [];
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
            this.tableLoading = true;
            this.pager.activity.page = page || this.pager.activity.page;
            this.pager.activity.pageSize = pageSize || this.pager.activity.pageSize;
            axios.post("/api/org/GetActByDepartId", {Id: this.orgInfo.ID, page: this.pager.activity.page, pageSize: this.pager.activity.pageSize, name: this.activityName}, msg => {
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
                this.tableLoading = false;
            });
        },
        addSubDepart () {
            this.recordData = {};
            this.component.name = "subDept-form";
            this.component.title = "新建部门";
            this.callbackFunc = this.modifySubDepart;
            this.modalShow = true;
        },
        addMember (who, position, departId) {
            this.component.name = who + "-form";
            let dic = {
                "tutor": "新建指导老师",
                "member": "新建成员",
                "admin": "新建管理员"
            }
            this.component.title = dic[who];
            this.newDptId = departId;
            this.recordData = {
                position,
                user: {
                    JoinCPCTime: "",
                    JoinCCYLTime: ""
                },
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
        delTutor (row) {
            this.$Modal.confirm({
                title: "确认删除该指导老师？",
                onOk: () => {
                    axios.post("/api/security/RemoveUserV2", { userId: row.ID, departId: row.departId, position: "指导老师" }, msg => {
                        if (msg.success) {
                            this.$Message.success("删除成功");
                        } else {
                            this.$Message.warning(msg.msg);
                        }
                        this.getTutorTable();
                    });
                }
            });
        },
        delThisDepart (id) {
            this.$Modal.confirm({
                title: "确认删除该社团？",
                content: "删除社团后无法还原，但不会删除成员数据。",
                onOk: () => {
                    axios.post("/api/security/RemoveDepartV2", {id}, msg => {
                        if (msg.success) {
                            this.$Message.success("删除成功");
                            this.$router.go(-1);
                        } else {
                            this.$Message.warning(msg.msg);
                        }
                    });
                }
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
        modifyTutor (row) {
            axios.post("/api/security/GetUserById", {id: row.ID, departId: this.orgInfo.ID}, msg => {
                this.recordData.user = msg.user;
                this.recordData.changeLogs = msg.changeLogs;
                this.component.name = "tutor-form";
                this.component.title = "修改指导老师"
                this.modalShow = true;
                this.callbackFunc = this.getTutorTable;
            });
        },
        modifySubDepart (row) {
            this.getDeptTable();
            if (!row.isParent) {
                window.open("/manage/org/detail?id=" + row.id);
            } else {
                window.open("/manage/org/affiliated?id=" + row.id);
            }
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
                this.$Message.success('修改成功');
            })
            this.visible = false;
        },
        cancelSet () {
            this.visible = false;
        },
        searchSubDepart () {
           this.tableData.subDept = this.searchSubDep.filter(item => {
                if (item.name.includes(this.keyword)) {
                    return item;
                }
            })
        },
        setKeyword: _.debounce(function () {
                if (this.tabSelect === "member") {
                    this.getMemberTable();
                }
                if (this.tabSelect === "tutor") {
                    this.getTutorTable();
                }
                if (this.tabSelect === "subDept") {
                    this.searchSubDepart();
                }
        }, 500)
    },
    watch: {
        keyword (v) {
            this.setKeyword();
        },
        "orgInfo.Type" (value, oldValue) {
            if (value === oldValue || oldValue === undefined) return;
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
                // 弥补接口错误
                this.orgInfo.HaveLeagueBranch = this.orgInfo.HaveLeagueBranch === "true";
                this.orgInfo.HaveCPCBranch = this.orgInfo.HaveCPCBranch === "true";
                this.orgInfo.HaveDepartRule = Boolean(this.orgInfo.HaveDepartRule);
                // 至此结束
                this.level = msg.level;
                this.logs = msg.changeLogs.data;
                // 获取其他Tab页信息
                this.getMemberTable();
                this.getTutorTable();
                this.getDeptTable();
                this.getOptTable();
                this.getActivityTable();
                this.getApplicateTable();
                this.getAllOrgDetail();
            }
            this.$Spin.hide();
            this.tabSelect = this.$route.query.tabSelect || "basicInfo";
        });
    },
    data () {
        let THIS = this;
        return {
            modalShow: false,
            modalLoading: false,
            app,
            loadingStatus: false,
            formData: null,
            files: [],
            tableCol,
            visible: false,
            logs: [],
            keyword: "",
            activityName: "",
            teachers: [],
            users: 0,
            tabSelect: "",
            isSaving: false,
            tableLoading: false,
            newDptId: "",
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
                activity: [],
                tutor: [],
                operation: [],
                organization: []
            },
            enumDic: {
                0: "已通过",
                1: "被拒绝",
                2: "自行撤回",
                3: "申请中"
            },
            ruleForBasic: {
                Name: [
                        {
                            required: true,
                            message: "必须填写社团名称",
                            trigger: "blur"
                        }
                    ],
                DepartType: [
                        {
                            required: true,
                            message: "必须填写社团类型",
                            trigger: "change"
                        }
                    ],
                BirthTime: [
                        {
                                required: true,
                                type: "date",
                                message: "必须填写成立时间",
                                trigger: "change"
                        }
                    ],
                Description: [
                    { required: true, message: 'Please fill in the Description', trigger: 'blur' }
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
            memberManage: (h) => {
                    return h('div', [
                        h('span', '成员管理'),
                        h('span', '（' + this.tableData.member.length + '人）')
                    ])
            },
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
            callbackFunc: () => {}
        };
    }
}
</script>

<style lang="less">
.fileInfo {
    margin: 16px;
    height: 60px;
    line-height: 60px;
    border: 1px solid #ccc;
    padding-left: 16px;
    font-size: 16px;
}
.fileBox {
    margin: 10px;
    height: 60px;
    line-height: 60px;
    padding-left: 16px;
    font-size: 16px;
}
h3 {
    padding: 10px 0 0 16px;
    font-weight: normal;
    font-size: 18px;
    color: #666;
}
.uploadBox {
    width: 350px;
    border: 1px solid #ccc;
    margin: 40px auto;
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
</style>

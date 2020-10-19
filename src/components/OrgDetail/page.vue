<template>
    <i-row>
        <!--i-spin fix size="large" v-show="tableLoading"></i-spin-->
        <i-col span="24">
            <i-alert show-icon v-if="!io.isMyStep">
                您正处于查看模式
                <template slot="desc">您只能查看该申请，不能编辑</template>
            </i-alert>
            <i-alert show-icon v-else>
                您正处于编辑模式
                <template slot="desc">您当前正在编辑社团基本信息，请单击“确定”按钮提交修改，单击“取消”按钮或关闭页面以放弃修改。</template>
            </i-alert>
            <i-form :model="io.data" ref="form" :rules="ruleInline">
                <Divider orientation="left">基本信息</Divider>
                <i-row type="flex" justify="space-between">
                    <i-col span="24">
                        <i-form-item label="社团名称" prop="Name">
                            <i-input v-model="io.data.Name" :disabled="io.fieldAccess.Name === 'r' || !io.isMyStep"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="社团类型" prop="DepartType">
                            <dic-select dic="社团类型" :disabled="io.fieldAccess.DepartType === 'r' || !io.isMyStep" v-model="io.data.DepartType" />
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="成立时间" prop="BirthTime">
                            <i-date-picker type="date" :disabled="io.fieldAccess.BirthTime === 'r' || !io.isMyStep" v-model="io.data.BirthTime" format="yyyy年MM月dd日" />
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="部门电话" prop="Phone">
                            <i-input :disabled="io.fieldAccess.Phone === 'r' || !io.isMyStep" v-model="io.data.Phone"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="业务指导单位" prop="ParentId">
                            <org-selector disabled v-model="io.data.ParentId"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex" style="display: none">
                    <i-col span="11">
                        <i-form-item label="排序号" prop="Sort">
                            <i-input disabled v-model="io.data.Sort"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="部门类型">
                            <i-select v-model="io.data.Type" disabled>
                                <i-option :value="0" key="业务指导单位">业务指导单位</i-option>
                                <i-option :value="1" key="社团">社团</i-option>
                            </i-select>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="24">
                        <i-form-item label="社团简介" prop="Description">
                            <i-input :disabled="io.fieldAccess.Description === 'r' || !io.isMyStep" type="textarea" maxlength="300" show-word-limit :autosize="{minRows: 3}" v-model="io.data.Description"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="章程制定时间">
                            <i-switch :disabled="io.fieldAccess.HaveDepartRule === 'r' || !io.isMyStep" v-model="io.data.HaveDepartRule" />
                            <i-date-picker :disabled="!io.data.HaveDepartRule || io.fieldAccess.RuleCreatedOn === 'r' || !io.isMyStep" v-model="io.data.RuleCreatedOn"></i-date-picker>
                            <i-row v-if="io.data.HaveDepartRule" style="margin-top: 10px">
                                <i-upload type="drag" :disabled="!io.data.HaveDepartRule || !io.isMyStep" action="/api/cms/UploadFile" :default-file-list="file"
                                :before-upload="beforeUpload" :on-preview="previewFile" :on-remove="removeUpload"
                                :data="{'usage': 'DepartRule', 'single': true, 'relateTable': 'DepartInfo', 'id': this.io.data.ID, 'fileName': this.fileName}"
                                >
                                    <div v-if="io.fieldAccess.Name === 'w'">
                                        <Icon type="ios-cloud-upload" size="36" style="color: #3399ff"></Icon>
                                        <p>上传社团章程</p>
                                    </div>
                                </i-upload>
                            </i-row>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="团支部成立时间">
                            <i-switch :disabled="io.fieldAccess.HaveLeagueBranch === 'r' || !io.isMyStep" v-model="io.data.HaveLeagueBranch" />
                            <i-date-picker :disabled="!io.data.HaveLeagueBranch || io.fieldAccess.LeagueBrachCreatedOn === 'r' || !io.isMyStep" v-model="io.data.LeagueBrachCreatedOn"></i-date-picker>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="党支部成立时间">
                            <i-switch :disabled="io.fieldAccess.HaveCPCBranch === 'r' || !io.isMyStep" v-model="io.data.HaveCPCBranch" />
                            <i-date-picker :disabled="!io.data.HaveCPCBranch || io.fieldAccess.CPCBranchCreatedOn === 'r' || !io.isMyStep" v-model="io.data.CPCBranchCreatedOn"></i-date-picker>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="党支部类型">
                            <dic-select dic="党支部类型" :disabled="!io.data.HaveCPCBranch || io.fieldAccess.CPCBranchType === 'r' || !io.isMyStep" v-model="io.data.CPCBranchType"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row>
                    <i-form-item label="社团头像">
                        <avatar-uploader
                            :width="128"
                            :height="128"
                            usage="avatar"
                            single
                            :id="io.data.ID"
                            :showText="false"
                            relate-table="DepartInfo"
                            :value="`/api/cms/downloadImage?id=${io.data.ID} `"
                            :disabled="!io.isMyStep || io.fieldAccess.Name === 'r'"
                        />
                    </i-form-item>
                </i-row>
                <Divider orientation="left">指导老师情况</Divider>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="指导老师工号" prop="GuideCode">
                            <i-input placeholder="请输入..." prefix="md-create" :disabled="io.fieldAccess.GuideCode === 'r' || !io.isMyStep"
                            v-model="io.data.GuideCode" @on-blur="searchUser(io.data.GuideCode, 0)"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11"  offset="2">
                        <i-form-item label="指导老师姓名">
                            <i-input :disabled="!searchedTeacher" v-model="io.data.GuideName"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="指导老师产生方式">
                            <i-input :disabled="io.fieldAccess.GuideElectionBy === 'r' || !io.isMyStep" v-model="io.data.GuideElectionBy"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="指导老师有无激励">
                            <i-input :disabled="io.fieldAccess.GuideBonus === 'r' || !io.isMyStep" v-model="io.data.GuideBonus"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="指导教师类别">
                            <i-input :disabled="!searchedTeacher" v-model="io.data.GuideType"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="指导教师政治面貌">
                            <i-input :disabled="!searchedTeacher" v-model="io.data.GuidePolitics"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="指导教师单位">
                            <i-input :disabled="!searchedTeacher" v-model="io.data.GuideDepart"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="指导教师手机">
                            <i-input :disabled="!searchedTeacher" v-model="io.data.GuidePhone"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="指导教师邮箱">
                            <i-input :disabled="!searchedTeacher" v-model="io.data.GuideEmail"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <Divider orientation="left">社团负责人情况</Divider>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="社团负责人学号" prop="ChargerCode">
                            <i-input placeholder="请输入..." prefix="md-create" :disabled="io.fieldAccess.ChargerCode === 'r' || !io.isMyStep"
                            v-model="io.data.ChargerCode" @on-blur="searchUser(io.data.ChargerCode, 1)"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="何时确定为社团负责人">
                            <i-input :disabled="io.fieldAccess.ChargerSelectedOn === 'r' || !io.isMyStep" v-model="io.data.ChargerSelectedOn"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="社团负责人姓名">
                            <i-input :disabled="!searchedCharger" v-model="io.data.ChargerName"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="社团负责人政治面貌">
                            <i-input :disabled="!searchedCharger" v-model="io.data.ChargerPolitics"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="社团负责人学院">
                            <i-input :disabled="!searchedCharger" v-model="io.data.ChargerCollege"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="社团负责人年级专业">
                            <i-input :disabled="!searchedCharger" v-model="io.data.ChargerMajor"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="社团负责人手机">
                            <i-input :disabled="!searchedCharger" v-model="io.data.ChargerPhone"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="社团负责人邮箱">
                            <i-input :disabled="!searchedCharger" v-model="io.data.ChargerEmail"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <Divider orientation="left">社团团支部情况</Divider>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="社团团支部书记学号">
                            <i-input placeholder="请输入..." prefix="md-create" :disabled="io.fieldAccess.ASecretaryCode === 'r' || !io.isMyStep || !io.data.HaveLeagueBranch"
                            v-model="io.data.ASecretaryCode"  @on-blur="searchUser(io.data.ASecretaryCode, 2)"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="何时被确定为社团团支部书记">
                            <i-input :disabled="io.fieldAccess.ASecretarySelectedOn === 'r' || !io.isMyStep || !io.data.HaveLeagueBranch" v-model="io.data.ASecretarySelectedOn"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="社团团支部书记姓名">
                            <i-input :disabled="!searchedASecretary" v-model="io.data.ASecretaryName"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="社团团支部书记所在学院">
                            <i-input :disabled="!searchedASecretary" v-model="io.data.ASecretaryCollege"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="社团团支部书记年级专业">
                            <i-input :disabled="!searchedASecretary" v-model="io.data.ASecretaryMajor"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="社团团支部书记手机">
                            <i-input :disabled="!searchedASecretary" v-model="io.data.ASecretaryPhone"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="社团团支部书记邮箱">
                            <i-input :disabled="!searchedASecretary" v-model="io.data.ASecretaryEmail"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <Divider orientation="left">社团党支部情况</Divider>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="社团党支部书记学号">
                            <i-input placeholder="请输入..." prefix="md-create" :disabled="io.fieldAccess.BSecretaryCode === 'r' || !io.isMyStep || !io.data.HaveCPCBranch"
                            v-model="io.data.BSecretaryCode" @on-blur="searchUser(io.data.BSecretaryCode, 3)"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="何时被确定为社团党支部书记">
                            <i-input :disabled="io.fieldAccess.BSecretarySelectedOn === 'r' || !io.isMyStep || !io.data.HaveCPCBranch" v-model="io.data.BSecretarySelectedOn"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="社团党支部书记姓名">
                            <i-input :disabled="!searchedBSecretary" v-model="io.data.BSecretaryName"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="社团党支部书记所在学院">
                            <i-input :disabled="!searchedBSecretary" v-model="io.data.BSecretaryCollege"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="社团党支部书记年级专业">
                            <i-input :disabled="!searchedBSecretary" v-model="io.data.BSecretaryMajor"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="社团党支部书记手机">
                            <i-input :disabled="!searchedBSecretary" v-model="io.data.BSecretaryPhone"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="社团党支部书记邮箱">
                            <i-input :disabled="!searchedBSecretary" v-model="io.data.BSecretaryEmail"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <Divider orientation="left">宣传平台信息</Divider>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="开通新媒体平台情况">
                            <i-input :disabled="io.fieldAccess.SocialMedia === 'r' || !io.isMyStep" v-model="io.data.SocialMedia" placeholder="媒体平台：账号名称，粉丝数；"/>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="经费来源">
                            <i-input :disabled="io.fieldAccess.ChannelForFunds === 'r' || !io.isMyStep" v-model="io.data.ChannelForFunds"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="24">
                        <i-form-item label="备注1">
                            <i-input :disabled="io.fieldAccess.Name === 'r' || !io.isMyStep" type="textarea" v-model="io.data.Memo"/>
                        </i-form-item>
                        <i-form-item label="备注2">
                            <i-input :disabled="io.fieldAccess.Name === 'r' || !io.isMyStep" type="textarea" v-model="io.data.Remark"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <Divider orientation="left" v-if="io.fieldAccess.GuideTeacherOpinion">指导老师审核</Divider>
                <i-row type="flex">
                    <div v-show="io.fieldAccess.GuideTeacherIsPass === 'w' && io.isMyStep">
                        是否通过：
                        <i-radio-group v-model="io.data.GuideTeacherIsPass">
                            <i-radio label="true" class="iview-type-size" :disabled="io.fieldAccess.GuideTeacherOpinion === 'r' || !io.isMyStep"> 是</i-radio>
                            <i-radio label="false" class="iview-type-size" :disabled="io.fieldAccess.GuideTeacherOpinion === 'r' || !io.isMyStep">否</i-radio>
                        </i-radio-group>
                        <i-button type="primary" size="small" class="button-position" :disabled="io.fieldAccess.GuideTeacherOpinion === 'r' || !io.isMyStep" @click="submit">确认</i-button>
                    </div>
                    <i-input type="textarea" class="opinionForm" :rows="3" placeholder="（审核意见）" v-model="io.data.GuideTeacherOpinion" v-if="io.fieldAccess.GuideTeacherOpinion === 'w' && io.isMyStep"/>
                    <p v-else-if="io.fieldAccess.GuideTeacherOpinion === 'r'">指导老师审核意见：{{io.data.GuideTeacherOpinion===""?"无审核意见":io.data.GuideTeacherOpinion}}</p>
                    <div class="wen-zi-ju-you" v-if="io.fieldAccess.GuideTeacherOpinion">
                        <p >审核人（签名）：<i-input v-model="io.data.GuideTeacher" v-if="io.fieldAccess.GuideTeacher === 'w' && io.isMyStep"/>
                            <span v-else>{{io.data.GuideTeacher}}</span>
                        </p>
                        <i-date-picker type="date" format="yyyy年MM月dd日" placeholder="审核时间" v-model="io.data.GuideTeacherTime" v-if="io.fieldAccess.GuideTeacherTime === 'w' && io.isMyStep"/>
                        <p v-else>{{io.data.GuideTeacherTime}}</p>
                    </div>
                </i-row>
                <Divider orientation="left" v-if="io.fieldAccess.AffiliatedDepartOpinion">业务指导单位审核</Divider>
                <div v-show="io.fieldAccess.AffiliatedDepartIsPass === 'w' && io.isMyStep">
                    是否通过：
                    <i-radio-group v-model="io.data.AffiliatedDepartIsPass">
                        <i-radio label="true" class="iview-type-size" :disabled="io.fieldAccess.AffiliatedDepartOpinion === 'r' || !io.isMyStep"> 是</i-radio>
                        <i-radio label="false" class="iview-type-size" :disabled="io.fieldAccess.AffiliatedDepartOpinion === 'r' || !io.isMyStep">否</i-radio>
                    </i-radio-group>
                    <i-button type="primary" size="small" class="button-position" :disabled="io.fieldAccess.AffiliatedDepartOpinion === 'r' || !io.isMyStep" @click="submit">确认</i-button>
                </div>
                <i-input type="textarea" class="opinionForm" :rows="3" placeholder="（审核意见）" v-model="io.data.AffiliatedDepartOpinion" v-if="io.fieldAccess.AffiliatedDepartOpinion === 'w' && io.isMyStep"/>
                <p v-else-if="io.fieldAccess.AffiliatedDepartOpinion==='r'">业务指导单位审核意见:{{io.data.AffiliatedDepartOpinion===""?"无审核意见":io.data.AffiliatedDepartOpinion}}</p>
                <div class="wen-zi-ju-you" v-if="io.fieldAccess.AffiliatedDepartOpinion">
                    <p>审核人（签名）：<i-input v-model="io.data.AffiliatedDepart" v-if="io.fieldAccess.AffiliatedDepart === 'w' && io.isMyStep"/>
                        <span v-else>{{io.data.AffiliatedDepart}}</span>
                    </p>
                    <i-date-picker v-model="io.data.AffiliatedDepartTime" type="date" format="yyyy年MM月dd日" placeholder="审核时间" v-if="io.fieldAccess.AffiliatedDepartTime === 'w' && io.isMyStep"/>
                    <p v-else>{{io.data.AffiliatedDepartTime}}</p>
                </div>
                <Divider orientation="left" v-if="io.fieldAccess.SauOpinion">学生社团管理部审核</Divider>
                <div v-show="io.fieldAccess.SauIsPass === 'w' && io.isMyStep">
                    是否通过：
                    <i-radio-group v-model="io.data.SauIsPass">
                        <i-radio label="true" class="iview-type-size" :disabled="io.fieldAccess.SauOpinion === 'r' || !io.isMyStep"> 是</i-radio>
                        <i-radio label="false" class="iview-type-size" :disabled="io.fieldAccess.SauOpinion === 'r' || !io.isMyStep">否</i-radio>
                    </i-radio-group>
                    <i-button type="primary" size="small" class="button-position" :disabled="io.fieldAccess.SauOpinion === 'r' || !io.isMyStep" @click="submit">确认</i-button>
                </div>
                <i-input type="textarea" class="opinionForm" :rows="3" placeholder="（审核意见）" v-model="io.data.SauOpinion" v-if="io.fieldAccess.SauOpinion === 'w' && io.isMyStep"/>
                <p v-else-if="io.fieldAccess.SauOpinion==='r'">学生社团管理部审核意见:{{io.data.SauOpinion===""?"无审核意见":io.data.SauOpinion}}</p>
                <div class="wen-zi-ju-you" v-if="io.fieldAccess.SauOpinion">
                    <p>审核人（签名）：<i-input v-model="io.data.Sau" v-if="io.fieldAccess.Sau === 'w' && io.isMyStep"/>
                        <span v-else>{{io.data.Sau}}</span>
                    </p>
                    <i-date-picker v-model="io.data.SauTime" type="date" format="yyyy年MM月dd日" placeholder="审核时间" v-if="io.fieldAccess.SauTime === 'w' && io.isMyStep"/>
                    <p v-else>{{io.data.SauTime}}</p>
                </div>
                <Divider orientation="left" v-if="io.fieldAccess.YlcOpinion">校团委审核</Divider>
                <div v-show="io.fieldAccess.YlcIsPass === 'w' && io.isMyStep">
                    是否通过：
                    <i-radio-group v-model="io.data.YlcIsPass">
                        <i-radio label="true" class="iview-type-size" :disabled="io.fieldAccess.YlcOpinion === 'r' || !io.isMyStep"> 是</i-radio>
                        <i-radio label="false" class="iview-type-size" :disabled="io.fieldAccess.YlcOpinion === 'r' || !io.isMyStep">否</i-radio>
                    </i-radio-group>
                    <i-button type="primary" size="small" class="button-position" :disabled="io.fieldAccess.YlcOpinion === 'r' || !io.isMyStep" @click="submit">确认</i-button>
                </div>
                <i-input type="textarea" class="opinionForm" :rows="3" placeholder="（审核意见）" v-model="io.data.YlcOpinion" v-if="io.fieldAccess.YlcOpinion === 'w' && io.isMyStep"/>
                <p v-else-if="io.fieldAccess.YlcOpinion==='r'">校团委审核意见:{{io.data.YlcOpinion===""?"无审核意见":io.data.YlcOpinion}}</p>
                <div class="wen-zi-ju-you" v-if="io.fieldAccess.YlcOpinion">
                    <p>审核人（签名）：<i-input v-model="io.data.Ylc" v-if="io.fieldAccess.Ylc === 'w' && io.isMyStep"/>
                        <span v-else>{{io.data.Ylc}}</span>
                    </p>
                    <i-date-picker v-model="io.data.YlcTime" type="date" format="yyyy年MM月dd日" placeholder="审核时间" v-if="io.fieldAccess.YlcTime === 'w' && io.isMyStep"/>
                    <p v-else>{{io.data.YlcTime}}</p>
                </div>
            </i-form>
            <i-row style="margin-top: 40px;">
                <template v-if="io.isMyStep && io.currentStep==='填写申请表'">
                    <i-button @click="submit" type="primary">提交修改</i-button>
                    <i-button @click="giveUp">放弃修改</i-button>
                </template>
            </i-row>
            <i-divider style="padding: 20px 0px" orientation="center">时间轴</i-divider>
            <i-row>
                <i-timeline>
                    <TimelineItem v-for="(item,index) in io.timelines" :key="index">
                        <i-row class="time">
                            <i-col>
                                <p>{{item.Key}}</p>
                            </i-col>
                        </i-row>
                        <i-row v-for="(item,index) in item.steps" :key="index" class="content">
                            <Alert v-if="item.State !== 0 && item.State !== 1" show-icon :type="icons[item.State]">{{item.StepName}}于{{item.CreatedOn}}{{item.Time}}由{{item.ExecutorName}}{{stepInfo[item.State]}}</Alert>
                            <Alert v-else show-icon>{{item.StepName}}于{{item.CreatedOn}}{{item.Time}}由{{item.ExecutorName}}{{stepInfo[item.State]}}</Alert>
                        </i-row>
                    </TimelineItem>
                </i-timeline>
            </i-row>
        </i-col>
    </i-row>
</template>

<script>
const axios = require("axios");
const enums = require("@/config/enums");
export default {
    mounted () {
        this.getFile();
    },
    props: {
        io: {
            type: Object,
            required: true,
            default () {
                return {
                    fieldAccess: {},
                    data: {}
                }
            }
        }
    },
    model: {
        prop: 'io',
        event: 'change'
    },
    data () {
        return {
            searchedTeacher: false,
            searchedCharger: false,
            searchedASecretary: false,
            searchedBSecretary: false,
            file: [],
            fileName: "",
            stepInfo: enums.stepInfo,
            upLoad: {},
            icons: [
                "",
                "",
                "success",
                "success",
                "error",
                "warning"
            ],
            ruleInline: {
                Description: [
                    { required: true, message: '必须填写社团简介', trigger: 'blur' }
                ],
                GuideCode: [
                    { required: true, message: '必须填写指导老师工号', trigger: 'blur' }
                ],
                ChargerCode: [
                    { required: true, message: '必须填写社团管理员学号', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        searchUser (code, i) {
            axios.post("/api/security/GetUserByCode", {code: code}, msg => {
                if (msg.success) {
                    if (i === 0) {
                        this.io.data.GuideName = msg.user.RealName;
                        this.io.data.GuideType = msg.user.GuideTeacherType;
                        this.io.data.GuidePolitics = msg.user.PoliticalStatus;
                        this.io.data.GuideDepart = msg.user.BelongDepart;
                        this.io.data.GuidePhone = msg.user.Mobile;
                        // this.io.data.GuideElectionBy = msg.user.
                        // this.io.data.GuideBonus = msg.user.
                        this.io.data.GuideEmail = msg.user.Email;
                        this.searchedTeacher = false;
                    } else if (i === 1) {
                        this.io.data.ChargerName = msg.user.RealName;
                        this.io.data.ChargerPolitics = msg.user.PoliticalStatus;
                        this.io.data.ChargerCollege = msg.user.BelongDepart;
                        this.io.data.ChargerMajor = msg.user.Specialty;
                        this.io.data.ChargerPhone = msg.user.Mobile;
                        this.io.data.ChargerEmail = msg.user.Email;
                        this.searchedCharger = false;
                    } else if (i === 2) {
                        this.io.data.ASecretaryName = msg.user.RealName;
                        this.io.data.ASecretaryCollege = msg.user.BelongDepart;
                        this.io.data.ASecretaryMajor = msg.user.Specialty;
                        this.io.data.ASecretaryPhone = msg.user.Mobile;
                        this.io.data.ASecretaryEmail = msg.user.Email;
                        this.searchedASecretary = false;
                    } else if (i === 3) {
                        this.io.data.BSecretaryName = msg.user.RealName;
                        this.io.data.BSecretaryCollege = msg.user.BelongDepart;
                        this.io.data.BSecretaryMajor = msg.user.Specialty;
                        this.io.data.BSecretaryPhone = msg.user.Mobile;
                        this.io.data.BSecretaryEmail = msg.user.Email;
                        this.searchedBSecretary = false;
                    }
                } else {
                    this.$Message.error(msg.msg + ",请自行填写相关数据项。");
                    if (i === 0) {
                        this.searchedTeacher = true;
                    } else if (i === 1) {
                        this.searchedCharger = true;
                    } else if (i === 2) {
                        this.searchedASecretary = true;
                    } else if (i === 3) {
                        this.searchedBSecretary = true;
                    }
                }
            });
        },
        getFile () {
            axios.post("/api/cms/GetAttachments", {id: this.io.data.ID, relateTable: "DepartInfo", usage: "DepartRule"}, msg => {
                if (msg.success) {
                    // console.log(msg);
                    this.file = msg.data.map(e => {
                        return {
                            name: e.DisplayName,
                            id: e.ID
                        }
                    });
                }
            });
        },
        removeUpload (file) {
            axios.post("/api/cms/RemoveAttachment", {id: file.id || file.response.id}, msg => {
                if (msg.success) {
                    this.$Message.success('删除文件成功');
                    this.getFile();
                }
            })
        },
        async beforeUpload (file) {
            this.fileName = file.name;
            await this.$nextTick();
        },
        previewFile (file) {
            const { href } = this.$router.resolve({
                path: "/api/cms/Download",
                query: {
                    id: file.id || file.response.id
                }
            });
            window.open(href);
        },
        giveUp () {
        },
        submit () {
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    this.$Message.error('请完整填写表单!');
                } else {
                    this.io.shouldUpload.forEach(value => {
                        this.upLoad[value] = this.io[value] || this.io.data[value];
                    });
                    axios.postStream("/api/workflow/SubmitInstance", {
                        ...this.upLoad
                    }, msg => {
                        if (msg.success) {
                            this.$Message.success("提交成功，3秒后关闭页面");
                            setTimeout(function () {
                                window.close();
                            }, 3000);
                        } else {
                            this.$Message.warning(msg.msg);
                        }
                        //  setTimeout(window.close(), 8000);
                    })
                }
            })
        }
    },
    watch: {
        io: {
            handler (newValue) {
                this.$emit('change', newValue);
            },
            deep: true
        },
        'io.data.ID' (newValue) {
            if (newValue) {
                this.getFile();
            }
        }
    }
}
</script>

<style scoped>
.ivu-form-item .ivu-date-picker{
    width: 100%;
}
.time{
    font-size: 14px;
    font-weight: bold;
}
.content{
    padding-left: 5px;
}
.wen-zi-ju-you{
    width: 100%;
    text-align: right;
}
.opinionForm{
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>

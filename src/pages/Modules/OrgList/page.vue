<template>
    <i-row id="OrgList">
        <i-card style="margin: 20px 50px;" title="社团列表" :padding="24">
            <template v-slot:extra>
                <i-row type="flex" :gutter="16">
                    <i-col>
                        <i-button type="primary" @click="showModal = true">新建社团</i-button>
                    </i-col>
                    <i-col>
                        <i-input search placeholder="搜索社团名" @on-search="searchOrganization" />
                    </i-col>
                </i-row>
            </template>
            <i-row>
                <i-table :max-height="contentHeight" border stripe :columns="organizationCol" :data="organizationSearched" :loading="tableLoading">
                    <template slot="Action" slot-scope="{row}">
                        <i-button @click="viewOrg(row.id)">查看</i-button>
                    </template>
                </i-table>
            </i-row>
        </i-card>
        <i-modal title="新建社团" v-model="showModal" :scrollable="true">
            <i-form :model="orgModel" ref="form" :rules="rules">
                <i-row type="flex" justify="space-around">
                    <i-col>
                        <i-form-item label="序号" prop="order">
                            <i-input v-model="orgModel.order" />
                        </i-form-item>
                    </i-col>
                    <i-col>
                        <i-form-item label="社团名称" prop="name">
                            <i-input v-model="orgModel.name" />
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex" justify="space-around">
                    <i-col>
                        <i-form-item label="社团类型" prop="type">
                            <i-input v-model="orgModel.type" />
                        </i-form-item>
                    </i-col>
                    <i-col>
                        <i-form-item label="业务指导单位" prop="parentDepartName">
                            <i-input v-model="orgModel.parentDepartName" />
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex" justify="space-around">
                    <i-col>
                        <i-form-item label="业务指导单位管理员姓名" prop="parentDepartAdminName">
                            <i-input v-model="orgModel.parentDepartAdminName" />
                        </i-form-item>
                    </i-col>
                    <i-col>
                        <i-form-item label="业务指导单位管理员教工号" prop="parentDepartAdminCode">
                            <i-input v-model="orgModel.parentDepartAdminCode" />
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex" justify="space-around">
                    <i-col>
                        <i-form-item label="指导老师姓名" prop="guideTeachers">
                            <i-input v-model="orgModel.guideTeachers" />
                        </i-form-item>
                    </i-col>
                    <i-col>
                        <i-form-item label="指导老师教工号" prop="guideTeacherCodes">
                            <i-input v-model="orgModel.guideTeacherCodes" />
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex" justify="space-around">
                    <i-col>
                        <i-form-item label="社团管理员姓名" prop="departAdminName">
                            <i-input v-model="orgModel.departAdminName" />
                        </i-form-item>
                    </i-col>
                    <i-col>
                        <i-form-item label="社团管理员学号" prop="departAdminCode">
                            <i-input v-model="orgModel.departAdminCode" />
                        </i-form-item>
                    </i-col>
                </i-row>
                <!--i-row type="flex" justify="space-around">
                    <i-col>
                        <i-form-item label="社团管理员学号" prop="departAdminCode">
                            <i-input v-model="orgModel.departAdminCode" />
                        </i-form-item>
                    </i-col>
                    <i-col>
                        <i-form-item style="visibility: hidden;">
                            <i-input v-model="orgModel.departAdminCode" />
                        </i-form-item>
                    </i-col>
                </i-row-->
            </i-form>
            <template v-slot:footer>
                <i-button type="primary" @click="addOrg" :loading="submitingOrg">新建</i-button>
            </template>
        </i-modal>
    </i-row>
</template>

<script>
import axios from 'axios';
import tableColumns from '../ManageIndex/tableColumns';
const app = require("@/config");
export default {
    data () {
        return {
            app,
            showModal: false,
            submitingOrg: false,
            contentHeight: 0,
            organizationSearched: [],
            organizationData: [],
            organizationCol: tableColumns.organization,
            tableLoading: false,
            orgModel: {
                order: '',
                name: '',
                type: '',
                parentDepartName: '',
                parentDepartAdminName: '',
                parentDepartAdminCode: '',
                guideTeachers: '',
                guideTeacherCodes: '',
                departAdminName: '',
                departAdminCode: ''
            },
            rules: {
                order: [
                    {required: true, message: "必须填写序号", trigger: "blur"}
                ],
                name: [
                    {required: true, message: "必须填写社团名称", trigger: "blur"}
                ],
                type: [
                    {required: true, message: "必须填写社团类型", trigger: "blur"}
                ],
                parentDepartName: [
                    {required: true, message: "必须填写业务指导单位", trigger: "blur"}
                ],
                parentDepartAdminName: [
                    {required: true, message: "必须填写业务指导单位管理员姓名", trigger: "blur"}
                ],
                parentDepartAdminCode: [
                    {required: true, message: "必须填写业务指导单位管理员教工号", trigger: "blur"}
                ],
                guideTeachers: [
                    {required: true, message: "必须填写指导老师姓名", trigger: "blur"}
                ],
                guideTeacherCodes: [
                    {required: true, message: "必须填写指导老师教工号", trigger: "blur"}
                ],
                departAdminName: [
                    {required: true, message: "必须填写社团管理员姓名", trigger: "blur"}
                ],
                departAdminCode: [
                    {required: true, message: "必须填写社团管理员学号", trigger: "blur"}
                ]
            }
        }
    },
    methods: {
        getDashBoard () {
            this.tableLoading = true;
            axios.post("/api/security/GetAllAssociationsByDepartId", {departId: localStorage.getItem("defaultDepartId")}, msg => {
                if (msg.success) {
                    this.organizationData = msg.data;
                    this.organizationSearched = this.organizationData;
                    this.$nextTick(() => {
                        this.contentHeight = window.innerHeight * 0.8;
                    })
                }
                this.tableLoading = false;
            });
        },
        searchOrganization (value) {
            this.organizationSearched = this.organizationData.filter(e => e.name.indexOf(value) > -1);
        },
        viewOrg (id) {
            this.$router.push({
                name: 'OrgDetail',
                query: {
                    id
                }
            });
        },
        addOrg () {
            this.submitingOrg = true;
            let form = this.$refs["form"];
            form.validate(res => {
                if (!res) {
                    this.submitingOrg = false;
                    return
                }
                axios.post("/api/security/UpdateOrg", {
                    ...this.orgModel
                }, async msg => {
                    if (msg.success) {
                        await axios.post("/api/security/UpdateAllOrgs", {});
                        this.$Message.success('成功新建社团');
                        this.showModal = false;
                        form.resetFields();
                        this.getDashBoard();
                    } else {
                        this.$Message.warning(msg.msg);
                    }
                    this.submitingOrg = false;
                });
            })
        }
    },
    mounted () {
        app.title = "社团列表";
        this.getDashBoard();
    }
}
</script>

<style scoped>

</style>

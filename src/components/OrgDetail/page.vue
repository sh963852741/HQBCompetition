<template>
    <i-row>
        <i-col span="24">
            <i-alert show-icon v-if="!io.isMyStep">
                您正处于查看模式
                <template slot="desc">您只能查看该申请，不能编辑</template>
            </i-alert>
            <i-alert show-icon v-else>
                您正处于编辑模式
                <template slot="desc">您当前正在编辑社团基本信息，请单击“确定”按钮提交修改，单击“取消”按钮或关闭页面以放弃修改。</template>
            </i-alert>
            <i-form :model="io.data" ref="form">
                <i-row type="flex" justify="space-between">
                    <i-col span="24">
                        <i-form-item label="企业名字" prop="ApplicantName">
                            <i-input v-model="io.data.ApplicantName" :disabled="io.fieldAccess.ApplicantName === 'r' || !io.isMyStep"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="企业财报" prop="FinancialReport">
                            <i-upload :disabled="io.fieldAccess.FinancialReport === 'r' || !io.isMyStep" v-model="io.data.FinancialReport"
                            :before-upload="beforeUpload" :on-preview="previewFile" :on-remove="removeUpload" action="/api/cms/UploadFile" :default-file-list="financialReport"
                            :data="{'usage': 'FinancialReport', 'single': true, 'relateTable': 'Estimation', 'id': this.io.data.ID, 'fileName': this.fileName}">
                                <i-button>上传</i-button>
                            </i-upload>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="企业专利" prop="Patent">
                            <i-upload :disabled="io.fieldAccess.Patent === 'r' || !io.isMyStep" v-model="io.data.Patent"
                            :before-upload="beforeUpload" :on-preview="previewFile" :on-remove="removeUpload" action="/api/cms/UploadFile" :default-file-list="patent"
                            :data="{'usage': 'FinancialReport', 'single': true, 'relateTable': 'Estimation', 'id': this.io.data.ID, 'fileName': this.fileName}">
                                <i-button>上传</i-button>
                            </i-upload>
                        </i-form-item>
                    </i-col>
                </i-row>
                <i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="法律纠纷" prop="LegalDisputes">
                            <i-upload :disabled="io.fieldAccess.LegalDisputes === 'r' || !io.isMyStep" v-model="io.data.LegalDisputes"
                            :before-upload="beforeUpload" :on-preview="previewFile" :on-remove="removeUpload" action="/api/cms/UploadFile" :default-file-list="legalDisputes"
                            :data="{'usage': 'FinancialReport', 'single': true, 'relateTable': 'Estimation', 'id': this.io.data.ID, 'fileName': this.fileName}">
                                <i-button>上传</i-button>
                            </i-upload>
                        </i-form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <i-form-item label="最终估值" prop="Value">
                            <i-input :disabled="io.fieldAccess.Value === 'r' || !io.isMyStep" v-model="io.data.Value"/>
                        </i-form-item>
                    </i-col>
                </i-row>
                <!--i-row type="flex">
                    <i-col span="11">
                        <i-form-item label="章程制定时间">
                            <i-switch :disabled="io.fieldAccess.HaveDepartRule === 'r' || !io.isMyStep" v-model="io.data.HaveDepartRule" />
                            <i-date-picker :disabled="!io.data.HaveDepartRule || io.fieldAccess.RuleCreatedOn === 'r' || !io.isMyStep" v-model="io.data.RuleCreatedOn"></i-date-picker>
                            <i-row v-if="io.data.HaveDepartRule" style="margin-top: 10px">
                                <i-upload type="drag" :disabled="!io.data.HaveDepartRule || !io.isMyStep" action="/api/cms/UploadFile" :default-file-list="file"
                                :before-upload="beforeUpload" :on-preview="previewFile" :on-remove="removeUpload"
                                :data="{'usage': 'DepartRule', 'single': true, 'relateTable': 'Estimation', 'id': this.io.data.ID, 'fileName': this.fileName}"
                                >
                                    <div v-if="io.fieldAccess.Name === 'w'">
                                        <Icon type="ios-cloud-upload" size="36" style="color: #3399ff"></Icon>
                                        <p>上传社团章程</p>
                                    </div>
                                </i-upload>
                            </i-row>
                        </i-form-item>
                    </i-col>
                </i-row-->
            </i-form>
            <i-row style="margin-top: 40px;">
                <template v-if="io.isMyStep">
                    <i-button @click="submit" type="primary">提交申请</i-button>
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
            fileName: '',
            financialReport: [],
            patent: [],
            legalDisputes: [],
            stepInfo: enums.stepInfo,
            upLoad: {},
            icons: [
                "",
                "",
                "success",
                "success",
                "error",
                "warning"
            ]
        }
    },
    methods: {
        getFile () {
            axios.post("/api/cms/GetAttachments", {id: this.io.data.ID, relateTable: "Estimation", usage: "FinancialReport"}, msg => {
                if (msg.success) {
                    this.financialReport = msg.data.map(e => {
                        return {
                            name: e.DisplayName,
                            id: e.ID
                        }
                    });
                }
            });
            axios.post("/api/cms/GetAttachments", {id: this.io.data.ID, relateTable: "Estimation", usage: "Patent"}, msg => {
                if (msg.success) {
                    this.patent = msg.data.map(e => {
                        return {
                            name: e.DisplayName,
                            id: e.ID
                        }
                    });
                }
            });
            axios.post("/api/cms/GetAttachments", {id: this.io.data.ID, relateTable: "Estimation", usage: "LegalDisputes"}, msg => {
                if (msg.success) {
                    this.legalDisputes = msg.data.map(e => {
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
                            this.$Message.error(msg.msg);
                        }
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

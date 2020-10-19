<template>
    <i-row>
        <i-card title="上传文件" style="margin-top: 24px">
            <i-row type="flex" justify="space-between">
                <i-col span="17">
                    <i-row type="flex" :gutter="24">
                        <i-col span="3">
                            <Upload action="" accept=".xls,.xlsx" :before-upload="readFile">
                                <Button :disabled="isUploading">导入文件</Button>
                            </Upload>
                        </i-col>
                        <i-col span="5">
                            <Progress v-if="showReadProgress" :percent="readPercent">
                                <span>已导入</span>
                            </Progress>
                        </i-col>
                    </i-row>
                    <i-divider size="small" style="margin: 8px 0px;" />
                    <i-row v-if="file.size">
                        <span>文件名：{{file.name}}</span>
                        <span style="margin-left: 16px;">文件大小：{{file.size}}KB</span>
                        <span style="margin-left: 16px;">修改日期：{{new Date(file.lastModifiedDate).toLocaleString()}}</span>
                        <br>
                        <Button style="margin-top: 5px;" type="primary" :disabled="containError" @click="uploadOrgInfo" :loading="isUploading">上传社团信息</Button>
                        <Progress v-if="showUploadProgress" :percent="uploadPercent"></Progress>
                    </i-row>
                </i-col>
                <i-col span="5" offset="2">
                    <Steps :current="currentStep" direction="vertical">
                        <Step title="导入Excel" content="选择本地Excel文件"></Step>
                        <Step title="上传社团信息" content="将社团信息上传至服务器，需要花费一些时间"></Step>
                    </Steps>
                </i-col>
            </i-row>
        </i-card>
        <i-card style="margin-top: 16px" title="文件内容">
            <List>
                <ListItem v-for="(error, index) in errorArray" :key="index">
                    <i-row style="width: 100%">{{error.errLevel}}：{{error.title}}</i-row>
                    <!--template v-slot:action>
                        <i-button v-if="error.type === 101">去除空格（未实现）</i-button>
                    </template-->
                </ListItem>
            </List>
            <i-table :columns="tableTitle" :data="tableData">
                <template v-slot:Order="data">
                    <Icon :type="data.row.icon" :color="data.row.color" />{{data.row.序号}}
                </template>
            </i-table>
        </i-card>
    </i-row>
</template>

<script>
import excel from '@/../libs/excel'
const axios = require("axios");
export default {
    data () {
        return {
            file: {},
            progressPercent: 0,
            tableData: [],
            tableTitle: [],
            readPercent: 0,
            uploadPercent: 0,
            showReadProgress: false,
            showUploadProgress: false,
            isUploading: false,
            currentStep: 0,
            targetTableHead: [
                "序号", "社团名称", "社团类型", "业务指导单位", "业务指导单位管理员姓名", "业务指导单位管理员教工号", "指导老师姓名", "指导老师教工号", "社团管理员姓名", "社团管理员学号"
            ],
            errorArray: [],
            containError: false
        }
    },
    methods: {
        verifyTable () {
            this.errorArray = [];
            this.containError = false;
            /* 表头部分 */
            if (this.targetTableHead.length !== this.tableTitle.length) {
                this.errorArray.push({
                    errLevel: '错误',
                    title: `表格应有${this.targetTableHead.length}个字段，他们分别是${this.targetTableHead}。但是传入的Excel拥有${this.tableTitle.length}个字段。`,
                    detail: ''
                });
                this.containError = true;
                return;
            }
            for (let index in this.tableTitle) {
                if (this.tableTitle[index].title !== this.targetTableHead[index]) {
                    if (this.tableTitle[index].title.replace(/\s+/g, "") === this.targetTableHead[index]) { // 表头由于空格而不等
                        this.errorArray.push({
                            errLevel: '警告',
                            type: 101,
                            title: `表头第${parseInt(index) + 1}个字段${this.tableTitle[index].title}不应该含有任何空白字符（例如空格等）。`,
                            detail: ''
                        });
                    } else {
                        this.errorArray.push({
                            errLevel: '错误',
                            title: `表头第${parseInt(index) + 1}个字段名应为${this.targetTableHead[index]}而不是${this.tableTitle[index].title}。`,
                            detail: ''
                        });
                        this.containError = true;
                    }
                }
            }
            /* 表格内容 */
            if (this.containError) return; // 表头出错时不继续检查接下来的内容
            for (let index in this.tableData) {
                /* 去除所有字段空格 */
                for (let key in this.tableData[index]) {
                    this.tableData[index][key] = this.tableData[index][key].replace(/\s+/g, "");
                }

                /* 检查序号 */
                if (!/\d+/.test(this.tableData[index].序号)) {
                    this.errorArray.push({
                        errLevel: '错误',
                        title: `第${parseInt(index) + 1}项数据的“序号”字段应为连续不间断的数字，而非${this.tableData[index].序号}。`,
                        detail: ''
                    });
                    this.containError = true;
                }

                /* 检查社团名称 */
                if (/\s/.test(this.tableData[index].社团名称)) {
                    this.errorArray.push({
                        errLevel: '警告',
                        type: 101,
                        title: `第${parseInt(index) + 1}项数据的“社团名称”字段不应该含有任何空白字符（例如空格等）。`,
                        detail: ''
                    });
                }

                /* 检查社团类型 */
                if (/\s/.test(this.tableData[index].社团类型)) {
                    this.errorArray.push({
                        errLevel: '警告',
                        type: 101,
                        title: `第${parseInt(index) + 1}项数据的“社团类型”字段不应该含有任何空白字符（例如空格等）。`,
                        detail: ''
                    });
                }

                /* 检查业务指导单位 */
                if (/\s/.test(this.tableData[index].业务指导单位)) {
                    this.errorArray.push({
                        errLevel: '警告',
                        type: 101,
                        title: `第${parseInt(index) + 1}项数据的“业务指导单位”字段不应该含有任何空白字符（例如空格等）。`,
                        detail: ''
                    });
                }

                /* 检查业务指导单位管理员姓名 */
                if (/\s/.test(this.tableData[index].业务指导单位管理员姓名)) {
                    this.errorArray.push({
                        errLevel: '警告',
                        type: 101,
                        title: `第${parseInt(index) + 1}项数据的“业务指导单位管理员姓名”字段不应该含有任何空白字符（例如空格等）。`,
                        detail: ''
                    });
                }

                /* 检查业务指导单位管理员教工号 */
                if (/\s/.test(this.tableData[index].业务指导单位管理员教工号)) {
                    this.errorArray.push({
                        errLevel: '警告',
                        type: 101,
                        title: `第${parseInt(index) + 1}项数据的“业务指导单位管理员教工号”字段不应该含有任何空白字符（例如空格等）。`,
                        detail: ''
                    });
                }

                /* 检查指导老师姓名 */
                if (/\s/.test(this.tableData[index].指导老师姓名)) {
                    this.errorArray.push({
                        errLevel: '警告',
                        type: 101,
                        title: `第${parseInt(index) + 1}项数据的“指导老师姓名”字段不应该含有任何空白字符（例如空格等）。`,
                        detail: ''
                    });
                }

                /* 检查指导老师教工号 */
                if (/\s/.test(this.tableData[index].指导老师教工号)) {
                    this.errorArray.push({
                        errLevel: '警告',
                        type: 101,
                        title: `第${parseInt(index) + 1}项数据的“指导老师教工号”字段不应该含有任何空白字符（例如空格等）。`,
                        detail: ''
                    });
                }

                /* 检查社团管理员姓名 */
                if (/\s/.test(this.tableData[index].社团管理员姓名)) {
                    this.errorArray.push({
                        errLevel: '警告',
                        type: 101,
                        title: `第${parseInt(index) + 1}项数据的“社团管理员姓名”字段不应该含有任何空白字符（例如空格等）。`,
                        detail: ''
                    });
                }

                /* 检查社团管理员学号 */
                if (/\s/.test(this.tableData[index].社团管理员学号)) {
                    this.errorArray.push({
                        errLevel: '警告',
                        type: 101,
                        title: `第${parseInt(index) + 1}项数据的“社团管理员学号”字段不应该含有任何空白字符（例如空格等）。`,
                        detail: ''
                    });
                }

                /* 检查姓名和学/工号数目是否相等 */
                let orgAdminCount = this.tableData[index].社团管理员姓名 ? this.tableData[index].社团管理员姓名.toString().split(/[/\\、]/).length : 0;
                let orgAdminCodeCount = this.tableData[index].社团管理员学号 ? this.tableData[index].社团管理员学号.toString().split(/[/\\、]/).length : 0;
                if (orgAdminCount !== orgAdminCodeCount) {
                    this.errorArray.push({
                        errLevel: '错误',
                        title: `第${parseInt(index) + 1}行数据，填写了${orgAdminCount}位社团管理员，却填写了${orgAdminCodeCount}个学号。`,
                        detail: ''
                    });
                    this.containError = true;
                }

                let teacherCount = this.tableData[index].指导老师姓名 ? this.tableData[index].指导老师姓名.toString().split(/[/\\、]/).length : 0;
                let teacherCodeCount = this.tableData[index].指导老师教工号 ? this.tableData[index].指导老师教工号.toString().split(/[/\\、]/).length : 0;
                if (teacherCount !== teacherCodeCount) {
                    this.errorArray.push({
                        errLevel: '错误',
                        title: `第${parseInt(index) + 1}行数据，填写了${teacherCount}位指导老师，却填写了${teacherCodeCount}个工号。`,
                        detail: ''
                    });
                    this.containError = true;
                }

                let dptAdminCount = this.tableData[index].业务指导单位管理员姓名 ? this.tableData[index].业务指导单位管理员姓名.toString().split(/[/\\、]/).length : 0;
                let dptAdminCodeCount = this.tableData[index].业务指导单位管理员教工号 ? this.tableData[index].业务指导单位管理员教工号.toString().split(/[/\\、]/).length : 0;
                if (dptAdminCount !== dptAdminCodeCount) {
                    this.errorArray.push({
                        errLevel: '错误',
                        title: `第${parseInt(index) + 1}行数据，填写了${dptAdminCount}位业务指导单位管理员，却填写了${dptAdminCodeCount}个工号。`,
                        detail: ''
                    });
                    this.containError = true;
                }
            }
        },
        readFile (file) {
            this.file = file;
            this.readExcel(file);
            return false;
        },
        // 读取文件
        readExcel (file) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadstart = e => {
                /* this.uploadLoading = true
                this.tableLoading = true */
                this.showReadProgress = true;
                this.showUploadProgress = false;
                this.currentStep = 1;
            }
            reader.onprogress = e => {
                this.readPercent = Math.round(e.loaded / e.total * 100);
            }
            reader.onerror = e => {
                this.$Message.error('文件读取出错');
            }
            reader.onload = e => {
                const data = e.target.result;
                const { header, results } = excel.read(data, 'array');
                console.log(header, results);
                const tableTitle = header.map(item => { return { title: item, key: item } });

                tableTitle[0].slot = "Order";
                for (let item of results) {
                    item.icon = "";
                }

                this.tableData = results;
                this.tableTitle = tableTitle;
                this.uploadLoading = false;
                this.verifyTable();
                // this.tableLoading = false
                // this.showRemoveFile = true
            }
        },
        async uploadOrgInfo () {
            this.showUploadProgress = true;
            this.isUploading = true;
            for (let index in this.tableData) {
                this.tableData[index].icon = "md-stopwatch";
                this.tableData[index].color = "#2d8cf0";
                let res = await axios.post("/api/security/UpdateOrg", {
                    order: this.tableData[index].序号,
                    name: this.tableData[index].社团名称,
                    type: this.tableData[index].社团类型,
                    parentDepartName: this.tableData[index].业务指导单位,
                    parentDepartAdminName: this.tableData[index].业务指导单位管理员姓名,
                    parentDepartAdminCode: this.tableData[index].业务指导单位管理员教工号,
                    guideTeachers: this.tableData[index].指导老师姓名,
                    guideTeacherCodes: this.tableData[index].指导老师教工号,
                    departAdminName: this.tableData[index].社团管理员姓名,
                    departAdminCode: this.tableData[index].社团管理员学号
                });
                this.uploadPercent = Math.round((parseInt(index) + 1) / this.tableData.length * 100);
                if (res.data.success) {
                    this.tableData[index].icon = "md-checkmark";
                    this.tableData[index].color = "#19be6b";
                } else {
                    this.tableData[index].icon = "md-close";
                    this.tableData[index].color = "#ed4014";
                }
            }
            await axios.post("/api/security/UpdateAllOrgs", {});
            this.currentStep = 2;
            this.isUploading = false;
        }
    }
};
</script>

<style>
</style>

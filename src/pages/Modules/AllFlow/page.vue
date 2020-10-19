<template>
    <i-table :columns="columns" :data="tableData" :loading="loading">
        <template slot="Action" slot-scope="{row}">
            <i-button @click="checkWorkflow(row)">查看</i-button>
        </template>
    </i-table>
</template>
<script>
import axios from 'axios';
let app = require("@/config");
export default {
    data () {
        return {
            loading: false,
            tableData: [],
            columns: [
                {
                    title: "申请类别",
                    key: "WorkflowName"
                },
                {
                    title: "申请人",
                    key: "Owner"
                },
                {
                    title: "申请时间",
                    key: "ArriveOn"
                },
                {
                    title: "申请版本",
                    key: "Version"
                },
                {
                    title: "操作",
                    slot: "Action"
                }
            ],
            dic: {
                "修改社团基本信息申请": "/manage/org/orgdetailform",
                "社团活动申请": "/manage/org/activityform"
            }
        }
    },
    mounted () {
        app.title = "所有流程";
        this.getFlows();
    },
    methods: {
        getFlows () {
            this.loading = true;
            axios.post("/api/workflow/AllFlow", {name: "社团活动申请"}, msg => {
                if (msg.success) {
                    this.tableData = this.tableData.concat(msg.data);
                } else {
                    this.$Message.warning(msg.msg);
                }
                this.loading = false;
            });
            axios.post("/api/workflow/AllFlow", {name: "修改社团基本信息申请"}, msg => {
                if (msg.success) {
                    this.tableData = this.tableData.concat(msg.data);
                } else {
                    this.$Message.warning(msg.msg);
                }
                this.loading = false;
            });
        },
        checkWorkflow (row) {
            window.open(`${this.dic[row.WorkflowName]}?instanceId=${row.InstanceId}&stepId=${row.StepId}&detail=true`);
        }
    }
}
</script>

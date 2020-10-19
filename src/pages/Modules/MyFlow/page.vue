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
                    title: "流程类别",
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
        app.title = "我的流程";
        this.getFlows();
    },
    methods: {
        getFlows () {
            this.loading = true;
            axios.post("/api/workflow/MyFlow", {}, msg => {
                if (msg.success) {
                    this.tableData = msg.data;
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

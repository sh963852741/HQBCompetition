<template>
    <i-table :columns="columns" :data="tableData" :loading="loading">
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
                    title: "活动名称",
                    key: "ActivityName"
                },
                {
                    title: "活动地点",
                    key: "Address"
                },
                {
                    title: "举办社团",
                    key: "DepartName"
                },
                {
                    title: "活动开始时间",
                    key: "StartDate"
                },
                {
                    title: "活动结束时间",
                    key: "EndDate"
                }
            ]
        }
    },
    mounted () {
        app.title = "我参与过的活动";
        this.getMyApplications();
    },
    methods: {
        getMyApplications () {
            this.loading = true;
            axios.post("/api/org/GetMyApplications", {}, msg => {
                if (msg.success) {
                    this.tableData = msg.data;
                } else {
                    this.$Message.warning(msg.msg);
                }
                this.loading = false;
            });
        }
    }
}
</script>

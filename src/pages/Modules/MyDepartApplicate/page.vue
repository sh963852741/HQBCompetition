<template>
    <i-table :columns="columns" :data="tableData" :loading="loading">
        <template slot="Description" slot-scope="{row}">
            <div v-if="row.Description === ''">暂无简介</div>
            <div v-else>{{row.Description}}</div>
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
                    title: "社团名称",
                    key: "Name"
                },
                {
                    title: "所属学院",
                    key: "Parent"
                },
                {
                    title: "简介",
                    slot: "Description"
                }
            ]
        }
    },
    mounted () {
        app.title = "我的社团申请记录";
        this.getMyDepartApplicate();
    },
    methods: {
        getMyDepartApplicate () {
            this.loading = true;
            axios.post("/api/security/GetAllDeparts", {}, msg => {
                if (msg.success) {
                    this.tableData = msg.data.filter(e => e.app.State === 3);
                } else {
                    this.$Message.warning(msg.msg);
                }
                this.loading = false;
            });
        }
    }
}
</script>

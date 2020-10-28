<template>
    <i-row />
</template>

<script>
const axios = require("axios");
export default {
    data () {
        return {
        }
    },
    mounted () {
        this.addApplication();
    },
    methods: {
        addApplication () {
            axios.post("/api/HQB/EstimationApplicate", {id: localStorage.getItem('defaultDepartId')}, msg => {
                if (msg.success) {
                    this.$Message.success("创建成功");
                } else {
                    this.$Message.error(msg.msg);
                }
            })
        }
    }
};
</script>

<style>
</style>

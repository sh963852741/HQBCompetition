<template>
    <div/>
</template>

<script>
const axios = require("axios");
export default {
    mounted () {
        axios.post("/api/org/GetDashboard", {}, msg => {
            if (msg.DepartType) {
                this.$router.replace({name: 'OrgDetail'});
            } else {
                this.$router.replace({name: 'Affiliated'});
            }
        });
    }
}
</script>

<style lang="less">
</style>

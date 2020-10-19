<template>
    <i-row type="flex" justify="center">
        <i-col span="14">
            <org-detail-changer v-model="io"></org-detail-changer>
        </i-col>
    </i-row>
</template>

<script>
import orgDetailChanger from "../../../components/OrgDetail";
let app = require("@/config");
const axios = require("axios");
export default {
    components: {
        "org-detail-changer": orgDetailChanger
    },
    data () {
        return {
            io: {
                fieldAccess: {},
                data: {}
            },
            detailMode: false,
            upLoad: {}
        }
    },
    methods: {
        loadWorkflow () {
            axios.post("/api/workflow/LoadInstance", {instanceId: this.io.instanceId, stepId: this.io.stepId, detail: this.detailMode}, msg => {
                if (msg.success) {
                    msg.data.HaveCPCBranch = msg.data.HaveCPCBranch === "true";
                    msg.data.HaveLeagueBranch = msg.data.HaveLeagueBranch === "true";
                    if (msg.data.GuideTeacherIsPass !== undefined) {
                        msg.data.GuideTeacherIsPass = msg.data.GuideTeacherIsPass === true ? 'true' : 'false';
                    }
                    if (msg.data.AffiliatedDepartIsPass !== undefined) {
                        msg.data.AffiliatedDepartIsPass = msg.data.AffiliatedDepartIsPass === true ? 'true' : 'false';
                    }
                    if (msg.data.SauIsPass !== undefined) {
                        msg.data.SauIsPass = msg.data.SauIsPass === true ? 'true' : 'false';
                    }
                    if (msg.data.YlcIsPass !== undefined) {
                        msg.data.YlcIsPass = msg.data.YlcIsPass === true ? 'true' : 'false';
                    }
                    this.io = msg;
                } else {
                    this.$Message.warning(msg.msg);
                }
            });
        }
    },
    created () {
        this.io.instanceId = this.$route.query.instanceId;
        this.io.stepId = this.$route.query.stepId;
        this.detailMode = this.$route.query.detail === "true";
    },
    mounted () {
        app.title = "社团信息修改申请";
        this.loadWorkflow();
    }
}
</script>

<style>

</style>

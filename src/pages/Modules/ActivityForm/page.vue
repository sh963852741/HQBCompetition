<template>
    <div id="activity-form">
        <activity-form :instanceId="instanceId" :stepId="stepId" :detailMode="detailMode"></activity-form>
    </div>
</template>

<script>
import activityForm from "@/components/ActivityForm/Form";
let app = require("@/config");
export default {
    components: {
        'activity-form': activityForm
    },
    created () {
        this.instanceId = this.$route.query.instanceId;
        this.stepId = this.$route.query.stepId;
        this.detailMode = Boolean(this.$route.query.detail);
    },
    data () {
        return {
            instanceId: '',
            detailMode: true,
            stepId: ''
        }
    },
    methods: {},
    mounted () {
        app.title = "社团活动";
    }
}
</script>

<style>
</style>

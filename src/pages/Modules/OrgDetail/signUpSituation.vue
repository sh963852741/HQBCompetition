<template>
    <div>
        <activity-form :instanceId="instanceId" :stepId="stepId" :actID="actID"></activity-form>
    </div>
</template>

<script>
import activityForm from "@/components/ActivityForm/Form"
let app = require("@/config");
export default {
    components: {
        'activity-form': activityForm
    },
    created () {
        this.instanceId = this.$route.query.instanceId;
        this.stepId = this.$route.query.stepId;
        this.actID = this.$route.query.actId;
        this.detailMode = Boolean(this.$route.query.detail);
    },
    data () {
        return {
            instanceId: '',
            stepId: '',
            actID: '',
            detailMode: true
        }
    },
    methods: {},
    mounted () {
        app.title = "社团活动";
    }
}
</script>

<style lang="less">
.date {
    margin-top: 16px;
    margin-left: 518px;
    font-size: 12px;
    font-family: 'FangSong';
}
.table {
    margin: 8px auto 15px auto;
    border-collapse: collapse;
    text-align: center;
    font-family: 'FangSong';
    font-size: 18.7px;
    line-height: 30px;
}
#activity-form {
    .opinionForm .ivu-input {
        border:1px solid #dcdee2;
    }
    .ivu-input {
        border:none
    }
    .time{
        font-weight: bold;
        color: #888;
        margin-bottom: 10px;
    }
    .content{
        padding-left: 5px;
    }
    .paper {
        width: 795px;
        margin: 18px auto;
        background-color: white;
        border: solid 1px rgb(198, 198, 198);
        box-shadow:1px 1px 10px -2px #333333;
    }
    .status-bar{
        width: 793px;
        background-color: white;
        border-bottom: dashed 1px rgb(198, 198, 198);
    }
    .drop-down-box{
        width:200px;
    }
    .add1 {
        min-height: 50px;
    }
    .headline {
        margin-top: 9px;
        text-align: center;
        font-size: 24px;
        font-family: '';
    }
    .smallhang {
        width: 101px;
        height: 55px;
        padding: 0px 10px;
    }
    .longhang {
        width: 471px;
        height: 55px;
        padding: 10px 10px;
        text-align: left;
    }
    .wen-zi-ju-zhong{
        text-align: center;
    }
    .wen-zi-ju-you{
        text-align: right;
    }
    .input_box{
        min-height: 120px;
        text-align: left;
        font-family: 'FangSong';
    }
    .iview-type-size{
        font-size: 18.7px;
    }
    .button-position{
        float:right;
    }
    .info-row {
        display: flex;
        width: 602px;
        justify-content: space-between;
        margin: 24px auto 0px auto;
        font-size: 14px;
        font-family: 'FangSong';
    }
}
</style>

<template>
    <i-row>
        <activity-list overrideID="5dde2413-02d1-4ffd-9030-835afad93888"></activity-list>
    </i-row>
</template>

<script>
import activityList from '@/components/ActivityList/page.vue';
export default {
    components: {
        'activity-list': activityList
    },
    data () {
        return {};
    }
}
</script>

<style>

</style>

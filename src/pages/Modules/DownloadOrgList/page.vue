<template>
    <div />
</template>

<script>
export default {
    mounted () {
        window.open('/api/security/ExportExcel', '_blank');
        this.$router.go(-1);
    }
}
</script>

<style>

</style>

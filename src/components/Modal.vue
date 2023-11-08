<template>
    <div class="modal">
        <slot/>
    </div>
</template>

<script>
export default {
    name: "Modal",
}
</script>

<style scoped lang="scss">
@import "../scss/plugin";
.modal{
    background-color: $bg-menu;
    z-index: 999;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}


</style>

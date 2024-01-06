<template>
    <div class="modal">
        <slot/>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss">
@import "../scss/plugin";
.modal{
    padding: 20px 30px;
    background-color: $bg-main;
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

.modal-form-panel{
    width: 400px;
}

// MOBILE
@media (max-width: $grid-separate-width-sm) {
    .modal-form-panel{
        width: 100%;
    }
}

</style>

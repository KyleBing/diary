<template>
    <div class="menu-section">
        <div class="menu-section-title">密码</div>
        <div class="menu-section-content">
            <div class="btn" @click="goToChangePassword">修改密码</div>
            <div class="btn" @click="goToChangePassword">找回密码</div>
        </div>

    </div>
    <div class="menu-section">
        <div class="menu-section-title">导出</div>
        <div class="menu-section-content">
            <div class="btn">cvs</div>
            <div class="btn">json</div>
            <div class="btn">text</div>
        </div>
    </div>

</template>

<script>
import {mapMutations} from "vuex";

export default {
    name: "MenuOtherFunction",

    methods: {
        ...mapMutations(['SET_MENU_SHOWED']),
        goToChangePassword(){
            this.SET_MENU_SHOWED(false)
            this.$router.push({name: 'ChangePassword'})
        },
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";

</style>

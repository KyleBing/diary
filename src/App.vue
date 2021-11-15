<template>
    <router-view/>
</template>
<script>
import {mapMutations} from "vuex";

export default {
    mounted() {
        if (process.env.NODE_ENV !== 'development') {
            if (innerWidth < 1024) {
                location = '/diary/'
            }
        }
        window.onresize = () => {
            this.setInsets({
                windowsHeight: window.innerHeight,
                windowsWidth: window.innerWidth,
                heightPanel: window.innerHeight - 45, // 除 navbar 的高度
            })
        }
    },
    methods: {
        ...mapMutations(['setInsets'])
    }
}
</script>

<style lang="scss">
@import "./scss/diary";
</style>


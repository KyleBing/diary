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
            this.setHeightPanel(window.innerHeight - 45)
            this.setHeightWindow(window.innerHeight)
        }
    },
    methods: {
        ...mapMutations(['setHeightPanel', 'setHeightWindow'])
    }
}
</script>

<style lang="scss">
@import "./scss/diary";
</style>


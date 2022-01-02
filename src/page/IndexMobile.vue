<template>
    <div>
        <navbar/>
        <div class="diary" :style="`height:${insets.heightPanel}px`">
            <div class="diary-list-container diary-list-container-mobile"
                 :style="`height:${insets.heightPanel}px`">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
import list from "@/page/List"
import Navbar from "@/components/Navbar"
import {mapState} from 'vuex'

export default {
    name: 'IndexMobile',
    components: {
        Navbar,
        list
    },
    computed: {
        ...mapState(['insets'])
    }
}

</script>

<style lang="scss" scoped>
.diary-list-container-mobile{
    width: 100%;
}
</style>
